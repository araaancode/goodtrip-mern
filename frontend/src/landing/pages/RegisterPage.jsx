import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUser2Line, RiUser5Line, RiMailLine, RiLoader2Fill } from "@remixicon/react";
import axios from "axios";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    name: '',
    username: '',
    email: ''
  });
  const [touched, setTouched] = useState({
    phone: false,
    password: false,
    name: false,
    username: false,
    email: false
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone) return 'شماره تلفن الزامی است';
    if (!/^(\+98|0)?9\d{9}$/.test(phone)) return 'شماره تلفن معتبر نیست (مثال: 09123456789)';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'گذرواژه الزامی است';
    if (password.length < 8) return 'گذرواژه باید حداقل 8 کاراکتر باشد';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'گذرواژه باید شامل حروف بزرگ، کوچک و اعداد باشد';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'نام و نام خانوادگی الزامی است';
    if (name.length < 3) return 'نام باید حداقل 3 کاراکتر باشد';
    return '';
  };

  const validateUsername = (username) => {
    if (!username) return 'نام کاربری الزامی است';
    if (username.length < 3) return 'نام کاربری باید حداقل 3 کارакتر باشد';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'نام کاربری فقط می‌تواند شامل حروف، اعداد و زیرخط باشد';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'ایمیل الزامی است';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'ایمیل معتبر نیست';
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate the field on blur
    if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    } else if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === 'username') {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }));
    } else if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') setPhone(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'name') setName(value);
    else if (name === 'username') setUsername(value);
    else if (name === 'email') setEmail(value);

    // Real-time validation for touched fields
    if (touched[name]) {
      if (name === 'phone') {
        setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
      } else if (name === 'password') {
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
      } else if (name === 'name') {
        setErrors(prev => ({ ...prev, name: validateName(value) }));
      } else if (name === 'username') {
        setErrors(prev => ({ ...prev, username: validateUsername(value) }));
      } else if (name === 'email') {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = {
      phone: validatePhone(phone),
      password: validatePassword(password),
      name: validateName(name),
      username: validateUsername(username),
      email: validateEmail(email)
    };

    setErrors(newErrors);
    setTouched({
      phone: true,
      password: true,
      name: true,
      username: true,
      email: true
    });

    return !Object.values(newErrors).some(error => error);
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post('/api/users/auth/register',
        { phone, password, name, username, email }, config);

      toast.success(response.data.msg, {
        position: isMobile ? "top-center" : "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'خطا در ثبت نام. لطفا مجددا تلاش کنید';
      toast.error(errorMsg, {
        position: isMobile ? "top-center" : "top-right",
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
    <div dir="rtl" style={{
      background: '#f5f7fa',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '10px' : '20px',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        maxWidth: isMobile ? '100%' : '1200px',
        minHeight: isMobile ? 'auto' : '650px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        {/* Registration Form Section */}
        <div style={{
          flex: 1,
          padding: isMobile ? '25px 20px' : '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '25px' : '35px' }}>
              <h2 style={{
                fontSize: isMobile ? '1.5rem' : '2rem',
                color: '#2d3748',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                ثبت نام در سایت
              </h2>
              <p style={{
                color: '#718096',
                fontSize: isMobile ? '0.9rem' : '1.1rem'
              }}>
                برای ثبت نام اطلاعات خود را وارد کنید
              </p>
            </div>

            <form onSubmit={register} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '20px' : '25px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(1, 1fr)',
                gap: isMobile ? '15px' : '20px'
              }}>
                {/* Name Field */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="name" style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500',
                    color: '#4a5568',
                    marginBottom: isMobile ? '8px' : '10px'
                  }}>
                    نام و نام خانوادگی
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: isMobile ? '12px' : '18px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                      color: '#a0aec0'
                    }}>
                      <RiUser2Line style={{
                        width: isMobile ? '1.1rem' : '1.4rem',
                        height: isMobile ? '1.1rem' : '1.4rem'
                      }} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: '100%',
                        padding: isMobile ? '12px 12px 12px 40px' : '18px 18px 18px 55px',
                        border: `1px solid ${errors.name ? '#fc8181' : '#e2e8f0'}`,
                        backgroundColor: errors.name ? '#fff5f5' : '#f7fafc',
                        borderRadius: '12px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        transition: 'all 0.3s ease',
                        height: isMobile ? '48px' : '56px'
                      }}
                      placeholder="نام و نام خانوادگی"
                    />
                  </div>
                  {errors.name && <p style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#e53e3e'
                  }}>{errors.name}</p>}
                </div>

                {/* Username Field */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="username" style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500',
                    color: '#4a5568',
                    marginBottom: isMobile ? '8px' : '10px'
                  }}>
                    نام کاربری
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: isMobile ? '12px' : '18px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                      color: '#a0aec0'
                    }}>
                      <RiUser5Line style={{
                        width: isMobile ? '1.1rem' : '1.4rem',
                        height: isMobile ? '1.1rem' : '1.4rem'
                      }} />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: '100%',
                        padding: isMobile ? '12px 12px 12px 40px' : '18px 18px 18px 55px',
                        border: `1px solid ${errors.username ? '#fc8181' : '#e2e8f0'}`,
                        backgroundColor: errors.username ? '#fff5f5' : '#f7fafc',
                        borderRadius: '12px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        transition: 'all 0.3s ease',
                        height: isMobile ? '48px' : '56px'
                      }}
                      placeholder="نام کاربری"
                    />
                  </div>
                  {errors.username && <p style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#e53e3e'
                  }}>{errors.username}</p>}
                </div>

                {/* Phone Field */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="phone" style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500',
                    color: '#4a5568',
                    marginBottom: isMobile ? '8px' : '10px'
                  }}>
                    شماره تلفن
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: isMobile ? '12px' : '18px',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                      color: '#a0aec0'
                    }}>
                      <RiPhoneLine style={{
                        width: isMobile ? '1.1rem' : '1.4rem',
                        height: isMobile ? '1.1rem' : '1.4rem'
                      }} />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: '100%',
                        padding: isMobile ? '12px 12px 12px 40px' : '18px 18px 18px 55px',
                        border: `1px solid ${errors.phone ? '#fc8181' : '#e2e8f0'}`,
                        backgroundColor: errors.phone ? '#fff5f5' : '#f7fafc',
                        borderRadius: '12px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        transition: 'all 0.3s ease',
                        height: isMobile ? '48px' : '56px'
                      }}
                      placeholder="09123456789"
                    />
                  </div>
                  {errors.phone && <p style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#e53e3e'
                  }}>{errors.phone}</p>}
                  <div style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    color: '#718096'
                  }}>شماره تلفن همراه خود را با پیش‌شماره 09 وارد کنید</div>
                </div>

                {/* Password Field */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="password" style={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '500',
                    color: '#4a5568',
                    marginBottom: isMobile ? '8px' : '10px'
                  }}>
                    گذرواژه
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: isMobile ? '12px' : '18px',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 10,
                      color: '#a0aec0',
                      cursor: 'pointer'
                    }} onClick={togglePasswordVisibility}>
                      {passwordVisible ? (
                        <RiEye2Line style={{
                          width: isMobile ? '1.1rem' : '1.4rem',
                          height: isMobile ? '1.1rem' : '1.4rem'
                        }} />
                      ) : (
                        <RiEyeCloseLine style={{
                          width: isMobile ? '1.1rem' : '1.4rem',
                          height: isMobile ? '1.1rem' : '1.4rem'
                        }} />
                      )}
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: '100%',
                        padding: isMobile ? '12px 12px 12px 40px' : '18px 18px 18px 55px',
                        border: `1px solid ${errors.password ? '#fc8181' : '#e2e8f0'}`,
                        backgroundColor: errors.password ? '#fff5f5' : '#f7fafc',
                        borderRadius: '12px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        transition: 'all 0.3s ease',
                        height: isMobile ? '48px' : '56px'
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: '#e53e3e'
                  }}>{errors.password}</p>}
                  <div style={{
                    marginTop: isMobile ? '6px' : '8px',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    color: '#718096'
                  }}>حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک و اعداد</div>
                </div>
              </div>


              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: isMobile ? '8px' : '10px'
                }}>
                  ایمیل
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: isMobile ? '12px' : '18px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                    color: '#a0aec0'
                  }}>
                    <RiMailLine style={{
                      width: isMobile ? '1.1rem' : '1.4rem',
                      height: isMobile ? '1.1rem' : '1.4rem'
                    }} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 12px 12px 40px' : '18px 18px 18px 55px',
                      border: `1px solid ${errors.email ? '#fc8181' : '#e2e8f0'}`,
                      backgroundColor: errors.email ? '#fff5f5' : '#f7fafc',
                      borderRadius: '12px',
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      transition: 'all 0.3s ease',
                      height: isMobile ? '48px' : '56px'
                    }}
                    placeholder="example@domain.com"
                  />
                </div>
                {errors.email && <p style={{
                  marginTop: isMobile ? '6px' : '8px',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  color: '#e53e3e'
                }}>{errors.email}</p>}
              </div>


              <div style={{ marginTop: isMobile ? '1rem' : '1.5rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: isMobile ? '0.9rem 1.2rem' : '1.2rem 1.5rem',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                    fontSize: isMobile ? '0.9rem' : '1.1rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #0D47A1 100%)',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    height: isMobile ? '50px' : '60px'
                  }}
                >
                  {loading ? <RiLoader2Fill style={{
                    animation: 'spin 1s linear infinite',
                    height: isMobile ? '1.2rem' : '1.5rem',
                    width: isMobile ? '1.2rem' : '1.5rem'
                  }} /> : 'ثبت نام'}
                </button>
              </div>

              <div style={{
                marginTop: isMobile ? '2rem' : '2.5rem',
                textAlign: 'center',
                paddingTop: isMobile ? '1.5rem' : '1.8rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <p style={{
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  color: '#718096'
                }}>
                  حساب دارید؟{' '}
                  <a href="/login" style={{
                    fontWeight: '600',
                    color: '#2b6cb0',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    fontSize: isMobile ? '0.95rem' : '1.05rem'
                  }}>
                    ورود
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Background Image Section - Only show on larger screens */}
        {!isMobile && (
          <div style={{
            flex: 1,
            background: 'url(../images/auth/register.jpg) center/cover no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '30px',
              color: 'white'
            }}>
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  marginBottom: '25px',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  به گودتریپ بپیوندید
                </h1>
                <p style={{
                  fontSize: '1.3rem',
                  opacity: 0.9
                }}>
                  با ثبت نام از تمامی امکانات سایت بهره‌مند شوید
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;