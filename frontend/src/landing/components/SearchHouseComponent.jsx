import { useState } from "react";
import { CalendarDays, Users, MapPin, Search } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const cities=[
    "تهران",
    "اصفهان",
    "شیراز",
    "تبریز",
    "مشهد"
]


export default function SearchHouseComponent() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchData = {
      fromCity,
      toCity,
      checkIn: checkIn?.format(),
      checkOut: checkOut?.format(),
      guests,
    };
    console.log("Search Data:", searchData);
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="w-full max-w-5xl mx-auto my-12 px-4 lg:px-0"
  >
    <div className="flex flex-col lg:flex-row bg-white rounded-full shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50">
        {/* From City */}
        <div className="flex items-center gap-2 px-4 py-3 relative hover:bg-gray-50 transition-colors">
          <MapPin className="w-6 h-6 text-blue-900" />
          <input
            list="from-cities"
            placeholder="مبدا"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder-gray-500 text-right"
            required
          />
          <datalist id="from-cities">
            {cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>
  
        {/* To City */}
        <div className="flex items-center gap-2 px-4 py-3 relative hover:bg-gray-50 transition-colors">
          <MapPin className="w-6 h-6 text-blue-900" />
          <input
            list="to-cities"
            placeholder="مقصد"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder-gray-500 text-right"
            required
          />
          <datalist id="to-cities">
            {cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>
  
        {/* Check-In Date */}
        <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
          <CalendarDays className="w-6 h-6 text-blue-900" />
          <DatePicker
            value={checkIn}
            onChange={setCheckIn}
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full bg-transparent outline-none text-sm text-right"
            placeholder="تاریخ ورود"
            format="YYYY/MM/DD"
          />
        </div>
  
        {/* Check-Out Date */}
        <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
          <CalendarDays className="w-6 h-6 text-blue-900" />
          <DatePicker
            value={checkOut}
            onChange={setCheckOut}
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full bg-transparent outline-none text-sm text-right"
            placeholder="تاریخ خروج"
            format="YYYY/MM/DD"
          />
        </div>
  
        {/* Guests */}
        <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
          <Users className="w-6 h-6 text-blue-900" />
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-right"
            required
          />
        </div>
      </div>
  
      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-900  text-white py-3 px-6 flex items-center justify-center text-sm font-semibold whitespace-nowrap rounded-full m-1 transition-colors duration-300"
      >
        <Search className="w-5 h-5" />
        <span className="mr-2 hidden sm:inline">جستجو</span>
      </button>
    </div>
  </form>
  );
}
