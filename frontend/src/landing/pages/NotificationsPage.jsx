// src/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { RiTentLine, RiUser3Fill, RiSearchLine, RiCalendar2Line, RiLogoutBoxRLine, RiHeart2Line, RiBankCard2Line, RiNotificationLine, RiCustomerService2Line, RiCameraFill, RiCloseLine } from "@remixicon/react";
import { FaCamera } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import HeaderPages from '../components/HeaderPages';
import Footer from "../components/Footer"

import { IoIosCamera } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NotificationsPage = () => {

  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [user, setUser] = useState('')

  useEffect(() => {
    axios.get('/api/users/me', {
      headers: {
        'authorization': 'Bearer ' + userToken
      }
    })
      .then((res) => {
        setUser(res.data.user)
      })
      .catch((err) => console.error(err));
  }, [])


  function logout() {
    localStorage.removeItem("userToken")
    navigate('/');
    window.location.reload()

  }


  return (
    <>
      <HeaderPages />
      <div className="flex flex-col md:flex-row p-4 rtl mt-4">

        {/* User Basic Information Column 1 */}
        <div className="w-full md:w-1/4 py-6 bg-white border border-gray-200 rounded-lg shadow mb-4 md:mb-0">
          <div className="mb-8 px-4 text-center mx-auto flex justify-center">
            <div className="relative" style={{ width: '160px', height: '160px' }}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
                alt="user"
                className="object-cover rounded-full mx-auto"
              />
              <div className="absolute bottom-8 left-0 p-2 bg-white cursor-pointer shadow shadow-full rounded-full">
                <IoIosCamera className='text-blue-800 h-8 w-8' />
              </div>

              <p className="text-gray-900 text-center mt-2">{name ? user.name : user.phone}</p>
            </div>
          </div>
          <div className='border'></div>
          <div className='my-6 px-8'>
            <Link to="/profile">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiUser3Fill /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">حساب کاربری</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/bookings">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiCalendar2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">رزروهای من</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/favorites">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiHeart2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4"> لیست علاقه مندی ها</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/bank">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiBankCard2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">اطلاعات حساب بانکی</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/notifications">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiNotificationLine className='text-blue-800' /></span>
                <span style={{ fontSize: '18px' }} className="mr-4 text-blue-800">لیست اعلان ها</span>
              </li>
            </Link>
          </div>

          <div className='my-6 px-8'>
            <Link to="/support">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiCustomerService2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">پشتیبانی</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiLogoutBoxRLine /></span>
                <button className="mx-4" onClick={logout}>خروج</button>
              </li>
            </Link>
          </div>
        </div>

        {/* Update User Information Column 2 */}
        <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow mx-6">
          <div className="w-full flex justify-between rounded overflow-hidden border bg-gray-200 my-4 py-4">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">3 مرداد 1403 - 01:12:54</div>
              <p className="text-gray-700 text-base">
                رد رزرو: رزرو شماره 564805 برای اقامتگاه رزرو سوئیت جنگلی 4 توسط شما رد شد.
              </p>
            </div>
            <div className="px-6 my-auto">
              <a href="#" className="mx-4 font-bold py-4 px-6 rounded">
                <RiCloseLine />
              </a>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default NotificationsPage;
