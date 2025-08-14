import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "/api/owners/auth";

export const useOwnerAuthStore = create((set, get) => ({
  // State
  owner: null,
  token: null,
  isLoading: false,
  error: null,
  otp: null,
  isOwnerAuthenticated: false,


  // Actions
  register: async (ownerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, ownerData);
      set({ owner: response.data, isLoading: false });
      toast.success("با موفقیت ثبت نام شدید");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "خطایی در ثبت نام رخ داد");
      throw error;
    }
  },

  login: async ({ phone, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        phone,
        password,
      });
      set({
        owner: response.data.data?.owner || response.data.owner,
        token: response.data.token,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "خطایی در ورود رخ داد");
      throw error;
    }
  },

  sendOtp: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { phone });
      set({ otp: response.data, isLoading: false });
      toast.info("کد تایید ارسال شد");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "خطایی در ارسال کد رخ داد");
      throw error;
    }
  },

  verifyOtp: async ({ phone, code }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        phone,
        code,
      });
      set({
        owner: response.data.data?.owner || response.data.owner,
        token: response.data.token,
        isLoading: false,
        isOwnerAuthenticated: true,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "کد تایید نامعتبر است");
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
      });
      set({ isLoading: false });
      toast.info("لینک بازنشانی به ایمیل شما ارسال شد");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "خطایی در ارسال ایمیل رخ داد");
      throw error;
    }
  },

  resetPassword: async ({ password, confirmPassword, ownerId, token }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        password,
        confirmPassword,
        ownerId,
        token,
      });
      set({ isLoading: false });
      toast.success("گذرواژه با موفقیت تغییر کرد");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.msg || error.message,
        isLoading: false,
      });
      toast.error(error.response?.data?.msg || "خطایی در تغییر گذرواژه رخ داد");
      throw error;
    }
  },

  logout: () => {
    set({ owner: null, token: null,isOwnerAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  // Get current owner data
  checkAuthOwner: async () => {
    try {
      let response = await axios.get("/api/owners/me", {
        withCredentials: true,
      });
      set({ owner: response.data.owner, isOwnerAuthenticated: true });
    } catch (error) {
      console.log(error);
    }
  },
}));