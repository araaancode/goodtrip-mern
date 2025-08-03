// src/BookingsPage.js
import React, { useState, useEffect } from 'react';

import {
  RiTentLine,
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsHouses } from "react-icons/bs";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBusSolid } from "react-icons/lia";
import { CiCamera } from "react-icons/ci";
import { IoIosCamera } from 'react-icons/io';

// hooks
import houseStore from '../store/houseStore';
import useUserAuthStore from '../store/authStore';


const HOUSE_TYPES = {
  cottage: "کلبه",
  apartment: "آپارتمان",
  garden: "باغ",
  villa: "ویلا",
  room: "اتاق"
};

const CATEGORIES = Object.keys(HOUSE_TYPES);

const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Store hooks
  const {
    bookings,
    loading: houseLoading,
    error: houseError,
    fetchUserBookings,
    cancelBooking: storeCancelBooking
  } = houseStore();

  const {
    user,
    checkAuth,
    isAuthenticated,
    error: authError,
    logout
  } = useUserAuthStore();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      fetchUserBookings();
    }
  }, [isAuthenticated, checkAuth, fetchUserBookings]);

  const persianHouseType = (type) => HOUSE_TYPES[type] || type;

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.house?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || booking.house?.houseType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCancelBooking = async (id) => {
    try {
      await storeCancelBooking(id);
      toast.success("رزرو با موفقیت لغو شد", TOAST_CONFIG);
    } catch (err) {
      toast.error(err.message || "خطا در لغو رزرو", TOAST_CONFIG);
    }
  };

  const logoutUser = async () => {
    await logout()
    navigate('/');
  };

  const renderSidebarLink = (to, icon, text) => (
    <Link
      to={to}
      className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
    >
      {icon}
      <span className="text-lg">{text}</span>
    </Link>
  );

  const renderBookingCard = (booking, index) => (
    <div
      className="w-full flex justify-between rounded-lg overflow-hidden border bg-white my-4 py-4 mx-2"
      key={booking._id || index}
    >
      <div className="px-2 py-4">
        <div className="font-bold text-xl mb-2">
          {booking.house?.name} {persianHouseType(booking.house?.houseType)}
        </div>
        <div className="mb-2 text-gray-500">کد رزرو: {booking._id}</div>
      </div>

      <div className="px-2 my-auto">
        <div className="mb-2 text-gray-500">
          {new Date(booking.checkIn).toLocaleString("fa").split(',')[0]}
        </div>
        <div className="mb-2 text-gray-500">الی</div>
        <div className="mb-2 text-gray-500">
          {new Date(booking.checkOut).toLocaleString("fa").split(',')[0]}
        </div>
      </div>

      <div className="px-2 my-auto">
        <p className="mb-2 text-gray-500 inline">{booking.price} تومان</p>
      </div>

      <div className="px-2 my-auto">
        <button
          onClick={() => handleCancelBooking(booking._id)}
          className="bg-blue-800 hover:bg-blue-900 mx-2 text-white font-bold py-4 px-6 rounded shadow-lg"
        >
          لغو رزرو
        </button>

        <Link
          to={`/bookings/${booking._id}`}
          className="bg-white border py-4 px-6 font-bold rounded"
        >
          جزئیات
        </Link>
      </div>
    </div>
  );

  // Error and loading states
  if (authError || houseError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{authError || houseError}</div>
      </div>
    );
  }

  if (houseLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">لطفا ابتدا وارد شوید</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-4 rtl mt-4">
      {/* User Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow border border-gray-200 mb-4 md:mb-0">
        <div className="p-6 text-center">
          <div className="relative mx-auto w-40 h-40">
            <img
              src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
              alt="User profile"
              className="object-cover rounded-full w-full h-full border-4 border-white shadow"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all">
              <IoIosCamera className="text-blue-800 text-xl" />
            </button>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {user.name || user.phone}
          </h3>
        </div>

        <div className="border-t border-gray-200 mx-6"></div>

        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <Link
                to="/profile"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiUser3Fill className="text-blue-800 ml-2" />
                <span className="text-lg">حساب کاربری</span>
              </Link>
            </li>
            <li>
              <Link
                to="/bookings"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <BsHouses className="ml-2 w-8 h-8" />
                <span className="text-lg">رزروهای اقامتگاه</span>
              </Link>
            </li>
            <li>
              <Link
                to="/order-foods"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <IoFastFoodOutline className="ml-2 w-8 h-8" />
                <span className="text-lg">سفارش های غذا</span>
              </Link>
            </li>
            <li>
              <Link
                to="/bus-tickets"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <LiaBusSolid className="ml-2 w-8 h-8" />
                <span className="text-lg">بلیط های اتوبوس</span>
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiHeart2Line className="ml-2 w-8 h-8" />
                <span className="text-lg">لیست علاقه مندی ها</span>
              </Link>
            </li>
            <li>
              <Link
                to="/bank"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiBankCard2Line className="ml-2 w-8 h-8" />
                <span className="text-lg">اطلاعات حساب بانکی</span>
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiNotificationLine className="ml-2 w-8 h-8" />
                <span className="text-lg">لیست اعلان ها</span>
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiCustomerService2Line className="ml-2 w-8 h-8" />
                <span className="text-lg">پشتیبانی</span>
              </Link>
            </li>
            <li>
              <button
                onClick={logoutUser}
                className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
              >
                <RiLogoutBoxRLine className="ml-2 w-8 h-8" />
                <span className="text-lg">خروج</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>


      {/* Main Content Area */}
      <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow mx-10">
        {bookings.length > 0 ? (
          <>
            <div className='flex justify-between items-center'>
              <div className="mb-4 ml-2 w-4/5">
                <input
                  className="w-full border focus:outline-none rounded p-5 border-gray-900"
                  type="text"
                  placeholder="جستجو کنید..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4 w-1/5">
                <select
                  className="w-full p-5 border bg-white focus:outline-none rounded border-gray-900"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">مرتب سازی</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {persianHouseType(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredBookings.map(renderBookingCard)}
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h1 className='text-xl text-gray-500'>شما هیچ رزروی ندارید !!!</h1>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default BookingsPage;