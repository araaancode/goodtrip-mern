import { create } from "zustand";
import axios from "axios";

const useUserAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  error: "",
  msg: "",

  // login user
  login: async (phone, password) => {
    try {
      set({ loading: true, error: "" });
      const { data } = await axios.post(
        "/api/users/auth/login",
        { phone, password },
        {
          withCredentials: true,
        }
      );

      set({
        user: data.user,
        msg: data.msg,
        loading: false,
      });

      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "خطا در ورود به سیستم";
      set({
        loading: false,
        error: errorMsg,
        msg: errorMsg,
      });
      throw new Error(errorMsg);
    }
  },

  // send OTP
  sendOtp: async (phone) => {
    try {
      const { data } = await axios.post("/api/users/auth/send-otp", { phone });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to send OTP";
      set({ loading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  // verify OTP
  verify: async (phone, code) => {
    try {
      const { data } = await axios.post("/api/users/auth/verify-otp", {
        phone,
        code,
      });

      set({
        user: data || data.user,
        isAuthenticated: true,
      });
      return data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg ||
        "در اعتبارسنجی کد یکبار مصرف خطایی وجود دارد";
      set({
        loading: false,
        error: errorMsg,
      });
      throw new Error(errorMsg);
    }
  },

  // logout
  logout: async () => {
    try {
      let response = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });
      console.log(response);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.log(error);
    }
  },

  // Get current user data
  checkAuth: async () => {
    try {
      let response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserAuthStore;
