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
import houseStore from '../store/houseStore';
import useUserAuthStore from '../store/authStore';
import { CiCamera } from "react-icons/ci";

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
    error: authError
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate('/');
    window.location.reload();
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
      {/* User Profile Sidebar */}
      <div className="w-full md:w-1/4 py-6 bg-white border border-gray-200 rounded-lg shadow mb-4 md:mb-0">
        <div className="mb-8 px-4 text-center mx-auto flex justify-center">
          <div className="relative w-40 h-40">
            <img
              src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
              alt="user profile"
              className="object-cover rounded-full mx-auto"
            />
            <div className="absolute bottom-8 left-0 p-2 bg-white cursor-pointer shadow shadow-full rounded-full">
              <CiCamera className='text-blue-800 h-8 w-8' />
            </div>
            <p className="text-gray-900 text-center mt-2">
              {user?.name || user?.phone || 'کاربر'}
            </p>
          </div>
        </div>

        <div className='border'></div>
        
        <div className='my-6 px-8'>
          {renderSidebarLink("/profile", <RiUser3Fill className="ml-2 w-8 h-8" />, "حساب کاربری")}
          {renderSidebarLink("/bookings", <BsHouses className="ml-2 w-8 h-8" />, "رزروهای اقامتگاه")}
          {renderSidebarLink("/bookings", <IoFastFoodOutline className="ml-2 w-8 h-8" />, "سفارش های غذا")}
          {renderSidebarLink("/bookings", <LiaBusSolid className="ml-2 w-8 h-8" />, "بلیط های اتوبوس")}
          {renderSidebarLink("/favorites", <RiHeart2Line className="ml-2 w-8 h-8" />, "لیست علاقه مندی ها")}
          {renderSidebarLink("/bank", <RiBankCard2Line className="ml-2 w-8 h-8" />, "اطلاعات حساب بانکی")}
          {renderSidebarLink("/notifications", <RiNotificationLine className="ml-2 w-8 h-8" />, "لیست اعلان ها")}
          {renderSidebarLink("/support", <RiCustomerService2Line className="ml-2 w-8 h-8" />, "پشتیبانی")}
          
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors w-full"
          >
            <RiLogoutBoxRLine className="ml-2 w-8 h-8" />
            <span className="text-lg">خروج</span>
          </button>
        </div>
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