import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Spinner from "../components/Spinner"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUserSmileLine, RiUser2Line, RiMailLine, RiLoader2Fill, RiUser5Line } from "@remixicon/react"
import { MdOutlineSms } from "react-icons/md";

const LoginPage = () => {

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')


  const [errorPhoneMessage, setErrorPhoneMessage] = useState("")
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("")
  const [errorNameMessage, setErrorNameMessage] = useState("")
  const [errorUsernameMessage, setErrorUsernameMessage] = useState("")
  const [errorEmailMessage, setErrorEmailMessage] = useState("")

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  const navigate = useNavigate()


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const register = (e) => {
    e.preventDefault()

    if (phone && password && name && username && email) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }


      axios.post('/api/users/auth/register', { phone, password, name, username, email }, config).then((data) => {
        console.log(data.data.msg);
        toast.success(data.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }).catch((errMsg) => {
        console.log(errMsg);
        toast.error(errMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })


    } else {
      toast.error('!!لطفا همه فیلدها را وارد کنید', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }



  return (
    <div dir="rtl" className="flex justify-center items-center h-screen bg-gray-50 shadow-md">
      <div className="w-7/12 px-10 space-y-2 bg-white rounded border">
        <div className='flex flex-col bg-white px-4 sm:px-2 md:px-4 lg:px-8 py-4 w-full max-w-md mx-auto my-1'>
          <div className="self-center text-xl sm:text-2xl uppercase text-gray-800">
            <div className="w-12 h-12 mx-3 bg-white rounded-full">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
            </div>
          </div>
          <div className="relative mt-6 h-px bg-gray-300">
            <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
              <span className="bg-white px-4 text-xs text-gray-500 uppercase"> ثبت نام در سایت  </span>
            </div>
          </div>
        </div>
        <p className='text-center text-gray-500' style={{ marginBottom: '30px' }}>برای ثبت نام اطلاعات خود را وارد کنید. </p>
        <form className="space-y-2 mt-4" onSubmit={register}>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* name */}
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام و نام خانوادگی</label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RiUser2Line />
                  </div>
                  <input style={{ borderRadius: '5px' }} type="text" value={name}
                    onChange={handleNameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام و نام خانوادگی" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorNameMessage ? errorPhoneMessage : ""}</span>
              </div>
              {/* username */}
              <div className="flex flex-col mb-4">
                <label htmlFor="username" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام کاربری</label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RiUser5Line />
                  </div>
                  <input style={{ borderRadius: '5px' }} type="text" value={username}
                    onChange={handleUsernameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام کاربری" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorUsernameMessage ? errorUsernameMessage : ""}</span>
              </div>
              {/* phone */}
              <div className="flex flex-col mb-4">
                <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RiPhoneLine />
                  </div>
                  <input style={{ borderRadius: '5px' }} type="text" value={phone}
                    onChange={handlePhoneChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
              </div>
              {/* email */}
              <div className="flex flex-col mb-4">
                <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">ایمیل</label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RiMailLine />
                  </div>
                  <input style={{ borderRadius: '5px' }} type="text" value={email}
                    onChange={handleEmailChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="ایمیل" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorEmailMessage ? errorEmailMessage : ""}</span>
              </div>
            </div>
            {/* password */}
            <div className="flex flex-col mb-1">
              <div className="relative">
                <label className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600" htmlFor="password">
                  گذرواژه
                </label>

                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  onChange={handlePasswordChange}
                  value={password}
                  className="w-full px-4 py-2 border border-gray-400 placeholder-gray-400 rounded-sm focus:outline-none focus:border-blue-800"
                  placeholder="گذرواژه"
                  style={{ borderRadius: '5px' }}
                />

                <div
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 left-3 flex items-center cursor-pointer top-6"
                >
                  {passwordVisible ? (
                    <RiEye2Line className='text-gray-400' />
                  ) : (
                    <RiEyeCloseLine className='text-gray-400' />
                  )}
                </div>
                <span className='text-red-500 relative text-sm'>{errorPasswordMessage ? errorPasswordMessage : ""}</span>

              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded mb-2 mt-8 p-2 text-white bg-blue-800 hover:bg-blue-900"
            >
              {loading ? <RiLoader2Fill /> : 'ثبت نام'}
            </button>
            <p className='text-sm text-gray-800'>حساب دارید؟ <a href='/login' className='hover:text-blue-900 hover:cursor-pointer'>ورود </a></p>
          </div>

        </form>
      </div>

      <ToastContainer />
    </div >
  );
};

export default LoginPage;