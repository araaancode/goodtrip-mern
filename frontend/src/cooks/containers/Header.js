import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import axios from "axios";
import { SlUser } from "react-icons/sl";
import { PiBell } from "react-icons/pi";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
  }, [currentTheme]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  const logoutUser = () => {
    axios
      .get(`/api/cooks/auth/logout`, {})
      .then((res) => {
        console.log("cook logout");
        localStorage.clear();
        window.location.href = "/cooks/login";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="sticky top-0 bg-base-100 z-50 shadow-md backdrop-blur-sm bg-opacity-90">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button and title */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-ghost btn-circle drawer-button lg:hidden"
            aria-label="Open menu"
            onClick={handleSidebarToggle}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          
          {/* Page title - hidden on mobile when sidebar is open */}
          <h1 className={`
            text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white 
            truncate ml-2 sm:ml-4 transition-opacity duration-200
            lg:block
            ${isSidebarOpen ? 'hidden sm:block' : 'block'}
          `}>
            {pageTitle}
          </h1>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification button */}
          <button
            onClick={openNotification}
            className="btn btn-ghost btn-circle relative"
            aria-label="Notifications"
          >
            <PiBell className="w-5 h-5 sm:w-6 sm:h-6" />
            {noOfNotifications > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-primary badge-xs sm:badge-sm">
                {Math.min(noOfNotifications, 9)}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              aria-label="User menu"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <SlUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              </div>
            </label>
            
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-compact mt-3 p-2 shadow bg-base-100 rounded-box w-48 border border-gray-200 dark:border-gray-700"
            >
              <li>
                <Link
                  to="/cooks/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  دیدن پروفایل
                </Link>
              </li>
              
              <li className="border-t border-gray-200 dark:border-gray-700 my-1" />
              
              <li>
                <button
                  onClick={logoutUser}
                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                >
                  خروج
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;