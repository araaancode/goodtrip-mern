const express = require("express");

const router = express();

const userCtrls = require("../../controllers/users/users");

const protect = require("../../middlewares/authUser");

const { userUpload } = require("../../utils/upload");

// bus tickets
router.get("/buses/tickets", protect, userCtrls.getAllBusTickets);
router.get("/buses/tickets/:ticketId", protect, userCtrls.getSingleBusTicket);
router.put(
  "/buses/tickets/:ticketId/confirm",
  protect,
  userCtrls.confirmBusTicket
);
router.put(
  "/buses/tickets/:ticketId/cancel",
  protect,
  userCtrls.cancelBusTicket
);

// profile
router.get("/me", protect, userCtrls.getMe);
router.put("/update-profile", protect, userCtrls.updateProfile);
router.put(
  "/update-avatar",
  protect,
  userUpload.single("avatar"),
  userCtrls.updateAvatar
);

// houses
router.get("/houses/favorite-houses", protect, userCtrls.getFavoriteHouses);
router.get("/houses/bookings", protect, userCtrls.houseBookings);
router.get("/houses", userCtrls.getHouses);
router.get("/houses/:houseId", userCtrls.getHouse);
router.post("/houses/search-houses", userCtrls.searchHouses);
router.get(
  "/houses/favorite-houses/:houseId",
  protect,
  userCtrls.getFavoriteHouse
);
router.put("/houses/add-favorite-house", protect, userCtrls.addFavoriteHouse);
router.delete(
  "/houses/delete-favorite-house/:houseId",
  protect,
  userCtrls.deleteFavoriteHouse
);
router.post("/houses/book-house", protect, userCtrls.bookHouse);
router.get("/houses/bookings/:bookingId", protect, userCtrls.houseBooking);

router.put(
  "/houses/bookings/:bookingId/confirm-booking",
  protect,
  userCtrls.confirmHouseBooking
);
router.put(
  "/houses/bookings/:bookingId/cancel-booking",
  protect,
  userCtrls.cancelHouseBooking
);
router.put("/houses/:houseId/add-review", protect, userCtrls.addReviewToHouse);

// foods
router.post("/foods/search-foods", userCtrls.searchFoods);
router.post("/foods/orders", protect, userCtrls.createOrderFood);
router.get("/foods/orders", protect, userCtrls.getAllOrderFoods);
router.get("/foods/orders/:orderId", protect, userCtrls.getSingleOrderFood);
router.put("/foods/orders/:orderId/cancel", protect, userCtrls.cancelOrderFood);
router.put(
  "/foods/orders/:orderId/confirm",
  protect,
  userCtrls.confirmOrderFood
);

router.put(
  "/foods/orders/:orderId/update-status",
  protect,
  userCtrls.updateOrderStatus
);

// buses
router.get("/buses", userCtrls.getBuses);
router.get("/buses/:busId", userCtrls.getBus);
router.put("/buses/add-favorite-bus", protect, userCtrls.addFavoriteBus);
// router.put('/buses/delete-favorite-bus', protect, userCtrls.deleteFavoriteBus)
router.delete(
  "/buses/delete-favorite-bus/:busId",
  protect,
  userCtrls.deleteFavoriteBus
);
router.post("/buses/search-buses", userCtrls.searchBuses);
router.post("/buses/book-bus", protect, userCtrls.bookBus);
router.post(
  "/buses/search-one-side-bus-tickets",
  userCtrls.searchOneSideBusTickes
);
router.post(
  "/buses/search-two-side-bus-tickets",
  userCtrls.searchTwoSideBusTickes
);

// notifications
router.get("/notifications", protect, userCtrls.notifications);
router.get("/notifications/:ntfId", protect, userCtrls.notification);
router.post("/notifications", userCtrls.createNotification);
router.put(
  "/notifications/:ntfId/mark-notification",
  protect,
  userCtrls.markNotification
);

// support tickets
router.get("/support-tickets", protect, userCtrls.supportTickets);
router.get("/support-tickets/:stId", protect, userCtrls.supportTicket);
router.post("/support-tickets", protect, userCtrls.createSupportTicket);
router.put("/support-tickets/:stId/read", protect, userCtrls.readSupportTicket);
router.put(
  "/support-tickets/:stId/add-comment",
  protect,
  userCtrls.addCommentsToSupportTicket
);

router.get("/owners", userCtrls.getOwners);
router.get("/owners/:ownerId", userCtrls.getOwner);

// carts
router.get("/carts/", protect, userCtrls.getCart);
router.post("/carts/", protect, userCtrls.addToCart);
router.put("/carts/:itemId", protect, userCtrls.updateCartItem);
router.delete("/carts/:itemId", protect, userCtrls.removeFromCart);
router.delete("/carts/", protect, userCtrls.clearCart);
router.post("/carts/checkout", protect, userCtrls.createOrderFromCart);

module.exports = router;
