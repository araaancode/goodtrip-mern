const { StatusCodes } = require("http-status-codes");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const crypto = require("crypto");
const OwnerNotification = require("../../models/OwnerNotification");
const Owner = require("../../models/Owner");
const House = require("../../models/House");
const OwnerAds = require("../../models/OwnerAds");
const OwnerSupportTicket = require("../../models/OwnerSupportTicket");
const Booking = require("../../models/Booking");
const fs=require("fs")

// S3 Client for Liara
const s3Client = new S3Client({
  region: process.env.LIARA_REGION, // e.g. 'ir-thr-c1'
  endpoint: process.env.LIARA_ENDPOINT, // e.g. 'https://your-bucket.liara.ir'
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  forcePathStyle: true, // Important for S3-compatible storage like Liara
});

// *** owners apis ***
// # description -> HTTP VERB -> Accesss -> Access Type
// # owner get profile -> GET -> Owner -> PRIVATE
// @route = /api/owners/me
exports.getMe = async (req, res) => {
  try {
    let owner = await Owner.findById(req.owner.id).select("-password");

    if (owner) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "ملک دار پیدا شد",
        owner,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "ملک دار پیدا نشد",
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

// *** owners apis ***
// # description -> HTTP VERB -> Accesss -> Access Type
// # owner update profile -> PUT -> Owner -> PRIVATE
// @route = /api/owners/update-profile
exports.updateProfile = async (req, res) => {
  try {
    let owner = await Owner.findByIdAndUpdate(
      req.owner._id,
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
      },
      { new: true }
    );

    if (owner) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اطلاعات ملک دار ویرایش شد",
        name: owner.name,
        phone: owner.phone,
        email: owner.email,
        username: owner.username,
        nationalCode: owner.nationalCode,
        province: owner.province,
        city: owner.city,
        gender: owner.gender,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "اطلاعات ملک دار ویرایش نشد",
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

// *** owners apis ***
// # description -> HTTP VERB -> Accesss -> Access Type
// # owner update avatar -> PUT -> Owner -> PRIVATE
// @route = /api/owners/update-avatar
exports.updateAvatar = async (req, res) => {
  try {
    await Owner.findByIdAndUpdate(
      req.owner._id,
      {
        avatar: req.file.filename,
      },
      { new: true }
    )
      .then((owner) => {
        if (owner) {
          res.status(StatusCodes.OK).json({
            msg: "آواتار ملک دار ویرایش شد",
            name: owner.name,
            phone: owner.phone,
            email: owner.email,
            username: owner.username,
            nationalCode: owner.nationalCode,
            province: owner.province,
            city: owner.city,
            gender: owner.gender,
            avatar: owner.avatar,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "آواتار ملک دار ویرایش نشد",
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
// # get  owner notifications -> GET -> Owner -> PRIVATE
// @route = /api/owners/notifications
exports.notifications = async (req, res) => {
  try {
    let notifications = await OwnerNotification.find({
      reciever: req.owner._id,
    });
    // let findOwnerNotifications = []

    // for (let i = 0; i < notifications.length; i++) {
    //     if (JSON.stringify(notifications[i].reciever) == JSON.stringify(req.owner._id)) {
    //         findOwnerNotifications.push(notifications[i])
    //     }
    // }

    if (notifications) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اعلان ها پیدا شد",
        count: notifications.length,
        notifications,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "اعلان ها پیدا نشد",
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
// # get single Owner notification -> GET -> Owner -> PRIVATE
// @route = /api/owners/notifications/:ntfId
exports.notification = async (req, res) => {
  try {
    let notification = await OwnerNotification.findById(req.params.ntfId);
    if (notification) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اعلان پیدا شد",
        notification,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
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
// # create notification for Owner -> POST -> Owner -> PRIVATE
// @route = /api/owners/notifications
exports.createNotification = async (req, res) => {
  try {
    await OwnerNotification.create({
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
// # mark Owner notification -> PUT -> Owner -> PRIVATE
// @route = /api/owners/notifications/:ntfId/mark-notification
exports.markNotification = async (req, res) => {
  try {
    await OwnerNotification.findByIdAndUpdate(
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

// Route: GET /api/owners/ads
// Access: Private (Owner only)
// Description: Get all ads belonging to the authenticated owner
exports.allAds = async (req, res) => {
  try {
    // 1. Validate owner exists (auth middleware should handle this, but double-check)
    if (!req.owner || !req.owner._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "Owner authentication failed",
      });
    }

    // 2. Query database
    const ads = await OwnerAds.find({ owner: req.owner._id })
      .populate("owner", "name email phone") // Explicitly select only needed fields
      .sort({ createdAt: -1 }) // Add sorting by newest first
      .lean(); // Better performance

    // 3. Handle response
    if (!ads.length) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "No ads found for this owner",
        count: 0,
        ads: [],
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Ads retrieved successfully",
      count: ads.length,
      ads,
    });
  } catch (error) {
    console.error("Error fetching owner ads:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single Owner ads -> GET -> A -> PRIVATE
// @route = /api/owners/notifications/:adsId
exports.singleAds = async (req, res) => {
  try {
    let ads = await OwnerAds.findById(req.params.adsId);
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
// # get create owner ads -> POST -> Owner -> PRIVATE
// @route = /api/owners/ads
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
    const coverImageKey = `ownerAdsPhotos/photo-${Date.now()}-${coverImageFile.originalname}`;
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
      const imageKey = `ownerAdsPhotos/photos-${Date.now()}-${file.originalname}`;
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
    const ads = new OwnerAds({
      title,
      description,
      price,
      owner: req.owner._id,
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
// # update owner ads -> PUT -> Owner -> PRIVATE
// @route = /api/owners/ads/:adsId/update-ads
exports.updateAds = async (req, res) => {
  try {
    let company = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };
    await OwnerAds.findByIdAndUpdate(
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
// # update owner ads photo -> PUT -> Owner -> PRIVATE
// @route = /api/owners/ads/:adsId/update-photo
exports.updateAdsPhoto = async (req, res) => {
  try {
    const coverImageFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `ownerAdsPhotos/photo-${Date.now()}-${
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

    await OwnerAds.findByIdAndUpdate(req.params.adsId, {
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
// # update owner ads photos -> PUT -> Owner -> PRIVATE
// @route = /api/owners/ads/:adsId/update-photos
exports.updateAdsPhotos = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files : []; // Ensure req.files is an array

    // Upload images to 'ownerAdsPhotos/' folder
    const imageUrls = [];
    for (const file of imagePaths) {
      const imageKey = `ownerAdsPhotos/photos-${Date.now()}-${
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

    // Update the ownerAds document
    const updatedAds = await OwnerAds.findByIdAndUpdate(
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
// # delete owner ads -> DELETE -> Owner -> PRIVATE
// @route = /api/owners/ads/:adsId
exports.deleteAds = async (req, res) => {
  try {
    await OwnerAds.findByIdAndDelete(req.params.adsId).then((ads) => {
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

// # description -> HTTP VERB -> Access -> Access Type
// # get all owners support tickets -> GET -> Owner -> PRIVATE
// @route = /api/owners/support-tickets
exports.supportTickets = async (req, res) => {
  try {
    // 1. Validate owner authentication
    if (!req.owner?._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "احراز هویت ناموفق بود",
      });
    }

    // 2. Query tickets with additional useful fields and sorting
    const tickets = await OwnerSupportTicket.find({ owner: req.owner._id })
      .populate("owner", "name email") // Only include necessary owner info
      .sort({ createdAt: -1 }) // Newest tickets first
      .select("-__v") // Exclude version key
      .lean(); // Better performance

    // 3. Handle response (consistent structure whether empty or not)
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: tickets.length
        ? "تیکت های پشتیبانی پیدا شد"
        : "هیچ تیکت پشتیبانی یافت نشد",
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single owners support ticket -> GET -> Owner -> PRIVATE
// @route = /api/owners/support-tickets/:stId
exports.supportTicket = async (req, res) => {
  try {
    let ticket = await OwnerSupportTicket.findById(req.params.stId);
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
// # create owners support ticket -> POST -> Owner -> PRIVATE
// @route = /api/owners/support-tickets
exports.createSupportTicket = async (req, res) => {
  try {
    let images = [];
    if (req.files.images) {
      req.files.images.forEach((e) => {
        images.push(e.path);
      });
    }

    await OwnerSupportTicket.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.owner._id,
      assignedTo: req.owner._id,
      images,
    })
      .then((data) => {
        res.status(StatusCodes.CREATED).json({
          status: "success",
          msg: "تیکت پشتیبانی ساخته شد",
          data,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          error,
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
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # read support ticket -> PUT -> Owner -> PRIVATE
// @route = /api/owners/support-tickets/:stId/read
exports.readSupportTicket = async (req, res) => {
  try {
    await OwnerSupportTicket.findByIdAndUpdate(
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
// # add comments to support ticket -> PUT -> Owner -> PRIVATE
// @route = /api/owners/support-tickets/:stId/add-comment
exports.addCommentsToSupportTicket = async (req, res) => {
  try {
    let supportTicketFound = await OwnerSupportTicket.findById(req.params.stId);
    if (supportTicketFound) {
      let comments = {
        owner: req.owner._id,
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

exports.getHouses = async (req, res) => {
  try {
    // 1. Validate owner authentication
    if (!req.owner?._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "احراز هویت ناموفق بود",
      });
    }

    // 2. First check if amenities exists in schema
    const houseSchema = House.schema.obj;
    const populateOptions = [];

    if (houseSchema.amenities) {
      populateOptions.push({ path: "amenities", select: "name icon" });
    }

    if (houseSchema.reviews) {
      populateOptions.push({ path: "reviews", select: "rating comment" });
    }

    // 3. Query houses
    const houses = await House.find({ owner: req.owner._id })
      .populate(populateOptions)
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return response
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: houses.length
        ? "خانه ها با موفقیت دریافت شدند"
        : "هیچ خانه ای ثبت نشده است",
      count: houses.length,
      houses,
    });
  } catch (error) {
    console.error("Error fetching houses:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # owner get house -> GET -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId
exports.getHouse = async (req, res) => {
  try {
    let house = await House.findById(req.params.houseId);
    if (house) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "خانه پیدا شد",
        house,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "خانه پیدا نشد",
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
// # owner create house -> POST -> Owner -> PRIVATE
// @route = /api/owners/houses
exports.createHouse = async (req, res) => {
  try {
    // Destructure all required fields from request body
    const {
      name,
      province,
      city,
      description,
      price,
      postalCode,
      housePhone,
      meters,
      year,
      capacity,
      houseRoles,
      critrias,
      houseType,
      lat,
      lng,
      floor,
      options,
      heating,
      cooling,
      parking,
      address,
      houseOwner,
      houseNumber,
      hobbies,
      enviornment,
      ownerType,
      rooms,
      reservationRoles,
      freeDates,
      floorType,
      kitchenOptions,
      bedRoomOptions,
    } = req.body;

    // Handle latitude conversion and validation
    let latitude;
    if (Array.isArray(lat)) {
      latitude = parseFloat(lat[0]);
    } else if (typeof lat === "string") {
      latitude = parseFloat(lat);
    } else {
      latitude = lat;
    }

    // Handle longitude conversion and validation
    let longitude;
    if (Array.isArray(lng)) {
      longitude = parseFloat(lng[0]);
    } else if (typeof lng === "string") {
      longitude = parseFloat(lng);
    } else {
      longitude = lng;
    }

    // Validate coordinates
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "مختصات جغرافیایی نامعتبر است",
      });
    }

    // Get files from request
    const coverImageFile = req.files?.cover?.[0];
    const imagesFiles = req.files?.images || [];
    const billFiles = req.files?.bill || [];
    const documentFiles = req.files?.document || [];

    // Validate required files
    if (!coverImageFile) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "تصویر اصلی الزامی است",
      });
    }

    // Upload cover image to S3
    const coverImageKey = `ownerHousePhotos/coverImage-${Date.now()}-${
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

    // Upload additional images
    const imagesUrls = await Promise.all(
      imagesFiles.map(async (file) => {
        const imageKey = `ownerHousePhotos/images-${Date.now()}-${
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
        return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`;
      })
    );

    // Upload bill documents
    const billUrls = await Promise.all(
      billFiles.map(async (file) => {
        const billKey = `ownerHouseBills/bills-${Date.now()}-${
          file.originalname
        }`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: billKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );
        return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${billKey}`;
      })
    );

    // Upload other documents
    const documentUrls = await Promise.all(
      documentFiles.map(async (file) => {
        const docKey = `ownerHouseDocuments/documents-${Date.now()}-${
          file.originalname
        }`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: docKey,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );
        return `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${docKey}`;
      })
    );

    // Create new house document
    const house = new House({
      owner: req.owner._id,
      name,
      province,
      city,
      description,
      price,
      postalCode,
      housePhone,
      meters,
      year,
      capacity,
      houseRoles,
      critrias,
      houseType,
      lat: latitude,
      lng: longitude,
      floor,
      options,
      heating,
      cooling,
      parking,
      address,
      houseOwner,
      houseNumber,
      hobbies,
      enviornment,
      ownerType,
      rooms,
      reservationRoles,
      freeDates,
      floorType,
      kitchenOptions,
      bedRoomOptions,
      cover: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
      images: imagesUrls,
      bill: billUrls,
      document: documentUrls,
    });

    // Save to database
    await house.save();

    // Return success response
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "ملک با موفقیت ثبت شد",
      data: {
        houseId: house._id,
        name: house.name,
        address: house.address,
        coverImage: house.cover,
      },
    });
  } catch (error) {
    console.error("Error creating house:", error);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "خطا در اعتبارسنجی داده‌ها",
        errors,
      });
    }

    // Generic error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای سرور در ایجاد ملک",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # owner update house -> GET -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId/update-house
exports.updateHouse = async (req, res) => {
  try {
    console.log(req.body);

    let house = await House.findByIdAndUpdate(
      req.params.houseId,
      {
        name: req.body.name,
        province: req.body.province,
        city: req.body.city,
        description: req.body.description,
        price: req.body.price,
        postalCode: req.body.postalCode,
        housePhone: req.body.housePhone,
        meters: req.body.meters,
        year: req.body.year,
        capacity: req.body.capacity,
        houseRoles: req.body.houseRoles,
        critrias: req.body.critrias,
        houseType: req.body.houseType,
        lat: req.body.lat,
        lng: req.body.lng,
        floor: req.body.floor,
        options: req.body.options,
        heating: req.body.heating,
        cooling: req.body.cooling,
        parking: req.body.parking,
        address: req.body.address,
        houseOwner: req.body.houseOwner,
        houseNumber: req.body.houseNumber,
        hobbies: req.body.hobbies,
        enviornment: req.body.enviornment,
        ownerType: req.body.ownerType,
        rooms: +req.body.rooms,
        discount: +req.body.discount,
        document: req.body.document,
        reservationRoles: req.body.reservationRoles,
        freeDates: req.body.freeDates,
        floorType: req.body.floorType,
        kitchenOptions: req.body.kitchenOptions,
        bedRoomOptions: req.body.bedRoomOptions,
      },
      { new: true }
    );

    if (house) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "خانه ویرایش شد",
        house,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "خانه ویرایش نشد",
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
// # owner update house cover -> PUT -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId/update-cover
exports.updateCover = async (req, res) => {
  try {
    const coverImageFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'house/' folder
    const coverImageKey = `ownerHouseCover/cover-${Date.now()}-${
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

    await House.findByIdAndUpdate(req.params.houseId, {
      cover: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
    }).then((house) => {
      if (house) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "تصویر اصلی ملک ویرایش شد",
          house,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "تصویر اصلی ملک ویرایش نشد",
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
// # owner update house images -> PUT -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId/update-images
exports.updateImages = async (req, res) => {
  try {
    // Validate input files
    const imagePaths = req.files ? req.files : [];
    if (!imagePaths.length) {
      return res.status(400).json({
        error: "حداقل یک تصویر باید وارد کنید..!",
      });
    }

    // Fetch house to access existing photos
    const house = await House.findById(req.params.houseId);
    if (!house) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "ملک یافت نشد",
      });
    }

    // Delete old images from S3 if they exist
    if (house.photos && house.photos.length > 0) {
      const deleteParams = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Delete: {
          Objects: house.photos.map((url) => ({
            Key: url.split(`${process.env.LIARA_BUCKET_NAME}/`)[1],
          })),
        },
      };
      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      await s3Client.send(deleteCommand);
    }

    // Upload new images to S3
    const imageUrls = [];
    for (const file of imagePaths) {
      const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
      const imageKey = `ownerHousePhotos/photos-${uniqueSuffix}-${file.originalname}`;

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: "no-cache, no-store, must-revalidate",
        },
      });

      await upload.done();

      const publicUrl = `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`;
      imageUrls.push(publicUrl);
    }

    // Update house with new images, replacing old ones
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.houseId,
      { $set: { images: imageUrls } }, // Explicitly replace photos array
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "جایگزینی تصاویر ملک انجام نشد",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "تصاویر قدیمی حذف و با تصاویر جدید جایگزین شدند",
      house: updatedHouse,
    });
  } catch (error) {
    console.error("Error replacing images:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # owner update house map -> PUT -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId/update-map
exports.updateMap = async (req, res) => {
  try {
    let house = await House.findByIdAndUpdate(
      req.params.houseId,
      {
        lat: req.body.lat,
        lng: req.body.lng,
      },
      { new: true }
    );

    if (house) {
      res.status(200).json({
        status: "success",
        msg: "نقشه ویرایش شد",
        house,
      });
    } else {
      res.status(403).json({
        msg: "نقشه ویرایش نشد",
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

exports.updateBill = async (req, res) => {
  try {
    // Validate input files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "حداقل یک تصویر باید وارد کنید..!",
      });
    }

    // Fetch house to access existing bill
    const house = await House.findById(req.params.houseId);
    if (!house) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "ملک یافت نشد",
      });
    }

    // Delete old images from S3 if they exist
    if (house.bill && house.bill.length > 0) {
      // Filter out any null/undefined values and create delete objects
      const deleteObjects = house.bill
        .filter((url) => url) // Remove null/undefined
        .map((url) => {
          // More robust URL parsing
          const urlParts = url.split(`${process.env.LIARA_BUCKET_NAME}/`);
          return {
            Key: urlParts.length > 1 ? urlParts[1] : url.split("/").pop(),
          };
        });

      if (deleteObjects.length > 0) {
        const deleteParams = {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Delete: { Objects: deleteObjects },
        };
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3Client.send(deleteCommand);
      }
    }

    // Upload new images to S3
    const imageUrls = [];
    for (const file of req.files) {
      const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
      const imageKey = `ownerHouseBill/bill-${uniqueSuffix}-${file.originalname}`;

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: "no-cache, no-store, must-revalidate",
        },
      });

      await upload.done();
      imageUrls.push(
        `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${imageKey}`
      );
    }

    // Update house with new images
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.houseId,
      { bill: imageUrls },
      { new: true }
    );

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "تصاویر قدیمی حذف و با تصاویر جدید جایگزین شدند",
      house: updatedHouse,
    });
  } catch (error) {
    console.error("Error replacing images:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # owner update house documents -> PUT -> Owner -> PRIVATE
// @route = /api/owners/houses/:houseId/update-document
exports.updateDocument = async (req, res) => {
  try {
    // Validate environment variables
    const { LIARA_BUCKET_NAME, LIARA_ENDPOINT } = process.env;
    if (!LIARA_BUCKET_NAME || !LIARA_ENDPOINT) {
      throw new Error("Missing required environment variables");
    }

    // Validate input files
    let imagePaths = [];
    if (!req.files) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "حداقل یک تصویر باید وارد کنید..!",
      });
    }
    if (Array.isArray(req.files)) {
      imagePaths = req.files;
    } else if (typeof req.files === "object") {
      imagePaths = [req.files];
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "فرمت فایل‌های ورودی نامعتبر است",
      });
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of imagePaths) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: `نوع فایل ${file.originalname} مجاز نیست`,
        });
      }
      if (file.size > maxSize) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: `حجم فایل ${file.originalname} بیش از حد مجاز است`,
        });
      }
    }

    // Fetch house
    const house = await House.findById(req.params.houseId);
    if (!house) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "failure",
        msg: "ملک یافت نشد",
      });
    }

    // Delete old images from S3 if they exist
    if (house.document?.length > 0) {
      const objectsToDelete = house.document
        .map((url) => {
          const key = url.replace(
            `${LIARA_ENDPOINT}/${LIARA_BUCKET_NAME}/`,
            ""
          );
          return key ? { Key: key } : null;
        })
        .filter(Boolean);

      if (objectsToDelete.length > 0) {
        // Prepare the Delete object
        const deleteBody = {
          Objects: objectsToDelete,
        };

        // Serialize to JSON and compute Content-MD5
        const deleteBodyJson = JSON.stringify(deleteBody);
        const md5Hash = crypto
          .createHash("md5")
          .update(deleteBodyJson)
          .digest();
        const contentMD5 = md5Hash.toString("base64");

        // Configure delete parameters with Content-MD5
        const deleteParams = {
          Bucket: LIARA_BUCKET_NAME,
          Delete: deleteBody,
          ContentMD5: contentMD5,
        };

        try {
          const deleteCommand = new DeleteObjectsCommand(deleteParams);
          await s3Client.send(deleteCommand);
        } catch (err) {
          console.error(
            `Failed to delete old images for house ${req.params.houseId}:`,
            err
          );
          throw new Error(`خطا در حذف مدارک قدیمی: ${err.message}`);
        }
      }
    }

    // Upload new documents to S3
    const imageUrls = [];
    const uploadPromises = imagePaths.map(async (file) => {
      const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
      const imageKey = `ownerHousePhotos/document-${uniqueSuffix}-${file.originalname}`;

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: LIARA_BUCKET_NAME,
          Key: imageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: "no-cache, no-store, must-revalidate",
        },
      });

      try {
        await upload.done();
        return `${LIARA_ENDPOINT}/${LIARA_BUCKET_NAME}/${imageKey}`;
      } catch (err) {
        console.error(
          `Failed to upload ${file.originalname} for house ${req.params.houseId}:`,
          err
        );
        throw new Error(`خطا در آپلود فایل ${file.originalname}`);
      }
    });

    // Execute uploads in parallel
    imageUrls.push(...(await Promise.all(uploadPromises)));

    // Update house with new document
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.houseId,
      { $set: { document: imageUrls } },
      { new: true }
    );

    if (!updatedHouse) {
      // Rollback: Delete uploaded files if update fails
      const deleteParams = {
        Bucket: LIARA_BUCKET_NAME,
        Delete: {
          Objects: imageUrls.map((url) => ({
            Key: url.replace(`${LIARA_ENDPOINT}/${LIARA_BUCKET_NAME}/`, ""),
          })),
        },
      };
      // Compute Content-MD5 for rollback delete
      const deleteBodyJson = JSON.stringify(deleteParams.Delete);
      const md5Hash = crypto.createHash("md5").update(deleteBodyJson).digest();
      deleteParams.ContentMD5 = md5Hash.toString("base64");

      await s3Client
        .send(new DeleteObjectsCommand(deleteParams))
        .catch((err) => {
          console.error(
            `Failed to rollback uploads for house ${req.params.houseId}:`,
            err
          );
        });

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "جایگزینی مدارک ملک انجام نشد",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "مدارک قدیمی حذف و با مدارک جدید جایگزین شدند",
      house: updatedHouse,
    });
  } catch (error) {
    console.error(
      `Error replacing documents for house ${req.params.houseId}:`,
      error.stack
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// # description -> HTTP VERB -> Access -> Access Type
// # get all owner reservations -> GET -> Owner -> PRIVATE
// @route = /api/owners/reservations
exports.allReservations = async (req, res) => {
  try {
    // 1. Validate owner authentication
    if (!req.owner?._id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "failure",
        msg: "احراز هویت ناموفق بود",
      });
    }

    // 2. Check if 'user' and 'service' fields exist in Booking schema
    const bookingSchema = Booking.schema.obj;
    const populateOptions = [];

    if (bookingSchema.user) {
      populateOptions.push({ path: "user", select: "name email phone" });
    }

    if (bookingSchema.service) {
      populateOptions.push({ path: "service", select: "title price" });
    }

    // 3. Query reservations (with safe population)
    const reservations = await Booking.find({ owner: req.owner._id })
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return consistent response structure
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: reservations.length
        ? "رزروها با موفقیت دریافت شدند"
        : "هیچ رزروی یافت نشد",
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      msg: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// # description -> HTTP VERB -> Accesss -> Access Type
// # get single owners reservations -> GET -> Owner -> PRIVATE
// @route = /api/owners/reservations/:reservationId
exports.singleReservation = async (req, res) => {
  try {
    let reservation = await Booking.findById(req.params.reservationId);
    if (reservation) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "رزرو پیدا شد",
        reservation,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "رزرو پیدا نشد",
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

// @desc    Change booking status
// @route   PATCH /api/owners/bookings/:id/status
// @access  Private (Owner)
exports.changeBookingStatus = async (req, res) => {
  try {
    const { isConfirmed } = req.body;

    // Validate input
    if (typeof isConfirmed !== "boolean") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "لطفا مقدار وضعیت را به صورت صحیح ارسال کنید",
      });
    }
    // Find and update the booking
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.reservationId,
        owner: req.owner._id,
      },
      { isConfirmed },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email phone")
      .populate("house", "title location price");

    if (!booking) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: `رزروی با شناسه ${req.params.reservationId} یافت نشد`,
      });
    }

    // Prepare response data
    const responseData = {
      message: isConfirmed ? "رزرو با موفقیت تایید شد" : "رزرو با موفقیت رد شد",
      booking: {
        _id: booking._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        price: booking.price,
        isConfirmed: booking.isConfirmed,
        user: booking.user,
        house: booking.house,
      },
    };

    res.status(StatusCodes.OK).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// finance
exports.finance = (req, res) => {
  res.send("owner finance");
};

// tickets
exports.myTickets = (req, res) => {
  res.send("owner my tickets");
};
