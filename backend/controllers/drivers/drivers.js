const Driver = require("../../models/Driver");
const DriverNotification = require("../../models/DriverNotification");
const DriverAds = require("../../models/DriverAds");
const DriverSupportTicket = require("../../models/DriverSupportTicket");
const Bus = require("../../models/Bus");
const BusTicket = require("../../models/BusTicket");
const StatusCodes = require("http-status-codes");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// S3 Client for Liara
const s3Client = new S3Client({
  region: process.env.LIARA_REGION,
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  forcePathStyle: true,
});

// # description -> HTTP VERB -> Accesss -> Access Type
// # get driver profile -> GET -> Driver -> PRIVATE
// @route = /api/drivers/me
exports.getMe = async (req, res) => {
  try {
    let driver = await Driver.findById(req.driver._id).select("-password");
    if (driver) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "راننده پیدا شد",
        driver,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "راننده پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver profile -> GET -> Driver -> PRIVATE
// @route = /api/drivers/me
exports.updateProfile = async (req, res) => {
  try {
    let drivingLicenseBody = {
      name: req.body.name,
      nationalCode: req.body.nationalCode,
      dateOfIssue: req.body.dateOfIssue,
      birthDate: req.body.birthDate,
      licenseNumber: req.body.licenseNumber,
      crediteDate: req.body.crediteDate,
    };

    await Driver.findByIdAndUpdate(
      req.driver._id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        nationalCode: req.body.nationalCode,
        province: req.body.province,
        city: req.body.city,
        gender: req.body.gender,
        address: req.body.address,
        firstCity: req.body.firstCity,
        lastCity: req.body.lastCity,
        movingDate: req.body.movingDate,
        returningDate: req.body.returningDate,
        startHour: req.body.startHour,
        endHour: req.body.endHour,
        address: req.body.address,
        drivingLicense: drivingLicenseBody,
      },
      { new: true }
    )
      .then((user) => {
        if (user) {
          res.status(StatusCodes.OK).json({
            msg: " پروفایل راننده ویرایش شد ",
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

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver profile -> GET -> Driver -> PRIVATE
// @route = /api/drivers/me
exports.updateAvatar = async (req, res) => {
  try {
    await Driver.findByIdAndUpdate(
      req.driver._id,
      {
        avatar: req.file.filename,
      },
      { new: true }
    )
      .then((driver) => {
        if (driver) {
          res.status(StatusCodes.OK).json({
            msg: "آواتار راننده ویرایش شد",
            driver,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "آواتار راننده ویرایش نشد",
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

// # description -> HTTP VERB -> Accesss -> Access Type
// # get  driver notifications -> GET -> Driver -> PRIVATE
// @route = /api/drivers/notifications
exports.notifications = async (req, res) => {
  try {
    let notifications = await DriverNotification.find({
      reciever: req.driver._id,
    });
    // let findDriverNotifications = []

    // for (let i = 0; i < notifications.length; i++) {
    //     if (JSON.stringify(notifications[i].reciever) == JSON.stringify(req.driver._id)) {
    //         findDriverNotifications.push(notifications[i])
    //     }
    // }

    if (notifications && notifications.length) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اعلان ها پیدا شدند",
        count: notifications.length,
        notifications,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "اعلان ها پیدا نشدند",
      });
    }
  } catch (error) {
    console.log(error);

    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single driver notification -> GET -> Driver -> PRIVATE
// @route = /api/drivers/notifications/:ntfId
exports.notification = async (req, res) => {
  try {
    let notification = await DriverNotification.findById(req.params.ntfId);
    if (notification) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اعلان پیدا شد",
        notification,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "اعلان پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # create notification for driver -> POST -> Driver -> PRIVATE
// @route = /api/drivers/notifications
exports.createNotification = async (req, res) => {
  try {
    await DriverNotification.create({
      title: req.body.title,
      message: req.body.message,
      reciever: req.body.reciever,
    }).then((data) => {
      res.status(StatusCodes.CREATED).json({
        status: "success",
        msg: "اعلان ساخته شد",
        data,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # mark driver notification -> GET -> Driver -> PRIVATE
// @route = /api/drivers/notifications/:ntfId/mark-notification
exports.markNotification = async (req, res) => {
  try {
    await DriverNotification.findByIdAndUpdate(
      req.params.ntfId,
      { read: true },
      { new: true }
    ).then((nft) => {
      if (nft) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "اعلان خوانده شد",
          nft,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "اعلان خوانده نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all driver ads -> GET -> Driver -> PRIVATE
// @route = /api/drivers/ads
exports.allAds = async (req, res) => {
  try {
    let ads = await DriverAds.find({ driver: req.driver._id })
      .populate("company")
      .select("-password");
    if (ads) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "آگهی ها پیدا شد",
        count: ads.length,
        ads,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "آگهی ها پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single driver ads -> GET -> Driver -> PRIVATE
// @route = /api/drivers/ads/:adsId
exports.singleAds = async (req, res) => {
  try {
    let ads = await DriverAds.findById(req.params.adsId).populate("driver");

    if (ads) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "آگهی پیدا شد",
        ads,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "آگهی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get create driver ads -> POST -> Driver -> PRIVATE
// @route = /api/drivers/ads
exports.createAds = async (req, res) => {
  let company = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  try {
    const { title, description, price, name, phone, address } = req.body;
    const coverImageFile = req.files.photo && req.files.photo[0];
    const imageFiles = req.files.photos || [];

    if (
      !title ||
      !coverImageFile ||
      imageFiles.length > 6 ||
      !description ||
      !price ||
      !name ||
      !phone ||
      !address
    ) {
      return res
        .status(400)
        .json({ error: "Title, cover image, and up to 6 images are required" });
    }

    // --- Upload cover image ---
    const coverImageKey = `driverAdsPhotos/photo-${Date.now()}-${
      coverImageFile.originalname
    }`;
    const coverUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: coverImageKey,
        Body: coverImageFile.buffer, // یا استریم
        ContentType: coverImageFile.mimetype,
      },
    });
    await coverUpload.done();

    // --- Upload additional images ---
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageKey = `driverAdsPhotos/photos-${Date.now()}-${
        file.originalname
      }`;
      const imageUpload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });
      await imageUpload.done();

      imageUrls.push(
        `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`
      );
    }

    // --- Save ads to MongoDB ---
    const ads = new DriverAds({
      title,
      description,
      price,
      driver: req.driver._id,
      company,
      photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
      photos: imageUrls,
    });

    await ads.save();
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "آگهی ساخته شد",
      data: ads,
    });
  } catch (error) {
    console.error("Error creating ads:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver ads -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/ads/:adsId/update-ads
exports.updateAds = async (req, res) => {
  // try {
  //     await DriverAds.findByIdAndUpdate(req.params.adsId, {
  //         title: req.body.title,
  //         description: req.body.description,
  //         price: req.body.price,
  //     }, { new: true }).then((ads) => {
  //         if (ads) {
  //             return res.status(StatusCodes.OK).json({
  //                 status: 'success',
  //                 msg: "آگهی ویرایش شد",
  //                 ads
  //             })
  //         } else {
  //             return res.status(StatusCodes.BAD_REQUEST).json({
  //                 status: 'failure',
  //                 msg: "آگهی ویرایش نشد"
  //             })
  //         }
  //     })

  // } catch (error) {
  //     console.error(error.message);
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //         status: 'failure',
  //         msg: "خطای داخلی سرور",
  //         error
  //     });
  // }

  try {
    let company = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };
    await DriverAds.findByIdAndUpdate(
      req.params.adsId,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        company,
      },
      { new: true }
    ).then((ads) => {
      if (ads) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "آگهی ویرایش شد",
          ads,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "آگهی ویرایش نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver ads photo -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/ads/:adsId/update-photo
exports.updateAdsPhoto = async (req, res) => {
  try {
    const coverImageFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `driverAdsPhotos/photo-${Date.now()}-${
      coverImageFile.originalname
    }`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: coverImageKey,
        Body: coverImageFile.buffer,
        ContentType: coverImageFile.mimetype,
      })
    );

    await DriverAds.findByIdAndUpdate(req.params.adsId, {
      photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
    }).then((ads) => {
      if (ads) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "تصویر اصلی آگهی ویرایش شد",
          ads,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "تصویر اصلی آگهی ویرایش نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver ads photos -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/ads/:adsId/update-photos
exports.updateAdsPhotos = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files : []; // Ensure req.files is an array

    // Upload images to 'driverAdsPhotos/' folder
    const imageUrls = [];
    for (const file of imagePaths) {
      const imageKey = `driverAdsPhotos/photos-${Date.now()}-${
        file.originalname
      }`;

      // Use Upload from @aws-sdk/lib-storage
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer, // Buffer from multer
          ContentType: file.mimetype,
        },
      });

      // Execute the upload
      await upload.done();

      // Construct the public URL
      imageUrls.push(
        `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`
      );
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        error: "حداقل یک تصویر باید وارد کنید..!",
      });
    }

    // Update the driverAds document
    const updatedAds = await DriverAds.findByIdAndUpdate(
      req.params.adsId,
      { photos: imageUrls },
      { new: true } // Return the updated document
    );

    if (updatedAds) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "تصاویر آگهی ویرایش شدند",
        ads: updatedAds,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تصاویر آگهی ویرایش نشدند",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # delete driver ads -> DELETE -> Driver -> PRIVATE
// @route = /api/drivers/ads/:adsId
exports.deleteAds = async (req, res) => {
  try {
    await DriverAds.findByIdAndDelete(req.params.adsId).then((ads) => {
      if (ads) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "آگهی حذف شد",
          ads,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "آگهی حذف نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all drivers support tickets -> GET -> Driver -> PRIVATE
// @route = /api/drivers/support-tickets
exports.supportTickets = async (req, res) => {
  try {
    let tickets = await DriverSupportTicket.find({});
    if (tickets) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "تیکت های پشتیبانی پیدا شد",
        count: tickets.length,
        tickets,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تیکت های پشتیبانی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single drivers support ticket -> GET -> Driver -> PRIVATE
// @route = /api/drivers/support-tickets/:stId
exports.supportTicket = async (req, res) => {
  try {
    let ticket = await DriverSupportTicket.findById(req.params.stId);
    if (ticket) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "تیکت پشتیبانی پیدا شد",
        ticket,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تیکت پشتیبانی پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # create drivers support ticket -> POST -> Driver -> PRIVATE
// @route = /api/drivers/support-tickets
exports.createSupportTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageFiles = req.files.images || [];

    if ((imageFiles.length > 6 || !title, !description)) {
      return res.status(400).json({
        error: "title, cover images, and up to 6 images are required",
      });
    }

    // Upload additional images to 'food/' folder
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageKey = `driverSupportTickets/images-${Date.now()}-${
        file.originalname
      }`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      imageUrls.push(
        `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`
      );
    }

    // Save supportTicket to MongoDB
    const supportTicket = new DriverSupportTicket({
      title: req.body.title,
      description: req.body.description,
      driver: req.driver._id,
      assignedTo: req.driver._id,
      images: imageUrls,
    });

    await supportTicket.save();
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "تیکت پشتیبانی اضافه شد",
      data: supportTicket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # read support ticket -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/support-tickets/:stId/read
exports.readSupportTicket = async (req, res) => {
  try {
    await DriverSupportTicket.findByIdAndUpdate(
      req.params.stId,
      {
        isRead: true,
      },
      { new: true }
    ).then((ticket) => {
      if (ticket) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "تیکت خوانده شد",
          ticket,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "تیکت خوانده نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comments to support ticket -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/support-tickets/:stId/add-comment
exports.addCommentsToSupportTicket = async (req, res) => {
  try {
    let supportTicketFound = await DriverSupportTicket.findById(
      req.params.stId
    );
    if (supportTicketFound) {
      let comments = {
        driver: req.driver._id,
        comment: req.body.comment,
      };

      supportTicketFound.comments.push(comments);

      await supportTicketFound
        .save()
        .then((ticket) => {
          return res.status(StatusCodes.OK).json({
            status: "success",
            msg: "پاسخ گویی به تیکت",
            ticket,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(StatusCodes.BAD_REQUEST).json({
            status: "failure",
            msg: "عدم پاسخ گویی به تیکت",
            error,
          });
        });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "failure",
        msg: "تیکت پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get driver bus -> GET -> Driver -> PRIVATE
// @route = /api/drivers/bus
exports.getDriverBus = async (req, res) => {
  try {
    // let buses = await Bus.find({})
    // let findBus = buses.find(bus => JSON.stringify(bus.driver) == JSON.stringify(req.driver._id));

    let findBus = await Bus.findOne({ driver: req.driver._id });

    if (findBus) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اتوبوس پیدا شد",
        bus: findBus,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "failure",
        msg: "اتوبوس پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # add driver bus -> POST -> Driver -> PRIVATE
// @route = /api/drivers/bus
exports.addDriverBus = async (req, res) => {
  let findBus = await Bus.findOne({ driver: req.driver._id });

  if (findBus) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "failure",
      msg: "شما قبلا اتوبوس خود را اضافه کردید",
    });
  } else {
    // Get files from request
    const coverPhotoFile = req.files?.photo?.[0];
    const photosFiles = req.files?.photos || [];

    // / Validate required files
    if (!coverPhotoFile) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تصویر اصلی الزامی است",
      });
    }

    // Upload cover image to S3
    const coverPhotoKey = `driverBusPhotos/coverPhoto-${Date.now()}-${
      coverPhotoFile.originalname
    }`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: coverPhotoKey,
        Body: coverPhotoFile.buffer,
        ContentType: coverPhotoFile.mimetype,
      })
    );

    // Upload additional photos
    const photosUrls = await Promise.all(
      photosFiles.map(async (file) => {
        const photoKey = `driverBusPhotos/photos-${Date.now()}-${
          file.originalname
        }`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: photoKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );
        return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${photoKey}`;
      })
    );

    try {
      await Bus.create({
        driver: req.driver._id,
        name: req.body.name,
        description: req.body.description,
        model: req.body.model,
        color: req.body.color,
        type: req.body.type,
        heat: req.body.heat,
        coldness: req.body.coldness,
        licensePlate: req.body.licensePlate,
        serviceProvider: req.body.serviceProvider,
        price: req.body.price,
        seats: req.body.seats,
        capacity: req.body.capacity,
        // photo: req.files.photo[0].filename,
        photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverPhotoKey}`,
        photos: photosUrls,
        options: req.body.options,
      }).then((data) => {
        res.status(StatusCodes.CREATED).json({
          status: "success",
          msg: "اتوبوس افزوده شد",
          data,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "failure",
        msg: "خطای داخلی سرور",
        error,
      });
    }
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver bus -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/bus/:busId/update-bus
exports.updateDriverBus = async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(
      req.params.busId,
      {
        name: req.body.name,
        description: req.body.description,
        model: req.body.model,
        color: req.body.color,
        type: req.body.type,
        licensePlate: req.body.licensePlate,
        serviceProvider: req.body.serviceProvider,
        price: req.body.price,
        seats: req.body.seats,
        capacity: req.body.capacity,
        options: req.body.options,
        heat: req.body.heat,
        coldness: req.body.coldness,
      },
      { new: true }
    ).then((bus) => {
      if (bus) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "اتوبوس ویرایش شد",
          bus,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "اتوبوس ویرایش نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver bus cover photo -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/bus/:busId/update-photo
exports.updateDriverBusPhoto = async (req, res) => {
  try {
    const coverPhotoFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'ads/' folder
    const coverPhotoKey = `driverBusPhotos/photo-${Date.now()}-${
      coverPhotoFile.originalname
    }`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: coverPhotoKey,
        Body: coverPhotoFile.buffer,
        ContentType: coverPhotoFile.mimetype,
      })
    );

    await Bus.findByIdAndUpdate(req.params.busId, {
      photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverPhotoKey}`,
    }).then((ads) => {
      if (ads) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "تصویر اصلی اتوبوس ویرایش شد",
          ads,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "تصویر اصلی اتوبوس ویرایش نشد",
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # update driver bus cover photo -> PUT -> Driver -> PRIVATE
// @route = /api/drivers/bus/:busId/update-photos
exports.updateDriverBusPhotos = async (req, res) => {
  try {
    const photoPaths = req.files ? req.files : [];

    // Upload images to 'driverBusPhotos/' folder
    const photoUrls = [];
    for (const file of photoPaths) {
      const imageKey = `driverBusPhotos/photos-${Date.now()}-${
        file.originalname
      }`;

      // Use Upload from @aws-sdk/lib-storage
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer, // Buffer from multer
          ContentType: file.mimetype,
        },
      });

      // Execute the upload
      await upload.done();

      // Construct the public URL
      photoUrls.push(
        `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`
      );
    }

    if (photoUrls.length === 0) {
      return res.status(400).json({
        error: "حداقل یک تصویر باید وارد کنید..!",
      });
    }

    // Update the bus
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.busId,
      { photos: photoUrls },
      { new: true } // Return the updated
    );

    if (updatedBus) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "تصاویر اتوبوس ویرایش شدند",
        ads: updatedBus,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تصاویر اتوبوس ویرایش نشدند",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get driver bus tickets -> GET -> Driver -> PRIVATE
// @route = /api/drivers/bus-tickets
exports.getBusTickets = async (req, res) => {
  try {
    let busTickets = await BusTicket.find({});
    let foundBusTickets = [];

    for (let i = 0; i < busTickets.length; i++) {
      if (
        JSON.stringify(busTickets[i].driver) == JSON.stringify(req.driver._id)
      ) {
        foundBusTickets.push(busTickets[i]);
      }
    }

    if (foundBusTickets) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "بلیط های اتوبوس پیدا شد",
        count: foundBusTickets.length,
        tickets: foundBusTickets,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "failure",
        msg: "بلیط های اتوبوس پیدا نشد",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

exports.finance = (req, res) => {
  res.send("driver finance");
};
