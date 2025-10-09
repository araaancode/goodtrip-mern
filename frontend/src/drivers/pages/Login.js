import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine } from "@remixicon/react";
import { MdOutlineSms } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDriverAuthStore } from "../stores/authStore";

function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [code, setCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    phone: "",
    password: "",
    code: ""
  });

  const navigate = useNavigate();
  
  // Use authStore
  const { 
    login: authLogin, 
    sendOtp, 
    verifyOtp, 
    isLoading, 
    error,
    clearError 
  } = useDriverAuthStore();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Clear field-specific error when user starts typing
  const handleInputChange = (field, value) => {
    if (field === 'phone' || field === 'password') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (field === 'code') {
      setCode(value);
    }
    
    // Clear error for this specific field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateLoginForm = () => {
    let isValid = true;
    const newErrors = {
      phone: "",
      password: ""
    };

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "شماره تلفن الزامی است";
      isValid = false;
    } else if (!/^09[0-9]{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "فرمت شماره تلفن نامعتبر است (مثال: 09123456789)";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "گذرواژه الزامی است";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "گذرواژه باید حداقل ۶ کاراکتر باشد";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const validateOtpForm = () => {
    let isValid = true;
    const newErrors = {
      code: ""
    };

    // Code validation
    if (!code.trim()) {
      newErrors.code = "کد تایید الزامی است";
      isValid = false;
    } else if (!/^\d{4,6}$/.test(code)) {
      newErrors.code = "کد تایید باید بین ۴ تا ۶ رقم باشد";
      isValid = false;
    }

    setFieldErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      // Login using authStore
      await authLogin(formData);
      
      // If login successful, send OTP
      await sendOtp(formData.phone);
      
      setIsLogin(true);
    } catch (error) {
      // Error handling is already done in the authStore
      console.log("Login error:", error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!validateOtpForm()) {
      return;
    }

    try {
      // Verify OTP using authStore
      await verifyOtp({ phone: formData.phone, code });
      
      // If verification successful, navigate to welcome page
      navigate("/drivers/welcome");
    } catch (error) {
      // Error handling is already done in the authStore
      console.log("Verification error:", error);
    }
  };

  const hasLoginErrors = Object.values(fieldErrors).some(error => error !== "") || error;
  const hasOtpErrors = fieldErrors.code || error;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center text-right">
        <div className="card mx-auto w-full max-w-5xl shadow-2xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div className="">
              <div className="hero min-h-full rounded-l-xl bg-base-200">
                <div className="hero-content p-2">
                  <div className="w-50 px-6 py-4">
                    <h1 className="mb-4 text-center font-bold text-lg">
                      ورود به پنل رانندگان
                    </h1>
                    <div className="my-auto">
                      <img
                        width={500}
                        height={400}
                        src="https://img.freepik.com/free-photo/portrait-female-bus-driver_23-2151589862.jpg?uid=R156737658&ga=GA1.1.972404931.1740587830&semt=ais_hybrid"
                        style={{ borderRadius: "12px" }}
                        alt="راننده اتوبوس"
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
                <div className="relative mt-4 h-px bg-gray-300">
                  <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                      تایید کد
                    </span>
                  </div>
                </div>

                {/* General error display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify}>
                  <p className="text-gray-500 mt-6 mb-10">
                    کد ارسال شده را در زیر وارد کنید.
                  </p>
                  <div className="flex flex-col mb-2">
                    <label
                      htmlFor="code"
                      className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                    >
                      کد یکبار مصرف
                    </label>
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <MdOutlineSms className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        style={{ borderRadius: "5px" }}
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={(e) => handleInputChange("code", e.target.value)}
                        className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                          fieldErrors.code ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                        }`}
                        placeholder="کد یکبار مصرف"
                        maxLength="6"
                      />
                    </div>
                    {fieldErrors.code && (
                      <span className="text-red-500 text-xs mt-1">
                        {fieldErrors.code}
                      </span>
                    )}
                  </div>
                  
                  {/* verify user */}
                  <div className="mt-4 w-full">
                    <button 
                      type="submit"
                      className="app-btn-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || hasOtpErrors}
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
                <div className="relative mt-4 h-px bg-gray-300">
                  <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                      ورود به پنل رانندگان
                    </span>
                  </div>
                </div>

                {/* General error display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mt-2 rounded-sm">
                  <form onSubmit={handleLogin} className="space-y-2 mt-2">
                    <div className="container mx-auto p-4">
                      {/* phone */}
                      <div className="flex flex-col mb-4">
                        <label
                          htmlFor="phone"
                          className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                        >
                          شماره تلفن
                        </label>
                        <div className="relative">
                          <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <RiPhoneLine />
                          </div>
                          <input
                            style={{ borderRadius: "5px" }}
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 text-right rounded-lg border w-full py-2 focus:outline-none ${
                              fieldErrors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                            }`}
                            placeholder="09123456789"
                          />
                        </div>
                        {fieldErrors.phone && (
                          <span className="text-red-500 text-xs mt-1">
                            {fieldErrors.phone}
                          </span>
                        )}
                      </div>

                      {/* password */}
                      <div className="relative mb-4">
                        <label
                          className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                          htmlFor="password"
                        >
                          گذرواژه
                        </label>
                        <div className="relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-10 rounded-lg border w-full py-2 focus:outline-none ${
                              fieldErrors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                            }`}
                            placeholder="گذرواژه"
                            style={{ borderRadius: "5px" }}
                          />
                          <div
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 left-3 flex items-center cursor-pointer"
                          >
                            {passwordVisible ? (
                              <RiEye2Line className="text-gray-400" />
                            ) : (
                              <RiEyeCloseLine className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        {fieldErrors.password && (
                          <span className="text-red-500 text-xs mt-1">
                            {fieldErrors.password}
                          </span>
                        )}

                        <div className="flex items-center mb-6">
                          <div className="flex ml-auto">
                            <Link
                              to="/drivers/forgot-password"
                              className="inline-flex text-xs font-bold sm:text-sm text-blue-800 hover:text-blue-900"
                            >
                              گذرواژه خود را فراموش کردید؟
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* login user */}
                      <div className="my-2 w-full">
                        <button 
                          type="submit"
                          className="app-btn-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || hasLoginErrors}
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
                      <p className="text-sm text-gray-800">
                        حساب ندارید؟{" "}
                        <Link
                          to="/drivers/register"
                          className="hover:text-blue-900 hover:cursor-pointer text-blue-800 font-medium"
                        >
                          ثبت نام
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
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