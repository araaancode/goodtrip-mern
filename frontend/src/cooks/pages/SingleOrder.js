// pages/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookAuthStore } from '../stores/authStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select  from 'react-tailwindcss-select';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { cook, isCookAuthenticated } = useCookAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Status options for the dropdown
  const statusOptions = [
    { 
      value: 'Pending', 
      label: 'در انتظار',
      icon: (
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'Processing', 
      label: 'در حال آماده سازی',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      value: 'Shipped', 
      label: 'ارسال شده',
      icon: (
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    { 
      value: 'Delivered', 
      label: 'تحویل داده شده',
      icon: (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 'Cancelled', 
      label: 'لغو شده',
      icon: (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  ];

  // Status configurations for display
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'در انتظار' },
    Processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'در حال آماده سازی' },
    Shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'ارسال شده' },
    Delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'تحویل داده شده' },
    Cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'لغو شده' }
  };

  const paymentStatusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'در انتظار پرداخت' },
    Paid: { color: 'bg-green-100 text-green-800 border-green-200', label: 'پرداخت شده' },
    Failed: { color: 'bg-red-100 text-red-800 border-red-200', label: 'پرداخت ناموفق' }
  };

  // Custom styles for the select component
  const selectStyles = {
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      zIndex: 50
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0.5rem',
      maxHeight: '200px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#e5e7eb'
      }
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      minHeight: '48px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: '#374151'
      }
    })
  };

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cooks/foods/order-foods/${orderId}`, {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        setOrder(response.data.order);
        const currentStatus = response.data.order.orderStatus;
        const foundOption = statusOptions.find(option => option.value === currentStatus);
        setSelectedStatus(foundOption || null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.response?.data?.msg || 'خطا در دریافت اطلاعات سفارش');
      navigate('/cook/orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (newStatus) => {
    if (!newStatus) return;
    
    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `/api/cooks/foods/order-foods/${orderId}/change-status`,
        { orderStatus: newStatus.value },
        {
          withCredentials: true
        }
      );

      if (response.data.status === 'success') {
        setOrder(prev => ({ ...prev, orderStatus: newStatus.value }));
        setSelectedStatus(newStatus);
        toast.success('وضعیت سفارش با موفقیت به روز شد');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.msg || 'خطا در به روزرسانی وضعیت سفارش');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  // Safe value getter
  const getSafeValue = (obj, path, defaultValue = '---') => {
    try {
      const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
      return value || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  useEffect(() => {
    if (!isCookAuthenticated) {
      navigate('/cook/login');
      return;
    }
    fetchOrderDetails();
  }, [orderId, isCookAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 text-lg">در حال دریافت اطلاعات سفارش...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">سفارش یافت نشد</h2>
          <p className="text-gray-600 mb-6">متأسفانه اطلاعات سفارش مورد نظر در دسترس نمی باشد</p>
          <button 
            onClick={() => navigate('/cook/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            بازگشت به لیست سفارشات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/cook/orders')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به لیست سفارشات
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  سفارش #{order._id ? order._id.slice(-8).toUpperCase() : '---'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {order.createdAt ? formatDate(order.createdAt) : '---'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig[order.orderStatus]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                  {statusConfig[order.orderStatus]?.label || order.orderStatus || '---'}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${paymentStatusConfig[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                  {paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus || '---'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Notes */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  آیتم های سفارش
                </h2>
              </div>
              
              <div className="p-6">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item._id || index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-blue-50/30 transition-colors duration-200">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden">
                            {getSafeValue(item, 'food.image') ? (
                              <img 
                                src={getSafeValue(item, 'food.image')} 
                                alt={getSafeValue(item, 'name', 'آیتم سفارش')}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate">{getSafeValue(item, 'name')}</h3>
                            <p className="text-sm text-gray-600 mt-1">قیمت واحد: {formatCurrency(getSafeValue(item, 'price', 0))}</p>
                          </div>
                        </div>
                        
                        <div className="text-left ml-4 flex-shrink-0">
                          <p className="font-medium text-gray-900 text-center bg-white px-3 py-1 rounded-lg border border-gray-200">
                            {getSafeValue(item, 'quantity', 0)} عدد
                          </p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            {formatCurrency((getSafeValue(item, 'price', 0) * getSafeValue(item, 'quantity', 0)))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                    </svg>
                    <p className="text-gray-500">هیچ آیتمی در این سفارش وجود ندارد</p>
                  </div>
                )}
                
                {/* Total Amount */}
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200/60">
                  <span className="text-lg font-semibold text-gray-900">مبلغ کل سفارش:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(order.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    توضیحات مشتری
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed bg-blue-50/30 p-4 rounded-lg border border-blue-200/50">
                    {order.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status Update Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  تغییر وضعیت سفارش
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <Select
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                  options={statusOptions}
                  isSearchable={false}
                  isClearable={false}
                  placeholder="انتخاب وضعیت..."
                  primaryColor="blue"
                  classNames={{
                    menuButton: () => 
                      `flex text-sm text-gray-500 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white ${
                        updatingStatus ? 'opacity-50 cursor-not-allowed' : ''
                      }`,
                    menu: "absolute z-50 w-full bg-white shadow-lg border border-gray-200 rounded-xl mt-1 py-2",
                    list: "py-1 text-sm text-gray-700",
                    option: ({ isSelected }) => 
                      `block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition-colors duration-200 ${
                        isSelected ? 'bg-blue-100 text-blue-900' : ''
                      }`
                  }}
                  formatOptionLabel={(data) => (
                    <div className="flex items-center gap-3">
                      {data.icon}
                      <span>{data.label}</span>
                    </div>
                  )}
                  isDisabled={updatingStatus}
                />
                
                <button
                  onClick={() => updateOrderStatus(selectedStatus)}
                  disabled={updatingStatus || !selectedStatus || selectedStatus.value === order.orderStatus}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال به روزرسانی...
                    </>
                  ) : (
                    'به روزرسانی وضعیت'
                  )}
                </button>
                
                {selectedStatus && selectedStatus.value === order.orderStatus && (
                  <p className="text-sm text-yellow-600 text-center bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    این وضعیت در حال حاضر فعال است
                  </p>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  اطلاعات مشتری
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getSafeValue(order, 'user.name', 'م').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{getSafeValue(order, 'user.name')}</p>
                    <p className="text-sm text-gray-600">{getSafeValue(order, 'user.email')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">شماره تماس:</span>
                    <span className="font-medium text-gray-900">{getSafeValue(order, 'contactNumber')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  اطلاعات تحویل
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-orange-50/50 rounded-lg border border-orange-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getSafeValue(order, 'deliveryAddress.text')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">تاریخ سفارش:</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {order.createdAt ? formatDate(order.createdAt) : '---'}
                    </span>
                  </div>
                  
                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <div className="flex justify-between items-center py-2 border-t border-gray-200/60">
                      <span className="text-sm text-gray-600">آخرین بروزرسانی:</span>
                      <span className="font-medium text-gray-900 text-sm">{formatDate(order.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;