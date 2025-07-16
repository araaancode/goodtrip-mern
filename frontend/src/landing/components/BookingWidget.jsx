import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-multi-date-picker/styles/colors/teal.css';
import houseStore from "../store/houseStore";

export default function BookingWidget() {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get data and actions from Zustand store
  const { 
    currentHouse: house, 
    bookings, 
    fetchUserBookings, 
    bookHouse: bookHouseAction 
  } = houseStore();

  const userToken = localStorage.getItem("userToken") || null;

  const numberOfNights = checkIn && checkOut 
    ? differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    : 0;

  useEffect(() => {
    if (userToken) {
      fetchUserBookings();
    }
  }, [userToken, fetchUserBookings]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!house?._id) {
      toast.error('اطلاعات اقامتگاه نامعتبر است');
      return;
    }

    setIsLoading(true);

    try {
      await bookHouseAction({
        house: house._id,
        checkIn,
        checkOut,
        guests: numberOfGuests
      });

      toast.success('رزرو با موفقیت انجام شد!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error(error.response?.data?.msg || 'خطا در انجام رزرو. لطفا مجددا تلاش کنید.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const foundBooking = bookings?.find(b => b.house === house?._id);

  if (!house) return null;

  return (
    <div dir="rtl" className="bg-white border p-4 md:p-8 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <p className="text-gray-700 text-base md:text-lg">
          قیمت به ازای هر شب: 
          <span className="font-bold text-lg md:text-xl mr-1">
            {house.price.toLocaleString()} تومان
          </span>
        </p>
        {/* <AddressLink /> */}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <form onSubmit={handleBooking}>
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-3 md:p-4 flex-1">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">
                تاریخ ورود:
              </label>
              <DatePicker
                value={checkIn}
                onChange={setCheckIn}
                calendar={persian}
                locale={persian_fa}
                className="w-full"
                inputClass="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                minDate={new Date()}
              />
            </div>

            <div className="p-3 md:p-4 flex-1">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">
                تاریخ خروج:
              </label>
              <DatePicker
                value={checkOut}
                onChange={setCheckOut}
                calendar={persian}
                locale={persian_fa}
                className="w-full"
                inputClass="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                minDate={checkIn || new Date()}
              />
            </div>
          </div>

          <div className="p-3 md:p-4 border-t border-gray-200">
            <label className="block text-gray-700 mb-2 text-sm md:text-base">
              تعداد مهمان ها:
            </label>
            <input
              type="number"
              min="1"
              max={house.capacity}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="p-3 md:p-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">قیمت کل:</span>
              <span className="font-bold text-lg">
                {(house.price * numberOfNights).toLocaleString()} تومان
              </span>
            </div>
            <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
              <span>{numberOfNights} شب</span>
              <span>{numberOfGuests} نفر</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={foundBooking || isLoading || numberOfNights <= 0}
            className={`w-full py-3 px-4 mt-2 font-bold rounded transition-all
              ${foundBooking 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : numberOfNights <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-900 hover:text-white border border-blue-500'
              }
              ${isLoading ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            {isLoading ? 'در حال پردازش...' : 
              foundBooking ? 'این اقامتگاه را قبلا رزرو کردید!' : 
              numberOfNights <= 0 ? 'تاریخ‌های معتبر انتخاب کنید' : 'رزرو این اقامتگاه'
            }
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}