// stores/houseStore.js
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

const houseStore = create((set, get) => ({
  // State
  houses: [],
  favoriteHouses: [],
  bookings: [],
  currentHouse: null,
  currentBooking: null,
  loading: false,
  error: null,
  searchResults: [],

  // Actions

  // Fetch all active and available houses
  fetchHouses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/users/houses');
      set({ houses: response.data.houses, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to fetch houses', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to fetch houses');
    }
  },

  // Fetch single house
  fetchHouse: async (houseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/houses/${houseId}`);
      set({ currentHouse: response.data.house, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to fetch house', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to fetch house');
    }
  },

  // Search houses
  searchHouses: async (searchCriteria) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/users/houses/search-houses', searchCriteria);
      set({ searchResults: response.data.houses, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Search failed', loading: false });
      toast.error(error.response?.data?.msg || 'Search failed');
    }
  },

  // Fetch favorite houses
  fetchFavoriteHouses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/users/houses/favorite-houses');
      set({ favoriteHouses: response.data.houses, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to fetch favorites', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to fetch favorites');
    }
  },

  // Add/remove house from favorites
  toggleFavoriteHouse: async (houseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put('/api/users/houses/add-favorite-house', { house: houseId });
      set(state => ({
        favoriteHouses: response.data.newUser.favoriteHouses,
        houses: state.houses.map(house => 
          house._id === houseId ? { ...house, isFavorite: !house.isFavorite } : house
        ),
        loading: false
      }));
      toast.success(response.data.msg);
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to update favorites', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to update favorites');
    }
  },

  // Book a house
  bookHouse: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/users/houses/book-house', bookingData);
      set(state => ({
        bookings: [...state.bookings, response.data.booking],
        houses: state.houses.map(house => 
          house._id === response.data.house._id ? response.data.house : house
        ),
        loading: false
      }));
      toast.success(response.data.msg);
      return response.data.booking;
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Booking failed', loading: false });
      toast.error(error.response?.data?.msg || 'Booking failed');
      throw error;
    }
  },

  // Fetch user bookings
  fetchUserBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/users/houses/bookings');
      set({ bookings: response.data.bookings, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to fetch bookings', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to fetch bookings');
    }
  },

  // Fetch single booking
  fetchBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/houses/bookings/${bookingId}`);
      set({ currentBooking: response.data.booking, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to fetch booking', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to fetch booking');
    }
  },

  // Confirm booking
  confirmBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/users/houses/bookings/${bookingId}/confirm-booking`);
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking._id === bookingId ? { ...booking, isConfirmed: true } : booking
        ),
        loading: false
      }));
      toast.success(response.data.msg);
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to confirm booking', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to confirm booking');
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/users/houses/bookings/${bookingId}/cancel-booking`);
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking._id === bookingId ? { ...booking, isConfirmed: false } : booking
        ),
        loading: false
      }));
      toast.success(response.data.msg);
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to cancel booking', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to cancel booking');
    }
  },

  // Add review to house
  addReview: async (houseId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/users/houses/${houseId}/add-review`, reviewData);
      set(state => ({
        currentHouse: response.data.house,
        houses: state.houses.map(house => 
          house._id === houseId ? response.data.house : house
        ),
        loading: false
      }));
      toast.success(response.data.msg);
    } catch (error) {
      set({ error: error.response?.data?.msg || 'Failed to add review', loading: false });
      toast.error(error.response?.data?.msg || 'Failed to add review');
    }
  },

  // Clear current house and booking
  clearCurrent: () => {
    set({ currentHouse: null, currentBooking: null });
  },

  // Clear search results
  clearSearchResults: () => {
    set({ searchResults: [] });
  }
}));

export default houseStore;