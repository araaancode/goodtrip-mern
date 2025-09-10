// src/pages/OrderFoodsPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiCustomerService2Line,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBusSolid } from "react-icons/lia";

import {
  PiMagnifyingGlass,
  PiCalendarBlank,
  PiUser,
} from 'react-icons/pi';

import { IoIosCamera } from 'react-icons/io';
import { BsHouses } from "react-icons/bs";
import {
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
} from '@remixicon/react';

import useOrderFoodStore from '../store/orderFoodStore';
import useUserAuthStore from '../store/authStore';

const OrderFoodsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Store hooks
  const {
    orders,
    loading,
    error,
    fetchOrders,
    cancelOrder,
    confirmOrder,
    searchFoods,
    searchResults,
    clearSearchResults
  } = useOrderFoodStore();

  const { user, isAuthenticated, logout } = useUserAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("سفارش با موفقیت لغو شد", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("خطا در لغو سفارش", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder(orderId);
      toast.success("سفارش با موفقیت تایید شد", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("خطا در تایید سفارش", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchFoods(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    clearSearchResults();
  };

  const logoutUser = async () => {
    await logout();
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <BsHouses className="ml-2 w-5 h-5" />, text: 'رزروهای اقامتگاه', link: '/bookings' },
    { id: 'order-foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارش های غذا', link: '/order-foods' },
    { id: 'bus-tickets', icon: <LiaBusSolid className="ml-2 w-5 h-5" />, text: 'بلیط های اتوبوس', link: '/bus-tickets' },
    { id: 'favorites', icon: <RiHeart2Line className="ml-2 w-5 h-5" />, text: 'لیست علاقه مندی ها', link: '/favorites' },
    { id: 'bank', icon: <RiBankCard2Line className="ml-2 w-5 h-5" />, text: 'اطلاعات حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <RiNotificationLine className="ml-2 w-5 h-5" />, text: 'لیست اعلان ها', link: '/notifications' },
    { id: 'support', icon: <RiCustomerService2Line className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];


  const renderOrderCard = (order) => (
    <div key={order._id} className="w-full rounded-2xl p-5 mb-4 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-3 md:mb-0">
          <div className="flex items-center mb-2">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              سفارش #{order._id.slice(-6).toUpperCase()}
            </span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
              }`}>
              {order.orderStatus === 'Pending' ? 'در انتظار تایید' :
                order.orderStatus === 'Processing' ? 'در حال آماده سازی' :
                  order.orderStatus === 'Shipped' ? 'ارسال شده' :
                    order.orderStatus === 'Delivered' ? 'تحویل داده شده' :
                      'لغو شده'}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-left">
          <p className="text-lg font-bold text-gray-800">
            {order.totalAmount.toLocaleString('fa-IR')} <span className="text-sm font-normal">تومان</span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <h4 className="font-medium mb-3 text-gray-700">موارد سفارش:</h4>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{item.name}</span>
              <div className="flex items-center">
                <span className="text-gray-600 ml-2">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">× {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/order-foods/${order._id}`)}
          className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center text-sm md:text-base"
        >
          <span>جزئیات سفارش</span>
          <RiSearchLine className="mr-1" size={16} />
        </button>
        {order.orderStatus === 'Pending' && (
          <>
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center text-sm md:text-base"
            >
              <span>لغو سفارش</span>
            </button>
            <button
              onClick={() => handleConfirmOrder(order._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center text-sm md:text-base"
            >
              <span>تایید سفارش</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده سفارشات خود لطفاً وارد حساب کاربری شوید</p>
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

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت سفارشات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">سفارشات غذایی</h1>
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
                  <Link
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'order-foods'
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">سفارشات غذایی</h2>
                  <p className="text-gray-500 text-sm mt-1">مدیریت و پیگیری سفارشات غذایی شما</p>
                </div>
                <Link
                  to="/order-food/new"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <IoFastFoodOutline className="ml-1" size={18} />
                  <span>سفارش غذای جدید</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <form onSubmit={handleSearch} className="md:col-span-2">
                  <div className="relative">
                    <PiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                    <input
                      type="text"
                      placeholder="جستجوی نام غذا..."
                      className="w-full pr-10 pl-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-right transition-colors duration-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </form>

                <div className="relative">
                  <PiCalendarBlank className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  <input
                    type="date"
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-right transition-colors duration-300"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="mb-6 bg-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">نتایج جستجو</h3>
                    <button
                      onClick={clearSearch}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center transition-colors duration-300"
                    >
                      <span>بستن نتایج</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.map((food) => (
                      <div key={food._id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-right text-gray-800">{food.name}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                            {food.price.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/foods/${food._id}`)}
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center float-left transition-colors duration-300"
                        >
                          <span>مشاهده و سفارش</span>
                          <RiSearchLine className="mr-1" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders
                    .filter(order =>
                      !deliveryDate ||
                      new Date(order.deliveryDate).toISOString().split('T')[0] === deliveryDate
                    )
                    .map(renderOrderCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <IoFastFoodOutline className="mx-auto text-gray-300" size={80} />
                    <h3 className="text-xl font-bold text-gray-700 mt-4">سفارشی ثبت نشده است</h3>
                    <p className="text-gray-500 mt-2">شما هنوز هیچ سفارش غذایی ثبت نکرده‌اید</p>
                    <Link
                      to="/order-food/new"
                      className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      ثبت اولین سفارش
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

export default OrderFoodsPage;