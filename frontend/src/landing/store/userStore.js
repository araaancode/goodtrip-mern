

import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  user: null,
  error: "",
  msg: "",


  // change user profile 
  updateProfile: async (name,phone,email,username, nationalCode,province,city,gender) => {

    try {
      set({ loading: true, error: "" });
      const { data } = await axios.put(
        "/api/users/update-profile",
        { name,phone,email,username, nationalCode,province,city,gender },
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
      const errorMsg = error.response?.data?.msg || "مشکلی وجود دارد. دوباره امتحان کنید";
      set({
        loading: false,
        error: errorMsg,
        msg: errorMsg,
      });
      throw new Error(errorMsg);
    }
  },
 
}));

export default useUserStore;
