import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns-jalali';

const PersianCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });
  const firstDayOfMonth = getDay(start);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const renderDays = () => {
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className="h-12"></div>
    ));

    const dayCells = days.map((day) => (
      <div
        key={day.toString()}
        className={`h-12 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-100 transition-colors ${
          isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 'text-gray-700'
        }`}
        onClick={() => handleDayClick(day)}
      >
        {format(day, 'd')}
      </div>
    ));

    return [...emptyDays, ...dayCells];
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-blue-500 hover:text-blue-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy', { locale: dateFnsJalali.locales.fa })}
        </h2>
        <button onClick={nextMonth} className="text-blue-500 hover:text-blue-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
        <div>شنبه</div>
        <div>یک‌شنبه</div>
        <div>دوشنبه</div>
        <div>سه‌شنبه</div>
        <div>چهارشنبه</div>
        <div>پنج‌شنبه</div>
        <div>جمعه</div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {renderDays()}
      </div>
      {selectedDate && (
        <div className="mt-4 text-center text-gray-700">
          تاریخ انتخاب‌شده: {format(selectedDate, 'd MMMM yyyy', { locale: dateFnsJalali.locales.fa })}
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;