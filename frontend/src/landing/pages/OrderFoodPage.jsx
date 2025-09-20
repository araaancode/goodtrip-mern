// src/pages/OrderFoodPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  RiArrowRightLine,
  RiMapPinLine,
  RiPhoneLine,
  RiCalendarLine,
  RiTimeLine,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine
} from "@remixicon/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOrderFoodStore from '../store/orderFoodStore';
import useUserAuthStore from '../store/authStore';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  Pending: <RiInformationLine className="ml-1" />,
  Processing: <RiTimeLine className="ml-1" />,
  Shipped: <RiArrowRightLine className="ml-1" />,
  Delivered: <RiCheckboxCircleLine className="ml-1" />,
  Cancelled: <RiCloseCircleLine className="ml-1" />
};

const OrderFoodPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Store hooks
  const {
    selectedOrder,
    loading,
    error,
    getOrderDetails,
    cancelOrder,
    confirmOrder,
    updateOrderStatus
  } = useOrderFoodStore();

  const { user, isAuthenticated } = useUserAuthStore();

  useEffect(() => {
    if (isAuthenticated && orderId) {
      getOrderDetails(orderId);
    }
  }, [isAuthenticated, orderId, getOrderDetails]);

  const handleCancelOrder = async () => {
    await cancelOrder(orderId);
    navigate('/order-foods');
  };

  const handleConfirmOrder = async () => {
    await confirmOrder(orderId);
  };

  const handleStatusUpdate = async (status) => {
    await updateOrderStatus(orderId, status);
  };

  const persianStatus = (status) => {
    switch(status) {
      case 'Pending': return 'در انتظار تایید';
      case 'Processing': return 'در حال آماده‌سازی';
      case 'Shipped': return 'ارسال شده';
      case 'Delivered': return 'تحویل داده شده';
      case 'Cancelled': return 'لغو شده';
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده جزئیات سفارش لطفا وارد حساب کاربری شوید</p>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت اطلاعات سفارش...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">خطا در دریافت اطلاعات سفارش</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => getOrderDetails(orderId)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="text-gray-400 text-4xl mb-4">🍽️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">سفارش یافت نشد</h2>
          <p className="text-gray-600 mb-6">سفارش مورد نظر وجود ندارد یا ممکن است حذف شده باشد</p>
          <Link
            to="/order-foods"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            بازگشت به سفارشات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rtl min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/order-foods"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <RiArrowRightLine className="transform rotate-180 ml-1" />
            <span>بازگشت به سفارشات</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">جزئیات سفارش غذا</h1>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center mb-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[selectedOrder.orderStatus]}`}>
                  {persianStatus(selectedOrder.orderStatus)}
                </span>
                <span className="text-gray-500 text-sm mr-2">
                  کد سفارش: #{selectedOrder._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">سفارش غذا</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-lg font-bold text-gray-800">
                {selectedOrder.totalAmount.toLocaleString('fa-IR')} <span className="text-sm font-normal">تومان</span>
              </p>
              <p className="text-gray-500 text-sm text-left mt-1">
                {new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-700 mb-3">موارد سفارش:</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="bg-white p-1 rounded-md shadow-sm mr-3">
                      <img 
                        src={item.food?.image || "https://cdn-icons-png.flaticon.com/512/5787/5787016.png"} 
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-gray-500 text-sm">آشپز: {item.cook?.name || 'نامشخص'}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-700">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</p>
                    <p className="text-gray-500 text-sm">تعداد: {item.quantity.toLocaleString('fa-IR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <RiMapPinLine className="ml-1 text-blue-600" />
              اطلاعات تحویل
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-medium">آدرس:</span> {selectedOrder.deliveryAddress.text}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">تلفن تماس:</span> {selectedOrder.contactNumber}
              </p>
              {selectedOrder.description && (
                <p className="text-gray-700">
                  <span className="font-medium">توضیحات:</span> {selectedOrder.description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <RiCalendarLine className="ml-1 text-blue-600" />
              زمان تحویل
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-medium">تاریخ تحویل:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString('fa-IR')}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">ساعت تحویل:</span> {selectedOrder.deliveryTime}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">وضعیت پرداخت:</span> 
                <span className={`px-2 py-0.5 rounded-full text-xs mr-2 ${
                  selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  selectedOrder.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedOrder.paymentStatus === 'Paid' ? 'پرداخت شده' :
                   selectedOrder.paymentStatus === 'Pending' ? 'در انتظار پرداخت' :
                   'پرداخت ناموفق'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">عملیات سفارش</h3>
          <div className="flex flex-wrap gap-3">
            {selectedOrder.orderStatus === 'Pending' && (
              <>
                <button
                  onClick={handleConfirmOrder}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center transition-colors"
                >
                  <RiCheckboxCircleLine className="ml-1" />
                  تایید سفارش
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center transition-colors"
                >
                  <RiCloseCircleLine className="ml-1" />
                  لغو سفارش
                </button>
              </>
            )}
            
            {selectedOrder.orderStatus === 'Processing' && (
              <button
                onClick={() => handleStatusUpdate('Shipped')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center transition-colors"
              >
                <RiArrowRightLine className="ml-1" />
                ثبت ارسال سفارش
              </button>
            )}
            
            {selectedOrder.orderStatus === 'Shipped' && (
              <button
                onClick={() => handleStatusUpdate('Delivered')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center transition-colors"
              >
                <RiCheckboxCircleLine className="ml-1" />
                ثبت تحویل سفارش
              </button>
            )}

            <Link
              to="/support"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center transition-colors"
            >
              {/* <RiCustomerService2Line className="ml-1" /> */}
              <RiCheckboxCircleLine className="ml-1" />
              درخواست پشتیبانی
            </Link>
          </div>
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

export default OrderFoodPage;