// src/SupportPage.js
import React, { useState, useEffect } from 'react';
import { RiTentLine, RiUser3Fill, RiSearchLine, RiCalendar2Line, RiLogoutBoxRLine, RiHeart2Line, RiBankCard2Line, RiNotificationLine, RiCustomerService2Line, RiCameraFill } from "@remixicon/react";
import { FaCamera } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import HeaderPages from '../components/HeaderPages';
import Footer from "../components/Footer"

import { IoIosCamera } from "react-icons/io";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const SupportPage = () => {


  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null
  const navigate = useNavigate();
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


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send the data to a server)
    toast.info('پیام شما با موفقیت ارسال شد', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

    // Clear form after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

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
                <span className="mr-2 text-gray-400"><RiNotificationLine /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">لیست اعلان ها</span>
              </li>
            </Link>
          </div>

          <div className='my-6 px-8'>
            <Link to="/support">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiCustomerService2Line className='text-blue-800' /></span>
                <span style={{ fontSize: '18px' }} className="mr-4 text-blue-800">پشتیبانی</span>
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
        <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg mx-6">
          <div className="w-full flex items-center justify-center">
            <div className="bg-white p-2 rounded-lg w-full flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/128/3355/3355341.png" className='text-center mb-6' alt="support" />
              <h3 className='font-bold mt-4'>برای رفع مشکل خود با ما تماس حاصل نمایید</h3>
              <span className='py-3 px-6 my-2 text-xl bg-gray-200 rounded-full font-bold'>0951xxxxxxx</span>
              <span className='py-3 px-6 my-2 text-xl bg-gray-200 rounded-full font-bold'>0951xxxxxxx</span>
              <form onSubmit={handleSubmit} className="space-y-10">

                <h1 className='font-bold my-4'>و یا مشکل خود را با ما در میان بگذارید تا در سریع ترین زمان با شما تماس بگیریم</h1>
                <div>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    rows="5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none"
                >
                  ارسال پیام
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default SupportPage;
