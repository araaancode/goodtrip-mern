// src/pages/OrderFoodsPage.js
import React, { useState, useEffect } from 'react';
import {
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiHeart2Fill,
  RiBankCardLine,
  RiNotification3Line,
  RiCustomerService2Line,
  RiSearchLine,
  RiCalendarLine
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsHouseDoor } from "react-icons/bs";
import { GiFoodTruck } from "react-icons/gi";
import { FaBusAlt, FaUser } from "react-icons/fa";
import useOrderFoodStore from '../store/orderFoodStore';
import useUserAuthStore from '../store/authStore';

const OrderFoodsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

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
    await cancelOrder(orderId);
  };

  const handleConfirmOrder = async (orderId) => {
    await confirmOrder(orderId);
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

  const renderSidebarLink = (to, icon, text, active = false) => (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-xl transition-all ${active ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'}`}
    >
      <span className="text-base font-medium ml-2">{text}</span>
      <div className={`p-2 rounded-lg ${active ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {React.cloneElement(icon, { className: `${active ? 'text-blue-600' : 'text-gray-500'} text-lg` })}
      </div>
    </Link>
  );

  const renderOrderCard = (order) => (
    <div key={order._id} className="w-full rounded-2xl p-5 mb-4 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              سفارش #{order._id.slice(-6).toUpperCase()}
            </span>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
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

      <div className="mt-4 flex justify-start space-x-2 space-x-reverse">
        <button
          onClick={() => navigate(`/order-foods/${order._id}`)}
          className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center"
        >
          <span>جزئیات سفارش</span>
          <RiSearchLine className="mr-1" size={16} />
        </button>
        {order.orderStatus === 'Pending' && (
          <>
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center"
            >
              <span>لغو سفارش</span>
            </button>
            <button
              onClick={() => handleConfirmOrder(order._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center"
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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده سفارشات خود لطفاً وارد حساب کاربری شوید</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت سفارشات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-4 rtl min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      {/* User Sidebar */}
      <div className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 md:mb-0 md:ml-4 overflow-hidden">
        <div className="p-6 text-center">
          <div className="relative mx-auto w-28 h-28">
            <img
              src={user.avatar || "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
              alt="پروفایل کاربر"
              className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 left-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all">
              <FaUser className="text-blue-600 text-lg" />
            </button> 
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-800">
            {user.name || user.phone}
          </h3>
          <p className="text-sm text-gray-500 mt-1">کاربر عزیز، خوش آمدید</p>
        </div>

        <div className="border-t border-gray-200 mx-6"></div>

        <nav className="p-4 space-y-1">
          {renderSidebarLink("/profile", <RiUser3Fill />, "حساب کاربری")}
          {renderSidebarLink("/bookings", <BsHouseDoor />, "رزرو اقامتگاه")}
          {renderSidebarLink("/order-foods", <GiFoodTruck />, "سفارشات غذا", true)}
          {renderSidebarLink("/bus-tickets", <FaBusAlt />, "بلیط اتوبوس")}
          {renderSidebarLink("/favorites", <RiHeart2Fill />, "علاقه‌مندی‌ها")}
          {renderSidebarLink("/bank", <RiBankCardLine />, "حساب بانکی")}
          {renderSidebarLink("/notifications", <RiNotification3Line />, "اعلان‌ها")}
          {renderSidebarLink("/support", <RiCustomerService2Line />, "پشتیبانی")}
          
          <button
            onClick={logoutUser}
            className="w-full flex items-center p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors mt-4"
          >
            <span className="text-base font-medium ml-2">خروج از حساب</span>
            <div className="p-2 rounded-lg bg-red-50">
              <RiLogoutBoxRLine className="text-red-500 text-lg" />
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800">سفارشات غذایی</h2>
              <p className="text-gray-500 text-sm mt-1">مدیریت و پیگیری سفارشات غذایی شما</p>
            </div>
            <Link
              to="/order-food/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center transition-colors shadow-md hover:shadow-lg"
            >
              <GiFoodTruck className="ml-1" size={18} />
              <span>سفارش غذای جدید</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی نام غذا..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-right"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <RiSearchLine size={20} />
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <RiCalendarLine size={18} />
              </div>
              <input
                type="date"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-right"
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
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <span>بستن نتایج</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map((food) => (
                  <div key={food._id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-right text-gray-800">{food.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        {food.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/foods/${food._id}`)}
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center float-left"
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
                <GiFoodTruck className="mx-auto text-gray-300" size={80} />
                <h3 className="text-xl font-bold text-gray-700 mt-4">سفارشی ثبت نشده است</h3>
                <p className="text-gray-500 mt-2">شما هنوز هیچ سفارش غذایی ثبت نکرده‌اید</p>
                <Link
                  to="/order-food/new"
                  className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition-all"
                >
                  ثبت اولین سفارش
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer 
        position="top-left" 
        autoClose={5000} 
        rtl 
        toastClassName="font-sans"
        bodyClassName="text-right"
      />
    </div>
  );
};

export default OrderFoodsPage;