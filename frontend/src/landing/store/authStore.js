// import { create } from "zustand";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const api = axios.create({
//   withCredentials: true,
// });

// export const useAuthStore = create((set, get) => ({
//   user: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
//   otp: {
//     phone: null,
//     code: null,
//     loading: false,
//     error: null,
//   },

//   // Register new user
//   register: async (userData) => {
//     set({ loading: true, error: null });
//     try {
//       const { data } = await api.post(
//         "/auth/register",
//         userData
//       );
//       set({
//         user: data,
//         isAuthenticated: true,
//         loading: false,
//       });
//       return data;
//     } catch (error) {
//       const errorMsg = error.response?.data?.msg || "کاربر ثبت نام نشد";
//       set({ loading: false, error: errorMsg });
//       throw new Error(errorMsg);
//     }
//   },

//   login: async ({ phone, password }) => {
//     set({ loading: true, error: null });

//     console.log("phone: ",phone)
//     console.log("password: ",password)

// try {
//   const { data } = await axios.post(
//     `/api/users/auth/login`,
//     {
//       phone,
//       password,
//     },
//     { withCredentials: true }
//   );

//   if (data.token) {
//     const decoded = jwtDecode(data.token);
//     set({
//       user: decoded.user || data.user || data,
//       isAuthenticated: true,
//     });
//   } else {
//     set({
//       user: data.user || data,
//       isAuthenticated: true,
//     });
//   }

//   set({ loading: false });
//   return data;
// } catch (error) {
//   console.log(error);
//   const errorMsg = error.response?.data?.msg || "وارد سایت نشدید";
//   set({ loading: false, error: errorMsg });
//   throw new Error(errorMsg);
// }
//   },

// sendOTP: async (phone) => {
//   set({
//     otp: {
//       ...get().otp,
//       loading: true,
//       error: null,
//       phone,
//     },
//   });
//   try {
//     const { data } = await api.post(
//       `/users/auth/send-otp`,
//       { phone }
//     );
//     set({ otp: { ...get().otp, loading: false } });
//     return data;
//   } catch (error) {
//     const errorMsg = error.response?.data?.msg || "Failed to send OTP";
//     set({ otp: { ...get().otp, loading: false, error: errorMsg } });
//     throw new Error(errorMsg);
//   }
// },

//   // Verify OTP code
// verifyOTP: async (phone, code) => {
//   set({
//     otp: { ...get().otp, loading: true, error: null },
//     loading: true,
//     error: null,
//   });
//   try {
//     const { data } = await api.post(
//       `/auth/verify-otp`,
//       {
//         phone,
//         code,
//       }
//     );

//     if (data.token) {
//       const decoded = jwtDecode(data.token);
//       set({
//         user: decoded.user || data.user,
//         isAuthenticated: true,
//       });
//     }

//     set({
//       loading: false,
//       otp: {
//         ...get().otp,
//         loading: false,
//         phone: null,
//         code: null,
//       },
//     });
//     return data;
//   } catch (error) {
//     const errorMsg = error.response?.data?.msg || "OTP verification failed";
//     set({
//       loading: false,
//       error: errorMsg,
//       otp: { ...get().otp, loading: false, error: errorMsg },
//     });
//     throw new Error(errorMsg);
//   }
// },

//   // Request password reset
//   forgotPassword: async (email) => {
//     set({ loading: true, error: null });
//     try {
//       const { data } = await api.post(
//         `/auth/forgot-password`,
//         { email }
//       );
//       set({ loading: false });
//       return data;
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.msg || "Failed to send password reset email";
//       set({ loading: false, error: errorMsg });
//       throw new Error(errorMsg);
//     }
//   },

//   // Reset password with token
//   resetPassword: async ({ userId, token, password, confirmPassword }) => {
//     set({ loading: true, error: null });
//     try {
//       const { data } = await api.post(
//         `/auth/reset-password`,
//         {
//           userId,
//           token,
//           password,
//           confirmPassword,
//         }
//       );
//       set({ loading: false });
//       return data;
//     } catch (error) {
//       const errorMsg = error.response?.data?.msg || "Password reset failed";
//       set({ loading: false, error: errorMsg });
//       throw new Error(errorMsg);
//     }
//   },

//   // Logout user
//   logout: async () => {
//     try {
//       await api.post(`/api/users/auth/logout`);
//     } finally {
//       set({
//         user: null,
//         isAuthenticated: false,
//       });
//     }
//   },

// // Get current user data
// checkAuth: async () => {
//   try {
//     let response = await axios.get(`{process.env.currentURL}/api/users/me`, {
//       withCredentials: true,
//     });
//     console.log(response);
//     set({ user: response.data, isAuthenticated: true });
//   } catch (error) {
//     console.log(error);
//   }
// },
// }));

// // Axios response interceptor to handle 401 unauthorized
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );

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
