// src/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiMenuLine,
  RiCloseLine,
  RiBellFill,
  RiCheckboxCircleLine,
  RiErrorWarningFill,
  RiInformationFill,
  RiDeleteBinLine,
  RiCheckLine,
  RiTimeLine,
  RiArrowRightLine,
  RiFilterLine,
  RiCheckboxBlankCircleFill
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosCamera } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

// React Icons from pi package for sidebar
import { 
  PiUser,
  PiHouse,
  PiHeart,
  PiCreditCard,
  PiBell,
  PiHeadset
} from 'react-icons/pi';

// Mock data since we don't have the actual store
const mockNotifications = [
  {
    _id: '1',
    type: 'success',
    title: 'رزرو شما تأیید شد',
    message: 'رزرو ویلای شمال در تاریخ 1402/08/15 با موفقیت تأیید شد.',
    time: '2 ساعت پیش',
    read: false,
    link: '/bookings/1',
    icon: <RiCheckboxCircleLine className="text-green-500" size={20} />
  },
  {
    _id: '2',
    type: 'warning',
    title: 'یادآوری پرداخت',
    message: 'لطفاً برای تکمیل رزرو خود، مبلغ 250,000 تومان را پرداخت کنید.',
    time: '5 ساعت پیش',
    read: false,
    link: '/bookings/2',
    icon: <RiErrorWarningFill className="text-amber-500" size={20} />
  },
  {
    _id: '3',
    type: 'info',
    title: 'سفارش غذا تحویل داده شد',
    message: 'سفارش غذا شما با کد پیگیری 45678 تحویل داده شد.',
    time: '1 روز پیش',
    read: true,
    link: '/order-foods/3',
    icon: <RiInformationFill className="text-blue-500" size={20} />
  },
  {
    _id: '4',
    type: 'error',
    title: 'لغو سفر',
    message: 'سفر شما به مقصد مشهد به دلیل شرایط جوی لغو شد.',
    time: '2 روز پیش',
    read: true,
    link: '/bus-tickets/4',
    icon: <RiErrorWarningFill className="text-red-500" size={20} />
  },
  {
    _id: '5',
    type: 'success',
    title: 'پرداخت موفق',
    message: 'پرداخت شما به مبلغ 180,000 تومان با موفقیت انجام شد.',
    time: '3 روز پیش',
    read: true,
    link: '/bank',
    icon: <RiCheckboxCircleLine className="text-green-500" size={20} />
  },
  {
    _id: '6',
    type: 'info',
    title: 'بروزرسانی سیستم',
    message: 'سیستم در تاریخ 1402/08/20 از ساعت 02:00 تا 04:00 بامداد در دسترس نخواهد بود.',
    time: '4 روز پیش',
    read: true,
    link: null,
    icon: <RiInformationFill className="text-blue-500" size={20} />
  }
];

// Mock user authentication
const useMockAuth = () => {
  return {
    user: {
      name: 'علی رضایی',
      phone: '09123456789',
      avatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'
    },
    isAuthenticated: true,
    logout: () => {
      toast.info('عملیات خروج انجام شد');
    }
  };
};

// Mock notifications store
const useMockNotificationsStore = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  
  const fetchNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const markAsRead = (notificationId) => {
    return new Promise((resolve) => {
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      resolve();
    });
  };
  
  const markAllAsRead = () => {
    return new Promise((resolve) => {
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      resolve();
    });
  };
  
  const deleteNotification = (notificationId) => {
    return new Promise((resolve) => {
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      resolve();
    });
  };
  
  const clearAllNotifications = () => {
    return new Promise((resolve) => {
      setNotifications([]);
      resolve();
    });
  };
  
  return {
    notifications,
    loading,
    error: null,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Use mock stores instead of the missing ones
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useMockNotificationsStore();
  const { user, isAuthenticated, logout } = useMockAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      toast.success('اعلان به عنوان خوانده شده علامت گذاری شد', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('خطا در بروزرسانی اعلان', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('همه اعلان‌ها به عنوان خوانده شده علامت گذاری شدند', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('خطا در بروزرسانی اعلان‌ها', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      toast.success('اعلان با موفقیت حذف شد', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('خطا در حذف اعلان', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('آیا از پاک کردن همه اعلان‌ها مطمئن هستید؟')) {
      try {
        await clearAllNotifications();
        toast.success('همه اعلان‌ها با موفقیت پاک شدند', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('خطا در پاک کردن اعلان‌ها', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;
    
    if (window.confirm(`آیا از حذف ${selectedNotifications.length} اعلان انتخاب شده مطمئن هستید؟`)) {
      try {
        await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
        setSelectedNotifications([]);
        toast.success('اعلان‌های انتخاب شده با успеیت حذف شدند', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('خطا در حذف اعلان‌ها', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const logoutUser = async () => {
    await logout();
    navigate('/');
  };

  // Filter notifications based on selection
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation items with links - using same icons as previous components
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <PiHouse className="ml-2 w-5 h-5" />, text: 'رزرو اقامتگاه', link: '/bookings' },
    { id: 'order-foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارشات غذا', link: '/order-foods' },
    { id: 'bus-tickets', icon: <PiBell className="ml-2 w-5 h-5" />, text: 'بلیط اتوبوس', link: '/bus-tickets' },
    { id: 'favorites', icon: <PiHeart className="ml-2 w-5 h-5" />, text: 'علاقه‌مندی‌ها', link: '/favorites' },
    { id: 'bank', icon: <PiCreditCard className="ml-2 w-5 h-5" />, text: 'حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <PiBell className="ml-2 w-5 h-5" />, text: 'اعلان‌ها', link: '/notifications' },
    { id: 'support', icon: <PiHeadset className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];

  const renderNotificationCard = (notification) => (
    <motion.div
      key={notification._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${
        !notification.read ? 'border-r-4 border-r-blue-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleSelectNotification(notification._id)}
          className={`mt-1 p-1 rounded-full transition-colors ${
            selectedNotifications.includes(notification._id)
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-300 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <RiCheckboxBlankCircleFill size={16} />
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-100' :
                notification.type === 'warning' ? 'bg-amber-100' :
                notification.type === 'error' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {notification.icon}
              </div>
              <h3 className="font-bold text-gray-800">{notification.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm flex items-center">
                <RiTimeLine size={14} className="ml-1" />
                {notification.time}
              </span>
              {!notification.read && (
                <span className="bg-blue-500 w-2 h-2 rounded-full"></span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
          
          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center"
              >
                <RiCheckLine size={14} className="ml-1" />
                علامت به عنوان خوانده شده
              </button>
            )}
            {notification.link && (
              <Link
                to={notification.link}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                مشاهده جزئیات
                <RiArrowRightLine size={14} className="mr-1" />
              </Link>
            )}
            <button
              onClick={() => handleDeleteNotification(notification._id)}
              className="text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center"
            >
              <RiDeleteBinLine size={14} className="ml-1" />
              حذف
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده اعلان‌ها لطفاً وارد حساب کاربری شوید</p>
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

  if (loading && !notifications.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت اعلان‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">اعلان‌ها</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
              {unreadCount}
            </span>
          )}
        </div>
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
                src={user.avatar}
                alt="پروفایل کاربر"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-105"
              />
              <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <IoIosCamera className="text-blue-600 text-lg md:text-xl" />
              </button>
            </div>
            <h3 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 truncate">
              {user.name}
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
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'notifications' 
                      ? 'bg-blue-50 text-blue-600 shadow-inner' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                    }`}
                  >
                    {item.icon}
                    <span className="text-right flex-1 text-sm md:text-base">{item.text}</span>
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <RiBellFill className="ml-2 text-blue-600" />
                    اعلان‌ها
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2">
                        {unreadCount} خوانده نشده
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">مدیریت اعلان‌های سیستم</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors duration-300 flex items-center"
                    >
                      <RiDeleteBinLine className="ml-1" size={16} />
                      حذف انتخاب شده‌ها ({selectedNotifications.length})
                    </button>
                  )}
                  <button
                    onClick={handleMarkAllAsRead}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors duration-300 flex items-center"
                  >
                    <RiCheckLine className="ml-1" size={16} />
                    علامت همه به عنوان خوانده شده
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition-colors duration-300 flex items-center"
                  >
                    <RiDeleteBinLine className="ml-1" size={16} />
                    پاک کردن همه
                  </button>
                </div>
              </div>

              {/* Filter Section */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    همه
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      filter === 'unread' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    خوانده نشده
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      filter === 'read' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    خوانده شده
                  </button>
                </div>
              </div>

              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredNotifications.map(renderNotificationCard)}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RiBellFill className="text-blue-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mt-4">اعلانی یافت نشد</h3>
                    <p className="text-gray-500 mt-2">
                      {filter !== 'all' 
                        ? 'هیچ اعلانی با فیلترهای انتخاب شده مطابقت ندارد' 
                        : 'شما هیچ اعلانی ندارید'}
                    </p>
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className="inline-block mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                      >
                        حذف فیلترها
                      </button>
                    )}
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

export default NotificationsPage;