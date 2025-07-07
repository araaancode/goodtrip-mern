const express = require("express")
const multer = require('multer');
const router = express()

const cookCtrls = require("../../controllers/cooks/cooks")

const authCook = require("../../middlewares/authCook")

const upload = require("../../utils/upload")

// liaraUpload
const liaraUpload = multer({ storage: multer.memoryStorage() });

// cook profile
router.get('/me', authCook, cookCtrls.getMe)

router.put('/update-profile', authCook, cookCtrls.updateProfile)
router.put('/update-avatar', authCook, upload.cookAvatarUpload.single("avatar"), cookCtrls.updateAvatar)


// notifications
router.get('/notifications', authCook, cookCtrls.notifications)
router.get('/notifications/:ntfId', authCook, cookCtrls.notification)
router.post('/notifications', cookCtrls.createNotification)
router.put('/notifications/:ntfId/mark-notification', cookCtrls.markNotification)

// advertisments
router.get('/ads', authCook, cookCtrls.allAds)
router.get('/ads/:adsId', authCook, cookCtrls.singleAds)
router.post('/ads', authCook, liaraUpload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 6,
    },
]), cookCtrls.createAds)

router.put('/ads/:adsId/update-ads', authCook, cookCtrls.updateAds)
router.put('/ads/:adsId/update-photo', authCook, liaraUpload.single("photo"), cookCtrls.updateAdsPhoto)
router.put('/ads/:adsId/update-photos', authCook, liaraUpload.array("photos", 6), cookCtrls.updateAdsPhotos)
router.delete('/ads/:adsId', authCook, cookCtrls.deleteAds)


// support tickets
router.get('/support-tickets', authCook, cookCtrls.supportTickets)
router.get('/support-tickets/:stId', authCook, cookCtrls.supportTicket)

router.post('/support-tickets', authCook, liaraUpload.fields([
    { name: 'images', maxCount: 6 }
]), cookCtrls.createSupportTicket)

router.put('/support-tickets/:stId/read', authCook, cookCtrls.readSupportTicket)
router.put('/support-tickets/:stId/add-comment', authCook, cookCtrls.addCommentsToSupportTicket)

// foods
router.get('/foods/order-foods', authCook, cookCtrls.orderFoods)
router.get('/foods/order-foods/:orderId', authCook, cookCtrls.orderFood)
router.put('/foods/order-foods/:orderId/change-status', authCook, cookCtrls.changeOrderStatus)

router.get('/foods', authCook, cookCtrls.getFoods)
router.get('/foods/:foodId', authCook, cookCtrls.getFood)
router.post('/foods', authCook, liaraUpload.fields([
    {
        name: "photo",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 6,
    },
]), cookCtrls.createFood)

router.put('/foods/:foodId/update-food', authCook, cookCtrls.updateFood)
router.put('/foods/:foodId/update-food-photo', authCook, liaraUpload.single("photo"), cookCtrls.updateFoodPhoto)
router.put('/foods/:foodId/update-food-photos', authCook, liaraUpload.array("photos", 6), cookCtrls.updateFoodPhotos)
router.delete('/foods/:foodId', authCook, cookCtrls.deleteFood)


// // router.get('/finance', cookCtrls.finance)
// // router.get('/my-tickets', cookCtrls.myTickets)

module.exports = router