import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "/api/admins/auth";

export const useAdminAuthStore = create((set, get) => ({
  // State
  admin: null,
  token: null,
  isLoading: false,
  error: null,
  otp: null,
  isAdminAuthenticated: false,


  // Actions
  register: async (adminData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, adminData);
      set({ admin: response.data, isLoading: false });
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
        admin: response.data.data?.admin || response.data.admin,
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
        admin: response.data.data?.admin || response.data.admin,
        token: response.data.token,
        isLoading: false,
        isAdminAuthenticated: true,
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

  resetPassword: async ({ password, confirmPassword, adminId, token }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        password,
        confirmPassword,
        adminId,
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
    set({ admin: null, token: null,isAdminAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  // Get current admin data
  checkAuthAdmin: async () => {
    try {
      let response = await axios.get("/api/admins/me", {
        withCredentials: true,
      });
      set({ admin: response.data.admin, isAdminAuthenticated: true });
    } catch (error) {
      console.log(error);
    }
  },
}));