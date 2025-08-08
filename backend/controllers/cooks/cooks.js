const { StatusCodes } = require("http-status-codes");
const CookNotification = require("../../models/CookNotification");
const Cook = require("../../models/Cook");
const CookAds = require("../../models/CookAds");
const CookSupportTicket = require("../../models/CookSupportTicket");
const Food = require("../../models/Food");
const OrderFood = require("../../models/OrderFood");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// S3 Client for Liara
const s3Client = new S3Client({
  region: "default", // Liara doesn't require a specific region
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  endpoint: process.env.LIARA_ENDPOINT,
});

// # description -> HTTP VERB -> Accesss -> Access Type
// # cook get profile -> GET -> Cook -> PRIVATE
// @route = /api/cooks/me
exports.getMe = async (req, res) => {
  try {
    let cook = await Cook.findById(req.cook.id).select("-password");
    if (cook) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "غذادار پیدا شد",
        cook,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "غذادار پیدا نشد",
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
// # cook update profile -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/update-profile
exports.updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    let cook = await Cook.findByIdAndUpdate(
      req.cook._id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        province: req.body.province,
        address: req.body.address,
        city: req.body.city,
        nationalCode: req.body.nationalCode,
        gender: req.body.gender.label,
        lat: req.body.lat,
        lng: req.body.lng,
      },
      { new: true }
    );

    if (cook) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "اطلاعات غذادار ویرایش شد",
        name: cook.name,
        phone: cook.phone,
        email: cook.email,
        username: cook.username,
        nationalCode: cook.nationalCode,
        province: cook.province,
        city: cook.city,
        gender: cook.gender,
        address: req.body.address,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "اطلاعات غذادار ویرایش نشد",
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

// *** cooks apis ***
// # description -> HTTP VERB -> Accesss -> Access Type
// # cook update avatar -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/update-avatar
exports.updateAvatar = async (req, res) => {
  try {
    await Cook.findByIdAndUpdate(
      req.cook._id,
      {
        avatar: req.file.filename,
      },
      { new: true }
    )
      .then((cook) => {
        if (cook) {
          res.status(StatusCodes.OK).json({
            msg: "آواتار غذادار ویرایش شد",
            name: cook.name,
            phone: cook.phone,
            email: cook.email,
            username: cook.username,
            nationalCode: cook.nationalCode,
            province: cook.province,
            city: cook.city,
            gender: cook.gender,
            avatar: cook.avatar,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "آواتار غذادار ویرایش نشد",
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
// # get  owner notifications -> GET -> Cook -> PRIVATE
// @route = /api/cooks/notifications
exports.notifications = async (req, res) => {
  try {
    let notifications = await CookNotification.find({ reciever: req.cook._id });
    // let findCookNotifications = []

    // for (let i = 0; i < notifications.length; i++) {
    //     if (JSON.stringify(notifications[i].reciever) == JSON.stringify(req.cook._id)) {
    //         findCookNotifications.push(notifications[i])
    //     }
    // }

    if (notifications && notifications.length > 0) {
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
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single cook notification -> GET -> Cook -> PRIVATE
// @route = /api/cooks/notifications/:ntfId
exports.notification = async (req, res) => {
  try {
    let notification = await CookNotification.findById(req.params.ntfId);
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
// # create notification for cook -> POST -> Cook -> PRIVATE
// @route = /api/cooks/notifications
exports.createNotification = async (req, res) => {
  try {
    await CookNotification.create({
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
// # mark cook notification -> GET -> cook -> PRIVATE
// @route = /api/cooks/notifications/:ntfId/mark-notification
exports.markNotification = async (req, res) => {
  try {
    await CookNotification.findByIdAndUpdate(
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
// # get all cooks ads -> GET -> Cook -> PRIVATE
// @route = /api/cooks/ads
exports.allAds = async (req, res) => {
  try {
    let ads = await CookAds.find({ cook: req.cook._id })
      .populate("cook")
      .select("-password");

    if (ads) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "آگهی ها پیدا شدند",
        count: ads.length,
        ads,
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
// # get single cook ads -> GET -> A -> PRIVATE
// @route = /api/cooks/notifications/:adsId
exports.singleAds = async (req, res) => {
  try {
    let ads = await CookAds.findById(req.params.adsId);
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
// # get create cook ads -> POST -> Cook -> PRIVATE
// @route = /api/cooks/ads
exports.createAds = async (req, res) => {
  let company = {};

  company.name = req.body.name;
  company.phone = req.body.phone;
  company.address = req.body.address;

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

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `cookAdsPhotos/photo-${Date.now()}-${
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

    // Upload additional images to 'ads/' folder
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageKey = `cookAdsPhotos/photos-${Date.now()}-${
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

    // Save ads to MongoDB
    const ads = new CookAds({
      title,
      description,
      price,
      cook: req.cook._id,
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
// # update cook ads -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/ads/:adsId/update-ads
exports.updateAds = async (req, res) => {
  try {
    let company = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };
    await CookAds.findByIdAndUpdate(
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
// # update cook ads photo -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/ads/:adsId/update-photo
exports.updateAdsPhoto = async (req, res) => {
  try {
    const coverImageFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `cookAdsPhotos/photo-${Date.now()}-${
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

    await CookAds.findByIdAndUpdate(req.params.adsId, {
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
// # update cook ads photos -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/ads/:adsId/update-photos
exports.updateAdsPhotos = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files : []; // Ensure req.files is an array

    // Upload images to 'cookAdsPhotos/' folder
    const imageUrls = [];
    for (const file of imagePaths) {
      const imageKey = `cookAdsPhotos/photos-${Date.now()}-${
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

    // Update the CookAds document
    const updatedAds = await CookAds.findByIdAndUpdate(
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
// # delete cook ads -> DELETE -> Cook -> PRIVATE
// @route = /api/cooks/ads/:adsId
exports.deleteAds = async (req, res) => {
  try {
    await CookAds.findByIdAndDelete(req.params.adsId).then((ads) => {
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
// # get all cooks support tickets -> GET -> Cook -> PRIVATE
// @route = /api/cooks/support-tickets
exports.supportTickets = async (req, res) => {
  try {
    let supportTickets = await CookSupportTicket.find({ cook: req.cook._id })
      .populate("cook")
      .select("-password");

    if (supportTickets) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "تیکت های پشتیبانی پیدا شدند",
        count: supportTickets.length,
        supportTickets,
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
// # get single cooks support ticket -> GET -> Cook -> PRIVATE
// @route = /api/cooks/support-tickets/:stId
exports.supportTicket = async (req, res) => {
  try {
    let ticket = await CookSupportTicket.findById(req.params.stId);
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
// # create cooks support ticket -> POST -> Cook -> PRIVATE
// @route = /api/cooks/support-tickets
exports.createSupportTicket = async (req, res) => {
  // try {
  //   let images = [];
  //   if (req.files.images) {
  //     req.files.images.forEach((e) => {
  //       images.push(e.path);
  //     });
  //   }

  //   await CookSupportTicket.create({
  //     title: req.body.title,
  //     description: req.body.description,
  //     cook: req.cook._id,
  //     assignedTo: req.cook._id,
  //     images,
  //   })
  //     .then((data) => {
  //       res.status(StatusCodes.CREATED).json({
  //         status: "success",
  //         msg: "تیکت پشتیبانی ساخته شد",
  //         data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(StatusCodes.BAD_REQUEST).json({
  //         status: "failure",
  //         error,
  //       });
  //     });
  // } catch (error) {
  //   console.error(error);
  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //     status: "failure",
  //     msg: "خطای داخلی سرور",
  //     error,
  //   });
  // }

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
      const imageKey = `cookSupportTickets/images-${Date.now()}-${
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
    const supportTicket = new CookSupportTicket({
      title: req.body.title,
      description: req.body.description,
      cook: req.cook._id,
      assignedTo: req.cook._id,
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
// # read support ticket -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/support-tickets/:stId/read
exports.readSupportTicket = async (req, res) => {
  try {
    await CookSupportTicket.findByIdAndUpdate(
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
// # add comments to support ticket -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/support-tickets/:stId/add-comment
exports.addCommentsToSupportTicket = async (req, res) => {
  try {
    let supportTicketFound = await CookSupportTicket.findById(req.params.stId);
    if (supportTicketFound) {
      let comments = {
        cook: req.cook._id,
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
// # cook get food -> GET -> Cook -> PRIVATE
// @route = /api/foods
exports.getFoods = async (req, res) => {
  try {
    let foods = await Food.find({ cook: req.cook._id })
      .populate("cook")
      .select("-password");

    if (foods) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "غذاها پیدا شدند",
        count: foods.length,
        foods,
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
// # cook get food -> GET -> Cook -> PRIVATE
// @route = /api/foods/:foodId
exports.getFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.foodId);
    if (food) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "غذا پیدا شد",
        food,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "غذا پیدا نشد",
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
// # cook create food -> POST -> Cook -> PRIVATE
// @route = /api/foods
exports.createFood = async (req, res) => {
  try {
    const {
      name,
      cookName,
      price,
      description,
      category,
      count,
      cookDate,
      cookHour,
    } = req.body;
    const coverImageFile = req.files.photo && req.files.photo[0];
    const imageFiles = req.files.photos || [];

    if (
      !coverImageFile ||
      imageFiles.length > 6 ||
      !name ||
      !cookName ||
      !price ||
      !description ||
      !category ||
      !count ||
      !cookDate ||
      !cookHour
    ) {
      return res.status(400).json({
        error: "food name, cover image, and up to 6 images are required",
      });
    }

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `cookFoodsPhotos/photo-${Date.now()}-${
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

    // Upload additional images to 'food/' folder
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageKey = `cookFoodsPhotos/photos-${Date.now()}-${
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

    // Save food to MongoDB
    const food = new Food({
      cook: req.cook._id,
      name,
      cookName,
      price,
      description,
      category,
      count,
      cookDate,
      cookHour,
      photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
      photos: imageUrls,
    });

    await food.save();
    res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "غذا اضافه شد",
      data: food,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error,
    });
  }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # cook update food -> PUT -> Cook -> PRIVATE
// @route = /api/foods/:foodId/update-food
exports.updateFood = async (req, res) => {
  try {
    let newCookDate = [];

    for (const element of req.body.cookDate) {
      newCookDate.push(element.label);
    }

    console.log("category: ", req.body.category.value);

    let food = await Food.findByIdAndUpdate(
      req.params.foodId,
      {
        name: req.body.name,
        cookName: req.body.cookName,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category.value,
        count: req.body.count,
        cookDate: newCookDate,
        cookHour: req.body.cookHour.label,
      },
      { new: true }
    );

    if (food) {
      res.status(StatusCodes.OK).json({
        status: "success",
        msg: "غذا ویرایش شد",
        food,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "failure",
        msg: "غذا ویرایش نشد",
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
// # cook update food photo -> PUT -> Cook -> PRIVATE
// @route = /api/foods/:foodId/update-food-photo
exports.updateFoodPhoto = async (req, res) => {
  try {
    const coverImageFile = req.file ? req.file : null;

    // Upload cover image to Liara in 'ads/' folder
    const coverImageKey = `cookFoodsPhotos/photo-${Date.now()}-${
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

    await Food.findByIdAndUpdate(req.params.foodId, {
      photo: `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${coverImageKey}`,
    }).then((food) => {
      if (food) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "تصویر اصلی غذا ویرایش شد",
          food,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "تصویر اصلی غذا ویرایش نشد",
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
// # cook update food photos -> PUT -> Cook -> PRIVATE
// @route = /api/foods/:foodId/update-food-photos
exports.updateFoodPhotos = async (req, res) => {
  // try {
  //   const imagePaths = req.files.map((file) => file.path);

  //   if (imagePaths.length === 0) {
  //     return res
  //       .status(400)
  //       .json({ error: "حداقل یک تصویر باید وارد کنید..!" });
  //   }

  //   await Food.findByIdAndUpdate(req.params.foodId, {
  //     photos: imagePaths,
  //   }).then((food) => {
  //     if (food) {
  //       return res.status(StatusCodes.OK).json({
  //         status: "success",
  //         msg: "تصاویر غذا ویرایش شدند",
  //         food,
  //       });
  //     } else {
  //       return res.status(StatusCodes.BAD_REQUEST).json({
  //         status: "failure",
  //         msg: "تصاویر غذا ویرایش نشدند",
  //       });
  //     }
  //   });
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //     status: "failure",
  //     msg: "خطای داخلی سرور",
  //     error,
  //   });
  // }

  try {
    const imagePaths = req.files ? req.files : []; // Ensure req.files is an array

    // Upload images to 'cookFoodPhotos/' folder
    const imageUrls = [];
    for (const file of imagePaths) {
      const imageKey = `cookFoodPhotos/photos-${Date.now()}-${
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

    // Update the Food document
    const updatedAds = await Food.findByIdAndUpdate(
      req.params.foodId,
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
// # delete cook food -> DELETE -> Cook -> PRIVATE
// @route = /api/cooks/foods/:foodId
exports.deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.foodId).then((food) => {
      if (food) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "غذا حذف شد",
          food,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "failure",
          msg: "غذا حذف نشد",
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
// # cook update house map -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/foods/:foodId/update-map
exports.updateMap = async (req, res) => {
  try {
    let house = await Food.findByIdAndUpdate(
      req.params.foodId,
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

// # description -> HTTP VERB -> Accesss -> Access Type
// # get orders -> GET -> Cook -> PRIVATE
// @route = /api/cooks/foods/order-foods
exports.orderFoods = async (req, res) => {
  try {
    // Convert cook ID to string for consistent comparison
    const cookId = req.cook._id.toString();

    let orders = await OrderFood.find({}).populate("user").select("-password");

    let findCookOrders = [];

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].items.length; j++) {
        // Convert item's cook ID to string before comparison
        if (orders[i].items[j].cook.toString() === cookId) {
          findCookOrders.push(orders[i]);
          break; // No need to check other items if we found one for this cook
        }
      }
    }

    if (findCookOrders.length > 0) {
      return res.status(StatusCodes.OK).json({
        status: "success",
        msg: "سفارش های غذا پیدا شدند",
        count: findCookOrders.length,
        orders: findCookOrders,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "success",
        msg: "سفارشی برای این آشپز یافت نشد",
        count: 0,
        orders: [],
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "failure",
      msg: "خطای داخلی سرور",
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/cooks/foods/order-foods/:orderId
// @access  Private (Cook)
exports.orderFood = async (req, res) => {
  try {
    const order = await OrderFood.findOne({
      _id: req.params.orderId,
      'items.cook': req.cook._id // Ensure the cook owns at least one item in the order
    })
    .populate('user', 'name email phone')
    .populate('items.food', 'name image');

    if (!order) {
       return res.status(StatusCodes.NOT_FOUND).json({
        status: "failure",
        msg: "سفارش غذا پیدا نشد",
      });
    }

    const transformedOrder = {
      _id: order._id,
      user: order.user,
      items: order.items.map(item => ({
        _id: item._id,
        name: item.name || item.food?.name,
        quantity: item.quantity,
        price: item.price,
        food: item.food,
        cook: item.cook
      })),
      totalAmount: order.totalAmount,
      deliveryAddress: order.deliveryAddress,
      contactNumber: order.contactNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      description: order.description,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };



    res.status(StatusCodes.OK).json({
      status: 'success',
      msg: 'سفارش با موفقیت یافت شد',
      order: transformedOrder
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failure',
      msg: error.message || 'خطای سرور در دریافت سفارش'
    });
  }
};


// # description -> HTTP VERB -> Accesss -> Access Type
// # change order status -> PUT -> Cook -> PRIVATE
// @route = /api/cooks/foods/order-foods/:orderId/change-status
exports.changeOrderStatus = async (req, res) => {
  try {
    await OrderFood.findByIdAndUpdate(
      req.params.orderId,
      {
        orderStatus: req.body.orderStatus,
      },
      { new: true }
    ).then((order) => {
      if (order) {
        return res.status(StatusCodes.OK).json({
          status: "success",
          msg: "وضعیت سفارش تغییر کرد",
          order,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "failure",
          msg: "وضعیت سفارش تغییر نکرد",
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

exports.finance = (req, res) => {
  res.send("owner finance");
};

exports.myTickets = (req, res) => {
  res.send("owner my tickets");
};
