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


// // Order Controllers
// const orderControllers = {
//   // Create order from cart
//   createOrder: async (req, res) => {
    // try {
    //   const { deliveryAddress, contactNumber, deliveryDate, deliveryTime, description } = req.body;

    //   // Get user's cart
    //   const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    //   if (!cart || cart.items.length === 0) {
    //     return res.status(400).json({ message: 'Cart is empty' });
    //   }

    //   // Validate all items are still available
    //   for (const item of cart.items) {
    //     const food = await Food.findById(item.food._id);
    //     if (!food || !food.isAvailable || !food.isActive) {
    //       return res.status(400).json({ 
    //         message: `Item ${item.name} is no longer available`,
    //         unavailableItem: item
    //       });
    //     }
    //   }

    //   // Prepare order items
    //   const orderItems = cart.items.map(item => ({
    //     food: item.food._id,
    //     name: item.name,
    //     quantity: item.quantity,
    //     price: item.price,
    //     cook: item.food.cook
    //   }));

    //   // Create order
    //   const order = new OrderFood({
    //     user: req.user._id,
    //     items: orderItems,
    //     totalAmount: cart.total,
    //     deliveryAddress,
    //     contactNumber,
    //     deliveryDate,
    //     deliveryTime,
    //     description
    //   });

    //   await order.save();

    //   // Clear the cart after successful order
    //   await Cart.findOneAndUpdate(
    //     { user: req.user._id },
    //     { $set: { items: [], total: 0 } }
    //   );

    //   res.status(201).json(order);
    // } catch (error) {
    //   res.status(500).json({ message: 'Server error', error: error.message });
    // }
//   },

//   // Get user's orders
//   getUserOrders: async (req, res) => {
//     try {
//       const orders = await OrderFood.find({ user: req.user._id })
//         .sort({ createdAt: -1 })
//         .populate('items.food items.cook');
//       res.status(200).json(orders);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   },

//   // Get order by ID
//   getOrderById: async (req, res) => {
//     try {
//       const order = await OrderFood.findOne({
//         _id: req.params.id,
//         user: req.user._id
//       }).populate('items.food items.cook');

//       if (!order) {
//         return res.status(404).json({ message: 'Order not found' });
//       }

//       res.status(200).json(order);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   },

//   // Cancel order
//   cancelOrder: async (req, res) => {
//     try {
//       const order = await OrderFood.findOneAndUpdate(
//         {
//           _id: req.params.id,
//           user: req.user._id,
//           orderStatus: { $in: ['Pending', 'Processing'] }
//         },
//         { $set: { orderStatus: 'Cancelled' } },
//         { new: true }
//       );

//       if (!order) {
//         return res.status(400).json({ 
//           message: 'Order cannot be cancelled or not found' 
//         });
//       }

//       res.status(200).json(order);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   },

//   // Update order status (for admin/cook)
//   updateOrderStatus: async (req, res) => {
//     try {
//       const { status } = req.body;

//       const order = await OrderFood.findOneAndUpdate(
//         {
//           _id: req.params.id,
//           'items.cook': req.user._id // Ensure the user is the cook for this order
//         },
//         { $set: { orderStatus: status } },
//         { new: true }
//       );

//       if (!order) {
//         return res.status(404).json({ message: 'Order not found or unauthorized' });
//       }

//       res.status(200).json(order);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }
// };





// router.get("/foods", userCtrls.getFoods);
// router.get("/foods/:foodId", userCtrls.getFood);
// router.put("/foods/add-favorite-food", protect, userCtrls.addFavoriteFood);
// router.delete(
//   "/foods/delete-favorite-food/:foodId",
//   protect,
//   userCtrls.deleteFavoriteFood
// );

// router.put(
//   "/foods/orders/:orderId/confirm",
//   protect,
//   userCtrls.confirmOrderFood
// );




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
