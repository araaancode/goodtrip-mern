const { StatusCodes } = require("http-status-codes");
const House = require("../../models/House");
const User = require("../../models/User");
const Booking = require("../../models/Booking");
const Owner = require("../../models/Owner");
const Food = require("../../models/Food");
const Bus = require("../../models/Bus");
const Cart = require("../../models/Cart");
const OrderFood = require("../../models/OrderFood");
const BusTicket = require("../../models/BusTicket");
const UserNotification = require("../../models/UserNotification");
const UserSupportTicket = require("../../models/UserSupportTicket");
const { calculateDistance } = require('../../utils/geoUtils');


const moment = require("moment-jalaali");
const crypto = require("crypto");

// Helper function to get search suggestions
async function getSearchSuggestions(partialName) {
  return Food.find({
    name: { $regex: `^${escapeRegExp(partialName)}`, $options: "i" },
    isActive: true,
  })
    .sort({ rating: -1 })
    .limit(5)
    .select("name category price rating");
}

const { isValidDate, parseDate } = require("../../utils/dateUtils");

const addZero = (item) => {
  if (item.length == 1) {
    return `0${item}`;
  }
  return item;
};

// Helper function to validate dates
const validateDates = (busDate, userDate) => {
  try {
    const busDateStr = new Date(busDate).toISOString().split("T")[0];
    const userDateStr = new Date(userDate).toISOString().split("T")[0];
    return busDateStr === userDateStr;
  } catch (error) {
    console.error("Date validation error:", error);
    return false;
  }
};

// Clean up any stale indexes
const cleanupStaleIndexes = async () => {
  try {
    const indexes = await BusTicket.collection.getIndexes();
    if (indexes.trackingCode_1) {
      await BusTicket.collection.dropIndex("trackingCode_1");
      console.log("Removed stale trackingCode index");
    }
  } catch (err) {
    console.log("Index cleanup:", err.message);
  }
};

// Initialize index cleanup on startup
cleanupStaleIndexes();

// Ticket creation with duplicate handling
const createTicketWithRetry = async (bus, user, ticketData) => {
  const createTicket = async (attempt = 1) => {
    try {
      const ticketNumber = crypto.randomBytes(8).toString("hex").toUpperCase();

      const ticketStartHour = new Date();
      ticketStartHour.setHours(ticketData.startHour);
      ticketStartHour.setMinutes(ticketData.startMin);

      const ticketEndHour = new Date();
      ticketEndHour.setHours(ticketData.endHour);
      ticketEndHour.setMinutes(ticketData.endMin);

      return await BusTicket.create({
        ticketNumber,
        bus: ticketData.bus,
        user: user._id,
        driver: bus.driver,
        passengers: ticketData.passengers,
        firstCity: ticketData.firstCity,
        lastCity: ticketData.lastCity,
        movingDate: ticketData.movingDate,
        returningDate: ticketData.returningDate,
        startHour: ticketStartHour,
        endHour: ticketEndHour,
        ticketPrice: ticketData.passengers.length * bus.price,
        seatNumbers: determineSeatNumbers(
          ticketData.passengers.length,
          bus.capacity,
          bus.seats
        ),
        ticketType: ticketData.ticketType,
        count: ticketData.count,
      });
    } catch (err) {
      if (err.code === 11000 && attempt < 3) {
        // Duplicate key error
        console.log(`Retrying ticket creation (attempt ${attempt})`);
        return createTicket(attempt + 1);
      }
      throw err;
    }
  };
  return createTicket();
};

// const calculateBookignHousePrice = (housePrice, guestsCount, checkInDate, checkOutDate) => {
//     //    return housePrice * guestsCount *
//     let checkInMounth = checkInDate.split('-')[1]
//     let checkOutMounth = checkOutDate.split('-')[1]
//     let checkInDay = checkInDate.split('-')[2]
//     let checkOutDay = checkOutDate.split('-')[2]
//     let daysDiffer = 0

//     if(checkOutMounth === checkInMounth){
//         daysDiffer = checkOutDay - checkInDay
//     }else if(checkOutMounth > checkInMounth){
//         daysDiffer = checkOutDay - checkInDay

//     }
// }

const determineSeatNumbers = (pL, capacity, seats) => {
  subtrack = capacity - seats;
  let seatNums = [];

  for (let i = 0; i < pL; i++) {
    seatNums.push(i + 1 + subtrack);
  }

  return seatNums;
};

exports.getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    if (user) {
      return res.status(StatusCodes.OK).json({
        msg: "کاربر پیدا شد",
        user: user,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "کاربر پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* profile *********************
// # description -> HTTP VERB -> Accesss
// # update user profile -> PUT -> user
exports.updateProfile = async (req, res) => {
  try {
    console.log(req.body);

    await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        nationalCode: req.body.nationalCode,
        province: req.body.province,
        city: req.body.city,
        gender: req.body.gender,
      },
      { new: true }
    )
      .then((user) => {
        if (user) {
          res.status(StatusCodes.OK).json({
            msg: "کاربر ویرایش شد",
            user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "پروفایل ویرایش نشد",
          error: error,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error: error,
    });
  }
};

// # description -> HTTP VERB -> Accesss
// # update user avatar -> PUT -> user
exports.updateAvatar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.file.filename,
      },
      { new: true }
    )
      .then((user) => {
        if (user) {
          res.status(StatusCodes.OK).json({
            msg: "آواتار کاربر ویرایش شد",
            user,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "آواتار کاربر ویرایش نشد",
          err,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error: error,
    });
  }
};

// ********************* houses *********************

// # description -> HTTP VERB -> Accesss -> Access Type
// # user get houses -> GET -> USER -> PRIVATE
// @route /api/users/houses
exports.getHouses = async (req, res) => {
  try {
    let houses = await House.find({
      isActive: true,
      isAvailable: true,
    }).populate("owner");
    if (houses.length > 0) {
      return res.status(StatusCodes.OK).json({
        msg: "خانه ها پیدا شدند",
        count: houses.length,
        houses: houses,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "خانه ها پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # user get single house -> GET -> USER -> PRIVATE
// @route /api/users/houses/:houseId
exports.getHouse = async (req, res) => {
  try {
    let house = await House.findById(req.params.houseId);

    if (house && house.isActive) {
      return res.status(StatusCodes.OK).json({
        msg: "خانه پیدا شد",
        house: house,
      });
    } else {
      return res.status(400).json({
        msg: "خانه پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # user search houses -> POST -> USER -> PRIVATE
// @route /api/users/houses/search-houses
exports.searchHouses = async (req, res) => {
  try {
    const { city, houseType, environmentType } = req.body;

    // Build query object based on provided parameters
    const query = {};
    if (city) query.city = { $regex: city, $options: "i" }; // Case-insensitive search
    if (houseType) query.houseType = houseType;
    if (environmentType) query.enviornment = environmentType;

    const houses = await House.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: houses.length,
      houses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "خطا در جستجوی خانه ها",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get favorites houses -> GET -> USER -> PRIVATE
// @route /api/users/houses/favorite-houses
exports.getFavoriteHouses = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");

    if (user.favoriteHouses && user.favoriteHouses.length > 0) {
      return res.status(StatusCodes.OK).json({
        msg: "خانه ها پیدا شدند",
        count: user.favoriteHouses.length,
        houses: user.favoriteHouses,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "خانه ای به لیست مورد علاقه شما افزوده نشده است",
      });
    }
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single favorite house -> GET -> USER -> PRIVATE
// @route /api/users/houses/favorite-houses/:houseId
exports.getFavoriteHouse = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("favoriteHouses");
    if (user.favoriteHouses.length > 0) {
      let house = user.favoriteHouses.find((f) => f._id == req.params.houseId);

      if (house) {
        return res.status(StatusCodes.OK).json({
          msg: "خانه پیدا شد",
          house,
        });
      } else {
        return res.status(StatusCodes.OK).json({
          msg: "خانه پیدا نشد",
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "خانه پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add house to favorites list -> PUT -> USER -> PRIVATE
// @route /api/users/houses/add-favorite-house
exports.addFavoriteHouse = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.user._id }).select("-password");

    if (user) {
      if (!user.favoriteHouses.includes(req.body.house)) {
        user.favoriteHouses.push(req.body.house);
      } else if (user.favoriteHouses.includes(req.body.house)) {
        user.favoriteHouses = user.favoriteHouses.filter(
          (item) => item != req.body.house
        );
      }

      let newUser = await user.save();

      if (newUser) {
        return res.status(StatusCodes.OK).json({
          msg: "خانه به لیست مورد علاقه اضافه شد",
          newUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # delete house from favorites list -> DELETE -> USER -> PRIVATE
// @route /api/users/houses/delete-favorite-house
exports.deleteFavoriteHouse = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("favoriteHouses");
    if (user.favoriteHouses.length > 0) {
      let filterHouses = user.favoriteHouses.filter(
        (f) => f._id != req.params.houseId
      );
      user.favoriteHouses = filterHouses;

      let newUser = await user.save();

      if (newUser) {
        res.status(StatusCodes.OK).json({
          msg: "خانه حذف شد",
          newUser,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "خانه حذف نشد",
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "خانه ها حذف نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # booking house -> POST -> USER -> PRIVATE
// @route /api/users/houses/book-house
exports.bookHouse = async (req, res) => {
  try {
    let house = await House.findOne({ _id: req.body.house });
    let checkInMounth = new Date(req.body.checkIn)
      .toLocaleDateString()
      .split("/")[0];
    let checkOutMounth = new Date(req.body.checkOut)
      .toLocaleDateString()
      .split("/")[0];

    let checkInDay = new Date(req.body.checkIn)
      .toLocaleDateString()
      .split("/")[1];
    let checkOutDay = new Date(req.body.checkOut)
      .toLocaleDateString()
      .split("/")[1];

    let differ = checkOutMounth - checkInMounth;

    let countDays = 0;

    // function compare() {
    //     if (1 <= checkOutMounth <= 6) {
    //         return 31;
    //     } else if (1 <= checkOutMounth <= 11) {
    //         return 30;
    //     } else {
    //         return 29;
    //     }
    // }

    // let base = compare()
    // console.log(base);

    // if (checkInMounth == checkOutMounth) {
    //     countDays = checkOutDay - checkInDay
    // } else if (checkOutMounth > checkInMounth) {
    //     let base = compare()
    //     console.log(base);
    // }

    if (!house || !house.isActive || !house.isAvailable) {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "اقامتگاه پیدا نشد",
      });
    } else {
      // let totalBookingHousePrice = calculateBookignHousePrice(house.price, req.body.guests, req.body.checkIn, req.body.checkOut)

      let newBooking = await Booking.create({
        user: req.user._id,
        owner: house.owner,
        house: house._id,
        // price: Number(house.price) * Number(req.body.guests) * Number(checkOutMounth > checkInMounth ? (checkOutDay > checkInDay ?  (checkOutDay - checkInDay  + 30) : (((checkOutDay - checkInDay) * (-1))  + 30)) : (checkOutMounth == checkInMounth ? (1) : ((checkOutDay - checkInDay)))),
        // price: Number(house.price),
        price:
          Number(house.price) *
          Number(req.body.guests) *
          Number(checkOutDay - checkInDay),
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        guests: req.body.guests,
      });

      if (newBooking) {
        house.isAvailable = false;
        await house.save().then((data) => {
          res.status(StatusCodes.CREATED).json({
            msg: "اقامتگاه رزرو شد",
            booking: newBooking,
            house: house,
          });
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "اقامتگاه رزرو نشد",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get user booking houses -> GET -> USER -> PRIVATE
// @route /api/users/houses/bookings
exports.houseBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ user: req.user._id }).populate(
      "owner house"
    );

    if (bookings) {
      return res.status(StatusCodes.OK).json({
        msg: "رزروها پیدا شدند",
        count: bookings.length,
        bookings: bookings,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "رزروها پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get user booking houses -> GET -> USER -> PRIVATE
// @route /api/users/houses/bookings/:bookingId
exports.houseBooking = async (req, res) => {
  try {
    let booking = await Booking.findOne({
      user: req.user._id,
      _id: req.params.bookingId,
    }).populate("owner house");

    if (booking) {
      return res.status(StatusCodes.OK).json({
        msg: "رزرو پیدا شد",
        booking: booking,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "رزرو پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # confirm booking house -> PUT -> USER -> PRIVATE
// @route /api/users/houses/bookings/:bookingId/confirm-booking
exports.confirmHouseBooking = async (req, res) => {
  try {
    let bookings = await Booking.find({ user: req.user._id });
    let findBooking = bookings.find(
      (booking) => booking._id == req.params.bookingId
    );

    if (findBooking) {
      findBooking.isConfirmed = true;
      await findBooking
        .save()
        .then((booking) => {
          return res.status(StatusCodes.OK).json({
            msg: "رزرو تایید شد",
            booking: booking,
          });
        })
        .catch(() => {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "رزرو تایید نشد",
          });
        });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "رزرو پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # cancel booking house -> PUT -> USER -> PRIVATE
// @route /api/users/houses/bookings/:bookingId/cancel-booking
exports.cancelHouseBooking = async (req, res) => {
  try {
    let bookings = await Booking.find({ user: req.user._id });
    let findBooking = bookings.find(
      (booking) => booking._id == req.params.bookingId
    );

    if (findBooking) {
      findBooking.isConfirmed = false;
      await findBooking
        .save()
        .then((booking) => {
          return res.status(StatusCodes.OK).json({
            msg: "رزرو لغو شد",
            booking: booking,
          });
        })
        .catch(() => {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "رزرو لغو نشد",
          });
        });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "رزرو پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add review to house -> PUT -> User -> PRIVATE
// @route /api/users/houses/:houseId/add-review
exports.addReviewToHouse = async (req, res) => {
  try {
    let review = {
      user: req.user._id,
      name: req.body.name,
      comment: req.body.comment,
      rating: req.body.rating,
    };

    let house = await House.findByIdAndUpdate(
      req.params.houseId,
      {
        $push: {
          reviews: review,
        },
      },
      { new: true }
    );

    if (house) {
      res.status(StatusCodes.OK).json({
        msg: "نظر افزوده شد",
        house,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "نظر افزوده نشد",
      });
    }
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* foods *********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all foods -> GET -> User -> PRIVATE
// @route /api/users/foods
exports.getFoods = async (req, res) => {
  try {
    let foods = await Food.find({ isActive: true, isAvailable: true });

    if (foods && foods.length > 0) {
      return res.status(StatusCodes.OK).json({
        msg: "غذاها پیدا شدند",
        count: foods.length,
        foods: foods,
      });
    } else {
      return res.status(400).json({
        msg: "غذاها پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single food -> GET -> User -> PRIVATE
// @route /api/users/foods/:foodId
exports.getFood = async (req, res) => {
  try {
    let food = await Food.findById({
      _id: req.params.foodId,
      isActive: true,
      isAvailable: true,
    });

    if (food) {
      return res.status(StatusCodes.OK).json({
        msg: "غذا پیدا شد",
        food: food,
      });
    } else {
      return res.status(400).json({
        msg: "غذا پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add house to favorites list -> PUT -> USER -> PRIVATE
// @route /api/users/foods/add-favorite-food
exports.addFavoriteFood = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.user._id }).select("-password");

    if (user) {
      if (!user.favoriteFoods.includes(req.body.food)) {
        user.favoriteFoods.push(req.body.food);
      } else if (user.favoriteFoods.includes(req.body.food)) {
        user.favoriteFoods = user.favoriteFoods.filter(
          (item) => item != req.body.food
        );
      }

      let newUser = await user.save();

      if (newUser) {
        return res.status(StatusCodes.OK).json({
          msg: "غذا به لیست مورد علاقه اضافه شد",
          newUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # delete food from favorites list -> DELETE -> USER -> PRIVATE
// @route /api/users/foods/delete-favorite-food/:foodId
exports.deleteFavoriteFood = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("favoriteFoods");
    if (user.favoriteFoods.length > 0) {
      let filterFoods = user.favoriteFoods.filter(
        (f) => f._id != req.params.foodId
      );
      user.favoriteFoods = filterFoods;

      let newUser = await user.save();

      if (newUser) {
        res.status(StatusCodes.OK).json({
          msg: "غذا حذف شد",
          newUser,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "غذا حذف نشد",
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "غذا ها حذف نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};


// *********************** order foods ***********************
// *********************** *********** ***********************
// *********************** *********** ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # order food -> POST -> USER -> PRIVATE
// @route /api/users/foods/orders
exports.createOrderFood = async (req, res) => {
  try {
    const {
      items,
      customerInfo,
      deliveryOption,
      location,
      notes,
      subtotal,
      deliveryFee,
      tax,
      total
    } = req.body;

    // Validate required fields
    if (!items || !customerInfo || !subtotal || !tax || !total) {
      return res.status(400).json({
        success: false,
        message: 'لطفا تمام اطلاعات ضروری را وارد کنید'
      });
    }

    // Check if cart is empty
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'سبد خرید شما خالی است'
      });
    }

    // Validate food items availability
    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food || !food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `محصول ${item.name} در حال حاضر موجود نمی‌باشد`
        });
      }
    }

    // For delivery orders, validate location
    if (deliveryOption === 'delivery') {
      if (!location || !location.coordinates) {
        return res.status(400).json({
          success: false,
          message: 'لطفا موقعیت مکانی را مشخص کنید'
        });
      }

      // Check if delivery location is within range (example: 10km)
      const restaurantLocation = [51.3890, 35.6892]; // Example coordinates
      const distance = calculateDistance(
        restaurantLocation,
        location.coordinates
      );
      
      if (distance > 10) { // 10km radius
        return res.status(400).json({
          success: false,
          message: 'متاسفانه به آدرس شما سرویس دهی نداریم'
        });
      }
    }

    // Create the order
    const order = new OrderFood({
      user: req.user._id,
      items,
      customerInfo,
      deliveryOption,
      location: deliveryOption === 'delivery' ? location : undefined,
      notes,
      subtotal,
      deliveryFee: deliveryOption === 'delivery' ? deliveryFee : 0,
      tax,
      total,
      status: 'pending'
    });

    // Get cook from first food item
    const firstFood = await Food.findById(items[0].food);
    order.cook = firstFood.cook;

    // Save the order
    const createdOrder = await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], total: 0 } }
    );

    res.status(201).json({
      success: true,
      order: createdOrder,
      trackingCode: createdOrder.trackingCode
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت سفارش'
    });
  }
};



// # description -> HTTP VERB -> Accesss -> Access Type
// # search foods -> GET -> USER -> PRIVATE
// @route /api/users/foods/search-foods
exports.searchFoods = async (req, res) => {
  try {
    // Validate input
    if (!req.body.name || typeof req.body.name !== "string") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "نام غذا باید یک رشته معتبر باشد",
      });
    }

    let foods = await Food.find({ name: req.body.name }).populate(
      "cook",
      "-password"
    );

    if (foods && foods.length > 0) {
      res.status(StatusCodes.OK).json({
        status: "succses",
        msg: "غذا پیدا شد",
        count: foods.length,
        foods,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "غذا با این نام پیدا نشد",
      });
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطا در انجام عملیات جستجو",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all food orders -> GET -> USER -> PRIVATE
// @route /api/users/foods/orders
exports.getAllOrderFoods = async (req, res) => {
  try {
    let orderFoods = await OrderFood.find({ user: req.user._id });

    if (orderFoods) {
      return res.status(StatusCodes.OK).json({
        msg: " سفارش های غذا پیدا شدند",
        count: orderFoods.length,
        orderFoods: orderFoods,
      });
    } else {
      return res.status(400).json({
        msg: " سفارش های غذا پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single food order -> GET -> USER -> PRIVATE
// @route /api/users/foods/orders/:orderId
exports.getSingleOrderFood = async (req, res) => {
  try {
    let orderFood = await OrderFood.findOne({
      user: req.user._id,
      _id: req.params.orderId,
    });

    if (orderFood) {
      return res.status(StatusCodes.OK).json({
        msg: " سفارش غذا پیدا شد",
        orderFood: orderFood,
      });
    } else {
      return res.status(400).json({
        msg: " سفارش غذا پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # confirm order food -> PUT -> USER -> PRIVATE
// @route /api/users/foods/orders/:orderId/confirm
exports.confirmOrderFood = async (req, res) => {
  try {
    await OrderFood.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: "Confirmed" },
      { new: true }
    ).then((order) => {
      if (order) {
        return res.status(StatusCodes.OK).json({
          msg: "سفارش غذا تایید شد",
          order,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "سفارش غذا تایید نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # cancel order food -> PUT -> USER -> PRIVATE
// @route /api/users/foods/orders/:orderId/cancel
exports.cancelOrderFood = async (req, res) => {
  try {
    await OrderFood.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus: "Cancelled" },
      { new: true }
    ).then((order) => {
      if (order) {
        return res.status(StatusCodes.OK).json({
          msg: "سفارش غذا لغو شد",
          order,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "سفارش غذا لغو نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* buses *********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all active and available buses -> GET -> USER -> PUBLIC
// @route /api/users/buses
exports.getBuses = async (req, res) => {
  try {
    let buses = await Bus.find({ isActive: true, isAvailable: true });

    if (buses) {
      return res.status(StatusCodes.OK).json({
        msg: "اتوبوس ها پیدا شدند",
        count: buses.length,
        buses: buses,
      });
    } else {
      return res.status(400).json({
        msg: "اتوبوس ها پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single active and available bus -> GET -> USER -> PUBLIC
// @route /api/users/buses/:busId
exports.getBus = async (req, res) => {
  try {
    let bus = await Bus.findOne({
      _id: req.params.busId,
      isActive: true,
      isAvailable: true,
    });

    if (bus) {
      return res.status(StatusCodes.OK).json({
        msg: "اتوبوس پیدا شد",
        bus: bus,
      });
    } else {
      return res.status(400).json({
        msg: "اتوبوس پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add bus to favorites list -> PUT -> USER -> PRIVATE
// @route /api/users/buses/add-favorite-bus
exports.addFavoriteBus = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.user._id }).select("-password");
    if (user && req.body.bus) {
      if (!user.favoriteBuses.includes(req.body.bus)) {
        user.favoriteBuses.push(req.body.bus);
        let newUser = await user.save();

        if (newUser) {
          return res.status(StatusCodes.OK).json({
            msg: "اتوبوس به لیست مورد علاقه اضافه شد",
            newUser,
          });
        }
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "اتوبوس در لیست مورد علاقه وجود دارد. نمیتوانید دوباره آن را اضافه کنید!!!",
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "اتوبوس به لیست مورد علاقه اضافه نشد",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # delete bus from favorites list -> PUT -> USER -> PRIVATE
// @route /api/users/buses/delete-favorite-bus/:busId
exports.deleteFavoriteBus = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("favoriteBuses");
    if (user.favoriteBuses.length > 0) {
      let filterBuses = user.favoriteBuses.filter(
        (f) => f._id != req.params.busId
      );
      user.favoriteBuses = filterBuses;

      let newUser = await user.save();

      if (newUser) {
        res.status(StatusCodes.OK).json({
          msg: "اتوبوس حذف شد",
          newUser,
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "اتوبوس حذف نشد",
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "اتوبوس ها حذف نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> POST -> USER -> PUBLIC
// @route /api/users/buses/search-buses
exports.searchBuses = async (req, res) => {
  try {
    let buses = await Bus.find({
      name: req.body.name,
      isActive: true,
      isAvailable: true,
    });
    if (buses.length > 0) {
      res.status(StatusCodes.OK).json({
        msg: "اتوبوس هاپیدا شدند",
        count: buses.length,
        buses: buses,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "اتوبوسی یافت نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search available bus tickets -> POST -> USER -> PUBLIC
// @route /api/users/buses/search-one-side-bus-tickets
exports.searchOneSideBusTickes = async (req, res) => {
  try {
    let buses = await Bus.find({ isActive: true, isAvailable: true })
      .populate("driver")
      .select("-password");

    let userFirstCity = req.body.firstCity;
    let userLastCity = req.body.lastCity;
    let userCount = req.body.count;
    let userMovingDate = req.body.movingDate;

    let results = [];

    if (!userFirstCity || !userLastCity || !userCount || !userMovingDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "لطفاً تمام فیلدها را پر کنید (firstCity, lastCity, count, movingDate)",
      });
    }

    if (isNaN(userCount) || userCount < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تعداد مسافران باید عددی و بزرگتر از صفر باشد",
      });
    }

    if (!isValidDate(userMovingDate)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تاریخ حرکت نامعتبر است (فرمت صحیح: YYYY/MM/DD)",
      });
    }

    // test api

    // const [month, day, year] = buses[3].driver.movingDate
    //   .toLocaleDateString()
    //   .split("/");

    // const attachedDateMovingDate = `${year}/${addZero(month)}/${addZero(day)}`;

    // console.log("userFirstCity: ", userFirstCity);
    // console.log("userLastCity: ", userLastCity);
    // console.log("userCount: ", userCount);
    // console.log("userMovingDate: ", userMovingDate);
    // console.log("=========================================");
    // console.log("driverFirstCity: ", buses[3].driver.firstCity);
    // console.log("driverLastCity: ", buses[3].driver.firstCity);
    // console.log("driverCount: ", buses[3].seats);
    // console.log("driverMovingDate: ", attachedDateMovingDate);

    buses.forEach((bus) => {
      // console.log(
      //   "driver Moving Date: ",
      //   moment(bus.driver.movingDate.toLocaleDateString(),"jDD-jMM-jYYYY").format(
      //     "jYYYY-jMM-jDD"
      //   )
      // );

      // change driver date in a new format
      const [month, day, year] = bus.driver.movingDate
        .toLocaleDateString()
        .split("/");

      const attachedDate = `${year}/${addZero(month)}/${addZero(day)}`; // YYYY/MM/DD

      if (
        bus.driver.firstCity === userFirstCity &&
        bus.driver.lastCity === userLastCity
      ) {
        if (bus.seats >= userCount) {
          if (attachedDate == userMovingDate) {
            results.push(bus);
          }
        }
      }
    });

    if (results.length > 0) {
      res.status(StatusCodes.OK).json({
        msg: "بلیط های اتوبوس پیدا شدند",
        count: results.length,
        buses: results,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "بلیطی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search available bus tickets -> POST -> USER -> PUBLIC
// @route /api/users/buses/search-two-side-bus-tickets
exports.searchTwoSideBusTickes = async (req, res) => {
  try {
    let buses = await Bus.find({ isActive: true, isAvailable: true })
      .populate("driver")
      .select("-password");

    let userFirstCity = req.body.firstCity;
    let userLastCity = req.body.lastCity;
    let userCount = req.body.count;
    let userMovingDate = req.body.movingDate;
    let userReturningDate = req.body.returningDate;

    if (
      !userFirstCity ||
      !userLastCity ||
      !userCount ||
      !userMovingDate ||
      !userReturningDate
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "لطفاً تمام فیلدها را پر کنید (firstCity, lastCity, count, movingDate)",
      });
    }

    if (isNaN(userCount) || userCount < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تعداد مسافران باید عددی و بزرگتر از صفر باشد",
      });
    }

    if (!isValidDate(userMovingDate)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تاریخ حرکت نامعتبر است (فرمت صحیح: YYYY/MM/DD)",
      });
    }

    if (!isValidDate(userReturningDate)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تاریخ برگشت نامعتبر است (فرمت صحیح: YYYY/MM/DD)",
      });
    }

    let results = [];

    buses.forEach((bus) => {
      const [month1, day1, year1] = bus.driver.movingDate
        .toLocaleDateString()
        .split("/");

      const attachedDateMovingDate = `${year1}/${addZero(month1)}/${addZero(
        day1
      )}`; // YYYY/MM/DD

      const [month2, day2, year2] = bus.driver.returningDate
        .toLocaleDateString()
        .split("/");

      const attachedDateReturningDate = `${year2}/${addZero(month2)}/${addZero(
        day2
      )}`; // YYYY/MM/DD

      if (
        bus.driver.firstCity === userFirstCity &&
        bus.driver.lastCity === userLastCity
      ) {
        if (bus.seats >= userCount) {
          if (attachedDateMovingDate == userMovingDate) {
            if (attachedDateReturningDate == userReturningDate) {
              results.push(bus);
            }
          }
        }
      }
    });

    if (results.length > 0) {
      res.status(StatusCodes.OK).json({
        msg: "بلیط های اتوبوس پیدا شدند",
        count: results.length,
        buses: results,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "بلیط های اتوبوس پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> POST -> USER -> PRIVATE
// @route /api/users/buses/book-bus
exports.bookBus = async (req, res) => {
  // try {
  //   let ticketType = req.body.ticketType;
  //   let passengers = req.body.passengers;

  //   // user bus tickets
  //   let busTickets = await BusTicket.find({ user: req.user._id });
  //   // all active and available buses
  //   let buses = await Bus.find({ isActive: true, isAvailable: true }).populate(
  //     "driver"
  //   );
  //   let userMovingDate = req.body.movingDate;
  //   let userReturningDate = req.body.returningDate;
  //   let count = req.body.count;
  //   let userFirstCity = req.body.firstCity;
  //   let userLastCity = req.body.lastCity;
  //   let userStartHour = req.body.startHour;
  //   let userEndHour = req.body.endHour;
  //   let userStartMin = req.body.startMin;
  //   let userEndMin = req.body.endMin;
  //   let userBus = req.body.bus;

  //   let validTickets = [];

  //   const ticketNumber = crypto.randomBytes(8).toString("hex").toUpperCase();

  //   if (busTickets && busTickets.length > 0) {
  //     // *** run bus expiretion date validation ***
  //     const now = new Date();
  //     // Update each ticket's validity based on expirationDate
  //     for (const ticket of busTickets) {
  //       if (ticket.movingDate < now) {
  //         // If the expiration date has passed, mark the ticket as invalid
  //         ticket.isValid = false;
  //         ticket.isExpired = true;
  //         await ticket.save();
  //       }
  //     }

  //     for (const ticket of busTickets) {
  //       if (ticket.isValid && !ticket.isExpired) {
  //         validTickets.push(ticket);
  //       }
  //     }

  //     //    if user has valid ticket, ticket must not registered, otherwise ticket ti can registered
  //     if (validTickets && validTickets.length > 0) {
  //       res.status(StatusCodes.BAD_REQUEST).json({
  //
  //         msg: "شما نمیتوانید بلیط بگیرید. هنوز بلیط های قبلی شما منقضی نشده اند",
  //       });
  //     } else {
  //       // if user has no valid tickets they can take ticket
  //       if (ticketType === "oneSide") {
  //         // *** run one side algorithm ***
  //         let bus = await Bus.findOne({
  //           _id: userBus,
  //           isActive: true,
  //           isAvailable: true,
  //         }).populate("driver");

  //         if (bus) {
  //           // #1 first of all check if user first city is the same with the driver first city
  //           // #2  check if user last city is the same with the driver last city

  //           const [month1, day1, year1] = bus.driver.movingDate
  //             .toLocaleDateString()
  //             .split("/");

  //           const attachedDateMovingDate = `${year1}/${addZero(
  //             month1
  //           )}/${addZero(day1)}`; // YYYY/MM/DD

  //           if (
  //             userFirstCity === bus.driver.firstCity &&
  //             userLastCity === bus.driver.lastCity &&
  //             count <= bus.seats &&
  //             attachedDateMovingDate == userMovingDate
  //           ) {
  //             let ticketStartHour = new Date();
  //             ticketStartHour.setHours(userStartHour);
  //             ticketStartHour.setMinutes(userStartMin);

  //             let ticketEndHour = new Date();
  //             ticketEndHour.setHours(userEndHour);
  //             ticketStartHour.setMinutes(userEndMin);

  //             let newBusTicket = await BusTicket.create({
  //               ticketNumber,
  //               bus: req.body.bus,
  //               user: req.user._id,
  //               driver: bus.driver,
  //               passengers: req.body.passengers,
  //               firstCity: req.body.firstCity,
  //               lastCity: req.body.lastCity,
  //               movingDate: req.body.movingDate,

  //               // returningDate: req.body.returningDate,
  //               startHour: ticketStartHour,
  //               endHour: ticketEndHour,
  //               ticketPrice:
  //                 Number(Object.keys(passengers).length) * Number(bus.price),
  //               seatNumbers: determineSeatNumbers(
  //                 req.body.passengers.length,
  //                 bus.capacity,
  //                 bus.seats
  //               ),
  //               ticketType,
  //               count: req.body.count,
  //             });

  //             bus.seats -= Number(req.body.passengers.length);

  //             if (bus.seats === 0) {
  //               bus.isAvailable = false;
  //               await bus.save();
  //               if (newBusTicket) {
  //                 await bus.save();

  //                 console.log("notification and sms send for user and driver");

  //                 res.status(StatusCodes.CREATED).json({
  //
  //                   msg: "بلیط اتوبوس صادر شد",
  //                   ticket: newBusTicket,
  //                 });
  //               }
  //             } else {
  //               await bus.save();
  //               if (newBusTicket) {
  //                 await bus.save();

  //                 console.log("notification and sms send for user and driver");

  //                 res.status(StatusCodes.CREATED).json({
  //
  //                   msg: "بلیط اتوبوس صادر شد",
  //                   ticket: newBusTicket,
  //                 });
  //               }
  //             }
  //           } else {
  //             res.status(StatusCodes.NOT_FOUND).json({
  //               msg: "بلیط اتوبوس صادر نشد",
  //             });
  //           }
  //         } else {
  //           res.status(StatusCodes.NOT_FOUND).json({
  //             msg: "اتوبوس پیدا نشد",
  //           });
  //         }
  //       } else if (ticketType === "twoSide") {
  //         // run two side algorithm
  //         let bus = await Bus.findOne({ _id: userBus }).populate("driver");

  //         if (bus) {
  //           // #1 first of all check if user first city is the same with the driver first city
  //           // #2  check if user last city is the same with the driver last city
  //           if (
  //             userFirstCity === bus.driver.firstCity &&
  //             userLastCity === bus.driver.lastCity &&
  //             count <= bus.seats &&
  //             bus.driver.movingDate.toLocaleDateString().split("/")[1] ==
  //               userMovingDate.split("-")[2] &&
  //             bus.driver.returningDate.toLocaleDateString().split("/")[1] ==
  //               userReturningDate.split("-")[2]
  //           ) {
  //             let ticketStartHour = new Date();
  //             ticketStartHour.setHours(userStartHour);
  //             ticketStartHour.setMinutes(userStartMin);

  //             let ticketEndHour = new Date();
  //             ticketEndHour.setHours(userEndHour);
  //             ticketStartHour.setMinutes(userEndMin);

  //             let newBusTicket = await BusTicket.create({
  //               ticketNumber,
  //               bus: req.body.bus,
  //               user: req.user._id,
  //               driver: bus.driver,
  //               passengers: req.body.passengers,
  //               firstCity: req.body.firstCity,
  //               lastCity: req.body.lastCity,
  //               movingDate: req.body.movingDate,
  //               returningDate: req.body.returningDate,
  //               startHour: ticketStartHour,
  //               endHour: ticketEndHour,
  //               ticketPrice:
  //                 Number(Object.keys(passengers).length) * Number(bus.price),
  //               seatNumbers: determineSeatNumbers(
  //                 req.body.passengers.length,
  //                 bus.capacity,
  //                 bus.seats
  //               ),
  //               ticketType,
  //               count: req.body.count,
  //             });

  //             bus.seats -= Number(req.body.passengers.length);

  //             if (bus.seats === 0) {
  //               bus.isAvailable = false;
  //               await bus.save();
  //               if (newBusTicket) {
  //                 await bus.save();

  //                 console.log("notification and sms send for user and driver");

  //                 res.status(StatusCodes.CREATED).json({
  //
  //                   msg: "بلیط اتوبوس صادر شد",
  //                   ticket: newBusTicket,
  //                 });
  //               }
  //             } else {
  //               await bus.save();
  //               if (newBusTicket) {
  //                 await bus.save();

  //                 console.log("notification and sms send for user and driver");

  //                 res.status(StatusCodes.CREATED).json({
  //
  //                   msg: "بلیط اتوبوس صادر شد",
  //                   ticket: newBusTicket,
  //                 });
  //               }
  //             }
  //           } else {
  //             res.status(StatusCodes.NOT_FOUND).json({
  //               msg: "بلیط اتوبوس صادر نشد ",
  //             });
  //           }
  //         } else {
  //           res.status(StatusCodes.NOT_FOUND).json({
  //             msg: "اتوبوس پیدا نشد",
  //           });
  //         }
  //       }
  //     }
  //   } else {
  //     if (ticketType === "oneSide") {
  //       // *** run one side algorithm ***
  //       let bus = await Bus.findOne({ _id: userBus }).populate("driver");

  //       if (bus) {
  //         // #1 first of all check if user first city is the same with the driver first city
  //         // #2  check if user last city is the same with the driver last city
  //         if (
  //           userFirstCity === bus.driver.firstCity &&
  //           userLastCity === bus.driver.lastCity &&
  //           count <= bus.seats &&
  //           bus.driver.movingDate.toLocaleDateString().split("/")[1] ==
  //             userMovingDate.split("-")[2]
  //         ) {
  //           let ticketStartHour = new Date();
  //           ticketStartHour.setHours(userStartHour);
  //           ticketStartHour.setMinutes(userStartMin);

  //           let ticketEndHour = new Date();
  //           ticketEndHour.setHours(userEndHour);
  //           ticketStartHour.setMinutes(userEndMin);

  //           let newBusTicket = await BusTicket.create({
  //             ticketNumber,
  //             bus: req.body.bus,
  //             user: req.user._id,
  //             driver: bus.driver,
  //             passengers: req.body.passengers,
  //             firstCity: req.body.firstCity,
  //             lastCity: req.body.lastCity,
  //             movingDate: req.body.movingDate,
  //             // returningDate: req.body.returningDate,
  //             startHour: ticketStartHour,
  //             endHour: ticketEndHour,
  //             ticketPrice:
  //               Number(Object.keys(passengers).length) * Number(bus.price),
  //             seatNumbers: determineSeatNumbers(
  //               req.body.passengers.length,
  //               bus.capacity,
  //               bus.seats
  //             ),
  //             ticketType,
  //             count: req.body.count,
  //           });

  //           bus.seats -= Number(req.body.passengers.length);

  //           if (bus.seats === 0) {
  //             bus.isAvailable = false;
  //             await bus.save();
  //             if (newBusTicket) {
  //               await bus.save();

  //               console.log("notification and sms send for user and driver");

  //               res.status(StatusCodes.CREATED).json({
  //
  //                 msg: "بلیط اتوبوس صادر شد",
  //                 ticket: newBusTicket,
  //               });
  //             }
  //           } else {
  //             await bus.save();
  //             if (newBusTicket) {
  //               await bus.save();

  //               console.log("notification and sms send for user and driver");

  //               res.status(StatusCodes.CREATED).json({
  //
  //                 msg: "بلیط اتوبوس صادر شد",
  //                 ticket: newBusTicket,
  //               });
  //             }
  //           }
  //         } else {
  //           res.status(StatusCodes.NOT_FOUND).json({
  //             msg: "بلیط اتوبوس  صادر نشد",
  //           });
  //         }
  //       } else {
  //         res.status(StatusCodes.NOT_FOUND).json({
  //           msg: "اتوبوس پیدا نشد",
  //         });
  //       }
  //     } else if (ticketType === "twoSide") {
  //       // *** run two side algorithm ***
  //       let bus = await Bus.findOne({ _id: userBus }).populate("driver");

  //       if (bus) {
  //         // #1 first of all check if user first city is the same with the driver first city
  //         // #2  check if user last city is the same with the driver last city
  //         if (
  //           userFirstCity === bus.driver.firstCity &&
  //           userLastCity === bus.driver.lastCity &&
  //           count <= bus.seats &&
  //           bus.driver.movingDate.toLocaleDateString().split("/")[1] ==
  //             userMovingDate.split("-")[2] &&
  //           bus.driver.returningDate.toLocaleDateString().split("/")[1] ==
  //             userReturningDate.split("-")[2]
  //         ) {
  //           let ticketStartHour = new Date();
  //           ticketStartHour.setHours(userStartHour);
  //           ticketStartHour.setMinutes(userStartMin);

  //           let ticketEndHour = new Date();
  //           ticketEndHour.setHours(userEndHour);
  //           ticketStartHour.setMinutes(userEndMin);

  //           let newBusTicket = await BusTicket.create({
  //             ticketNumber,
  //             bus: req.body.bus,
  //             user: req.user._id,
  //             driver: bus.driver,
  //             passengers: req.body.passengers,
  //             firstCity: req.body.firstCity,
  //             lastCity: req.body.lastCity,
  //             movingDate: req.body.movingDate,
  //             returningDate: req.body.returningDate,
  //             startHour: ticketStartHour,
  //             endHour: ticketEndHour,
  //             ticketPrice:
  //               Number(Object.keys(passengers).length) * Number(bus.price),
  //             seatNumbers: determineSeatNumbers(
  //               req.body.passengers.length,
  //               bus.capacity,
  //               bus.seats
  //             ),
  //             ticketType,
  //             count: req.body.count,
  //           });

  //           bus.seats -= Number(req.body.passengers.length);

  //           if (bus.seats === 0) {
  //             bus.isAvailable = false;
  //             await bus.save();
  //             if (newBusTicket) {
  //               await bus.save();

  //               console.log("notification and sms send for user and driver");

  //               res.status(StatusCodes.CREATED).json({
  //
  //                 msg: "بلیط اتوبوس صادر شد",
  //                 ticket: newBusTicket,
  //               });
  //             }
  //           } else {
  //             await bus.save();
  //             if (newBusTicket) {
  //               await bus.save();

  //               console.log("notification and sms send for user and driver");

  //               res.status(StatusCodes.CREATED).json({
  //
  //                 msg: "بلیط اتوبوس صادر شد",
  //                 ticket: newBusTicket,
  //               });
  //             }
  //           }
  //         } else {
  //           res.status(StatusCodes.NOT_FOUND).json({
  //             msg: "بلیط اتوبوس صادر نشد ",
  //           });
  //         }
  //       } else {
  //         res.status(StatusCodes.NOT_FOUND).json({
  //           msg: "اتوبوس پیدا نشد",
  //         });
  //       }
  //     }
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //
  //     msg: "خطای داخلی سرور",
  //     error,
  //   });
  // }

  try {
    // Input validation
    const requiredFields = [
      "ticketType",
      "passengers",
      "movingDate",
      "firstCity",
      "lastCity",
      "bus",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check for valid existing tickets
    const now = new Date();
    const validTickets = await BusTicket.find({
      user: req.user._id,
      isValid: true,
      isExpired: false,
      movingDate: { $gte: now },
    });

    if (validTickets.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "You cannot book a new ticket while having valid existing tickets",
      });
    }

    // Find and validate bus
    const bus = await Bus.findOne({
      _id: req.body.bus,
      isActive: true,
      isAvailable: true,
    }).populate("driver");

    if (!bus) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Bus not found or not available",
      });
    }

    // Validate capacity
    if (req.body.passengers.length > bus.seats) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Not enough seats available",
      });
    }

    // Validate route and dates
    const isRouteValid =
      req.body.firstCity === bus.driver.firstCity &&
      req.body.lastCity === bus.driver.lastCity;

    const isMovingDateValid = validateDates(
      bus.driver.movingDate,
      req.body.movingDate
    );

    let isReturnDateValid = true;
    if (req.body.ticketType === "twoSide") {
      isReturnDateValid = validateDates(
        bus.driver.returningDate,
        req.body.returningDate
      );
    }

    if (!isRouteValid || !isMovingDateValid || !isReturnDateValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid route or date selection",
      });
    }

    // Create ticket and update bus
    const newTicket = await createTicketWithRetry(bus, req.user, req.body);

    bus.seats -= req.body.passengers.length;
    bus.isAvailable = bus.seats > 0;
    await bus.save();

    // TODO: Implement actual notifications
    console.log("Notification and SMS would be sent here");

    return res.status(StatusCodes.CREATED).json({
      msg: "Bus ticket issued successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Ticket booking error:", error);

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        msg: "Duplicate ticket detected. Please try again.",
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> GET -> USER -> PRIVATE
// @route /api/users/buses/tickets
exports.getAllBusTickets = async (req, res) => {
  try {
    let busTickets = await BusTicket.find({ user: req.user._id });
    if (busTickets && busTickets.length > 0) {
      res.status(StatusCodes.OK).json({
        msg: "بلیط های اتوبوس پیدا شدند",
        count: busTickets.length,
        tickets: busTickets,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "بلیط های اتوبوس پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> GET -> USER -> PRIVATE
// @route /api/users/buses/tickets/:ticketId
exports.getSingleBusTicket = async (req, res) => {
  try {
    let busTicket = await BusTicket.findById({ _id: req.params.ticketId });
    if (busTicket) {
      res.status(StatusCodes.OK).json({
        msg: "بلیط اتوبوس پیدا شد",
        tickets: busTicket,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        msg: "بلیط اتوبوس پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> PUT -> USER -> PRIVATE
// @route /api/users/buses/tickets/:ticketId/confirm
exports.confirmBusTicket = async (req, res) => {
  try {
    await BusTicket.findByIdAndUpdate(
      req.params.ticketId,
      { isCanceled: false, isConfirmed: true },
      { new: true }
    ).then((busTicket) => {
      if (busTicket) {
        return res.status(StatusCodes.OK).json({
          msg: "بلیط اتوبوس تایید شد",
          busTicket,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "بلیط اتوبوس تایید نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # search buses -> PUT -> USER -> PRIVATE
// @route /api/users/buses/tickets/:ticketId/cancel
exports.cancelBusTicket = async (req, res) => {
  try {
    await BusTicket.findByIdAndUpdate(
      req.params.ticketId,
      { isCanceled: true, isConfirmed: false },
      { new: true }
    ).then((busTicket) => {
      if (busTicket) {
        return res.status(StatusCodes.OK).json({
          msg: "بلیط اتوبوس لغو شد",
          busTicket,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "بلیط اتوبوس لغو نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* notifications *********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all user notifications -> GET -> Driver -> PRIVATE
// @route /api/users/notifications
exports.notifications = async (req, res) => {
  try {
    let notifications = await UserNotification.find({});
    let findUserNotifications = [];

    for (let i = 0; i < notifications.length; i++) {
      if (
        JSON.stringify(notifications[i].reciever) ==
        JSON.stringify(req.user._id)
      ) {
        findUserNotifications.push(notifications[i]);
      }
    }

    if (findUserNotifications && findUserNotifications.length > 0) {
      return res.status(StatusCodes.OK).json({
        msg: "اعلان ها پیدا شد",
        count: findUserNotifications.length,
        findUserNotifications,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "اعلان ها پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single user notification -> GET -> User -> PRIVATE
// @route /api/users/notifications/:ntfId
exports.notification = async (req, res) => {
  try {
    let notification = await UserNotification.findById(req.params.ntfId);
    if (notification) {
      return res.status(StatusCodes.OK).json({
        msg: "اعلان پیدا شد",
        notification,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "اعلان پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # create notification for user -> POST -> User -> PRIVATE
// @route /api/users/notifications
exports.createNotification = async (req, res) => {
  try {
    await UserNotification.create({
      title: req.body.title,
      message: req.body.message,
      reciever: req.body.reciever,
    }).then((data) => {
      res.status(StatusCodes.CREATED).json({
        msg: "اعلان ساخته شد",
        data,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # mark user notification -> PUT -> User -> PRIVATE
// @route /api/users/notifications/:ntfId/mark-notification
exports.markNotification = async (req, res) => {
  try {
    await UserNotification.findByIdAndUpdate(
      req.params.ntfId,
      { read: true },
      { new: true }
    ).then((nft) => {
      if (nft) {
        return res.status(StatusCodes.OK).json({
          msg: "اعلان خوانده شد",
          nft,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "اعلان خوانده نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* support tickets *********************

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all users support tickets -> GET -> user -> PRIVATE
// @route /api/users/support-tickets
exports.supportTickets = async (req, res) => {
  try {
    let tickets = await UserSupportTicket.find({ user: req.user._id });
    if (tickets) {
      return res.status(StatusCodes.OK).json({
        msg: "تیکت های پشتیبانی پیدا شد",
        count: tickets.length,
        tickets,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تیکت های پشتیبانی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single users support ticket -> GET -> user -> PRIVATE
// @route /api/users/support-tickets/:stId
exports.supportTicket = async (req, res) => {
  try {
    let ticket = await UserSupportTicket.findById(req.params.stId);
    if (ticket) {
      return res.status(StatusCodes.OK).json({
        msg: "تیکت پشتیبانی پیدا شد",
        ticket,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "تیکت پشتیبانی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # create users support ticket -> POST -> user -> PRIVATE
// @route /api/users/support-tickets
exports.createSupportTicket = async (req, res) => {
  try {
    await UserSupportTicket.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
      assignedTo: req.user._id,
    }).then((data) => {
      res.status(StatusCodes.CREATED).json({
        msg: "تیکت پشتیبانی ساخته شد",
        data,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # read support ticket -> PUT -> user -> PRIVATE
// @route /api/users/support-tickets/:stId/read
exports.readSupportTicket = async (req, res) => {
  try {
    await UserSupportTicket.findByIdAndUpdate(
      req.params.stId,
      {
        isRead: true,
      },
      { new: true }
    ).then((ticket) => {
      if (ticket) {
        return res.status(StatusCodes.OK).json({
          msg: "تیکت خوانده شد",
          ticket,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "تیکت خوانده نشد",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comments to support ticket -> PUT -> User -> PRIVATE
// @route /api/users/support-tickets/:stId/add-comment
exports.addCommentsToSupportTicket = async (req, res) => {
  try {
    let supportTicketFound = await UserSupportTicket.findById(req.params.stId);
    if (supportTicketFound) {
      let comments = {
        user: req.user._id,
        comment: req.body.comment,
      };

      supportTicketFound.comments.push(comments);

      await supportTicketFound
        .save()
        .then((ticket) => {
          return res.status(StatusCodes.OK).json({
            msg: "پاسخ گویی به تیکت",
            ticket,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "عدم پاسخ گویی به تیکت",
            error,
          });
        });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "تیکت پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ********************* finance *********************
exports.finance = (req, res) => {
  res.send("user finance");
};

// ********************* owners *********************

exports.getOwners = async (req, res) => {
  try {
    let owners = await Owner.find({}).select("-password -phone -role");
    if (owners.length > 0) {
      return res.status(StatusCodes.OK).json({
        msg: "مالک ها پیدا شدند",
        count: owners.length,
        owners: owners,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "مالک ها پیدا نشدند",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

exports.getOwner = async (req, res) => {
  try {
    let owner = await Owner.findById(req.params.ownerId).select(
      "-password -phone -role"
    );
    if (owner) {
      return res.status(StatusCodes.OK).json({
        msg: "مالک پیدا شد",
        owner: owner,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "مالک پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// ************************************************ cart ************************************************
// ************************************************ **** ************************************************
// ************************************************ **** ************************************************

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.food"
    );

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        user: req.user._id,
        items: [],
        total: 0,
      });
      await cart.save();
      return res.json(cart);
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { foodId, quantity = 1 } = req.body;

  try {
    // Validate food item
    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(400).json({ msg: "Food item not available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // Create cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        total: 0,
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (existingItemIndex > -1) {
      // Update quantity if exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        food: food._id,
        quantity,
        price: food.price,
        name: food.name,
      });
    }

    // Recalculate total (optional)
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await Cart.populate(cart, { path: "items.food" }); // Fixed populate

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await Cart.populate(cart, { path: "items.food" }); 

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.food.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    cart = await Cart.populate(cart, { path: "items.food" }); // Fixed populate

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], total: 0 } },
      { new: true }
    ).populate("items.food");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Convert cart to order
// @route   POST /api/cart/checkout
// @access  Private
exports.createOrderFromCart = async (req, res) => {
  const { address, lat, lng } = req.body;

  try {
    // Validate input
    if (!address || lat === undefined || lng === undefined) {
      return res.status(400).json({ msg: "Address and location are required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.food"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      name: item.name,
      count: item.quantity,
      price: item.price,
      food: item.food._id,
    }));

    // Create order
    const order = new OrderFood({
      user: req.user._id,
      cook: cart.items[0].food.cook, // Assuming all items are from the same cook
      foodItems: orderItems,
      totalPrice: cart.total,
      address,
      lat,
      lng,
      orderStatus: "Pending",
    });

    await order.save();

    // Clear the cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], total: 0 } }
    );

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
