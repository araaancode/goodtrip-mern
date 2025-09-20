import { DateObject, Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';

const RangeDatePicker = ({
  selectedDates,
  setSelectedDates,
  ticketType,
  setFilters,
  setDateError,
  setShowDatePicker,
  isMobile,
  dateError,
}) => {
  // Format date in Persian
  const formatDate = (dateString) => {
    if (!dateString) return 'تاریخ نامعتبر';
    try {
      return new DateObject({
        date: dateString,
        calendar: persian,
        locale: persian_fa,
      }).format();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاریخ نامعتبر';
    }
  };

  // Validate date string
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    try {
      const date = new DateObject({
        date: dateString,
        calendar: persian,
        locale: persian_fa,
      });
      return date.isValid;
    } catch (error) {
      console.error('Error validating date:', error);
      return false;
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (dates) => {
    setDateError('');
    setSelectedDates(dates);

    try {
      if (dates.length > 0) {
        const movingDate = dates[0]?.format('YYYY-MM-DD');

        if (!isValidDate(movingDate)) {
          setDateError('تاریخ رفت نامعتبر است');
          return;
        }

        let returningDate = '';
        if (ticketType === 'twoSide') {
          if (dates.length < 2) {
            setDateError('لطفا تاریخ برگشت را انتخاب کنید');
            return;
          }

          returningDate = dates[1]?.format('YYYY-MM-DD');
          if (!isValidDate(returningDate)) {
            setDateError('تاریخ برگشت نامعتبر است');
            return;
          }

          const moving = new DateObject({ date: movingDate, calendar: persian });
          const returning = new DateObject({ date: returningDate, calendar: persian });
          if (returning.unix < moving.unix) {
            setDateError('تاریخ برگشت باید بعد از تاریخ رفت باشد');
            return;
          }
        }

        setFilters((prev) => ({
          ...prev,
          movingDate,
          returningDate,
        }));
      }
    } catch (error) {
      console.error('Error handling date selection:', error);
      setDateError('خطا در انتخاب تاریخ');
    }
  };

  return (
    <div
      className={`absolute z-20 bg-white rounded-xl p-3 md:p-5 border border-gray-200 mt-2 w-full ${
        isMobile ? 'left-0 right-0 mx-2' : 'min-w-[300px] md:min-w-[580px]'
      }`}
    >
      {dateError && (
        <div className="text-red-500 mb-3 text-center text-sm bg-red-50 p-2 rounded-lg">
          {dateError}
        </div>
      )}

      <Calendar
        value={selectedDates}
        onChange={handleDateRangeSelect}
        calendar={persian}
        locale={persian_fa}
        range={ticketType === 'twoSide'}
        numberOfMonths={isMobile ? 1 : ticketType === 'twoSide' ? 2 : 1}
        plugins={[<Toolbar position="bottom" className="flex justify-between pt-4 mt-4 border-t border-gray-200" />]}
        mapDays={({ date }) => {
          const today = new DateObject({ calendar: persian });
          const currentDate = new DateObject(date);
          if (currentDate.unix < today.unix) {
            return { disabled: true, style: { color: '#ccc' } };
          }
        }}
        className="rmdp-shadow-none w-full border-none"
      />

      <div className="flex flex-col md:flex-row justify-between items-center mt-5 pt-4 border-t border-gray-200 gap-3 md:gap-0">
        <div className="text-sm text-gray-600 text-center md:text-right">
          {selectedDates.length > 0 && (
            <>
              <span className="font-medium text-gray-800">انتخاب شده: </span>
              <span className="font-medium text-blue-600">
                {selectedDates.map((date) => formatDate(date?.format('YYYY-MM-DD'))).join(' تا ')}
              </span>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedDates([]);
              setFilters((prev) => ({
                ...prev,
                movingDate: '',
                returningDate: '',
              }));
              setDateError('');
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            aria-label="پاک کردن تاریخ‌ها"
          >
            پاک کردن
          </button>
          <button
            onClick={() => {
              if (selectedDates.length === 0) {
                setDateError('لطفا تاریخ رفت را انتخاب کنید');
              } else if (ticketType === 'twoSide' && selectedDates.length < 2) {
                setDateError('لطفا تاریخ برگشت را انتخاب کنید');
              } else {
                setShowDatePicker(false);
              }
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            aria-label="تایید تاریخ‌ها"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default RangeDatePicker;