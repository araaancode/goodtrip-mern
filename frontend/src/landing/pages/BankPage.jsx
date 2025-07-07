// src/BankPage.js
import React, { useState, useEffect } from 'react';
import { RiTentLine, RiUser3Fill, RiSearchLine, RiCalendar2Line, RiLogoutBoxRLine, RiHeart2Line, RiBankCard2Line, RiNotificationLine, RiCustomerService2Line, RiCameraFill } from "@remixicon/react";
import { FaCamera } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams,useNavigate } from "react-router-dom";
import axios from "axios"
import HeaderPages from '../components/HeaderPages';
import Footer from "../components/Footer"

import { IoIosCamera } from "react-icons/io";
import { LiaPlusSolid } from "react-icons/lia";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BankPage = () => {

  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null
  const navigate = useNavigate();

  const [name, setName] = useState('')
  const [user, setUser] = useState('')
  const [isClicked, setIsClicked] = useState(false)

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
    // location.reload()
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
                <span className="mr-2 text-gray-400"><RiBankCard2Line className='text-blue-800' /></span>
                <span style={{ fontSize: '18px' }} className="mr-4 text-blue-800">اطلاعات حساب بانکی</span>
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
        {isClicked ? (
          <div className="w-full md:w-3/4 py-6 px-6 bg-white border border-gray-200 mt-0 rounded-lg shadow mx-6 h-50">
            <h1 className='px-8 mt-12 mb-2 text-blue-800 text-xl font-bold'>افزودن اطلاعات حساب</h1>
            <p className='px-8 my-2'>افزودن اطلاعات حساب
              جهت واریز مبالغ اجاره اقامتگاهتان اطلاعات مربوط به حساب بانکی خود را وارد نمایید</p>
            <div className="flex w-full justify-center items-center">
              <form className="bg-white ounded px-8 pt-6 pb-8 mb-4 w-full">
                {/* First Row */}
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide rounded-md font-bold mb-2"
                      htmlFor="firstName"
                    >
                      نام و نام خانوادگی <span className='text-red-500'>*</span>
                    </label>
                    <input
                      className="block w-full border border-gray-400 rounded-md px-4 leading-tight focus:outline-none"
                      id="first-name"
                      type="text"
                      style={{ borderRadius: '5px', padding: '15px', height: '60px' }}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide rounded-md font-bold mb-2"
                      htmlFor="lastName"
                    >
                      شماره کارت<span className='text-red-500'>*</span>
                    </label>
                    <input
                      className="block w-full border border-gray-400 rounded-md px-4 leading-tight focus:outline-none"
                      id="firstName"
                      type="text"
                      style={{ borderRadius: '5px', padding: '15px', height: '60px' }}

                    />
                  </div>
                </div>
                {/* Second Row */}


                <div className="w-full" dir='ltr'>
                  <label dir='rtl'
                    className="block uppercase tracking-wide rounded-md font-bold mb-2"
                    htmlFor="lastName"
                  >
                    شماره شبا<span className='text-red-500 mr-2'>*</span>
                  </label>
                  <div className="flex items-center">
                    <span style={{ padding: '15px', height: '60px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} className="inline-flex items-center px-4 border border-gray-400">
                      IR
                    </span>
                    <input style={{ padding: '15px', height: '60px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} type="text" className="rounded-none border border-gray-400 block w-full focus:outline-none" />
                  </div>

                </div>

                <div className="border-t border-blue-800 my-8" />
                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-800 hover:bg-blue-900 text-white font-bold p-6 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    ثبت اطلاعات
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow m-auto h-screen mx-6">
            <div className="flex items-center justify-center h-screen">
              <div className="bg-whit p-8 text-center">
                <div style={{ width: '150px', height: '150px', margin: '20px auto' }} className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                  <RiBankCard2Line className="text-gray-400 w-12 h-12 " />
                </div>
                <h2 style={{ fontSize: '20px' }} className="text-gray-500 mb-2">هنوز هیچ حساب بانکی وجود ندارد</h2>
                <h2 style={{ fontSize: '20px' }} className="text-gray-500">جهت دریافت وجه، اطلاعات حساب خود را اضافه کنید</h2>
                <button onClick={(e) => setIsClicked(true)} style={{ borderRadius: "10px", margin: '50px 0' }} className="bg-blue-800 text-white py-4 px-8 hover:bg-blue-900 font-bold transition duration-300">
                  + افزودن اطلاعات حساب
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default BankPage;
