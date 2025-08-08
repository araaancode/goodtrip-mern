import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = '/api/cooks/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,
      otp: null,

      // Actions
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/register`, userData);
          set({ user: response.data, isLoading: false });
          toast.success('با موفقیت ثبت نام شدید');
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'خطایی در ثبت نام رخ داد');
          throw error;
        }
      },

      login: async ({ phone, password }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/login`, { phone, password });
          set({ user: response.data, isLoading: false });
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'خطایی در ورود رخ داد');
          throw error;
        }
      },

      sendOtp: async (phone) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/send-otp`, { phone });
          set({ otp: response.data, isLoading: false });
          toast.info('کد تایید ارسال شد');
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'خطایی در ارسال کد رخ داد');
          throw error;
        }
      },

      verifyOtp: async ({ phone, code }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/verify-otp`, { phone, code });
          set({ 
            user: response.data.data.cook,
            token: response.data.token,
            isLoading: false 
          });
          localStorage.setItem('userToken', response.data.token);
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'کد تایید نامعتبر است');
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
          set({ isLoading: false });
          toast.info('لینک بازنشانی به ایمیل شما ارسال شد');
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'خطایی در ارسال ایمیل رخ داد');
          throw error;
        }
      },

      resetPassword: async ({ password, confirmPassword, cookId, token }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            password,
            confirmPassword,
            cookId,
            token
          });
          set({ isLoading: false });
          toast.success('گذرواژه با موفقیت تغییر کرد');
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.msg || error.message, isLoading: false });
          toast.error(error.response?.data?.msg || 'خطایی در تغییر گذرواژه رخ داد');
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('userToken');
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);