// src/BookingsPage.js
import React, { useState, useEffect } from 'react';
import {
  RiTentLine,
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line,
  RiSearchLine,
  RiFilterLine,
  RiArrowLeftSLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiCloseCircleLine,
  RiMenuLine,
  RiCloseLine
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsHouses } from "react-icons/bs";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBusSolid } from "react-icons/lia";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const renderSidebarLink = (to, icon, text, isActive = false) => (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'}`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {icon}
      <span className="text-right flex-1 text-sm md:text-base">{text}</span>
    </Link>
  );

  const renderBookingCard = (booking, index) => (
    <div
      className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg border border-gray-100 transform hover:-translate-y-1"
      key={booking._id || index}
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <BsHouses className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl text-gray-900">
                  {booking.house?.name}
                </h3>
                <p className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs inline-block mt-1">
                  {persianHouseType(booking.house?.houseType)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 mt-4">
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <RiCalendarEventLine className="ml-1" size={16} />
                <span>
                  {new Date(booking.checkIn).toLocaleString("fa").split(',')[0]}
                </span>
              </div>
              <div className="text-gray-400 hidden md:block">|</div>
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <RiCalendarEventLine className="ml-1" size={16} />
                <span>
                  {new Date(booking.checkOut).toLocaleString("fa").split(',')[0]}
                </span>
              </div>
              <div className="text-gray-400 hidden md:block">|</div>
              <div className="flex items-center text-gray-600 text-sm md:text-base">
                <RiMoneyDollarCircleLine className="ml-1" size={16} />
                <span>{booking.price.toLocaleString()} تومان</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end mt-4 md:mt-0">
            <div className="mb-2 text-gray-500 text-xs md:text-sm">کد رزرو: {booking._id.slice(-8)}</div>
            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 md:px-4 rounded-lg transition-colors duration-300 text-sm md:text-base"
              >
                <RiCloseCircleLine className="ml-1" size={18} />
                لغو رزرو
              </button>
              <Link
                to={`/bookings/${booking._id}`}
                className="flex items-center justify-center bg-white border border-gray-300 hover:border-blue-600 hover:text-blue-600 py-2 px-3 md:px-4 font-medium rounded-lg transition-all duration-300 text-sm md:text-base"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation items
  const navItems = [
    { id: 'profile', icon: <RiUser3Fill className="ml-2 w-5 h-5" />, text: 'حساب کاربری' },
    { id: 'bookings', icon: <BsHouses className="ml-2 w-5 h-5" />, text: 'رزروهای اقامتگاه' },
    { id: 'foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارش های غذا' },
    { id: 'bus', icon: <LiaBusSolid className="ml-2 w-5 h-5" />, text: 'بلیط های اتوبوس' },
    { id: 'favorites', icon: <RiHeart2Line className="ml-2 w-5 h-5" />, text: 'لیست علاقه مندی ها' },
    { id: 'bank', icon: <RiBankCard2Line className="ml-2 w-5 h-5" />, text: 'اطلاعات حساب بانکی' },
    { id: 'notifications', icon: <RiNotificationLine className="ml-2 w-5 h-5" />, text: 'لیست اعلان ها' },
    { id: 'support', icon: <RiCustomerService2Line className="ml-2 w-5 h-5" />, text: 'پشتیبانی' },
  ];

  // Error and loading states
  if (authError || houseError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="text-red-500 text-xl mb-4">{authError || houseError}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (houseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت اطلاعات رزروها...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="text-xl mb-4">لطفا ابتدا وارد شوید</div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            رفتن به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">رزروهای اقامتگاه</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 z-50 relative"
        >
          {isMobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* User Sidebar */}
        <div className={`
          w-full lg:w-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 
          transition-all duration-300 z-50 lg:z-auto
          ${isMobileMenuOpen 
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 max-w-md max-h-[80vh] overflow-y-auto' 
            : 'hidden lg:block'
          }
        `}>
          {/* Close button for mobile */}
          {isMobileMenuOpen && (
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center lg:hidden">
              <h2 className="text-lg font-semibold text-gray-800">منو</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
          )}
          
          <div className="p-4 md:p-6 text-center">
            <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
                alt="User profile"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-105"
              />
              <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <IoIosCamera className="text-blue-600 text-lg md:text-xl" />
              </button>
            </div>
            <h3 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 truncate">
              {user.name || user.phone}
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base truncate">{user.email || 'ایمیل ثبت نشده'}</p>
          </div>

          <div className="border-t border-gray-100 mx-4"></div>

          <nav className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id !== 'bookings') {
                        navigate(`/${item.id}`);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'bookings' 
                      ? 'bg-blue-50 text-blue-600 shadow-inner' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    {item.icon}
                    <span className="text-right flex-1 text-sm md:text-base">{item.text}</span>
                  </button>
                </li>
              ))}
              
              <li>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <RiLogoutBoxRLine className="ml-2 w-5 h-5" />
                  <span className="text-right flex-1 text-sm md:text-base">خروج</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="p-4 md:p-6 lg:p-8">
              {bookings.length > 0 ? (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b border-gray-100">رزروهای اقامتگاه</h2>
                  
                  <div className='flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6'>
                    <div className="relative flex-1">
                      <RiSearchLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        className="w-full border border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl py-3 pr-10 pl-4 transition-colors duration-300"
                        type="text"
                        placeholder="جستجو بر اساس نام اقامتگاه..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="w-full md:w-56">
                      <select
                        className="w-full p-3 border border-gray-300 bg-white focus:border-blue-500 focus:outline-none rounded-xl transition-colors duration-300"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="All">همه دسته‌بندی‌ها</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {persianHouseType(category)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4 text-gray-600">
                    {filteredBookings.length} رزرو پیدا شد
                  </div>

                  <div className="bookings-list">
                    {filteredBookings.map(renderBookingCard)}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <RiTentLine className="text-blue-600 text-4xl" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">شما هیچ رزروی ندارید</h2>
                  <p className="text-gray-600 mb-6">با رزرو اقامتگاه جدید، این صفحه پر خواهد شد</p>
                  <Link
                    to="/"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    مشاهده اقامتگاه‌ها
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default BookingsPage;