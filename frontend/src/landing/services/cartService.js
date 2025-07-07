// services/cartService.js
import axios from 'axios';

const API_URL = '/api/users/carts';

const CartService = {
  async getCart() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async addItem(foodId, quantity = 1) {
    const response = await axios.post(API_URL, { foodId, quantity });
    return response.data;
  },

  async updateItem(itemId, quantity) {
   
    const response = await axios.put(`${API_URL}/${itemId}`, { quantity });
    return response.data;
  },

  async removeItem(itemId) {
    const response = await axios.delete(`${API_URL}/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await axios.delete(API_URL);
    return response.data;
  }
};

export default CartService;