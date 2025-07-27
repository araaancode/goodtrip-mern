// stores/busStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBusStore = create(
  persist(
    (set, get) => ({
      // Initial state
      buses: [],
      tickets: [],
      favoriteBuses: [],
      currentBus: null,
      currentTicket: null,
      searchResults: [],
      loading: false,
      error: null,

      // Actions
      fetchBuses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users/buses');
          const data = await response.json();
          if (response.ok) {
            set({ buses: data.buses, loading: false });
          } else {
            throw new Error(data.msg || 'Failed to fetch buses');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      fetchBusById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/users/buses/${id}`);
          const data = await response.json();
          if (response.ok) {
            set({ currentBus: data.bus, loading: false });
          } else {
            throw new Error(data.msg || 'Bus not found');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      searchBuses: async (query) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users/buses/search-buses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
          });
          const data = await response.json();
          if (response.ok) {
            set({ searchResults: data.buses, loading: false });
          } else {
            throw new Error(data.msg || 'Search failed');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      searchTickets: async (params) => {
        set({ loading: true, error: null });
        try {
          const endpoint = params.ticketType === 'twoSide' 
            ? '/api/users/buses/search-two-side-bus-tickets' 
            : '/api/users/buses/search-one-side-bus-tickets';
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          });
          const data = await response.json();
          if (response.ok) {
            set({ searchResults: data.buses, loading: false });
          } else {
            throw new Error(data.msg || 'Ticket search failed');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      addFavoriteBus: async (busId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users/buses/add-favorite-bus', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ bus: busId }),
          });
          const data = await response.json();
          if (response.ok) {
            set(state => ({
              favoriteBuses: [...state.favoriteBuses, data.newUser.favoriteBuses],
              loading: false,
            }));
          } else {
            throw new Error(data.msg || 'Failed to add favorite');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      removeFavoriteBus: async (busId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/users/buses/delete-favorite-bus/${busId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            set(state => ({
              favoriteBuses: state.favoriteBuses.filter(bus => bus._id !== busId),
              loading: false,
            }));
          } else {
            throw new Error(data.msg || 'Failed to remove favorite');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      bookTicket: async (ticketData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users/buses/book-bus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(ticketData),
          });
          const data = await response.json();
          if (response.ok) {
            set(state => ({
              tickets: [...state.tickets, data.ticket],
              loading: false,
            }));
          } else {
            throw new Error(data.msg || 'Failed to book ticket');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      fetchTickets: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/users/buses/tickets', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            set({ tickets: data.tickets, loading: false });
          } else {
            throw new Error(data.msg || 'Failed to fetch tickets');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      fetchTicketById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/users/buses/tickets/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            set({ currentTicket: data.ticket, loading: false });
          } else {
            throw new Error(data.msg || 'Ticket not found');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      confirmTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/users/buses/tickets/${ticketId}/confirm`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            set(state => ({
              tickets: state.tickets.map(ticket => 
                ticket._id === ticketId ? data.busTicket : ticket
              ),
              currentTicket: data.busTicket,
              loading: false,
            }));
          } else {
            throw new Error(data.msg || 'Failed to confirm ticket');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      cancelTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/users/buses/tickets/${ticketId}/cancel`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            set(state => ({
              tickets: state.tickets.map(ticket => 
                ticket._id === ticketId ? data.busTicket : ticket
              ),
              currentTicket: data.busTicket,
              loading: false,
            }));
          } else {
            throw new Error(data.msg || 'Failed to cancel ticket');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      reset: () => {
        set({
          buses: [],
          tickets: [],
          favoriteBuses: [],
          currentBus: null,
          currentTicket: null,
          searchResults: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'bus-storage',
      partialize: (state) => ({ 
        favoriteBuses: state.favoriteBuses,
      }),
    }
  )
);

// Additional stores you might need:

// 1. User Store
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            set({ 
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            throw new Error(data.msg || 'Login failed');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            set({ 
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            throw new Error(data.msg || 'Registration failed');
          }
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

// 2. UI Store for global UI state
export const useUIStore = create((set) => ({
  theme: 'light',
  language: 'en',
  sidebarOpen: false,
  notifications: [],

  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),

  setLanguage: (lang) => set({ language: lang }),

  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
}));

// 3. Booking Store for temporary booking data
export const useBookingStore = create((set) => ({
  selectedBus: null,
  selectedSeats: [],
  passengerDetails: [],
  paymentMethod: null,
  bookingStep: 1,

  setSelectedBus: (bus) => set({ selectedBus: bus }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setPassengerDetails: (details) => set({ passengerDetails: details }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setBookingStep: (step) => set({ bookingStep: step }),
  resetBooking: () => set({
    selectedBus: null,
    selectedSeats: [],
    passengerDetails: [],
    paymentMethod: null,
    bookingStep: 1,
  }),
}));