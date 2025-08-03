import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import { FaCheckCircle, FaRegCalendarAlt, FaRegClock, FaRegUser } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// store hooks
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-2xl text-blue-600">در حال بارگذاری اطلاعات رزرو...</div>
      </div>
    );
  }

  if (houseError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-2xl">{houseError}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-2xl">رزروی یافت نشد</div>
      </div>
    );
  }

  const { house, owner } = booking;
  const stayDuration = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn));

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">جزئیات رزرو اقامتگاه</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Booking Info */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Booking Status */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-800">وضعیت رزرو</h2>
                <div className={`px-4 py-2 rounded-full ${booking.isConfirmed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {booking.isConfirmed ? 'تایید شده' : 'در انتظار تایید'}
                </div>
              </div>

              {/* Host Info */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                <div className="relative">
                  <img 
                    src={owner?.avatar || '/default-avatar.png'} 
                    alt={owner?.name || 'میزبان'} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                  <FaCheckCircle className="absolute bottom-0 left-0 text-green-500 bg-white rounded-full" />
                </div>
                <div className="mr-4">
                  <p className="text-gray-500 text-sm">میزبان</p>
                  <h3 className="font-medium text-gray-800">{owner?.name || owner?.phone || 'نام نامشخص'}</h3>
                </div>
              </div>

              {/* Guest Info */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-8">
                <img 
                  src="/default-user.png" 
                  alt="میهمان" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="mr-4">
                  <p className="text-gray-500 text-sm">میهمان</p>
                  <h3 className="font-medium text-gray-800">{user?.name || user?.phone || 'میهمان'}</h3>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center">
                {booking.isConfirmed ? (
                  <button 
                    disabled 
                    className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md cursor-not-allowed opacity-90"
                  >
                    رزرو تایید شده است
                  </button>
                ) : (
                  <button 
                    onClick={handleConfirmBooking}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                  >
                    تایید نهایی رزرو
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Property Info */}
              <div className="flex items-start mb-6">
                <img 
                  src={house?.cover || '/default-house.jpg'} 
                  alt={house?.name} 
                  className="w-24 h-24 object-cover rounded-lg shadow mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{house?.name}</h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <HiOutlineLocationMarker className="ml-1" />
                    <span>{convertCityEnglishToPersian(house?.city)}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>شناسه اقامتگاه: {house?._id?.substring(0, 8)}...</p>
                    <p>کد رزرو: {booking._id?.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Booking Details */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaRegUser className="ml-2" />
                    <span>تعداد نفرات</span>
                  </div>
                  <span className="font-medium">{booking.guests} نفر</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaRegCalendarAlt className="ml-2" />
                    <span>تاریخ رزرو</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">از {new Date(booking.checkIn).toLocaleDateString("fa")}</p>
                    <p className="font-medium">تا {new Date(booking.checkOut).toLocaleDateString("fa")}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FaRegClock className="ml-2" />
                    <span>مدت اقامت</span>
                  </div>
                  <span className="font-medium">{stayDuration} شب</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Total Price */}
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span className="text-lg font-semibold text-gray-700">هزینه کل</span>
                <span className="text-2xl font-bold text-blue-600">
                  {booking.price?.toLocaleString() || '۰'} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer rtl />
    </div>
  );
}