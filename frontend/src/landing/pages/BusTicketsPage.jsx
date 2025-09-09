// src/pages/BusTicketsPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiBusLine,
  RiTicketLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiInformationLine,
  RiCalendarLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosCamera } from 'react-icons/io';
import { FaMale, FaFemale } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

// React Icons from pi package for sidebar
import { 
  PiUser,
  PiHouse,
  PiHeart,
  PiCreditCard,
  PiBell,
  PiHeadset
} from 'react-icons/pi';

import { useBusStore, useUserStore } from '../store/busStore';
import useUserAuthStore from '../store/authStore';

const BusTicketsPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Store hooks
  const { tickets, fetchTickets, cancelTicket, loading } = useBusStore();
  const { user, isAuthenticated, logout } = useUserAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated, fetchTickets]);

  const formatPersianDate = (date) => {
    if (!date) return 'نامشخص';
    const gregorianDate = new Date(date);
    return gregorianDate.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'نامشخص';
    return new Date(date).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelTicket = async (ticketId) => {
    if (window.confirm('آیا از لغو این بلیط مطمئن هستید؟')) {
      try {
        await cancelTicket(ticketId);
        toast.success('بلیط با موفقیت لغو شد', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: true
        });
      } catch (error) {
        toast.error('خطا در لغو بلیط', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          rtl: true
        });
      }
    }
  };

  const logoutUser = async () => {
    await logout();
    navigate('/');
  };

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'active') return !ticket.isCanceled && !ticket.isConfirmed;
    if (selectedStatus === 'confirmed') return ticket.isConfirmed;
    if (selectedStatus === 'canceled') return ticket.isCanceled;
    return true;
  });

  // Navigation items with links - using same icons as previous components
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <PiHouse className="ml-2 w-5 h-5" />, text: 'رزرو اقامتگاه', link: '/bookings' },
    { id: 'order-foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارشات غذا', link: '/order-foods' },
    { id: 'bus-tickets', icon: <RiBusLine className="ml-2 w-5 h-5" />, text: 'بلیط اتوبوس', link: '/bus-tickets' },
    { id: 'favorites', icon: <PiHeart className="ml-2 w-5 h-5" />, text: 'علاقه‌مندی‌ها', link: '/favorites' },
    { id: 'bank', icon: <PiCreditCard className="ml-2 w-5 h-5" />, text: 'حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <PiBell className="ml-2 w-5 h-5" />, text: 'اعلان‌ها', link: '/notifications' },
    { id: 'support', icon: <PiHeadset className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];

  const renderTicketCard = (ticket) => (
    <motion.div
      key={ticket._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-3 md:mb-0">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <RiTicketLine className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">بلیط شماره: {ticket.ticketNumber || ticket._id.slice(-8)}</h3>
            <p className="text-sm text-gray-500">تاریخ رزرو: {formatPersianDate(ticket.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          ticket.isCanceled
            ? 'bg-red-100 text-red-800'
            : ticket.isConfirmed
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
        >
          {ticket.isCanceled ? 'لغو شده' : ticket.isConfirmed ? 'تایید شده' : 'در انتظار تایید'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <RiBusLine className="text-gray-500 ml-2" />
            <span className="text-gray-600">اتوبوس:</span>
          </div>
          <p className="font-medium text-gray-800">{ticket.bus?.name || ticket.busCompany || 'نامعلوم'}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <RiMapPinLine className="text-gray-500 ml-2" />
            <span className="text-gray-600">مسیر:</span>
          </div>
          <p className="font-medium text-gray-800">
            {ticket.origin || ticket.firstCity} → {ticket.destination || ticket.lastCity}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <RiCalendarLine className="text-gray-500 ml-2" />
            <span className="text-gray-600">تاریخ حرکت:</span>
          </div>
          <p className="font-medium text-gray-800">
            {formatPersianDate(ticket.departureDate || ticket.movingDate)} - {formatTime(ticket.departureTime || ticket.movingDate)}
          </p>
        </div>

        {ticket.returnDate && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <RiCalendarLine className="text-gray-500 ml-2" />
              <span className="text-gray-600">تاریخ برگشت:</span>
            </div>
            <p className="font-medium text-gray-800">
              {formatPersianDate(ticket.returnDate)} - {formatTime(ticket.returnTime)}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-blue-50 p-4 rounded-lg flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RiInformationLine className="text-gray-500 ml-2" />
              <span className="text-gray-600">تعداد مسافران:</span>
            </div>
            <span className="font-medium text-gray-800">{ticket.passengerCount || ticket.count || 1}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <RiMoneyDollarCircleLine className="text-gray-500 ml-2" />
              <span className="text-gray-600">مبلغ کل:</span>
            </div>
            <span className="font-bold text-blue-600 text-lg">
              {(ticket.totalPrice || ticket.ticketPrice || 0).toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>

        {!ticket.isCanceled && !ticket.isConfirmed && (
          <button
            onClick={() => handleCancelTicket(ticket._id)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center whitespace-nowrap"
          >
            لغو بلیط
          </button>
        )}
      </div>

      {ticket.passengers && ticket.passengers.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <RiInformationLine className="ml-2" /> اطلاعات مسافران
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ticket.passengers.map((passenger, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-medium text-gray-800 mb-1">{passenger.name}</p>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <RiInformationLine className="ml-1" />
                  <span>کد ملی: {passenger.nationalCode}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {passenger.gender === 'male' ? (
                    <FaMale className="ml-1 text-blue-500" />
                  ) : (
                    <FaFemale className="ml-1 text-pink-500" />
                  )}
                  <span className="ml-1">{passenger.gender === 'male' ? 'آقا' : 'خانم'}</span>
                  {passenger.age && (
                    <>
                      <span className="mx-2">•</span>
                      <span>سن: {passenger.age} سال</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده بلیط‌های خود لطفاً وارد حساب کاربری شوید</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !tickets.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <ClipLoader size={50} color="#4f46e5" />
          <p className="text-gray-600 mt-4">در حال دریافت بلیط‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">بلیط‌های اتوبус</h1>
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
                src={user.avatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
                alt="پروفایل کاربر"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-105"
              />
              <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <IoIosCamera className="text-blue-600 text-lg md:text-xl" />
              </button>
            </div>
            <h3 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 truncate">
              {user.name || user.phone}
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base truncate">کاربر عزیز، خوش آمدید</p>
          </div>

          <div className="border-t border-gray-100 mx-4"></div>

          <nav className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'bus-tickets' 
                      ? 'bg-blue-50 text-blue-600 shadow-inner' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    {item.icon}
                    <span className="text-right flex-1 text-sm md:text-base">{item.text}</span>
                  </Link>
                </li>
              ))}
              
              <li>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <RiLogoutBoxRLine className="ml-2 w-5 h-5" />
                  <span className="text-right flex-1 text-sm md:text-base">خروج از حساب</span>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">بلیط‌های اتوبوس</h2>
                  <p className="text-gray-500 text-sm mt-1">مدیریت و پیگیری بلیط‌های اتوبوس شما</p>
                </div>
                <Link
                  to="/buses"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <RiBusLine className="ml-1" size={18} />
                  <span>رزرو بلیط جدید</span>
                </Link>
              </div>

              {/* Filter Section */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedStatus === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    همه بلیط‌ها
                  </button>
                  <button
                    onClick={() => setSelectedStatus('active')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedStatus === 'active' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    در انتظار تایید
                  </button>
                  <button
                    onClick={() => setSelectedStatus('confirmed')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedStatus === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    تایید شده
                  </button>
                  <button
                    onClick={() => setSelectedStatus('canceled')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedStatus === 'canceled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    لغو شده
                  </button>
                </div>
              </div>

              {filteredTickets.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {filteredTickets.map(renderTicketCard)}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <RiBusLine className="mx-auto text-gray-300" size={80} />
                    <h3 className="text-xl font-bold text-gray-700 mt-4">بلیطی یافت نشد</h3>
                    <p className="text-gray-500 mt-2">
                      {selectedStatus === 'all' 
                        ? 'شما هنوز هیچ بلیطی رزرو نکرده‌اید' 
                        : `هیچ بلیط ${selectedStatus === 'active' ? 'در انتظار تایید' : selectedStatus === 'confirmed' ? 'تایید شده' : 'لغو شده'} یافت نشد`}
                    </p>
                    <Link
                      to="/buses"
                      className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      رزرو اولین بلیط
                    </Link>
                  </div>
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

export default BusTicketsPage;