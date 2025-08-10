import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine } from "@remixicon/react";
import { MdOutlineSms } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOwnerAuthStore } from '../stores/authStore';

function Login() {
  const { login, sendOtp, verifyOtp, isLoading } = useOwnerAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    code: ""
  });
  
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    code: ""
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      setErrors({
        phone: !formData.phone ? "شماره تلفن ضروری است" : "",
        password: !formData.password ? "گذرواژه ضروری است" : ""
      });
      return;
    }

    try {
      await login({ phone: formData.phone, password: formData.password });
      await sendOtp(formData.phone);
      setIsLogin(true);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!formData.code) {
      setErrors(prev => ({ ...prev, code: "کد تایید ضروری است" }));
      return;
    }

    try {
      await verifyOtp({ phone: formData.phone, code: formData.code });
      navigate('/owners/welcome');
    } catch (error) {
      console.error("Verify error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center text-right">
        <div className="card mx-auto w-full max-w-5xl shadow-2xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div className=''>
              <div className="hero min-h-full rounded-l-xl bg-base-200">
                <div className="hero-content p-2">
                  <div className="w-50 px-6 py-4">
                    <h1 className="mb-4 text-center font-bold text-lg"> ورود به پنل مالک</h1>
                    <div className="my-auto">
                      <img 
                        width={500} 
                        height={400} 
                        src="https://irancuisinetours.com/wp-content/uploads/2016/06/cholo-soltani-870x480.jpg" 
                        style={{ borderRadius: '12px' }} 
                        alt="اقامتگاه" 
                        className="inline-block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLogin ? (
              <div className="flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 pt-2 pb-6 w-full max-w-md m-auto">
                <div className="font-medium mt-2 self-center text-xl sm:text-2xl uppercase text-gray-800">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12">
                    <path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path>
                  </svg>
                </div>
                <div className="relative mt-4 h-px bg-gray-300">
                  <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">تایید کد </span>
                  </div>
                </div>
                <form onSubmit={handleVerify}>
                  <p className='text-gray-500 mt-6 mb-10'>کد ارسال شده را در زیر وارد کنید. </p>
                  <div className="flex flex-col mb-2">
                    <label htmlFor="code" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">کد یکبار مصرف</label>
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
                        className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" 
                        placeholder="کد یکبار مصرف" 
                      />
                    </div>
                    <span className='text-red-500 relative text-sm'>{errors.code}</span>
                  </div>
                  <div className="mt-4 w-full">
                    <button 
                      type="submit"
                      className="app-btn-blue w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="px-10 py-1 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <span>تایید کد</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 py-2 w-full max-w-md m-auto">
                <div className="font-medium mt-4 self-center text-xl sm:text-2xl uppercase text-gray-800">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12">
                    <path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path>
                  </svg>
                </div>
                <div className="relative mt-4 h-px bg-gray-300">
                  <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">ورود به پنل مالک </span>
                  </div>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="container mx-auto p-4">
                    <div className="flex flex-col mb-4">
                      <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
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
                          className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" 
                          placeholder="شماره تلفن" 
                        />
                      </div>
                      <span className='text-red-500 relative text-sm'>{errors.phone}</span>
                    </div>

                    <div className="relative mb-4">
                      <label className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600" htmlFor="password">
                        گذرواژه
                      </label>
                      <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                        placeholder="گذرواژه"
                        style={{ borderRadius: '5px' }}
                      />
                      <div
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-2 left-3 flex items-center cursor-pointer top-4"
                      >
                        {passwordVisible ? (
                          <RiEye2Line className='text-gray-400' />
                        ) : (
                          <RiEyeCloseLine className='text-gray-400' />
                        )}
                      </div>
                      <span className='text-red-500 relative text-sm'>{errors.password}</span>

                      <div className="flex items-center mb-6">
                        <div className="flex ml-auto">
                          <Link to="/owners/forgot-password" className="inline-flex text-xs font-bold sm:text-sm text-blue-800 hover:text-blue-900">گذرواژه خود را فراموش کردید؟</Link>
                        </div>
                      </div>
                    </div>

                    <div className="my-2 w-full">
                      <button 
                        type="submit"
                        className="app-btn-blue w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="px-10 py-1 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <span>ورود</span>
                        )}
                      </button>
                    </div>
                    <p className='text-sm text-gray-800'>حساب ندارید؟ <Link to='/owners/register' className='hover:text-blue-900 hover:cursor-pointer'>ثبت نام </Link></p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;