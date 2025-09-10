// src/pages/SupportPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiMenuLine,
  RiCloseLine,
  RiQuestionLine,
  RiMessage3Line,
  RiPhoneLine,
  RiMailLine,
  RiTelegramLine,
  RiWhatsappLine,
  RiArrowRightLine,
  RiSendPlaneLine,
  RiTimeLine,
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosCamera } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

// React Icons from pi package for sidebar
import {
  PiUser,
  PiHouse,
  PiHeart,
  PiCreditCard,
  PiBell,
  PiHeadset
} from 'react-icons/pi';

// Import your actual auth store
import useUserAuthStore from '../store/authStore';

const SupportPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: 'general',
    subject: '',
    message: ''
  });

  // Use your actual auth store
  const { user, isAuthenticated, logout, checkAuth } = useUserAuthStore();

  // Mock data - replace with actual API calls
  const [tickets, setTickets] = useState([]);
  const [faqItems, setFaqItems] = useState([]);

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSupportData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadSupportData = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      // const ticketsResponse = await axios.get('/api/users/support/tickets');
      // const faqResponse = await axios.get('/api/support/faq');

      // Mock data for demonstration
      setTimeout(() => {
        setTickets([
          {
            _id: '1',
            subject: 'مشکل در پرداخت آنلاین',
            message: 'هنگام پرداخت هزینه رزرو، با خطای "تراکنش ناموفق" مواجه شدم.',
            status: 'open',
            priority: 'high',
            createdAt: '1402/08/15 - 14:30',
            updatedAt: '1402/08/15 - 14:30',
            category: 'payment'
          },
          {
            _id: '2',
            subject: 'لغو رزرو اقامتگاه',
            message: 'چگونه می‌توانم رزرو خود را لغو کنم؟',
            status: 'resolved',
            priority: 'medium',
            createdAt: '1402/08/10 - 09:15',
            updatedAt: '1402/08/12 - 16:45',
            category: 'reservation'
          },
          {
            _id: '3',
            subject: 'مشکل در دریافت رسید',
            message: 'پس از پرداخت موفق، رسید الکترونیکی دریافت نکردم.',
            status: 'in-progress',
            priority: 'high',
            createdAt: '1402/08/14 - 18:20',
            updatedAt: '1402/08/15 - 10:30',
            category: 'technical'
          }
        ]);

        setFaqItems([
          {
            question: 'چگونه می‌توانم رزرو خود را لغو کنم؟',
            answer: 'برای لغو رزرو، به بخش "رزروهای من" مراجعه کرده و روی گزینه "لغو رزرو" کلیک کنید. توجه داشته باشید که شرایط استرداد وجه بسته به قوانین اقامتگاه متفاوت است.'
          },
          {
            question: 'آیا امکان تغییر تاریخ رزرو وجود دارد؟',
            answer: 'بله، در صورت موجود بودن اقامتگاه در تاریخ جدید، می‌توانید از طریق بخش "رزروهای من" درخواست تغییر تاریخ دهید.'
          },
          {
            question: 'چگونه می‌توانم با میزبان ارتباط برقرار کنم؟',
            answer: 'پس از تکمیل رزرو، اطلاعات تماس میزبان در بخش "رزروهای من" در دسترس خواهد بود.'
          },
          {
            question: 'سیستم پرداخت شما امن است؟',
            answer: 'بله، تمامی پرداخت‌ها از طریق درگاه‌های بانکی معتبر و با پروتکل SSL انجام می‌شود.'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading support data:', error);
      toast.error('خطا در دریافت اطلاعات پشتیبانی', {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      // Replace with actual API call
      // const response = await axios.post('/api/users/support/tickets', ticketData);
      const newTicket = {
        _id: Date.now().toString(),
        ...ticketData,
        status: 'open',
        createdAt: new Date().toLocaleString('fa-IR'),
        updatedAt: new Date().toLocaleString('fa-IR')
      };
      setTickets([newTicket, ...tickets]);
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createTicket(formData);
      toast.success('تیکت پشتیبانی با موفقیت ایجاد شد', {
        position: "top-right",
        autoClose: 5000,
      });
      setFormData({
        category: 'general',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('خطا در ارسال تیکت', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const logoutUser = async () => {
    try {
      await logout();
      toast.info('عملیات خروج انجام شد');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('خطا در خروج از حساب', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Navigation items with links
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <PiHouse className="ml-2 w-5 h-5" />, text: 'رزرو اقامتگاه', link: '/bookings' },
    { id: 'order-foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارشات غذا', link: '/order-foods' },
    { id: 'bus-tickets', icon: <PiBell className="ml-2 w-5 h-5" />, text: 'بلیط اتوبוס', link: '/bus-tickets' },
    { id: 'favorites', icon: <PiHeart className="ml-2 w-5 h-5" />, text: 'علاقه‌مندی‌ها', link: '/favorites' },
    { id: 'bank', icon: <PiCreditCard className="ml-2 w-5 h-5" />, text: 'حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <PiBell className="ml-2 w-5 h-5" />, text: 'اعلان‌ها', link: '/notifications' },
    { id: 'support', icon: <PiHeadset className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];

  const renderStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', text: 'باز' },
      'in-progress': { color: 'bg-amber-100 text-amber-800', text: 'در دست بررسی' },
      resolved: { color: 'bg-green-100 text-green-800', text: 'حل شده' }
    };

    const config = statusConfig[status] || statusConfig.open;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', text: 'بالا' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'متوسط' },
      low: { color: 'bg-gray-100 text-gray-800', text: 'پایین' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderTicketCard = (ticket) => (
    <motion.div
      key={ticket._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
            {renderStatusBadge(ticket.status)}
            {renderPriorityBadge(ticket.priority)}
          </div>
          <p className="text-gray-600 text-sm mb-3">{ticket.message}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <RiTimeLine className="ml-1" size={14} />
            <span>{ticket.createdAt}</span>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors duration-300 text-sm">
          مشاهده جزئیات
        </button>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای دسترسی به پشتیبانی لطفاً وارد حساب کاربری شوید</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">پشتیبانی</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 z-50 relative"
        >
          {isMobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* User Sidebar */}
        <div className={`
          w-full lg:w-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 
          transition-all duration-300 z-50 lg:z-auto
          ${isMobileMenuOpen
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 max-w-md max-h-[80vh] overflow-y-auto'
            : 'hidden lg:block'
          }
        `}>
          {/* Close button for mobile */}
          {isMobileMenuOpen && (
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center lg:hidden">
              <h2 className="text-lg font-semibold text-gray-800">منو</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
          )}

          <div className="p-4 md:p-6 text-center">
            <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-4">
              <img
                src={"https://cdn-icons-png.flaticon.com/128/17384/17384295.png" || user?.avatar}
                alt="پروفایل کاربر"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-105"
              />
              <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <IoIosCamera className="text-blue-600 text-lg md:text-xl" />
              </button>
            </div>
            <h3 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 truncate">
              {user?.name || user?.phone || 'کاربر'}
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base truncate">کاربر عزیز، خوش آمدید</p>
          </div>

          <div className="border-t border-gray-100 mx-4"></div>

          <nav className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'support'
                      ? 'bg-blue-50 text-blue-600 shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                      }`}
                  >
                    {item.icon}
                    <span className="text-right flex-1 text-sm md:text-base">{item.text}</span>
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <RiLogoutBoxRLine className="ml-2 w-5 h-5" />
                  <span className="text-right flex-1 text-sm md:text-base">خروج از حساب</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <PiHeadset className="ml-2 text-blue-600" />
                    پشتیبانی و راهنمایی
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">ما اینجا هستیم تا به شما کمک کنیم</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {tickets.length} تیکت
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-4 py-2 font-medium text-sm md:text-base transition-colors duration-300 ${activeTab === 'contact'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <RiMessage3Line className="inline ml-2" />
                  تماس با پشتیبانی
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-4 py-2 font-medium text-sm md:text-base transition-colors duration-300 ${activeTab === 'tickets'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <RiQuestionLine className="inline ml-2" />
                  تیکت‌های من
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-4 py-2 font-medium text-sm md:text-base transition-colors duration-300 ${activeTab === 'faq'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <RiQuestionLine className="inline ml-2" />
                  سوالات متداول
                </button>
              </div>

              {/* Contact Form */}
              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-6 rounded-2xl mb-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">ارسال تیکت پشتیبانی</h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        دسته‌بندی
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="general">عمومی</option>
                        <option value="technical">فنی</option>
                        <option value="payment">پرداخت</option>
                        <option value="reservation">رزرو</option>
                        <option value="refund">استرداد وجه</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        موضوع
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                        placeholder="موضوع درخواست خود را وارد کنید"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        پیام
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                        placeholder="شرح کامل درخواست یا مشکل خود را بنویسید"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-300 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <RiSendPlaneLine className="ml-2" />
                          ارسال تیکت
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Tickets List */}
              {activeTab === 'tickets' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {tickets.map(renderTicketCard)}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <RiQuestionLine className="mx-auto text-gray-300 text-5xl mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mt-4">تیکتی یافت نشد</h3>
                        <p className="text-gray-500 mt-2">شما هنوز هیچ تیکت پشتیبانی ایجاد نکرده‌اید</p>
                        <button
                          onClick={() => setActiveTab('contact')}
                          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors duration-300"
                        >
                          ایجاد تیکت جدید
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* FAQ Section */}
              {activeTab === 'faq' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">سوالات متداول</h3>

                  {faqItems.map((faq, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-right"
                      >
                        <h4 className="font-medium text-gray-800 text-sm md:text-base">{faq.question}</h4>
                        <RiArrowRightLine
                          className={`text-gray-500 transition-transform duration-300 ${expandedFaq === index ? 'rotate-90' : ''
                            }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3"
                          >
                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-gray-600 text-sm md:text-base">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Contact Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RiPhoneLine className="text-blue-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">تماس تلفنی</h4>
                  <p className="text-gray-600 text-sm">021-12345678</p>
                </div>

                <div className="bg-green-50 p-4 rounded-2xl text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RiWhatsappLine className="text-green-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">واتس‌اپ</h4>
                  <p className="text-gray-600 text-sm">09123456789</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RiTelegramLine className="text-purple-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">تلگرام</h4>
                  <p className="text-gray-600 text-sm">@support_username</p>
                </div>

                <div className="bg-red-50 p-4 rounded-2xl text-center">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RiMailLine className="text-red-600 text-xl" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">ایمیل</h4>
                  <p className="text-gray-600 text-sm">support@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default SupportPage;