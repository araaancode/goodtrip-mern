import React, { useEffect } from 'react';
import { useBusStore, useUserStore } from '../store/busStore';
import { FaBus, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { toJalaali } from 'jalaali-js';
import { motion } from 'framer-motion';

const BusTicketsPage = () => {
  const { tickets, fetchTickets, cancelTicket, loading } = useBusStore();
  const { user, isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate('/login');
    //   return;
    // }
    fetchTickets();
  }, [isAuthenticated, fetchTickets, navigate]);

  const formatPersianDate = (date) => {
    const gregorianDate = new Date(date);
    const jalaaliDate = toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate()
    );
    return `${jalaaliDate.jy}/${jalaaliDate.jm}/${jalaaliDate.jd}`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelTicket = async (ticketId) => {
    if (window.confirm('آیا از لغو این بلیط مطمئن هستید؟')) {
      await cancelTicket(ticketId);
      toast.success('بلیط با موفقیت لغو شد', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: true
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const ticketVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 rtl">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">بلیط‌های رزرو شده</h1>
          <p className="text-gray-600">لیست تمام بلیط‌های رزرو شده شما</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ClipLoader size={50} color="#4f46e5" />
          </div>
        ) : tickets.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                variants={ticketVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Ticket Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <FaTicketAlt className="text-indigo-600 text-xl" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mr-3">بلیط شماره: {ticket.ticketNumber}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ticket.isCanceled
                            ? 'bg-red-100 text-red-800'
                            : ticket.isConfirmed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        >
                          {ticket.isCanceled ? 'لغو شده' : ticket.isConfirmed ? 'تایید شده' : 'در انتظار تایید'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FaBus className="text-gray-500 ml-2" />
                            <span className="text-gray-600">اتوبوس:</span>
                          </div>
                          <p className="font-medium text-gray-800">{ticket.bus?.name || 'نامعلوم'}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FaMapMarkerAlt className="text-gray-500 ml-2" />
                            <span className="text-gray-600">مسیر:</span>
                          </div>
                          <p className="font-medium text-gray-800">
                            {ticket.firstCity} → {ticket.lastCity}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FaCalendarAlt className="text-gray-500 ml-2" />
                            <span className="text-gray-600">تاریخ حرکت:</span>
                          </div>
                          <p className="font-medium text-gray-800">
                            {formatPersianDate(ticket.movingDate)} - {formatTime(ticket.movingDate)}
                          </p>
                        </div>

                        {ticket.ticketType === 'twoSide' && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <FaCalendarAlt className="text-gray-500 ml-2" />
                              <span className="text-gray-600">تاریخ برگشت:</span>
                            </div>
                            <p className="font-medium text-gray-800">
                              {formatPersianDate(ticket.returningDate)} - {formatTime(ticket.returningDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="md:w-64 flex flex-col justify-between">
                      <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">تعداد مسافران:</span>
                          <span className="font-medium text-gray-800 flex items-center">
                            <FaUser className="ml-1" /> {ticket.count}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">مبلغ کل:</span>
                          <span className="font-bold text-indigo-600 text-lg">
                            {ticket.ticketPrice?.toLocaleString('fa-IR') || '۰'} تومان
                          </span>
                        </div>
                      </div>

                      {!ticket.isCanceled && !ticket.isConfirmed && (
                        <button
                          onClick={() => handleCancelTicket(ticket._id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        >
                          لغو بلیط
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="mt-6 pt-5 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <FaUser className="ml-2" /> اطلاعات مسافران
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ticket.passengers?.map((passenger, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <p className="font-medium text-gray-800 mb-1">{passenger.name}</p>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <FaInfoCircle className="ml-1" />
                            <span>کد ملی: {passenger.nationalCode}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>جنسیت: {passenger.gender === 'male' ? 'آقا' : 'خانم'}</span>
                            <span className="mx-2">•</span>
                            <span>سن: {passenger.age} سال</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-indigo-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">بلیطی یافت نشد</h3>
              <p className="text-gray-600 mb-6">شما هنوز هیچ بلیطی رزرو نکرده‌اید</p>
              <button
                onClick={() => navigate('/buses')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-300"
              >
                رزرو بلیط جدید
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BusTicketsPage;