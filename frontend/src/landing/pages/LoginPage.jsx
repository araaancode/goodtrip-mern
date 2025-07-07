import React, { useState } from 'react';
import { RiLoader2Fill } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine } from "@remixicon/react";
import { MdOutlineSms } from "react-icons/md";
import useUserAuthStore from '../store/authStore';

const LoginPage = () => {
  const { login, verify, sendOtp, isAuthenticated, msg, error } = useUserAuthStore();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    code: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    code: ''
  });

  const navigate = useNavigate();

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone) return 'شماره تلفن الزامی است';
    if (!/^(\+98|0)?9\d{9}$/.test(phone)) return 'شماره تلفن معتبر نیست';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'گذرواژه الزامی است';
    if (password.length < 8) return 'گذرواژه باید حداقل 8 کاراکتر باشد';
    return '';
  };

  const validateCode = (code) => {
    if (!code) return 'کد تایید الزامی است';
    if (code.length !== 5) return 'کد تایید باید 5 رقمی باشد';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change
    if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    } else if (name === 'code') {
      setErrors(prev => ({ ...prev, code: validateCode(value) }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = {
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);
    return !newErrors.phone && !newErrors.password;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const loginResult = await login(formData.phone, formData.password);

      console.log(loginResult)

      if (loginResult?.status === "success") {

        toast.info('کد یکبار مصرف ارسال شد', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsLogin(true);
        await sendOtp(loginResult.phone)

      } else {
        toast.error(loginResult?.msg || 'خطایی وجود دارد', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(error.message || 'خطا در ورود. لطفا مجددا تلاش کنید', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const codeError = validateCode(formData.code);
    if (codeError) {
      setErrors(prev => ({ ...prev, code: codeError }));
      return;
    }

    try {
      setLoading(true);
      await verify(formData.phone, formData.code);

      toast.success('ورود با موفقیت انجام شد', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/');
    } catch (error) {
      toast.error(error.message || 'خطا در تایید کد. لطفا مجددا تلاش کنید', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex justify-center items-center h-screen bg-gray-50 shadow-md">
      {isLogin ? (
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded border">
          <h2 className="text-xl font-bold text-gray-700">تایید کد</h2>
          <p className='text-gray-500 mt-1 mb-4'>کد ارسال شده را در زیر وارد کنید.</p>
          <form className="space-y-4">
            <div className="flex flex-col mb-6">
              <label htmlFor="code" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                کد یکبار مصرف
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <MdOutlineSms className='w-6 h-6 text-gray-400' />
                </div>
                <input
                  style={{ borderRadius: '5px' }}
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border ${errors.code ? 'border-red-500' : 'border-gray-400'
                    } w-full py-2 focus:outline-none focus:border-blue-800`}
                  placeholder="کد یکبار مصرف"
                />
              </div>
              {errors.code && <span className="text-red-500 text-sm mt-1">{errors.code}</span>}
            </div>
            <button
              type="button"
              className="w-full rounded mb-10 p-2 text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? <Spinner /> : 'تایید کد'}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md px-10 space-y-4 bg-white rounded border">
          <div className="flex flex-col bg-white px-4 sm:px-6 md:px-6 lg:px-6 py-6 w-full max-w-md m-auto">
            <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
              <div className="w-12 h-12 mx-3 bg-white rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="remixicon w-12 h-12"
                >
                  <path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path>
                </svg>
              </div>
            </div>

            <div className="relative mt-10 h-px bg-gray-300">
              <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                  ورود به سایت
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-500 mt-1 mb-4">
            برای ورود شماره موبایل خود را وارد کنید.
          </p>
          <form className="space-y-4">
            <div className="flex flex-col mb-6">
              <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                شماره تلفن
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <RiPhoneLine />
                </div>
                <input
                  style={{ borderRadius: '5px' }}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-400'
                    } w-full py-2 focus:outline-none focus:border-blue-800`}
                  placeholder="شماره تلفن"
                />
              </div>
              {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
            </div>
            <div>
              <div className="flex flex-col mb-1">
                <div className="mb-2 relative">
                  <label
                    className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                    htmlFor="password"
                  >
                    گذرواژه
                  </label>

                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-400'
                      } placeholder-gray-400 rounded-sm focus:outline-none focus:border-blue-800`}
                    placeholder="گذرواژه"
                    style={{ borderRadius: '5px' }}
                  />

                  <div
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 left-3 flex items-center cursor-pointer top-6"
                  >
                    {passwordVisible ? (
                      <RiEye2Line className="text-gray-400" />
                    ) : (
                      <RiEyeCloseLine className="text-gray-400" />
                    )}
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-2">{errors.password}</span>
                  )}
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex ml-auto">
                    <a
                      href="/forgot-password"
                      className="inline-flex text-xs font-bold sm:text-sm text-blue-800 hover:text-blue-900"
                    >
                      گذرواژه خود را فراموش کردید؟
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogin}
              type="button"
              className="w-full rounded mb-10 p-2 text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <RiLoader2Fill className="animate-spin mx-auto" /> : 'ورود'}
            </button>
            <p style={{ marginBottom: '20px' }} className="text-sm text-gray-800">
              حساب ندارید؟{' '}
              <a href="/register" className="hover:text-blue-800 hover:cursor-pointer">
                ثبت نام
              </a>
            </p>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;