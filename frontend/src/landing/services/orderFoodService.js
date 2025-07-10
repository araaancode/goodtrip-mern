// services/orderFoodService.js
import axios from "axios";

const API_URL = "/api/users/foods/orders";

const OrderFoodService = {
  async createOrder(orderData) {
    const response = await axios.post(API_URL, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

export default OrderFoodService;
