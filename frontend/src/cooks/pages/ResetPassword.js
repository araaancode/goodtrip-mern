import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RiLockPasswordLine } from "@remixicon/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookAuthStore } from '../stores/authStore';

function ResetPassword() {
  const { resetPassword, isLoading } = useCookAuthStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const cookId = searchParams.get('cookId');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'گذرواژه ضروری است!';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'گذرواژه باید حداقل 6 کاراکتر باشد';
      valid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'تایید گذرواژه ضروری است!';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'گذرواژه‌ها مطابقت ندارند';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        await resetPassword({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          cookId,
          token
        });
      } catch (error) {
        console.error("Reset password error:", error);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center text-right">
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div className=''>
              <div className="hero min-h-full rounded-l-xl bg-base-200">
                <div className="hero-content p-2">
                  <div className="w-50 px-6 py-4">
                    <h1 className="mb-4 text-center font-bold text-lg"> تغییر گذرواژه</h1>
                    <div className="my-auto">
                      <img 
                        width={500} 
                        height={400} 
                        src="https://img.freepik.com/premium-photo/technology-image_1308217-1335.jpg" 
                        style={{ borderRadius: '12px' }} 
                        alt="اقامتگاه" 
                        className="inline-block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 py-10 w-full max-w-md m-auto'>
              <div className="font-medium mt-2 self-center text-xl sm:text-2xl uppercase text-gray-800">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12">
                  <path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path>
                </svg>
              </div>
              <div className="relative mt-2 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">تغییر گذرواژه </span>
                </div>
              </div>
              <p className='mb-10 mt-8 text-right text-gray-500'>در زیر می توانید گذرواژه خود را تغییر دهید</p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-2">
                  <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">گذرواژه</label>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <RiLockPasswordLine />
                    </div>
                    <input 
                      style={{ borderRadius: '5px' }} 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" 
                      placeholder="گذرواژه" 
                    />
                  </div>
                  <span className='text-red-500 relative text-sm'>{errors.password}</span>
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="confirmPassword" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">تایید گذرواژه</label>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <RiLockPasswordLine />
                    </div>
                    <input 
                      style={{ borderRadius: '5px' }} 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" 
                      placeholder="تایید گذرواژه" 
                    />
                  </div>
                  <span className='text-red-500 relative text-sm'>{errors.confirmPassword}</span>
                </div>

                <div className="mb-2 mt-4 w-full">
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
                      <span>تغییر گذرواژه</span>
                    )}
                  </button>
                </div>

                <p className='text-sm text-gray-800'>حساب ندارید؟ <Link to='/cooks/register' className='hover:text-blue-900 hover:cursor-pointer'>ثبت نام </Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ResetPassword;