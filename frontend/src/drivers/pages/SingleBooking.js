import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import { showNotification } from "../features/common/headerSlice";
import axios from "axios";
import {
  PiTicket,
  PiMapPin,
  PiCalendar,
  PiClock,
  PiSeat,
  PiUser,
  PiBus,
  PiMoney,
  PiCheckCircle,
  PiXCircle,
  PiArrowLeft,
  PiQrCode,
  PiReceipt,
  PiUsers,
  PiShieldCheck,
  PiShieldWarning,
} from "react-icons/pi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(setPageTitle({ title: "جزئیات بلیط" }));
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/drivers/bus-tickets/${bookingId}`,
        {
          withCredentials: true,
        }
      );

      const foundTicket = response.data.tickets.find(
        (t) => t._id === bookingId
      );
      console.log(foundTicket);
      setBooking(foundTicket);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setLoading(false);
      dispatch(
        showNotification({
          message: "خطا در دریافت اطلاعات بلیط",
          status: 0,
        })
      );
    }
  };

  const confirmBooking = async () => {
    try {
      setActionLoading(true);
      await axios.patch(
        `/api/drivers/bus-tickets/${bookingId}/confirm`,
        {},
        {
          withCredentials: true,
        }
      );
      setBooking((prev) => ({ ...prev, isConfirmed: true, isCanceled: false }));
      dispatch(
        showNotification({
          message: "بلیط با موفقیت تایید شد",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error confirming booking:", error);
      dispatch(
        showNotification({
          message: "خطا در تایید بلیط",
          status: 0,
        })
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (window.confirm("آیا از لغو این بلیط اطمینان دارید؟")) {
      try {
        setActionLoading(true);
        await axios.patch(
          `/api/drivers/bus-tickets/${bookingId}/cancel`,
          {},
          {
            withCredentials: true,
          }
        );
        setBooking((prev) => ({
          ...prev,
          isCanceled: true,
          isConfirmed: false,
        }));
        dispatch(
          showNotification({
            message: "بلیط با موفقیت لغو شد",
            status: 1,
          })
        );
      } catch (error) {
        console.error("Error cancelling booking:", error);
        dispatch(
          showNotification({
            message: "خطا در لغو بلیط",
            status: 0,
          })
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Format Jalali date for display
  const formatJalaliDate = (dateString) => {
    if (!dateString) return "—";
    try {
      // You might want to use a library like moment-jalaali for proper conversion
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch (error) {
      return dateString; // Fallback to original string
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusConfig = (booking) => {
    if (booking.isCanceled) {
      return {
        text: "لغو شده",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <PiShieldWarning className="w-5 h-5" />,
      };
    }
    if (booking.isConfirmed) {
      return {
        text: "تایید شده",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <PiShieldCheck className="w-5 h-5" />,
      };
    }
    return {
      text: "در انتظار تایید",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: <PiClock className="w-5 h-5" />,
    };
  };

  if (loading) {
    return (
      <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات بلیط...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PiTicket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">بلیط یافت نشد</h3>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking);
  return (
    <div className="p-4  min-h-screen rounded-xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <PiArrowLeft className="w-5 h-5" />
          <span>بازگشت به لیست</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">جزئیات بلیط</h1>
            <p className="text-gray-600 mt-1">
              شماره بلیط: {booking.ticketNumber}
            </p>
          </div>

          <div
            className={`mt-4 md:mt-0 px-4 py-2 rounded-lg border flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color}`}
          >
            {statusConfig.icon}
            <span className="font-semibold">{statusConfig.text}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Information */}
        <div className="lg:col-span-2 shadow-md rounded-xl">
          <TitleCard
            title="اطلاعات بلیط"
            className="shadow-2xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-6">
              {/* Route Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.firstCity}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">مبدا</p>
                  </div>

                  <div className="flex items-center justify-center mx-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <PiBus className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="text-center flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.lastCity}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">مقصد</p>
                  </div>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard
                  icon={<PiTicket className="w-5 h-5" />}
                  title="شماره بلیط"
                  value={booking.ticketNumber}
                  className="bg-blue-50 text-blue-600"
                />

                <DetailCard
                  icon={<PiCalendar className="w-5 h-5" />}
                  title="تاریخ حرکت"
                  value={formatJalaliDate(booking.movingDate)}
                  className="bg-green-50 text-green-600"
                />

                <DetailCard
                  icon={<PiClock className="w-5 h-5" />}
                  title="ساعت حرکت"
                  value={formatTime(booking.startHour)}
                  className="bg-purple-50 text-purple-600"
                />

                <DetailCard
                  icon={<PiClock className="w-5 h-5" />}
                  title="ساعت رسیدن"
                  value={formatTime(booking.endHour)}
                  className="bg-purple-50 text-purple-600"
                />

                <DetailCard
                  icon={<PiSeat className="w-5 h-5" />}
                  title="شماره صندلی"
                  value={booking.seatNumbers?.join(", ") || "—"}
                  className="bg-amber-50 text-amber-600"
                />

                <DetailCard
                  icon={<PiUsers className="w-5 h-5" />}
                  title="تعداد مسافران"
                  value={`${booking.count} نفر`}
                  className="bg-indigo-50 text-indigo-600"
                />

                <DetailCard
                  icon={<PiMoney className="w-5 h-5" />}
                  title="قیمت بلیط"
                  value={
                    new Intl.NumberFormat("fa-IR").format(booking.ticketPrice) +
                    " تومان"
                  }
                  className="bg-emerald-50 text-emerald-600"
                />

                <DetailCard
                  icon={<PiReceipt className="w-5 h-5" />}
                  title="نوع بلیط"
                  value={
                    booking.ticketType === "oneSide" ? "یک طرفه" : "رفت و برگشت"
                  }
                  className="bg-rose-50 text-rose-600"
                />
              </div>

              {/* Additional Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  اطلاعات تکمیلی
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">شناسه رزرو:</span>
                    <span className="font-mono font-medium">{booking._id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">شناسه راننده:</span>
                    <span className="font-mono font-medium">
                      {booking.driver}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">شناسه اتوبوس:</span>
                    <span className="font-mono font-medium">{booking.bus}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">شناسه کاربر:</span>
                    <span className="font-mono font-medium">
                      {booking.user}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">تاریخ برگشت:</span>
                    <span className="font-medium">
                      {booking.returningDate
                        ? formatJalaliDate(booking.returningDate)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">تاریخ ایجاد:</span>
                    <span className="font-medium">
                      {formatJalaliDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passengers Information */}
              {booking.passengers && booking.passengers.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    مسافران
                  </h4>
                  <div className="space-y-2">
                    {booking.passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">
                          {passenger.name || `مسافر ${index + 1}`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {passenger.nationalId || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TitleCard>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6 ">
          {/* Action Buttons */}
          <TitleCard
            title="عملیات"
            className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-3 ">
              {!booking.isConfirmed && !booking.isCanceled && (
                <button
                  onClick={confirmBooking}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? "در حال تایید..." : "تایید بلیط"}
                </button>
              )}

              {!booking.isCanceled && !booking.isConfirmed && (
                <button
                  onClick={cancelBooking}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? "در حال لغو..." : "لغو بلیط"}
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                چاپ بلیط
              </button>
            </div>
          </TitleCard>

          {/* Quick Status */}
          <TitleCard
            title="وضعیت فعلی"
            className="shadow-2xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-3">
              <StatusItem
                label="تایید شده"
                value={booking.isConfirmed ? "✅" : "❌"}
              />
              <StatusItem
                label="لغو شده"
                value={booking.isCanceled ? "✅" : "❌"}
              />
              <StatusItem label="معتبر" value={booking.isValid ? "✅" : "❌"} />
              <StatusItem
                label="منقضی شده"
                value={booking.isExpired ? "✅" : "❌"}
              />
            </div>
          </TitleCard>

          {/* System Information */}
          <TitleCard
            title="اطلاعات سیستم"
            className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">آخرین بروزرسانی:</span>
                <span className="font-medium">
                  {formatJalaliDate(booking.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نسخه:</span>
                <span className="font-mono">{booking.__v}</span>
              </div>
            </div>
          </TitleCard>
        </div>
      </div>

      <ToastContainer
        position="top-left"
        autoClose={3000}
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

// Reusable Components
const DetailCard = ({ icon, title, value, className = "" }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
    <div className={`p-2 rounded-lg ${className}`}>{icon}</div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const StatusItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default TicketDetails;
