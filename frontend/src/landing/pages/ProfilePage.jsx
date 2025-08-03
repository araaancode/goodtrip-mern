// src/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import useUserStore from "../store/userStore"
import useUserAuthStore from "../store/authStore"

// Icons (grouped by source)
import {
  RiUser3Fill,
  RiLogoutBoxRLine,
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line,
} from '@remixicon/react';
import { IoIosCamera } from 'react-icons/io';
import { BsHouses } from "react-icons/bs";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBusSolid } from "react-icons/lia";

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


  // // Update user profile
  const updateUser = async (e) => {
    e.preventDefault();

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

  };

  const logoutUser = async () => {
    await logout()
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-col md:flex-row p-4 rtl mt-4 container mx-auto flex-grow">
        {/* User Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow border border-gray-200 mb-4 md:mb-0">
          <div className="p-6 text-center">
            <div className="relative mx-auto w-40 h-40">
              <img
                src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
                alt="User profile"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all">
                <IoIosCamera className="text-blue-800 text-xl" />
              </button>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {name ? user.name : user.phone}
            </h3>
          </div>

          <div className="border-t border-gray-200 mx-6"></div>

          <nav className="p-4">
            <ul className="space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiUser3Fill className="text-blue-800 ml-2" />
                  <span className="text-lg">حساب کاربری</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <BsHouses className="ml-2 w-8 h-8" />
                  <span className="text-lg">رزروهای اقامتگاه</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <IoFastFoodOutline className="ml-2 w-8 h-8" />
                  <span className="text-lg">سفارش های غذا</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <LiaBusSolid className="ml-2 w-8 h-8" />
                  <span className="text-lg">بلیط های اتوبوس</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiHeart2Line className="ml-2 w-8 h-8" />
                  <span className="text-lg">لیست علاقه مندی ها</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/bank"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiBankCard2Line className="ml-2 w-8 h-8" />
                  <span className="text-lg">اطلاعات حساب بانکی</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiNotificationLine className="ml-2 w-8 h-8" />
                  <span className="text-lg">لیست اعلان ها</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiCustomerService2Line className="ml-2 w-8 h-8" />
                  <span className="text-lg">پشتیبانی</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 transition-colors"
                >
                  <RiLogoutBoxRLine className="ml-2 w-8 h-8" />
                  <span className="text-lg">خروج</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Profile Form */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow border border-gray-200 md:mr-6">
          <form onSubmit={updateUser} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    نام کاربری
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    شماره همراه
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    کد ملی
                  </label>
                  <input
                    type="text"
                    id="nationalCode"
                    name="nationalCode"
                    defaultValue={nationalCode}
                    onChange={(e) => setNationalCode(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    استان
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    defaultValue={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    شهر
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    defaultValue={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-lg mb-2 font-medium">
                    جنسیت
                  </label>
                  <input
                    type="text"
                    id="gender"
                    name="gender"
                    defaultValue={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                تغییر اطلاعات شخصی
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProfilePage;