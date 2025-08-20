const express = require("express")

const router = express()

const driverCtrls = require("../../controllers/drivers/drivers")

const authDriver = require("../../middlewares/authDriver")

const { driverUpload, driverAdsPhotosUpload, driverBusPhotosUpload, driverSupportTicketUpload } = require("../../utils/upload")


const multer = require("multer");
const upload = require("../../utils/upload");
const storage = multer.memoryStorage();
const liaraUpload = multer({ storage });

router.post('/ads', authDriver, liaraUpload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 6,
    },
]), driverCtrls.createAds)



// basic profile api
router.get('/me', authDriver, driverCtrls.getMe)
router.put('/update-profile', authDriver, driverCtrls.updateProfile)
router.put('/update-avatar', authDriver, driverUpload.single('avatar'), driverCtrls.updateAvatar)

// notifications
router.get('/notifications', authDriver, driverCtrls.notifications)
router.get('/notifications/:ntfId', authDriver, driverCtrls.notification)
router.post('/notifications', driverCtrls.createNotification)
router.put('/notifications/:ntfId/mark-notification', authDriver, driverCtrls.markNotification)

// advertisments
router.get('/ads', authDriver, driverCtrls.allAds)
router.get('/ads/:adsId', authDriver, driverCtrls.singleAds)
router.post('/ads', authDriver, liaraUpload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 6,
    },
]), driverCtrls.createAds)

router.put('/ads/:adsId/update-ads', authDriver, driverCtrls.updateAds)
router.put('/ads/:adsId/update-photo', authDriver, liaraUpload.single("photo"), driverCtrls.updateAdsPhoto)
router.put('/ads/:adsId/update-photos', authDriver, liaraUpload.array("photos", 4), driverCtrls.updateAdsPhotos)
router.delete('/ads/:adsId', authDriver, driverCtrls.deleteAds)

// support tickets
router.get('/support-tickets', authDriver, driverCtrls.supportTickets)
router.get('/support-tickets/:stId', authDriver, driverCtrls.supportTicket)
// router.post('/support-tickets', authDriver, driverCtrls.createSupportTicket)
router.post('/support-tickets', authDriver, driverSupportTicketUpload.fields([
    { name: 'images', maxCount: 6 }
]), driverCtrls.createSupportTicket)

router.put('/support-tickets/:stId/read', authDriver, driverCtrls.readSupportTicket)
router.put('/support-tickets/:stId/add-comment', authDriver, driverCtrls.addCommentsToSupportTicket)

// bus
router.get('/bus', authDriver, driverCtrls.getDriverBus)
router.post('/bus', authDriver, liaraUpload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 6,
    },
]), driverCtrls.addDriverBus)
router.put('/bus/:busId/update-bus', authDriver, driverCtrls.updateDriverBus)
router.put('/bus/:busId/update-photo', authDriver, liaraUpload.single('photo'), driverCtrls.updateDriverBusPhoto)
router.put('/bus/:busId/update-photos', authDriver, liaraUpload.array('photos',6), driverCtrls.updateDriverBusPhotos)

router.get('/finance', authDriver, driverCtrls.finance)

// bus tickets
router.get('/bus-tickets', authDriver, driverCtrls.getBusTickets)


module.exports = router