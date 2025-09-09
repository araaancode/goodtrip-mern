// src/pages/FavoritesPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiHeartFill,
  RiHotelLine,
  RiRestaurantLine,
  RiBusLine,
  RiMapPinLine,
  RiStarFill,
  RiDeleteBinLine
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
const mockFavorites = [
  {
    _id: '1',
    type: 'house',
    name: 'ویلای زیبا در شمال',
    price: 450000,
    location: 'نوشهر، مازندران',
    rating: 4.5,
    reviewCount: 24,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80'
  },
  {
    _id: '2',
    type: 'house',
    name: 'آپارتمان مدرن در تهران',
    price: 320000,
    location: 'تهران، تجریش',
    rating: 4.2,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80'
  },
  {
    _id: '3',
    type: 'food',
    name: 'پیتزا مخصوص',
    price: 85000,
    description: 'پیتزا با پنیر فراوان و قارچ تfresh',
    rating: 4.7,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=481&q=80'
  },
  {
    _id: '4',
    type: 'bus',
    name: 'اتوبوس VIP تهران-مشهد',
    price: 250000,
    origin: 'تهران',
    destination: 'مشهد',
    company: 'سیر و سفر',
    rating: 4.3,
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=869&q=80'
  }
];

// Mock user authentication
const useMockAuth = () => {
  return {
    user: {
      name: 'کاربر مهمان',
      phone: '09123456789',
      avatar: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'
    },
    isAuthenticated: true,
    logout: () => {
      toast.info('عملیات خروج انجام شد');
    }
  };
};

// Mock favorites store
const useMockFavoritesStore = () => {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [loading, setLoading] = useState(false);
  
  const fetchFavorites = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const removeFavorite = (itemId, type) => {
    return new Promise((resolve) => {
      setFavorites(favorites.filter(item => item._id !== itemId));
      resolve();
    });
  };
  
  return {
    favorites,
    loading,
    error: null,
    fetchFavorites,
    removeFavorite
  };
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Use mock stores instead of the missing ones
  const { favorites, loading, fetchFavorites, removeFavorite } = useMockFavoritesStore();
  const { user, isAuthenticated, logout } = useMockAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  const handleRemoveFavorite = async (itemId, type) => {
    try {
      await removeFavorite(itemId, type);
      toast.success('از علاقه‌مندی‌ها حذف شد', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true
      });
    } catch (error) {
      toast.error('خطا در حذف از علاقه‌مندی‌ها', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true
      });
    }
  };

  const logoutUser = async () => {
    await logout();
    navigate('/');
  };

  // Filter favorites based on category and search term
  const filteredFavorites = favorites.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group favorites by type
  const favoritesByType = {
    houses: filteredFavorites.filter(item => item.type === 'house'),
    foods: filteredFavorites.filter(item => item.type === 'food'),
    buses: filteredFavorites.filter(item => item.type === 'bus')
  };

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

  const renderHouseCard = (house) => (
    <motion.div
      key={house._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="relative">
        <img
          src={house.image}
          alt={house.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => handleRemoveFavorite(house._id, 'house')}
          className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
        >
          <RiHeartFill className="text-red-500" size={18} />
        </button>
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
          {house.price?.toLocaleString('fa-IR')} تومان
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{house.name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <RiMapPinLine size={16} className="ml-1" />
          <span className="text-sm">{house.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <RiStarFill
                key={star}
                size={16}
                className={star <= Math.floor(house.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-600 mr-2">({house.reviewCount})</span>
          </div>
          <button
            onClick={() => navigate(`/houses/${house._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
          >
            مشاهده
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderFoodCard = (food) => (
    <motion.div
      key={food._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="relative">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => handleRemoveFavorite(food._id, 'food')}
          className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
        >
          <RiHeartFill className="text-red-500" size={18} />
        </button>
        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
          {food.price?.toLocaleString('fa-IR')} تومان
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{food.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {food.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <RiStarFill
                key={star}
                size={16}
                className={star <= Math.floor(food.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-600 mr-2">({food.reviewCount})</span>
          </div>
          <button
            onClick={() => navigate(`/foods/${food._id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
          >
            سفارش
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderBusCard = (bus) => (
    <motion.div
      key={bus._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="relative">
        <img
          src={bus.image}
          alt={bus.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => handleRemoveFavorite(bus._id, 'bus')}
          className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
        >
          <RiHeartFill className="text-red-500" size={18} />
        </button>
        <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
          {bus.price?.toLocaleString('fa-IR')} تومان
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2">{bus.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <RiMapPinLine size={16} className="ml-1" />
          <span className="text-sm">{bus.origin} → {bus.destination}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-3 text-sm">
          <RiBusLine size={16} className="ml-1" />
          <span>{bus.company}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <RiStarFill
                key={star}
                size={16}
                className={star <= Math.floor(bus.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-600 mr-2">({bus.reviewCount})</span>
          </div>
          <button
            onClick={() => navigate(`/buses/${bus._id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
          >
            رزرو
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده علاقه‌مندی‌ها لطفاً وارد حساب کاربری شوید</p>
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

  if (loading && !favorites.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت علاقه‌مندی‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">علاقه‌مندی‌ها</h1>
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
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'favorites' 
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">علاقه‌مندی‌های شما</h2>
                  <p className="text-gray-500 text-sm mt-1">مدیریت موارد مورد علاقه شما</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {favorites.length} مورد
                  </span>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <RiSearchLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو در علاقه‌مندی‌ها..."
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-right transition-colors duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedCategory === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    همه
                  </button>
                  <button
                    onClick={() => setSelectedCategory('house')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedCategory === 'house' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    اقامتگاه‌ها
                  </button>
                  <button
                    onClick={() => setSelectedCategory('food')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedCategory === 'food' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    غذاها
                  </button>
                  <button
                    onClick={() => setSelectedCategory('bus')}
                    className={`px-4 py-2 rounded-xl transition-colors duration-300 ${
                      selectedCategory === 'bus' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    اتوبوس‌ها
                  </button>
                </div>
              </div>

              {filteredFavorites.length > 0 ? (
                <div className="space-y-6">
                  {/* Houses Section */}
                  {favoritesByType.houses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <RiHotelLine className="ml-2 text-blue-600" />
                        اقامتگاه‌ها ({favoritesByType.houses.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                          {favoritesByType.houses.map(renderHouseCard)}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Foods Section */}
                  {favoritesByType.foods.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <RiRestaurantLine className="ml-2 text-green-600" />
                        غذاها ({favoritesByType.foods.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                          {favoritesByType.foods.map(renderFoodCard)}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Buses Section */}
                  {favoritesByType.buses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <RiBusLine className="ml-2 text-purple-600" />
                        اتوبوس‌ها ({favoritesByType.buses.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                          {favoritesByType.buses.map(renderBusCard)}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RiHeartFill className="text-red-500 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mt-4">موردی یافت نشد</h3>
                    <p className="text-gray-500 mt-2">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'هیچ موردی با فیلترهای انتخاب شده مطابقت ندارد' 
                        : 'شما هنوز هیچ موردی به علاقه‌مندی‌ها اضافه نکرده‌اید'}
                    </p>
                    {(searchTerm || selectedCategory !== 'all') ? (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="inline-block mt-6 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                      >
                        حذف فیلترها
                      </button>
                    ) : (
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => navigate('/houses')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                        >
                          مشاهده اقامتگاه‌ها
                        </button>
                        <button
                          onClick={() => navigate('/foods')}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                        >
                          مشاهده غذاها
                        </button>
                        <button
                          onClick={() => navigate('/buses')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                        >
                          مشاهده اتوبوس‌ها
                        </button>
                      </div>
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

export default FavoritesPage;