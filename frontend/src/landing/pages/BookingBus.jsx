import { useState } from 'react';
import { useBusStore } from '../store/busStore';
import { useNavigate } from 'react-router-dom';
import { DateObject, Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import provincesCities from '../../provinces_cities.json';

const BookingBus = () => {
  const { searchResults, searchTickets, loading, error } = useBusStore();
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    firstCity: '',
    lastCity: '',
    movingDate: '',
    returningDate: '',
    count: 1,
    ticketType: 'oneSide'
  });

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateError, setDateError] = useState('');

  // Format price to Persian style
  const formatPrice = (price) => {
    if (isNaN(price)) return 'قیمت نامعتبر';
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Validate date string
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    try {
      const date = new DateObject({
        date: dateString,
        calendar: persian,
        locale: persian_fa
      });
      return date.isValid;
    } catch (error) {
      console.error('Error validating date:', error);
      return false;
    }
  };

  // Handle date range selection with validation
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
        if (filters.ticketType === 'twoSide') {
          if (dates.length < 2) {
            setDateError('لطفاً تاریخ برگشت را انتخاب کنید');
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

        setFilters(prev => ({
          ...prev,
          movingDate,
          returningDate
        }));
      }
    } catch (error) {
      console.error('Error handling date selection:', error);
      setDateError('خطا در انتخاب تاریخ');
    }
  };

  // Format date in Persian with validation
  const formatDate = (dateString) => {
    if (!dateString) return 'تاریخ نامعتبر';
    try {
      return new DateObject({
        date: dateString,
        calendar: persian,
        locale: persian_fa
      }).format();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاریخ نامعتبر';
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ticketType') {
      setSelectedDates([]);
      setFilters(prev => ({
        ...prev,
        movingDate: '',
        returningDate: '',
        [name]: value
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle search submission with validation
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!filters.firstCity || !filters.lastCity) {
      setDateError('لطفاً مبدا و مقصد را انتخاب کنید');
      return;
    }

    if (!isValidDate(filters.movingDate)) {
      setDateError('لطفاً تاریخ رفت معتبر انتخاب کنید');
      return;
    }

    if (filters.ticketType === 'twoSide' && !isValidDate(filters.returningDate)) {
      setDateError('لطفاً تاریخ برگشت معتبر انتخاب کنید');
      return;
    }

    await searchTickets(filters);
  };

  // Handle book now button click
  const handleBookNow = (busId) => {
    if (!isValidDate(filters.movingDate) || 
        (filters.ticketType === 'twoSide' && !isValidDate(filters.returningDate))) {
      setDateError('لطفاً تاریخ‌های معتبر انتخاب کنید');
      return;
    }

    navigate(`/confirm-booking-bus/${busId}`, {
      state: {
        ...filters,
        firstCityName: provincesCities.find(p => p.id === filters.firstCity)?.name,
        lastCityName: provincesCities.find(p => p.id === filters.lastCity)?.name
      }
    });
  };

  // Custom Range Date Picker component
  const RangeDatePicker = () => (
    <div className="absolute z-20 bg-white shadow-lg rounded-xl p-5 border border-gray-200 mt-2 w-full min-w-[580px]">
      {dateError && (
        <div className="text-red-500 mb-3 text-center text-sm">
          {dateError}
        </div>
      )}

      <Calendar
        value={selectedDates}
        onChange={handleDateRangeSelect}
        calendar={persian}
        locale={persian_fa}
        range={filters.ticketType === 'twoSide'}
        numberOfMonths={filters.ticketType === 'twoSide' ? 2 : 1}
        plugins={[
          <Toolbar 
            position="bottom"
            className="flex justify-between pt-4 mt-4 border-t border-gray-200"
          />
        ]}
        mapDays={({ date }) => {
          const today = new DateObject({ calendar: persian });
          const currentDate = new DateObject(date);
          if (currentDate.unix < today.unix) {
            return { disabled: true, style: { color: '#ccc' } };
          }
        }}
        className="w-full shadow-none border-none"
      />

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {selectedDates.length > 0 && (
            <>
              <span>انتخاب شده: </span>
              <span className="font-medium">
                {selectedDates.map(date => formatDate(date?.format('YYYY-MM-DD'))).join(' تا ')}
              </span>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setSelectedDates([]);
              setFilters(prev => ({
                ...prev,
                movingDate: '',
                returningDate: ''
              }));
              setDateError('');
            }}
            className="px-4 py-2 text-gray-500 bg-transparent border-none cursor-pointer text-sm"
          >
            پاک کردن
          </button>
          <button 
            onClick={() => {
              if (selectedDates.length === 0) {
                setDateError('لطفاً تاریخ رفت را انتخاب کنید');
              } else if (filters.ticketType === 'twoSide' && selectedDates.length < 2) {
                setDateError('لطفاً تاریخ برگشت را انتخاب کنید');
              } else {
                setShowDatePicker(false);
              }
            }}
            className="px-5 py-2 bg-amber-600 text-white rounded-md cursor-pointer text-sm font-medium"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto p-4 rtl font-[IRANSans]">
      {/* Search Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex items-end gap-4 flex-wrap">
            {/* Origin Province */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">مبدا</label>
              <select
                name="firstCity"
                value={filters.firstCity}
                onChange={handleFilterChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[left_0.5rem_center] bg-[length:1rem]"
                required
              >
                <option value="">-- انتخاب استان --</option>
                {provincesCities.map(province => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Province */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">مقصد</label>
              <select
                name="lastCity"
                value={filters.lastCity}
                onChange={handleFilterChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[left_0.5rem_center] bg-[length:1rem]"
                required
              >
                <option value="">-- انتخاب استان --</option>
                {provincesCities.map(province => (
                  <option key={province.id} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="flex-1 min-w-[250px] relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filters.ticketType === 'twoSide' ? 'بازه زمانی سفر' : 'تاریخ رفت'}
              </label>
              <div 
                className={`flex items-center px-3 py-3 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md cursor-pointer bg-white`}
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <svg className="w-5 h-5 ml-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">
                  {filters.movingDate ? formatDate(filters.movingDate) : 'انتخاب تاریخ'}
                </span>
                {filters.ticketType === 'twoSide' && filters.returningDate && (
                  <>
                    <span className="mx-2 text-gray-400">تا</span>
                    <span className="text-gray-700">
                      {formatDate(filters.returningDate)}
                    </span>
                  </>
                )}
              </div>
              
              {showDatePicker && <RangeDatePicker />}
              {dateError && !showDatePicker && (
                <p className="text-red-500 text-xs mt-1">{dateError}</p>
              )}
            </div>

            {/* Passenger count */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد مسافران</label>
              <input
                type="number"
                name="count"
                min="1"
                max="10"
                value={filters.count}
                onChange={handleFilterChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm transition-colors"
                required
              />
            </div>

            {/* Ticket type */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع بلیط</label>
              <div className="flex items-center gap-4 p-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ticketType"
                    value="oneSide"
                    checked={filters.ticketType === 'oneSide'}
                    onChange={handleFilterChange}
                    className="ml-2"
                  />
                  <span className="text-sm font-medium">یک طرفه</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ticketType"
                    value="twoSide"
                    checked={filters.ticketType === 'twoSide'}
                    onChange={handleFilterChange}
                    className="ml-2"
                  />
                  <span className="text-sm font-medium">دو طرفه</span>
                </label>
              </div>
            </div>

            {/* Search button */}
            <div className="flex-1 min-w-[150px]">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 bg-blue-900 text-white rounded-md border-none cursor-pointer text-base font-bold transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              >
                {loading ? 'در حال جستجو...' : 'جستجوی بلیط'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Search Results */}
      <div className="grid gap-5">
        {searchResults.length > 0 ? (
          searchResults.map(bus => (
            <div key={bus._id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bus details */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-500 ml-1">شرکت:</span>
                    <span className="font-medium mr-1">{bus.serviceProvider}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-gray-500 ml-1">مدل:</span>
                    <span className="font-medium mr-1">{bus.model}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-500 ml-1">تعداد صندلی خالی:</span>
                    <span className="font-medium mr-1">{bus.seats}</span>
                  </div>
                </div>

                {/* Trip details */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-500 ml-1">مبدا:</span>
                    <span className="font-medium mr-1">
                      {provincesCities
                        .find(p => p.cities.some(c => c.id === bus.driver.firstCity))?.name || 
                        bus.driver.firstCity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-gray-500 ml-1">مقصد:</span>
                    <span className="font-medium mr-1">
                      {provincesCities
                        .find(p => p.cities.some(c => c.id === bus.driver.lastCity))?.name || 
                        bus.driver.lastCity}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-500 ml-1">تاریخ حرکت:</span>
                    <span className="font-medium mr-1">{bus.driver.movingDate}</span>
                  </div>
                  {filters.ticketType === 'twoSide' && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 ml-1">تاریخ برگشت:</span>
                      <span className="font-medium mr-1">{bus.driver.returningDate}</span>
                    </div>
                  )}
                </div>

                {/* Price and booking */}
                <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">قیمت:</span>
                    <span className="font-bold text-xl text-amber-600 ltr inline-block">
                      {formatPrice(bus.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookNow(bus._id)}
                    className="w-full px-3 py-3 bg-green-600 text-white rounded-md border-none cursor-pointer font-bold transition-colors"
                  >
                    رزرو بلیط
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال جستجو...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg">نتیجه‌ای یافت نشد. لطفاً فیلترهای جستجو را تغییر دهید.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingBus;