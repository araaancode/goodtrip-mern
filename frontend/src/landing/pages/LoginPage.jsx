import React, { useState } from 'react';
import { RiLoader2Fill, RiEye2Line, RiEyeCloseLine, RiPhoneLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  // Validation functions remain the same
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

  // handleLogin and handleVerify functions remain the same
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const loginResult = await login(formData.phone, formData.password);

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
        await sendOtp(loginResult.phone);
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
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center h-screen" 
           style={{ backgroundImage: 'url(https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg)' }}>
        <div className="h-full bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">به پنل کاربری خوش آمدید</h1>
            <p className="text-xl">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
          </div>
        </div>
      </div>
      
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {isLogin ? (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <MdOutlineSms className="w-8 h-8 text-blue-900" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">تایید کد</h2>
                <p className="mt-2 text-gray-600">کد ارسال شده به شماره {formData.phone} را وارد کنید</p>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    کد یکبار مصرف
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineSms className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      value={formData.code}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="12345"
                    />
                  </div>
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? <Spinner /> : 'تایید کد'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="w-8 h-8 text-blue-900"
                  >
                    <path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path>
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">ورود به حساب کاربری</h2>
                <p className="mt-2 text-gray-600">لطفا اطلاعات خود را وارد کنید</p>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تلفن
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiPhoneLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="09123456789"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    گذرواژه
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {passwordVisible ? (
                        <RiEye2Line className="h-5 w-5 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                      ) : (
                        <RiEyeCloseLine className="h-5 w-5 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility} />
                      )}
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  <div className="flex justify-end mt-2">
                    <a href="/forgot-password" className="text-sm text-blue-900 ">
                      گذرواژه خود را فراموش کرده‌اید؟
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? <RiLoader2Fill className="animate-spin h-5 w-5" /> : 'ورود'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  حساب ندارید؟{' '}
                  <a href="/register" className="font-medium text-blue-900 ">
                    ثبت نام کنید
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;