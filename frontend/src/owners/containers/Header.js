import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { SlUser } from "react-icons/sl";
import axios from "axios"
import { Link } from "react-router-dom";


import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { useOwnerAuthStore } from "../stores/authStore" 

function Header() {
  const dispatch = useDispatch();
  
  // Get state and actions from authStore
  const { owner, isOwnerAuthenticated, logout } = useOwnerAuthStore();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  useEffect(() => {
    themeChange(false);
    if (!currentTheme) {
      setCurrentTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }
  }, []);

  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  const handleLogout = async () => {
    try {
      // Call the API to logout from server
      await axios.get(`/api/owners/auth/logout`);
      
      // Clear local state using authStore
      logout();
      
      // Clear localStorage
      localStorage.clear();
      
      // Redirect to login page
      window.location.href = "/owners/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-base-100 shadow-md">
      <div className="navbar px-4 md:px-6">
        {/* Left section (menu + title) */}
        <div className="flex items-center flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <Bars3Icon className="w-6 h-6" />
          </label>
          <h1 className="ml-3 text-lg md:text-2xl font-semibold truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right section (icons + profile) */}
        <div className="flex items-center gap-4">
          {/* Display owner info if authenticated */}
          {isOwnerAuthenticated && owner && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {owner.name || owner.phone}
              </span>
            </div>
          )}

          {/* Profile dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <SlUser className="w-6 h-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52"
            >
              {isOwnerAuthenticated ? (
                <>
                  <li>
                    <Link to="/owners/profile" className="justify-between">
                      دیدن پروفایل
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>خروج</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/owners/login" className="justify-between">
                      ورود
                    </Link>
                  </li>
                  <li>
                    <Link to="/owners/register" className="justify-between">
                      ثبت نام
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;