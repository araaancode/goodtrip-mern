// stores/orderFoodStore.js
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useOrderFoodStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,
  searchResults: [],

  // Fetch all food orders for the current user
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/users/foods/orders", {
        withCredentials: true,
      });
      set({ orders: response.data.orders, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // Create a new food order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/users/foods/orders", orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      set(state => ({
        orders: [response.data, ...state.orders],
        loading: false
      }));
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create order',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to create order');
      throw error;
    }
  },

  // Get single order details
  getOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/foods/orders/${orderId}`, {
        withCredentials: true,
      });
      console.log(response);
      
      set({ selectedOrder: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch order details',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `/api/users/foods/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      set(state => ({
        orders: state.orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
        ),
        loading: false
      }));
      toast.success('Order cancelled successfully!');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel order',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      throw error;
    }
  },

  // Confirm an order
  confirmOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `/api/users/foods/orders/${orderId}/confirm`,
        {},
        { withCredentials: true }
      );
      set(state => ({
        orders: state.orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: 'Confirmed' } : order
        ),
        loading: false
      }));
      toast.success('Order confirmed successfully!');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to confirm order',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to confirm order');
      throw error;
    }
  },

  // Search foods
  searchFoods: async (searchTerm) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "/api/users/foods/search-foods",
        { name: searchTerm },
        { withCredentials: true }
      );
      set({ searchResults: response.data.foods, loading: false });
      return response.data.foods;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to search foods',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to search foods');
      throw error;
    }
  },

  // Update order status (for cooks)
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `/api/users/foods/orders/${orderId}/update-status`,
        { status },
        { withCredentials: true }
      );
      set(state => ({
        orders: state.orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: status } : order
        ),
        loading: false
      }));
      toast.success('Order status updated successfully!');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update order status',
        loading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to update order status');
      throw error;
    }
  },

  // Clear selected order
  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },

  // Clear search results
  clearSearchResults: () => {
    set({ searchResults: [] });
  }
}));

export default useOrderFoodStore;