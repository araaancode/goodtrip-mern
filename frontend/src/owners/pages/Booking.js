import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { Dialog } from "@headlessui/react";

// Icons
import { FaHome, FaUser, FaUserShield, FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { CiCircleQuestion } from "react-icons/ci";
import { 
  FiHome, 
  FiUser, 
  FiUserCheck, 
  FiCalendar, 
  FiUsers as FiUsersIcon,
  FiCheckCircle, 
  FiXCircle,
  FiDollarSign,
  FiEdit2,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone
} from "react-icons/fi";

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
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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
      setIsOpen(false);
    }
  };

  const openConfirmationDialog = (action) => {
    setPendingAction(action);
    setIsOpen(true);
  };

  const confirmAction = () => {
    if (pendingAction === 'accept') {
      handleStatusChange(true);
    } else if (pendingAction === 'reject') {
      handleStatusChange(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  const calculateNights = () => {
    if (!reservation) return 0;
    return Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">رزروی یافت نشد</p>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            <Dialog.Title className="text-xl font-bold text-gray-800 text-center mb-2">
              {pendingAction === 'accept' ? 'تایید رزرو' : 'رد رزرو'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 text-center mb-6">
              {pendingAction === 'accept' 
                ? 'آیا از تایید این رزرو اطمینان دارید؟'
                : 'آیا از رد این رزرو اطمینان دارید؟'
              }
            </Dialog.Description>
            <CiCircleQuestion className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <div className="flex items-center justify-center gap-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                onClick={confirmAction}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  'تایید'
                )}
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
                onClick={() => setIsOpen(false)}
                disabled={updatingStatus}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="min-h-screen py-1 px-1">
        <div className="w-full mx-auto">
          <div className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                  مدیریت رزرو
                </h2>
                <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  مشاهده و مدیریت اطلاعات رزرو
                </p>
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-600">
                    شناسه رزرو: <span className="font-mono text-gray-800">{reservation._id}</span>
                  </p>
                </div>
              </div>

              {/* Current Reservation Preview */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 mb-8 border border-blue-100/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiEdit2 className="ml-2 text-blue-500" />
                  خلاصه رزرو
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">وضعیت رزرو:</h4>
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl font-medium ${
                        reservation.isConfirmed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {reservation.isConfirmed ? (
                          <>
                            <FiCheckCircle className="ml-2" />
                            <span>تایید شده</span>
                          </>
                        ) : (
                          <>
                            <FiClock className="ml-2" />
                            <span>در انتظار تایید</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">تعداد مهمان:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {reservation.guests} نفر
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">قیمت هر شب:</h4>
                      <p className="text-indigo-600 font-semibold bg-white/50 p-3 rounded-xl">
                        {reservation.price.toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">تاریخ ورود:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {formatDate(reservation.checkIn)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">تاریخ خروج:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {formatDate(reservation.checkOut)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">تعداد شب‌ها:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {calculateNights()} شب
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                {/* House Information */}
                <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiHome className="ml-2 text-blue-500" />
                    اطلاعات اقامتگاه
                  </h3>
                  {house ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">عنوان:</span>
                        <span className="text-gray-800 font-semibold">{house.title}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">موقعیت:</span>
                        <span className="text-gray-800 font-semibold flex items-center">
                          <FiMapPin className="ml-1" />
                          {house.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">قیمت هر شب:</span>
                        <span className="text-indigo-600 font-semibold flex items-center">
                          {house.price.toLocaleString('fa-IR')}
                          <FiDollarSign className="mr-1" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">اطلاعات اقامتگاه در دسترس نیست</p>
                    </div>
                  )}
                </div>

                {/* Guest Information */}
                <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6 border border-green-100/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUser className="ml-2 text-green-500" />
                    اطلاعات مهمان
                  </h3>
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">نام:</span>
                        <span className="text-gray-800 font-semibold">{user.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">ایمیل:</span>
                        <span className="text-gray-800 font-semibold flex items-center">
                          <FiMail className="ml-1" />
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">تلفن:</span>
                        <span className="text-gray-800 font-semibold flex items-center">
                          <FiPhone className="ml-1" />
                          {user.phone || 'ثبت نشده'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">اطلاعات مهمان در دسترس نیست</p>
                    </div>
                  )}
                </div>

                {/* Owner Information */}
                <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-6 border border-purple-100/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUserCheck className="ml-2 text-purple-500" />
                    اطلاعات میزبان
                  </h3>
                  {owner ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">نام:</span>
                        <span className="text-gray-800 font-semibold">{owner.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                        <span className="text-gray-600 font-medium">ایمیل:</span>
                        <span className="text-gray-800 font-semibold flex items-center">
                          <FiMail className="ml-1" />
                          {owner.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">اطلاعات میزبان در دسترس نیست</p>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-6 border border-amber-100/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiDollarSign className="ml-2 text-amber-500" />
                    خلاصه هزینه‌ها
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                      <span className="text-gray-600 font-medium">قیمت هر شب:</span>
                      <span className="text-gray-800 font-semibold">
                        {reservation.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-200/50">
                      <span className="text-gray-600 font-medium">تعداد شب‌ها:</span>
                      <span className="text-gray-800 font-semibold">
                        {calculateNights()} شب
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                      <span className="text-lg font-bold text-gray-800">مجموع:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {(reservation.price * calculateNights()).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiEdit2 className="ml-2 text-blue-500" />
                  مدیریت رزرو
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!reservation.isConfirmed && (
                    <button
                      onClick={() => openConfirmationDialog('accept')}
                      disabled={updatingStatus}
                      className="px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white focus:outline-none focus:ring-4 focus:ring-green-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        {updatingStatus && pendingAction === 'accept' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            <span>در حال پردازش...</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-5 h-5" />
                            <span>تایید رزرو</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => openConfirmationDialog('reject')}
                    disabled={updatingStatus || !reservation.isConfirmed}
                    className={`px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${
                      reservation.isConfirmed 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white focus:ring-red-200/50' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white focus:ring-gray-200/50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {updatingStatus && pendingAction === 'reject' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          <span>در حال پردازش...</span>
                        </>
                      ) : (
                        <>
                          <span>رد رزرو</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl shadow-lg border border-gray-200/50"
        progressClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
      />
    </>
  );
}

export default Booking;