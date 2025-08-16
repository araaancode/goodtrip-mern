import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { FaHome, FaUser, FaUserShield, FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

// Set axios defaults for credentials
axios.defaults.withCredentials = true;

function Booking() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [house, setHouse] = useState(null);
  const [owner, setOwner] = useState(null);


  console.log(reservationId)

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/owners/reservations/${reservationId}`, {
        withCredentials: true
      });
      
      setReservation(res.data.reservation);
      setUser(res.data.user);
      setHouse(res.data.house);
      setOwner(res.data.owner);
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات رزرو');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, [reservationId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(
        `/api/owners/reservations/${reservationId}/status`,
        { isConfirmed: newStatus },
        { withCredentials: true }
      );
      
      setReservation(prev => ({ ...prev, isConfirmed: newStatus }));
      toast.success(newStatus ? 'رزرو با موفقیت تایید شد' : 'رزرو با موفقیت رد شد');
    } catch (error) {
      toast.error('خطا در تغییر وضعیت رزرو');
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  const calculateNights = () => {
    return Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">رزروی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <ToastContainer position="top-left" rtl />
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-800">
            <h1 className="text-xl font-bold text-white">
              جزئیات رزرو
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              شناسه رزرو: {reservation._id}
            </p>
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Right Column (House Info) */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <FaHome className="text-blue-600 ml-2 text-xl" />
                    <h2 className="text-lg font-bold text-gray-800">اطلاعات اقامتگاه</h2>
                  </div>
                  {house ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">عنوان:</span>
                        <span className="text-gray-800">{house.title}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">موقعیت:</span>
                        <span className="text-gray-800">{house.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">قیمت هر شب:</span>
                        <span className="text-gray-800 flex items-center">
                          {house.price.toLocaleString('fa-IR')} <RiMoneyDollarCircleLine className="mr-1" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">اطلاعات اقامتگاه در دسترس نیست</p>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-green-600 ml-2 text-xl" />
                    <h2 className="text-lg font-bold text-gray-800">تاریخ‌های رزرو</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium ml-2">تاریخ ورود:</span>
                      <span className="text-gray-800">{formatDate(reservation.checkIn)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium ml-2">تاریخ خروج:</span>
                      <span className="text-gray-800">{formatDate(reservation.checkOut)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium ml-2">تعداد مهمان‌ها:</span>
                      <span className="text-gray-800">{reservation.guests} نفر</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column (User/Owner Info) */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                  <div className="flex items-center mb-4">
                    <FaUser className="text-purple-600 ml-2 text-xl" />
                    <h2 className="text-lg font-bold text-gray-800">اطلاعات مهمان</h2>
                  </div>
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">نام:</span>
                        <span className="text-gray-800">{user.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">ایمیل:</span>
                        <span className="text-gray-800">{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">تلفن:</span>
                        <span className="text-gray-800">{user.phone || 'ثبت نشده'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">اطلاعات مهمان در دسترس نیست</p>
                  )}
                </div>

                <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                  <div className="flex items-center mb-4">
                    <FaUserShield className="text-amber-600 ml-2 text-xl" />
                    <h2 className="text-lg font-bold text-gray-800">اطلاعات میزبان</h2>
                  </div>
                  {owner ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">نام:</span>
                        <span className="text-gray-800">{owner.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium ml-2">ایمیل:</span>
                        <span className="text-gray-800">{owner.email}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">اطلاعات میزبان در دسترس نیست</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">وضعیت رزرو</h2>
                  <div className={`flex items-center ${reservation.isConfirmed ? 'text-green-600' : 'text-amber-600'}`}>
                    {reservation.isConfirmed ? (
                      <>
                        <FaCheckCircle className="ml-2" />
                        <span className="font-medium">تایید شده</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="ml-2" />
                        <span className="font-medium">در انتظار تایید</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {!reservation.isConfirmed && (
                    <button
                      onClick={() => handleStatusChange(true)}
                      disabled={updatingStatus}
                      className="flex items-center justify-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          در حال پردازش...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="ml-2" />
                          تایید رزرو
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(false)}
                    disabled={updatingStatus || !reservation.isConfirmed}
                    className={`flex items-center justify-center px-5 py-2.5 ${
                      reservation.isConfirmed ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
                    } text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updatingStatus ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="ml-2" />
                        رد رزرو
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-5">خلاصه هزینه‌ها</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center">
                    <RiMoneyDollarCircleLine className="ml-2" />
                    قیمت هر شب
                  </span>
                  <span className="font-medium">{reservation.price.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">تعداد شب‌ها</span>
                  <span className="font-medium">{calculateNights()} شب</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">مجموع</span>
                  <span className="text-xl font-bold text-blue-600">
                    {(reservation.price * calculateNights()).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;