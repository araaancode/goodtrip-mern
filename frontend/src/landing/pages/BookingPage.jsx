import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import { 
  FaCheckCircle, 
  FaRegCalendarAlt, 
  FaRegClock, 
  FaRegUser,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store hooks
import useUserAuthStore from "../store/authStore";
import useHouseStore from "../store/houseStore";

const cityMap = {
  "arak": "اراک",
  "ardebil": "اردبیل",
  "oromieh": "ارومیه",
  "isfahan": "اصفهان",
  "ahvaz": "اهواز",
  "elam": "ایلام",
  "bognord": "بجنورد",
  "bandar_abbas": "بندرعباس",
  "boshehr": "بوشهر",
  "birgand": "بیرجند",
  "tabriz": "تبریز",
  "tehran": "تهران",
  "khoram_abad": "خرم آباد",
  "rasht": "رشت",
  "zahedan": "زاهدان",
  "zanjan": "زنجان",
  "sari": "ساری",
  "semnan": "سمنان",
  "sanandaj": "سنندج",
  "sharekord": "شهرکرد",
  "shiraz": "شیراز",
  "ghazvin": "قزوین",
  "ghom": "قم",
  "karaj": "کرج",
  "kerman": "کرمان",
  "kermanshah": "کرمانشاه",
  "gorgan": "گرگان",
  "mashhad": "مشهد",
  "hamedan": "همدان",
  "yasoj": "یاسوج",
  "yazd": "یزد"
};

const convertCityEnglishToPersian = (city) => cityMap[city] || city;

// Loading component for better user experience
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
    <div className="animate-spin text-blue-600 mb-4">
      <FaSpinner size={32} />
    </div>
    <div className="text-xl text-gray-600">در حال بارگذاری اطلاعات رزرو...</div>
  </div>
);

// Error component for consistent error handling
const ErrorMessage = ({ error }) => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
    <div className="text-red-500 mb-4">
      <FaExclamationTriangle size={32} />
    </div>
    <div className="text-xl text-red-600 mb-2">خطا در بارگذاری اطلاعات</div>
    <div className="text-gray-600 text-center">{error}</div>
  </div>
);

// Booking status badge component
const BookingStatusBadge = ({ isConfirmed }) => (
  <div className={`px-4 py-2 rounded-full text-sm font-medium ${isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
    {isConfirmed ? 'تایید شده' : 'در انتظار تایید'}
  </div>
);

// User info card component
const UserInfoCard = ({ user, title, isHost = false }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6 shadow-sm">
    <div className="relative">
      <img 
        src={user?.avatar || (isHost ? '/default-avatar.png' : '/default-user.png')} 
        alt={user?.name || title} 
        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
      />
      {isHost && <FaCheckCircle className="absolute bottom-0 left-0 text-green-500 bg-white rounded-full" />}
    </div>
    <div className="mr-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="font-medium text-gray-800">{user?.name || user?.phone || 'نام نامشخص'}</h3>
    </div>
  </div>
);

// Booking detail row component
const BookingDetailRow = ({ icon, label, value, isDateRange = false }) => (
  <div className="flex justify-between items-center py-3">
    <div className="flex items-center text-gray-600">
      {icon}
      <span className="mr-2">{label}</span>
    </div>
    <div className={`font-medium ${isDateRange ? 'text-left' : ''}`}>
      {value}
    </div>
  </div>
);

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useUserAuthStore();
  
  const {
    currentBooking: booking,
    loading: houseLoading,
    error: houseError,
    fetchBooking,
    confirmBooking: storeConfirmBooking,
  } = useHouseStore();

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    }
  }, [id, fetchBooking]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (booking?._id) {
      await storeConfirmBooking(booking._id);
    }
  };

  if (houseLoading) {
    return <LoadingSpinner />;
  }

  if (houseError) {
    return <ErrorMessage error={houseError} />;
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-xl">رزروی یافت نشد</div>
      </div>
    );
  }

  const { house, owner } = booking;
  const stayDuration = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn));

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 border-b pb-4">
          جزئیات رزرو اقامتگاه
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Booking Info */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              {/* Booking Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                  وضعیت رزرو
                </h2>
                <BookingStatusBadge isConfirmed={booking.isConfirmed} />
              </div>

              {/* Host Info */}
              <UserInfoCard user={owner} title="میزبان" isHost={true} />

              {/* Guest Info */}
              <UserInfoCard user={user} title="میهمان" />

              {/* Confirm Button */}
              <div className="text-center mt-8">
                {booking.isConfirmed ? (
                  <button 
                    disabled 
                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md cursor-not-allowed opacity-90 w-full sm:w-auto"
                  >
                    رزرو تایید شده است
                  </button>
                ) : (
                  <button 
                    onClick={handleConfirmBooking}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    تایید نهایی رزرو
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              {/* Property Info */}
              <div className="flex items-start mb-6">
                <img 
                  src={house?.cover || '/default-house.jpg'} 
                  alt={house?.name} 
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow mr-4"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate mx-2">
                    {house?.name}
                  </h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <HiOutlineLocationMarker className="mx-2" />
                    <span className="truncate">{convertCityEnglishToPersian(house?.city)}</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-2">
                    <p className="truncate mr-2">شناسه اقامتگاه: {house?._id?.substring(0, 8)}...</p>
                    <p className="truncate mr-2">کد رزرو: {booking._id?.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Booking Details */}
              <div className="space-y-4">
                <BookingDetailRow 
                  icon={<FaRegUser className="ml-2" />}
                  label="تعداد نفرات"
                  value={`${booking.guests} نفر`}
                />

                <BookingDetailRow 
                  icon={<FaRegCalendarAlt className="ml-2" />}
                  label="تاریخ رزرو"
                  value={
                    <>
                      <p>از {new Date(booking.checkIn).toLocaleDateString("fa")}</p>
                      <p>تا {new Date(booking.checkOut).toLocaleDateString("fa")}</p>
                    </>
                  }
                  isDateRange={true}
                />

                <BookingDetailRow 
                  icon={<FaRegClock className="ml-2" />}
                  label="مدت اقامت"
                  value={`${stayDuration} شب`}
                />
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Total Price */}
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span className="text-lg font-semibold text-gray-700">هزینه کل</span>
                <span className="text-xl md:text-2xl font-bold text-blue-600">
                  {booking.price?.toLocaleString() || '۰'} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer rtl position="top-left" />
    </div>
  );
}