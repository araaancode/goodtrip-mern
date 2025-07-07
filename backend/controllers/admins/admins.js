const { StatusCodes } = require('http-status-codes');
const Admin = require("../../models/Admin")
const AdminNotification = require("../../models/AdminNotification")
const User = require("../../models/User")
const UserSupportTicket = require("../../models/UserSupportTicket")
const Cook = require("../../models/Cook")
const CookSupportTicket = require("../../models/CookSupportTicket");
const Owner = require("../../models/Owner");
const OwnerSupportTicket = require('../../models/OwnerSupportTicket');
const Driver = require("../../models/Driver");
const DriverSupportTicket = require("../../models/DriverSupportTicket");
const Food = require('../../models/Food');
const Bus = require('../../models/Bus');
const House = require('../../models/House')
// *********************** profile ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get admin profile -> GET -> Admin -> PRIVATE
// @route = /api/admins/me
exports.getMe = async (req, res) => {
    try {
        let admin = await Admin.findById(req.admin._id).select('-password')
        if (admin) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "ادمین پیدا شد",
                admin: admin
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "ادمین پیدا نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # update admin profile -> PUT -> Admin -> PRIVATE
// @route = /api/admins/update-profile
exports.updateProfile = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(
            req.admin._id,
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
        ).then((user) => {
            if (user) {
                res.status(StatusCodes.OK).json({
                    msg: ' پروفایل ادمین ویرایش شد ',
                    user,
                })
            }
        }).catch((error) => {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "پروفایل ویرایش نشد",
                error: error
            })
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "خطای داخلی سرور",
            error: error
        })
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # update admin avatar -> PUT -> Admin -> PRIVATE
// @route = /api/admins/update-avatar
exports.updateAvatar = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                avatar: req.file.filename,
            },
            { new: true }
        ).then((admin) => {
            if (admin) {
                res.status(StatusCodes.OK).json({
                    msg: 'آواتار ادمین ویرایش شد',
                    admin,
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: 'آواتار ادمین ویرایش نشد',
                err,
            })
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "خطای داخلی سرور",
            error: error
        })
    }
}


// *********************** notifications ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get admin notifications -> GET -> Admin -> PRIVATE
// @route = /api/admins/notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await AdminNotification.find({ reciever: req.admin.id }).sort({ createdAt: -1 });
        if (notifications && notifications.length > 0) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: 'اعلان ها دریافت شدند ',
                success: true,
                count: notifications.length,
                data: notifications,
            });
        } else {

            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: 'اعلان ها دریافت نشدند ',
                success: false,
            });
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'failure', success: false, error: err.message });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get admin single notification -> GET -> Admin -> PRIVATE
// @route = /api/admins/notifications/:notificationId
exports.getNotification = async (req, res) => {
    try {
        const notification = await AdminNotification.findById({ _id: req.params.notificationId })
        res.status(StatusCodes.OK).json({
            status: 'success',
            msg: 'اعلان دریافت شد ',
            success: true,
            data: notification,
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'failure', success: false, error: err.message });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # create admin notification -> PUT -> Admin -> PRIVATE
// @route = /api/admins/notifications
exports.createNotification = async (req, res) => {
    try {
        const { title, message, reciever } = req.body;
        const notification = new AdminNotification({ title, message, reciever });
        await notification.save();
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            success: true,
            data: notification,
            msg: 'اعلان ایجاد شد',
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: 'اعلان ایجاد نشد',
        });
    }
};

// # description -> HTTP VERB -> Accesss -> Access Type
// # mark notification as read -> PUT -> Admin -> PRIVATE
// @route = /api/admins/notifications/:notification/mark
exports.markNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await AdminNotification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: 'اعلان خوانده نشد ',
                success: false,
            });
        }
        res.status(StatusCodes.OK).json({
            status: 'success',
            msg: 'اعلان خوانده شد ',
            success: true,
            data: notification
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'failure', success: false, error: err.message });
    }
}

// *********************** users ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all users -> GET -> Admin -> PRIVATE
// @route = /api/admins/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password')
        if (users) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' کاربران پیدا شدند ',
                success: true,
                count: users.length,
                data: users,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' کاربری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single user -> GET -> Admin -> PRIVATE
// @route = /api/admins/users/:userId
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId }).select('-password')
        if (user) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' کاربر پیدا شد ',
                success: true,
                user,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' کاربری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # active user -> PUT -> Admin -> PRIVATE
// @route = /api/admins/users/:userId/active
exports.activeUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { isActive: true }, { new: true }).then((user) => {
            if (user) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' کاربر فعال شد ',
                    success: true,
                    user,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'کاربر هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # deActive user -> PUT -> Admin -> PRIVATE
// @route = /api/admins/users/:userId/deactive
exports.deActiveUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { isActive: false }, { new: true }).then((user) => {
            if (user) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' کاربر غیر شد ',
                    success: true,
                    user,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'کاربر هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all user support tickets that user send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/users/support-tickets
exports.getAllUsersSupportTickets = async (req, res) => {
    try {
        const supportTickets = await UserSupportTicket.find({}).populate('user')
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی کاربران پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' کاربری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        console.log(err);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all user support tickets that user send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/users/support-tickets/:userId
exports.getAllUserSupportTickets = async (req, res) => {
    try {
        const supportTickets = await UserSupportTicket.find({ user: req.params.userId })
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی کاربر پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' کاربری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get single support ticket -> GET -> Admin -> PRIVATE
// @route = /api/admins/users/support-tickets/:userId/:stId
exports.getSingleUserSupportTicket = async (req, res) => {
    try {
        const supportTicket = await UserSupportTicket.findOne({ user: req.params.userId, _id: req.params.stId }).populate("assignedTo admin")
        if (supportTicket) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت پشتیبانی کاربر پیدا شد ',
                success: true,
                data: supportTicket,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' کاربری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to user support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/users/support-tickets/:userId/:stId/add-comment
exports.addCommentToUserSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await UserSupportTicket.findOne({ user: req.params.userId, _id: req.params.stId })
        if (supportTicketFound) {

            let comments = {
                admin: req.admin._id,
                comment: req.body.comment
            }

            supportTicketFound.comments.push(comments)

            supportTicketFound.isRead = true
            supportTicketFound.status = "In Progress"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت شما پاسخ داده شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "عدم پاسخ گویی به تیکت",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to user support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/users/:userId/support-tickets/:stId/close-ticket
exports.closeUserSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await UserSupportTicket.findOne({ user: req.params.userId, _id: req.params.stId })
        if (supportTicketFound) {


            supportTicketFound.status = "Closed"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت بسته شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "تیکت پاسخ داده نشد",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}


// *********************** cooks ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all cooks -> GET -> Admin -> PRIVATE
// @route = /api/admins/cooks
exports.getCooks = async (req, res) => {
    try {
        const cooks = await Cook.find({}).select('-password')
        if (cooks) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' آشپزها پیدا شدند ',
                success: true,
                count: cooks.length,
                cooks,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' آشپزی وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all cooks -> GET -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId
exports.getCook = async (req, res) => {
    try {
        const cook = await Cook.findById({ _id: req.params.cookId }).select('-password')
        if (cook) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' آشپز پیدا شدند ',
                success: true,
                cook,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' آشپزی وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active cook -> PUT -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId/active
exports.activeCook = async (req, res) => {
    try {
        await Cook.findByIdAndUpdate(req.params.cookId, { isActive: true }, { new: true }).then((cook) => {
            if (cook) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' آشپز فعال شد ',
                    success: true,
                    cook,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'آشپز هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # active cook -> PUT -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId/deactive
exports.deActiveCook = async (req, res) => {
    try {
        await Cook.findByIdAndUpdate(req.params.cookId, { isActive: false }, { new: true }).then((cook) => {
            if (cook) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' آشپز غیر فعال شد ',
                    success: true,
                    cook,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'آشپز هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all cook support tickets that cook send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/cooks/support-tickets
exports.getAllCooksSupportTickets = async (req, res) => {
    try {
        const supportTickets = await CookSupportTicket.find({})
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی آشپز پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' آشپزی وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all cook support tickets that cook send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId/support-tickets
exports.getAllCookSupportTickets = async (req, res) => {
    try {
        const supportTickets = await CookSupportTicket.find({ cook: req.params.cookId })
        if (supportTickets && supportTickets.length > 0) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی آشپز پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' تیکت پشتیبانی برای آشپز وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get single support ticket -> GET -> Admin -> PRIVATE
// @route = /api/admins/cooks/support-tickets/:cookId/:stId
exports.getSingleCookSupportTicket = async (req, res) => {
    try {
        const supportTicket = await CookSupportTicket.find({ cook: req.params.cookId, _id: req.params.stId }).populate('assignedTo')
        if (supportTicket) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت پشتیبانی آشپز پیدا شد ',
                success: true,
                data: supportTicket[0],
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' آشپزی وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to cook support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId/support-tickets/:stId/add-comment
exports.addCommentToCookSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await CookSupportTicket.findOne({ cook: req.params.cookId, _id: req.params.stId })
        if (supportTicketFound) {

            let comments = {
                admin: req.admin._id,
                comment: req.body.comment
            }

            supportTicketFound.comments.push(comments)


            supportTicketFound.isRead = true
            supportTicketFound.status = "In Progress"

            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت شما پاسخ داده شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "عدم پاسخ گویی به تیکت",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to cook support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/cooks/:cookId/support-tickets/:stId/close-ticket
exports.closeCookSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await CookSupportTicket.findOne({ cook: req.params.cookId, _id: req.params.stId })
        if (supportTicketFound) {


            supportTicketFound.status = "Closed"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت بسته شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "تیکت پاسخ داده نشد",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}



// *********************** owners ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all owners -> GET -> Admin -> PRIVATE
// @route = /api/admins/owners
exports.getOwners = async (req, res) => {
    try {
        const owners = await Owner.find({}).select('-password')
        if (owners) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' مالک ها پیدا شدند ',
                success: true,
                count: owners.length,
                owners,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' ملک داری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all owners -> GET -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId
exports.getOwner = async (req, res) => {
    try {
        const owner = await Owner.findById({ _id: req.params.ownerId }).select('-password')
        if (owner) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' ملک دار پیدا شد ',
                success: true,
                owner,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' ملک داری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active owner -> PUT -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId/active
exports.activeOwner = async (req, res) => {
    try {
        await Owner.findByIdAndUpdate(req.params.ownerId, { isActive: true }, { new: true }).then((owner) => {
            if (owner) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ملک دار فعال شد ',
                    success: true,
                    owner,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ملک دار هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # active owner -> PUT -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId/deactive
exports.deActiveOwner = async (req, res) => {
    try {
        await Owner.findByIdAndUpdate(req.params.ownerId, { isActive: false }, { new: true }).then((owner) => {
            if (owner) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ملک دار غیر فعال شد ',
                    success: true,
                    owner,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ملک دار هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all owners support tickets that owner send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/owners/support-tickets
exports.getAllOwnersSupportTickets = async (req, res) => {
    try {
        const supportTickets = await OwnerSupportTicket.find()
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی ملک دارها پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' ملک داری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all owner support tickets that owner send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId/support-tickets
exports.getAllOwnerSupportTickets = async (req, res) => {
    try {
        const supportTickets = await OwnerSupportTicket.find({ owner: req.params.ownerId })
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی ملک دار پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' ملک داری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get single support ticket -> GET -> Admin -> PRIVATE
// @route = /api/admins/owners/support-tickets/:ownerId/:stId
exports.getSingleOwnerSupportTicket = async (req, res) => {
    try {
        const supportTicket = await OwnerSupportTicket.find({ owner: req.params.ownerId, _id: req.params.stId }).populate('assignedTo owner')
        if (supportTicket) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت پشتیبانی ملک دار پیدا شد ',
                success: true,
                data: supportTicket[0],
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: 'تیکت پشتیبانی برای ملک دار وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to owner support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId/support-tickets/:stId/add-comment
exports.addCommentToOwnerSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await OwnerSupportTicket.findOne({ owner: req.params.ownerId, _id: req.params.stId })
        if (supportTicketFound) {

            let comments = {
                admin: req.admin._id,
                comment: req.body.comment
            }

            supportTicketFound.comments.push(comments)


            supportTicketFound.isRead = true
            supportTicketFound.status = "In Progress"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت شما پاسخ داده شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "عدم پاسخ گویی به تیکت",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to owner support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/owners/:ownerId/support-tickets/:stId/close-ticket
exports.closeOwnerSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await OwnerSupportTicket.findOne({ owner: req.params.ownerId, _id: req.params.stId })
        if (supportTicketFound) {


            supportTicketFound.status = "Closed"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت بسته شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "تیکت پاسخ داده نشد",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}


// *********************** drivers ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all drivers -> GET -> Admin -> PRIVATE
// @route = /api/admins/drivers
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({}).select('-password')
        if (drivers) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' راننده ها پیدا شدند ',
                success: true,
                count: drivers.length,
                drivers,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' راننده داری وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all drivers -> GET -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId
exports.getDriver = async (req, res) => {
    try {
        const driver = await Driver.findById({ _id: req.params.driverId }).select('-password')
        if (driver) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' راننده پیدا شد ',
                success: true,
                driver,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' راننده وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active driver -> PUT -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId/active
exports.activeDriver = async (req, res) => {
    try {
        await Driver.findByIdAndUpdate(req.params.driverId, { isActive: true }, { new: true }).then((driver) => {
            if (driver) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' راننده فعال شد ',
                    success: true,
                    driver,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'راننده هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # active driver -> PUT -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId/deactive
exports.deActiveDriver = async (req, res) => {
    try {
        await Driver.findByIdAndUpdate(req.params.driverId, { isActive: false }, { new: true }).then((driver) => {
            if (driver) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' راننده غیر فعال شد ',
                    success: true,
                    driver,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'راننده هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all driver support tickets that driver send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/drivers/support-tickets
exports.getAllDriversSupportTickets = async (req, res) => {
    try {
        const supportTickets = await DriverSupportTicket.find({})
        if (supportTickets) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی رانندگان پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' راننده ای وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        console.log(err);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all driver support tickets that driver send to admin -> GET -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId/support-tickets
exports.getAllDriverSupportTickets = async (req, res) => {
    try {
        const supportTickets = await DriverSupportTicket.find({ driver: req.params.driverId })
        if (supportTickets && supportTickets.length > 0) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت های پشتیبانی راننده پیدا شدند ',
                success: true,
                count: supportTickets.length,
                data: supportTickets,
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: ' تیکت پشتیبانی برای راننده وجود ندارد',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get single support ticket -> GET -> Admin -> PRIVATE
// @route = /api/admins/drivers/support-tickets/:driverId/:stId
exports.getSingleDriverSupportTicket = async (req, res) => {
    try {
        const supportTicket = await DriverSupportTicket.find({ driver: req.params.driverId, _id: req.params.stId })
        if (supportTicket) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: ' تیکت پشتیبانی پیدا شد ',
                success: true,
                data: supportTicket[0],
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: 'تیکت پشتیبانی برای وجود ندارد ',
                success: false,
            });
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to driver support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId/support-tickets/:stId/add-comment
exports.addCommentToDriverSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await DriverSupportTicket.findOne({ driver: req.params.driverId, _id: req.params.stId })
        if (supportTicketFound) {

            let comments = {
                admin: req.admin._id,
                comment: req.body.comment
            }

            supportTicketFound.comments.push(comments)


            supportTicketFound.isRead = true
            supportTicketFound.status = "In Progress"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت شما پاسخ داده شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "عدم پاسخ گویی به تیکت",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # add comment to driver support ticket -> PUT -> Admin -> PRIVATE
// @route = /api/admins/drivers/:driverId/support-tickets/:stId/close-ticket
exports.closeDriverSupportTicket = async (req, res) => {
    try {
        let supportTicketFound = await DriverSupportTicket.findOne({ driver: req.params.driverId, _id: req.params.stId })
        if (supportTicketFound) {


            supportTicketFound.status = "Closed"
            await supportTicketFound.save().then((ticket) => {
                return res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: " تیکت بسته شد",
                    ticket
                })
            }).catch((error) => {
                console.log(error);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "تیکت پاسخ داده نشد",
                    error
                })
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "تیکت پیدا نشد"
            })
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// *********************** foods ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all foods -> GET -> Admin -> PRIVATE
// @route = /api/admins/foods
exports.getFoods = async (req, res) => {
    try {
        let foods = await Food.find({})
        if (foods) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "غذاها پیدا شدند",
                count: foods.length,
                foods: foods
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "غذاها پیدا نشدند"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all foods -> GET -> Admin -> PRIVATE
// @route = /api/admins/foods/:foodId
exports.getFood = async (req, res) => {
    try {
        let food = await Food.findById(req.params.foodId)
        if (food) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "غذا پیدا شد",
                food
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "غذا پیدا نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active food -> PUT -> Admin -> PRIVATE
// @route = /api/admins/foods/:foodId/active
exports.activeFood = async (req, res) => {
    try {
        await Food.findByIdAndUpdate(req.params.foodId, { isActive: true }, { new: true }).then((food) => {
            if (food) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' غذا فعال شد ',
                    success: true,
                    food,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'غذا هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # deactive food -> PUT -> Admin -> PRIVATE
// @route = /api/admins/foods/:foodId/deactive
exports.deActiveFood = async (req, res) => {
    try {
        await Food.findByIdAndUpdate(req.params.foodId, { isActive: false }, { new: true }).then((food) => {
            if (food) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' غذا غیر فعال شد ',
                    success: true,
                    food,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'غذا هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// *********************** buses ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all buses -> GET -> Admin -> PRIVATE
// @route = /api/admins/buses
exports.getBuses = async (req, res) => {
    try {
        let buses = await Bus.find({})
        if (buses) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "اتوبوس ها پیدا شدند",
                count: buses.length,
                buses: buses
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "اتوبوس ها پیدا نشدند"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all buses -> GET -> Admin -> PRIVATE
// @route = /api/admins/buses/:busId
exports.getBus = async (req, res) => {
    try {
        let bus = await Bus.findById(req.params.busId)
        if (bus) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "اتوبوس پیدا شد",
                bus
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "اتوبوس پیدا نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active bus -> PUT -> Admin -> PRIVATE
// @route = /api/admins/buses/:busId/active
exports.activeBus = async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.params.busId, { isActive: true }, { new: true }).then((bus) => {
            if (bus) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' اتوبوس فعال شد ',
                    success: true,
                    bus,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'اتوبوس هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # deactive bus -> PUT -> Admin -> PRIVATE
// @route = /api/admins/buses/:busId/deactive
exports.deActiveBus = async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.params.busId, { isActive: false }, { new: true }).then((bus) => {
            if (bus) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' اتوبوس غیر فعال شد ',
                    success: true,
                    bus,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'اتوبوس هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// *********************** houses ***********************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get all houses -> GET -> Admin -> PRIVATE
// @route = /api/admins/houses
exports.getHouses = async (req, res) => {
    try {
        let houses = await House.find({}).populate('owner')
        if (houses) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "خانه ها پیدا شدند",
                count: houses.length,
                houses: houses
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "خانه ها پیدا نشدند"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # get all houses -> GET -> Admin -> PRIVATE
// @route = /api/admins/houses/:houseId
exports.getHouse = async (req, res) => {
    try {
        let house = await House.findById(req.params.houseId)
        if (house) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "ملک پیدا شد",
                house
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "ملک پیدا نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active house -> PUT -> Admin -> PRIVATE
// @route = /api/admins/houses/:houseId/active
exports.activeHouse = async (req, res) => {
    try {
        await House.findByIdAndUpdate(req.params.houseId, { isActive: true }, { new: true }).then((house) => {
            if (house) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ملک فعال شد ',
                    success: true,
                    house,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ملک هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # deactive house -> PUT -> Admin -> PRIVATE
// @route = /api/admins/houses/:houseId/deactive
exports.deActiveHouse = async (req, res) => {
    try {
        await House.findByIdAndUpdate(req.params.houseId, { isActive: false }, { new: true }).then((house) => {
            if (house) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ملک غیر فعال شد ',
                    success: true,
                    house,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ملک هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// *******************************************************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get admin finance -> GET -> Admin -> PRIVATE
// @route = /api/admins/finance
exports.finance = (req, res) => {
    res.send("admin finance")
}

// ********************** admins **************************
// # description -> HTTP VERB -> Accesss -> Access Type
// # get admin finance -> GET -> SUPER Admin -> PRIVATE
// @route = /api/admins/:adminId/change-role
exports.changeAdminRole = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(
            req.params.adminId,
            {
                role: req.body.role,
            },
            { new: true }
        ).then((user) => {
            if (user) {
                res.status(StatusCodes.OK).json({
                    msg: ' نقش ادمین تغییر کرد ',
                    user,
                })
            }
        }).catch((error) => {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: "نقش تغییر نکرد",
                error: error
            })
        })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "خطای داخلی سرور",
            error: error
        })
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get all admins -> GET -> SUPER Admin -> PRIVATE
// @route = /api/admins
exports.getAdmins = async (req, res) => {
    try {
        let admins = await Admin.find({}).select('-password')
        if (admins) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "ادمین ها پیدا شدند",
                count: admins.length,
                admins: admins
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "ادمین ها پیدا نشدند"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # get single admins -> GET -> SUPER Admin -> PRIVATE
// @route = /api/admins/:adminId
exports.getAdmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.adminId)
        if (admin) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "ادمین پیدا شد",
                admin: admin
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "ادمین پیدا نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}



// # description -> HTTP VERB -> Accesss -> Access Type
// # create admin -> POST -> SUPER Admin -> PRIVATE
// @route = /api/admins
exports.createAdmin = async (req, res) => {
    try {
        let { name, username, phone, email, password } = req.body

        if (!name || !username || !phone || !email || !password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "همه فیلدها باید وارد شوند!",
            })
        } else {
            let findAdmin = await Admin.findOne({ phone: req.body.phone })

            if (findAdmin) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "ادمین وجود دارد. وارد سایت شوید!",
                })
            } else {
                let newAdmin = await Admin.create({
                    name: req.body.name,
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role
                })

                if (newAdmin) {
                    res.status(StatusCodes.CREATED).json({
                        status: 'success',
                        msg: "ادمین با موفقیت ثبت نام شد",
                        _id: newAdmin._id,
                        name: newAdmin.name,
                        phone: newAdmin.phone,
                        email: newAdmin.email,
                        username: newAdmin.username,
                        avatar: newAdmin.avatar,
                        role: newAdmin.role,
                    })
                }
            }
        }

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}



// # description -> HTTP VERB -> Accesss -> Access Type
// # active admin -> PUT -> Admin -> PRIVATE
// @route = /api/admins/:adminId/active
exports.activeAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(req.params.adminId, { isActive: true }, { new: true }).then((admin) => {
            if (admin) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ادمین فعال شد ',
                    success: true,
                    admin,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ادمین هنوز غیر فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}

// # description -> HTTP VERB -> Accesss -> Access Type
// # active admin -> PUT -> Admin -> PRIVATE
// @route = /api/admins/:adminId/deactive
exports.deActiveAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndUpdate(req.params.adminId, { isActive: false }, { new: true }).then((admin) => {
            if (admin) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: ' ادمین غیر فعال شد ',
                    success: true,
                    admin,
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    status: 'failure',
                    msg: 'ادمین هنوز فعال است',
                    success: false,
                });
            }
        })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            success: false,
            msg: "خطای داخلی سرور",
            error: err.message
        });
    }
}


// # description -> HTTP VERB -> Accesss -> Access Type
// # delete admin -> DELETE -> SUPER Admin -> PRIVATE
// @route = /api/admins/:adminId
exports.deleteAdmin = async (req, res) => {
    try {
        let admin = await Admin.findByIdAndDelete(req.params.adminId)
        if (admin) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "ادمین حذف شد",
                admin: admin
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "ادمین حذف نشد"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}


exports.updateBusAfterArrived = async (req, res) => {
  res.send("updateBusAfterArrived");
};

exports.updateDriverAfterArrived = async (req, res) => {
  res.send("updateBusAfterArrived");
};

exports.updateUserAfterArrived = async (req, res) => {
  res.send("updateBusAfterArrived");
};

exports.updateTicketAfterArrived = async (req, res) => {
  res.send("updateBusAfterArrived");
};