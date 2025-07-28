import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

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
          const { data } = await axios.get("/api/users/buses");
          set({ buses: data.buses, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to fetch buses",
            loading: false,
          });
        }
      },

      fetchBusById: async (id) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.get(`/api/users/buses/${id}`);
          set({ currentBus: data.bus, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Bus not found",
            loading: false,
          });
        }
      },

      searchBuses: async (query) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post(
            "/api/users/buses/search-buses",
            query
          );
          set({ searchResults: data.buses, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Search failed",
            loading: false,
          });
        }
      },

      searchTickets: async (params) => {
        set({ loading: true, error: null });
        try {
          const endpoint =
            params.ticketType === "twoSide"
              ? "/api/users/buses/search-two-side-bus-tickets"
              : "/api/users/buses/search-one-side-bus-tickets";

          const { data } = await axios.post(endpoint, params);
          set({ searchResults: data.buses, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Ticket search failed",
            loading: false,
          });
        }
      },

      addFavoriteBus: async (busId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.put(
            "/api/users/buses/add-favorite-bus",
            { bus: busId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          set((state) => ({
            favoriteBuses: [...state.favoriteBuses, data.newUser.favoriteBuses],
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to add favorite",
            loading: false,
          });
        }
      },

      removeFavoriteBus: async (busId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.put(
            `/api/users/buses/delete-favorite-bus/${busId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          set((state) => ({
            favoriteBuses: state.favoriteBuses.filter(
              (bus) => bus._id !== busId
            ),
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to remove favorite",
            loading: false,
          });
        }
      },

      bookTicket: async (ticketData) => {
        set({ loading: true, error: null });


        try {
          const { data } = await axios.post(
            "/api/users/buses/book-bus",
            ticketData,
            {
              withCredentials: true, 
            }
          );

          set((state) => ({
            tickets: [...state.tickets, data.ticket],
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to book ticket",
            loading: false,
          });
        }
      },

      fetchTickets: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.get("/api/users/buses/tickets", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          set({ tickets: data.tickets, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to fetch tickets",
            loading: false,
          });
        }
      },

      fetchTicketById: async (id) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.get(`/api/users/buses/tickets/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          set({ currentTicket: data.ticket, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Ticket not found",
            loading: false,
          });
        }
      },

      confirmTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.put(
            `/api/users/buses/tickets/${ticketId}/confirm`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          set((state) => ({
            tickets: state.tickets.map((ticket) =>
              ticket._id === ticketId ? data.busTicket : ticket
            ),
            currentTicket: data.busTicket,
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to confirm ticket",
            loading: false,
          });
        }
      },

      cancelTicket: async (ticketId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.put(
            `/api/users/buses/tickets/${ticketId}/cancel`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          set((state) => ({
            tickets: state.tickets.map((ticket) =>
              ticket._id === ticketId ? data.busTicket : ticket
            ),
            currentTicket: data.busTicket,
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Failed to cancel ticket",
            loading: false,
          });
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
      name: "bus-storage",
      partialize: (state) => ({
        favoriteBuses: state.favoriteBuses,
      }),
    }
  )
);

// Updated User Store with axios
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
          const { data } = await axios.post("/api/auth/login", credentials);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Login failed",
            loading: false,
          });
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post("/api/auth/register", userData);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.msg || "Registration failed",
            loading: false,
          });
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);

// UI Store remains the same as it doesn't make API calls
export const useUIStore = create((set) => ({
  theme: "light",
  language: "en",
  sidebarOpen: false,
  notifications: [],

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  setLanguage: (lang) => set({ language: lang }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// Booking Store remains the same as it doesn't make API calls
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
  resetBooking: () =>
    set({
      selectedBus: null,
      selectedSeats: [],
      passengerDetails: [],
      paymentMethod: null,
      bookingStep: 1,
    }),
}));
