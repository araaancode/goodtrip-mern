// src/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useUserStore from "../store/userStore";
import useUserAuthStore from "../store/authStore";

// Icons
import {
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line,
  RiMenuLine,
  RiCloseLine
} from '@remixicon/react';
import { IoIosCamera } from 'react-icons/io';
import { BsHouses } from "react-icons/bs";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBusSolid } from "react-icons/lia";

// React Icons from pi package for form inputs (using outline icons)
import {
  PiUser,
  PiUserCircle,
  PiEnvelope,
  PiPhone,
  PiIdentificationCard,
  PiMapPinArea,
  PiBuildings,
  PiGenderIntersex
} from 'react-icons/pi';

const ProfilePage = () => {
  const navigate = useNavigate();

  // store hooks
  const { updateProfile } = useUserStore()
  const { user, logout } = useUserAuthStore()

  // User state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // fill the form
  useEffect(() => {
    setName(user.name)
    setPhone(user.phone)
    setEmail(user.email)
    setUsername(user.username)
    setNationalCode(user.nationalCode)
    setProvince(user.province)
    setCity(user.city)
    setGender(user.gender)
  }, [user])

  // Update user profile
  const updateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await updateProfile(name, phone, email, username, nationalCode, province, city, gender)

      toast.success(data.msg, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error('خطایی رخ داده است. لطفا دوباره تلاش کنید.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoutUser = async () => {
    await logout()
    navigate('/');
  };

  // Navigation items
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <BsHouses className="ml-2 w-5 h-5" />, text: 'رزروهای اقامتگاه', link: '/bookings' },
    { id: 'foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارش های غذا', link: '/order-foods' },
    { id: 'bus', icon: <LiaBusSolid className="ml-2 w-5 h-5" />, text: 'بلیط های اتوبوس', link: '/bus-tickets' },
    { id: 'favorites', icon: <RiHeart2Line className="ml-2 w-5 h-5" />, text: 'لیست علاقه مندی ها', link: '/favorites' },
    { id: 'bank', icon: <RiBankCard2Line className="ml-2 w-5 h-5" />, text: 'اطلاعات حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <RiNotificationLine className="ml-2 w-5 h-5" />, text: 'لیست اعلان ها', link: '/notifications' },
    { id: 'support', icon: <RiCustomerService2Line className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">پنل کاربری</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 z-50 relative"
          >
            {isMobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* User Sidebar - Mobile Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

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
                {name || user.phone}
              </h3>
              <p className="text-gray-500 mt-1 text-sm md:text-base truncate">{email || 'ایمیل ثبت نشده'}</p>
            </div>

            <div className="border-t border-gray-100 mx-4"></div>

            <nav className="p-2 md:p-4">
              <ul className="space-y-1 md:space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
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
                    <span className="text-right flex-1 text-sm md:text-base">خروج</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profile Form */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="p-4 md:p-6 lg:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b border-gray-100">اطلاعات شخصی</h2>

                <form onSubmit={updateUser}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {/* Column 1 */}
                    <div className="space-y-4 md:space-y-5">
                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          نام و نام خانوادگی
                        </label>
                        <div className="relative">
                          <PiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="نام خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          نام کاربری
                        </label>
                        <div className="relative">
                          <PiUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="username"
                            name="username"
                            defaultValue={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="نام کاربری خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          ایمیل
                        </label>
                        <div className="relative">
                          <PiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="ایمیل خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          شماره همراه
                        </label>
                        <div className="relative">
                          <PiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            defaultValue={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="شماره همراه خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4 md:space-y-5">
                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          کد ملی
                        </label>
                        <div className="relative">
                          <PiIdentificationCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="nationalCode"
                            name="nationalCode"
                            defaultValue={nationalCode}
                            onChange={(e) => setNationalCode(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="کد ملی خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          استان
                        </label>
                        <div className="relative">
                          <PiMapPinArea className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="province"
                            name="province"
                            defaultValue={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="استان خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          شهر
                        </label>
                        <div className="relative">
                          <PiBuildings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            id="city"
                            name="city"
                            defaultValue={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                            placeholder="شهر خود را وارد کنید"
                            style={{borderRadius:'8px'}}
                          />
                        </div>
                      </div>

                      <div className="form-group relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          جنسیت
                        </label>
                        <div className="relative">
                          <PiGenderIntersex className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                          <select
                            id="gender"
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full p-3 md:p-3.5 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200 appearance-none"
                            style={{borderRadius:'8px'}}
                          >
                            <option value="">انتخاب جنسیت</option>
                            <option value="male">مرد</option>
                            <option value="female">زن</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 md:py-3 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-md flex items-center text-sm md:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          در حال پردازش...
                        </>
                      ) : 'تغییر اطلاعات شخصی'}
                    </button>
                  </div>
                </form>
              </div>
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

export default ProfilePage;