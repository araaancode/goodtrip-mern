// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiLoader2Fill } from "@remixicon/react";
// import { MdOutlineSms } from "react-icons/md";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useCookAuthStore } from '../stores/authStore';

// function Login() {
//   const { login, sendOtp, verifyOtp, isLoading } = useCookAuthStore();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     phone: "",
//     password: "",
//     code: Array(5).fill('')
//   });
  
//   const [errors, setErrors] = useState({
//     phone: "",
//     password: "",
//     code: ""
//   });

//   const [touched, setTouched] = useState({
//     phone: false,
//     password: false,
//     code: false
//   });
  
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const inputRefs = useRef([]);

//   // Check screen size on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Validation functions
//   const validatePhone = (phone) => {
//     if (!phone) return 'شماره تلفن الزامی است';
//     if (!/^(\+98|0)?9\d{9}$/.test(phone)) return 'شماره تلفن معتبر نیست (مثال: 09123456789)';
//     return '';
//   };

//   const validatePassword = (password) => {
//     if (!password) return 'گذرواژه الزامی است';
//     if (password.length < 8) return 'گذرواژه باید حداقل 8 کاراکتر باشد';
//     if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
//       return 'گذرواژه باید شامل حروف بزرگ، کوچک و اعداد باشد';
//     }
//     return '';
//   };

//   const validateCode = (code) => {
//     const codeString = code.join('');
//     if (!codeString) return 'کد تایید الزامی است';
//     if (codeString.length !== 5) return 'کد تایید باید 5 رقمی باشد';
//     if (!/^\d+$/.test(codeString)) return 'کد تایید باید فقط شامل اعداد باشد';
//     return '';
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));

//     if (name === 'phone') {
//       setErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
//     } else if (name === 'password') {
//       setErrors(prev => ({ ...prev, password: validatePassword(formData.password) }));
//     } else if (name === 'code') {
//       setErrors(prev => ({ ...prev, code: validateCode(formData.code) }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'phone' || name === 'password') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));

//       if (touched[name]) {
//         if (name === 'phone') {
//           setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
//         } else if (name === 'password') {
//           setErrors(prev => ({ ...prev, password: validatePassword(value) }));
//         }
//       }
//     }
//   };

//   // Handle OTP input change
//   const handleOtpChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;
    
//     const newCode = [...formData.code];
//     newCode[index] = value;
    
//     setFormData(prev => ({
//       ...prev,
//       code: newCode
//     }));
    
//     if (value && index === 4) {
//       setErrors(prev => ({ ...prev, code: validateCode(newCode) }));
//     }
    
//     if (value && index < 4) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   // Handle backspace in OTP inputs
//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Paste OTP code
//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData.getData('text').slice(0, 5);
//     if (/^\d+$/.test(pasteData)) {
//       const newCode = pasteData.split('');
//       const updatedCode = [...formData.code];
      
//       for (let i = 0; i < newCode.length && i < 5; i++) {
//         updatedCode[i] = newCode[i];
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         code: updatedCode
//       }));
      
//       const lastFilledIndex = Math.min(4, newCode.length - 1);
//       if (lastFilledIndex < 4) {
//         inputRefs.current[lastFilledIndex + 1].focus();
//       } else {
//         inputRefs.current[4].focus();
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const validateForm = () => {
//     const newErrors = {
//       phone: validatePhone(formData.phone),
//       password: validatePassword(formData.password)
//     };
//     setErrors(newErrors);
//     setTouched({ phone: true, password: true, code: false });
//     return !newErrors.phone && !newErrors.password;
//   };

//   const validateVerificationForm = () => {
//     const newErrors = {
//       code: validateCode(formData.code)
//     };
//     setErrors(prev => ({ ...prev, ...newErrors }));
//     setTouched(prev => ({ ...prev, code: true }));
//     return !newErrors.code;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       await login({ phone: formData.phone, password: formData.password });
//       await sendOtp(formData.phone);
      
//       toast.info('کد یکبار مصرف ارسال شد', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
      
//       setIsLogin(true);
      
//       setTimeout(() => {
//         if (inputRefs.current[0]) {
//           inputRefs.current[0].focus();
//         }
//       }, 300);
//     } catch (error) {
//       toast.error(error.message || 'خطا در ورود. لطفا مجددا تلاش کنید', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     if (!validateVerificationForm()) return;

//     try {
//       const codeString = formData.code.join('');
//       await verifyOtp({ phone: formData.phone, code: codeString });
      
//       toast.success('ورود با موفقیت انجام شد', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });

//       navigate('/cooks/welcome');
//     } catch (error) {
//       toast.error(error.message || 'خطا در تایید کد. لطفا مجددا تلاش کنید', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       await sendOtp(formData.phone);
//       toast.info('کد جدید ارسال شد', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
      
//       setFormData(prev => ({
//         ...prev,
//         code: Array(5).fill('')
//       }));
      
//       if (inputRefs.current[0]) {
//         inputRefs.current[0].focus();
//       }
//     } catch (error) {
//       toast.error('خطا در ارسال کد. لطفا مجددا تلاش کنید', {
//         position: isMobile ? "top-center" : "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   return (
//     <div dir="rtl" style={{
//       background: '#fff',
//       minHeight: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: isMobile ? '10px' : '20px'
//     }}>
//       <div style={{
//         display: 'flex',
//         flexDirection: isMobile ? 'column' : 'row',
//         width: '100%',
//         maxWidth: isMobile ? '100%' : '1000px',
//         minHeight: isMobile ? 'auto' : '600px',
//         background: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: '20px',
//         overflow: 'hidden',
//         boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
//         animation: 'fadeIn 0.8s ease-out'
//       }}>
//         {/* Login Form Section */}
//         <div style={{
//           flex: 1,
//           padding: isMobile ? '25px 20px' : '40px',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center'
//         }}>
//           <div style={{
//             width: '100%',
//             maxWidth: '400px',
//             margin: '0 auto'
//           }}>
//             {isLogin ? (
//               <div style={{ padding: '20px 0' }}>
//                 <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//                   <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', color: '#2d3748', marginBottom: '10px' }}>تایید کد</h2>
//                   <p style={{ color: '#718096', fontSize: isMobile ? '0.9rem' : '1rem' }}>کد ارسال شده به شماره {formData.phone} را وارد کنید</p>
//                   <button
//                     type="button"
//                     onClick={handleResendCode}
//                     disabled={isLoading}
//                     style={{
//                       marginTop: '1rem',
//                       background: 'none',
//                       border: 'none',
//                       color: '#2b6cb0',
//                       cursor: 'pointer',
//                       fontSize: '0.9rem',
//                       textDecoration: 'underline'
//                     }}
//                   >
//                     ارسال مجدد کد
//                   </button>
//                 </div>

//                 <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label style={{
//                       fontSize: '0.95rem',
//                       fontWeight: '500',
//                       color: '#4a5568',
//                       marginBottom: '15px',
//                       textAlign: 'center'
//                     }}>
//                       کد یکبار مصرف
//                     </label>
                    
//                     {/* OTP Inputs Container */}
//                     <div style={{
//                       display: 'flex',
//                       justifyContent: 'center',
//                       gap: isMobile ? '8px' : '12px',
//                       marginBottom: '15px',
//                       direction: 'ltr'
//                     }}>
//                       {formData.code.map((digit, index) => (
//                         <input
//                           key={index}
//                           ref={el => inputRefs.current[index] = el}
//                           type="text"
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           maxLength={1}
//                           value={digit}
//                           onChange={(e) => handleOtpChange(index, e.target.value)}
//                           onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                           onPaste={handleOtpPaste}
//                           style={{
//                             width: isMobile ? '45px' : '55px',
//                             height: isMobile ? '45px' : '55px',
//                             textAlign: 'center',
//                             fontSize: isMobile ? '1.4rem' : '1.6rem',
//                             fontWeight: 'bold',
//                             border: `2px solid ${errors.code ? '#fc8181' : '#e2e8f0'}`,
//                             backgroundColor: errors.code ? '#fff5f5' : '#f7fafc',
//                             borderRadius: '12px',
//                             transition: 'all 0.3s ease',
//                             boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
//                           }}
//                           onFocus={(e) => {
//                             e.target.style.borderColor = '#2b6cb0';
//                             e.target.style.backgroundColor = '#fff';
//                             e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = errors.code ? '#fc8181' : '#e2e8f0';
//                             e.target.style.backgroundColor = errors.code ? '#fff5f5' : '#f7fafc';
//                             e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
//                           }}
//                         />
//                       ))}
//                     </div>
                    
//                     {errors.code && <p style={{
//                       marginTop: '5px',
//                       fontSize: '0.85rem',
//                       color: '#e53e3e',
//                       textAlign: 'center'
//                     }}>{errors.code}</p>}
//                     <div style={{
//                       marginTop: '5px',
//                       fontSize: '0.8rem',
//                       color: '#718096',
//                       textAlign: 'center'
//                     }}>کد 5 رقمی ارسال شده به تلفن همراه خود را وارد کنید</div>
//                   </div>

//                   <div style={{ marginTop: '1.5rem' }}>
//                     <button
//                       type="submit"
//                       disabled={isLoading}
//                       style={{
//                         display: 'flex',
//                         width: '100%',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         padding: isMobile ? '0.8rem 1.2rem' : '1rem 1.5rem',
//                         border: 'none',
//                         borderRadius: '10px',
//                         boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
//                         fontSize: '1rem',
//                         fontWeight: '600',
//                         color: 'white',
//                         background: 'linear-gradient(135deg, #2b6cb0 0%, #0D47A1 100%)',
//                         outline: 'none',
//                         cursor: isLoading ? 'not-allowed' : 'pointer',
//                         transition: 'all 0.3s ease',
//                         position: 'relative',
//                         overflow: 'hidden',
//                         opacity: isLoading ? 0.7 : 1
//                       }}
//                     >
//                       {isLoading ? (
//                         <RiLoader2Fill style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem' }} />
//                       ) : (
//                         'تایید کد'
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             ) : (
//               <div style={{ padding: '20px 0' }}>
//                 <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//                   <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', color: '#2d3748', marginBottom: '10px' }}>ورود به پنل غذادار</h2>
//                   <p style={{ color: '#718096', fontSize: isMobile ? '0.9rem' : '1rem' }}>لطفا اطلاعات خود را وارد کنید</p>
//                 </div>

//                 <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label htmlFor="phone" style={{
//                       fontSize: '0.95rem',
//                       fontWeight: '500',
//                       color: '#4a5568',
//                       marginBottom: '8px'
//                     }}>
//                       شماره تلفن
//                     </label>
//                     <div style={{ position: 'relative' }}>
//                       <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         bottom: 0,
//                         left: '15px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         pointerEvents: 'none',
//                         zIndex: 10,
//                         color: '#a0aec0'
//                       }}>
//                         <RiPhoneLine style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem' }} />
//                       </div>
//                       <input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         style={{
//                           width: '100%',
//                           padding: isMobile ? '12px 12px 12px 45px' : '15px 15px 15px 50px',
//                           border: `1px solid ${errors.phone ? '#fc8181' : '#e2e8f0'}`,
//                           backgroundColor: errors.phone ? '#fff5f5' : '#f7fafc',
//                           borderRadius: '10px',
//                           fontSize: isMobile ? '0.9rem' : '1rem',
//                           transition: 'all 0.3s ease',
//                           textAlign: 'right'
//                         }}
//                         placeholder="09123456789"
//                       />
//                     </div>
//                     {errors.phone && <p style={{
//                       marginTop: '5px',
//                       fontSize: '0.85rem',
//                       color: '#e53e3e'
//                     }}>{errors.phone}</p>}
//                     <div style={{
//                       marginTop: '5px',
//                       fontSize: '0.8rem',
//                       color: '#718096'
//                     }}>شماره تلفن همراه خود را با پیش‌شماره 09 وارد کنید</div>
//                   </div>

//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label htmlFor="password" style={{
//                       fontSize: '0.95rem',
//                       fontWeight: '500',
//                       color: '#4a5568',
//                       marginBottom: '8px'
//                     }}>
//                       گذرواژه
//                     </label>
//                     <div style={{ position: 'relative' }}>
//                       <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         bottom: 0,
//                         left: '15px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         zIndex: 10,
//                         color: '#a0aec0',
//                         cursor: 'pointer'
//                       }} onClick={togglePasswordVisibility}>
//                         {passwordVisible ? (
//                           <RiEye2Line style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem' }} />
//                         ) : (
//                           <RiEyeCloseLine style={{ width: isMobile ? '1rem' : '1.25rem', height: isMobile ? '1rem' : '1.25rem' }} />
//                         )}
//                       </div>
//                       <input
//                         id="password"
//                         name="password"
//                         type={passwordVisible ? "text" : "password"}
//                         value={formData.password}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         style={{
//                           width: '100%',
//                           padding: isMobile ? '12px 12px 12px 45px' : '15px 15px 15px 50px',
//                           border: `1px solid ${errors.password ? '#fc8181' : '#e2e8f0'}`,
//                           backgroundColor: errors.password ? '#fff5f5' : '#f7fafc',
//                           borderRadius: '10px',
//                           fontSize: isMobile ? '0.9rem' : '1rem',
//                           transition: 'all 0.3s ease'
//                         }}
//                         placeholder="••••••••"
//                       />
//                     </div>
//                     {errors.password && <p style={{
//                       marginTop: '5px',
//                       fontSize: '0.85rem',
//                       color: '#e53e3e'
//                     }}>{errors.password}</p>}
//                     <div style={{
//                       marginTop: '5px',
//                       fontSize: '0.8rem',
//                       color: '#718096'
//                     }}>حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد</div>
//                   </div>

//                   <div style={{ marginTop: '1rem' }}>
//                     <button
//                       type="submit"
//                       disabled={isLoading}
//                       style={{
//                         display: 'flex',
//                         width: '100%',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         padding: isMobile ? '0.8rem 1.2rem' : '1rem 1.5rem',
//                         border: 'none',
//                         borderRadius: '1010px',
//                         boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
//                         fontSize: '1rem',
//                         fontWeight: '600',
//                         color: 'white',
//                         background: 'linear-gradient(135deg, #2b6cb0 0%, #0D47A1 100%)',
//                         outline: 'none',
//                         cursor: isLoading ? 'not-allowed' : 'pointer',
//                         transition: 'all 0.3s ease',
//                         position: 'relative',
//                         overflow: 'hidden',
//                         opacity: isLoading ? 0.7 : 1
//                       }}
//                     >
//                       {isLoading ? (
//                         <RiLoader2Fill style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem' }} />
//                       ) : (
//                         'ورود'
//                       )}
//                     </button>
//                   </div>
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     marginTop: '0.2rem'
//                   }}>
//                     <Link to="/cooks/forgot-password" style={{
//                       fontSize: '0.9rem',
//                       color: '#2b6cb0',
//                       textDecoration: 'none',
//                       fontWeight: '500',
//                       transition: 'color 0.2s ease'
//                     }}>
//                       گذرواژه خود را فراموش کرده‌اید؟
//                     </Link>
//                   </div>
//                 </form>

//                 <div style={{
//                   marginTop: '2rem',
//                   textAlign: 'center',
//                   paddingTop: '1.5rem',
//                   borderTop: '1px solid #e2e8f0'
//                 }}>
//                   <p style={{ fontSize: '0.95rem', color: '#718096' }}>
//                     حساب ندارید؟{' '}
//                     <Link to="/cooks/register" style={{
//                       fontWeight: '600',
//                       color: '#2b6cb0',
//                       textDecoration: 'none',
//                       transition: 'color 0.2s ease'
//                     }}>
//                       ثبت نام کنید
//                     </Link>
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Background Image Section - Only show on larger screens */}
//         {!isMobile && (
//           <div style={{
//             flex: 1,
//             background: 'url(https://irancuisinetours.com/wp-content/uploads/2016/06/cholo-soltani-870x480.jpg) center/cover no-repeat',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative'
//           }}>
//             <div style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               textAlign: 'center',
//               padding: '30px',
//               color: 'white'
//             }}>
//               <div>
//                 <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>ورود به پنل غذادار</h1>
//                 <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>از اینجا میتوانید وارد پنل مدیریت خود شوید</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <ToastContainer />
      
//       <style>
//         {`
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
          
//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default Login;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine } from "@remixicon/react";
import { MdOutlineSms } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookAuthStore } from '../stores/authStore';

function Login() {
  const { login, sendOtp, verifyOtp, isLoading } = useCookAuthStore();
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
      navigate('/cooks/welcome');
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
                    <h1 className="mb-4 text-center font-bold text-lg"> ورود به پنل غذادار</h1>
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
                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">ورود به پنل غذادار </span>
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
                          <Link to="/cooks/forgot-password" className="inline-flex text-xs font-bold sm:text-sm text-blue-800 hover:text-blue-900">گذرواژه خود را فراموش کردید؟</Link>
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
                    <p className='text-sm text-gray-800'>حساب ندارید؟ <Link to='/cooks/register' className='hover:text-blue-900 hover:cursor-pointer'>ثبت نام </Link></p>
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