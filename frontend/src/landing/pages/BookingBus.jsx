import { useState, useEffect, useRef } from 'react';
import { useBusStore } from '../store/busStore';
import { useNavigate } from 'react-router-dom';
import { DateObject, Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import provincesCities from '../../provinces_cities.json';

// Custom Select Component with TailwindCSS styling
const CustomSelect = ({ options, value, onChange, placeholder, isSearchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);

  useEffect(() => {
    if (isSearchable && searchTerm) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, isSearchable]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={selectRef}>
      <div
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-500'}>
          {value ? value.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isSearchable && (
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          )}
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer transition-colors hover:bg-blue-50 ${
                    value && value.value === option.value ? 'bg-blue-100 text-blue-700 font-medium' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">گزینه‌ای یافت نشد</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Always show first page
  if (totalPages > 0) pages.push(1);
  
  // Show ellipsis if needed
  if (currentPage > 3) {
    pages.push('...');
  }
  
  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }
  
  // Show ellipsis if needed
  if (currentPage < totalPages - 2) {
    pages.push('...');
  }
  
  // Always show last page if there is more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
        >
          قبلی
        </button>
        
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border text-sm sm:text-base ${
                currentPage === page 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
        >
          بعدی
        </button>
      </nav>
    </div>
  );
};

const BookingBus = () => {
  const { searchResults, searchTickets, loading, error, bookTicket } = useBusStore();
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

  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Prepare options for custom select
  const cityOptions = provincesCities.map(province => ({
    value: province.name,
    label: province.name
  }));

  const passengerCountOptions = [
    { value: 1, label: '۱ مسافر' },
    { value: 2, label: '۲ مسافر' },
    { value: 3, label: '۳ مسافر' },
    { value: 4, label: '۴ مسافر' },
    { value: 5, label: '۵ مسافر' },
    { value: 6, label: '۶ مسافر' },
    { value: 7, label: '۷ مسافر' },
    { value: 8, label: '۸ مسافر' },
    { value: 9, label: '۹ مسافر' },
    { value: 10, label: '۱۰ مسافر' }
  ];

  // Refs for click outside detection
  const datePickerRef = useRef(null);

  useEffect(() => {
    // Close date picker when clicking outside
    const handleClickOutside = (e) => {
      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

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

  // Handle filter changes for custom select components
  const handleSelectChange = (name, selectedOption) => {
    setFilters(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle ticket type change
  const handleTicketTypeChange = (e) => {
    const { value } = e.target;
    setSelectedDates([]);
    setFilters(prev => ({
      ...prev,
      movingDate: '',
      returningDate: '',
      ticketType: value
    }));
  };

  // Handle search submission with validation
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setDateError('');
    setCurrentPage(1); // Reset to first page on new search

    if (!filters.firstCity || !filters.lastCity) {
      setDateError('لطفا مبدا و مقصد را انتخاب کنید');
      setIsSearching(false);
      return;
    }

    if (!isValidDate(filters.movingDate)) {
      setDateError('لطفا تاریخ رفت معتبر انتخاب کنید');
      setIsSearching(false);
      return;
    }

    if (filters.ticketType === 'twoSide' && !isValidDate(filters.returningDate)) {
      setDateError('لطفا تاریخ برگشت معتبر انتخاب کنید');
      setIsSearching(false);
      return;
    }

    await searchTickets(filters);
    setIsSearching(false);
  };

  // Handle book now button click
  const handleBookNow = async (busId) => {
    if (!isValidDate(filters.movingDate) ||
      (filters.ticketType === 'twoSide' && !isValidDate(filters.returningDate))) {
      setDateError('لطفا تاریخ‌های معتبر انتخاب کنید');
      return;
    }

    let newTicket = await bookTicket({
      firstCity: filters.firstCity,
      lastCity: filters.lastCity,
      ticketType: filters.ticketType,
      movingDate: filters.movingDate,
      returningDate: filters.returningDate,
      bus: busId,
      count: filters.count
    });

    if (newTicket && newTicket._id) {
      navigate(`/confirm-bus-ticket/${newTicket._id}`, {
        state: {
          ...filters,
          firstCityName: provincesCities.find(p => p.id === filters.firstCity)?.name,
          lastCityName: provincesCities.find(p => p.id === filters.lastCity)?.name
        }
      });
    }
  };

  // Custom Range Date Picker component
  const RangeDatePicker = () => (
    <div 
      className="date-picker-container absolute z-50 bg-white shadow-lg rounded-xl p-3 sm:p-5 border border-gray-200 mt-2 w-full max-w-[95vw] sm:min-w-[580px] left-1/2 transform -translate-x-1/2"
      ref={datePickerRef}
    >
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
        numberOfMonths={window.innerWidth < 640 ? 1 : (filters.ticketType === 'twoSide' ? 2 : 1)}
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

      <div className="flex flex-col sm:flex-row justify-between items-center mt-5 pt-4 border-t border-gray-200 gap-3">
        <div className="text-sm text-gray-500 text-center sm:text-right">
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
            type="button"
            onClick={() => {
              setSelectedDates([]);
              setFilters(prev => ({
                ...prev,
                movingDate: '',
                returningDate: ''
              }));
              setDateError('');
            }}
            className="px-3 py-2 text-gray-500 bg-transparent border-none cursor-pointer text-sm"
          >
            پاک کردن
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedDates.length === 0) {
                setDateError('لطفا تاریخ رفت را انتخاب کنید');
              } else if (filters.ticketType === 'twoSide' && selectedDates.length < 2) {
                setDateError('لطفا تاریخ برگشت را انتخاب کنید');
              } else {
                setShowDatePicker(false);
              }
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer text-sm font-medium"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto rtl font-[IRANSans] px-2 sm:px-4">
      {/* Hero Section with Background Image Only */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-5 h-40 sm:h-60 top-5 sm:top-10 mx-2">
        {/* Background Image - Half Visible */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/811029/pexels-photo-811029.jpeg')",
            height: "100%",
            bottom: 0
          }}
        ></div>
      </div>

      {/* Search Filters */}
      <div className="relative -mt-16 sm:-mt-20 mx-2 sm:mx-4 z-20">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Origin Province */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">مبدا</label>
                <CustomSelect
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === filters.firstCity) || null}
                  onChange={(selectedOption) => handleSelectChange('firstCity', selectedOption)}
                  placeholder="انتخاب استان"
                  isSearchable={true}
                />
              </div>

              {/* Destination Province */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">مقصد</label>
                <CustomSelect
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === filters.lastCity) || null}
                  onChange={(selectedOption) => handleSelectChange('lastCity', selectedOption)}
                  placeholder="انتخاب استان"
                  isSearchable={true}
                />
              </div>

              {/* Date Picker */}
              <div className="relative md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filters.ticketType === 'twoSide' ? 'بازه زمانی سفر' : 'تاریخ رفت'}
                </label>
                <div
                  className={`flex items-center px-4 py-3 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-white transition-all hover:border-blue-400`}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <svg className="w-5 h-5 ml-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 text-sm truncate">
                    {filters.movingDate ? formatDate(filters.movingDate) : 'انتخاب تاریخ'}
                  </span>
                  {filters.ticketType === 'twoSide' && filters.returningDate && (
                    <>
                      <span className="mx-2 text-gray-400 flex-shrink-0">تا</span>
                      <span className="text-gray-700 text-sm truncate">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تعداد مسافران</label>
                <CustomSelect
                  options={passengerCountOptions}
                  value={passengerCountOptions.find(option => option.value === filters.count) || null}
                  onChange={(selectedOption) => handleSelectChange('count', selectedOption)}
                  placeholder="تعداد مسافران"
                />
              </div>

              {/* Ticket type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع بلیط</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg flex-wrap">
                  <label className="flex items-center cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name="ticketType"
                      value="oneSide"
                      checked={filters.ticketType === 'oneSide'}
                      onChange={handleTicketTypeChange}
                      className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">یک طرفه</span>
                  </label>
                  <label className="flex items-center cursor-pointer whitespace-nowrap">
                    <input
                      type="radio"
                      name="ticketType"
                      value="twoSide"
                      checked={filters.ticketType === 'twoSide'}
                      onChange={handleTicketTypeChange}
                      className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">دو طرفه</span>
                  </label>
                </div>
              </div>

              {/* Search button */}
              <div className="flex items-end md:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg border-none cursor-pointer text-sm sm:text-base font-bold transition-all shadow-md hover:shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال جستجو...
                    </span>
                  ) : (
                    'جستجوی بلیط'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="px-2 sm:px-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Search Results */}
        <div className="mb-8">
          
          <div className="grid gap-4 sm:gap-5">
            {searchResults.length > 0 ? (
              <>
                {currentItems.map(bus => (
                  <div key={bus._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {/* Bus details */}
                      <div className="grid gap-2 sm:gap-3">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">شرکت:</span>
                            <span className="font-medium block mr-1 truncate">{bus.serviceProvider}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">مدل:</span>
                            <span className="font-medium block mr-1 truncate">{bus.model}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">تعداد صندلی خالی:</span>
                            <span className="font-medium block mr-1">{bus.seats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Trip details */}
                      <div className="grid gap-2 sm:gap-3">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">مبدا:</span>
                            <span className="font-medium block mr-1 truncate">
                              {provincesCities
                                .find(p => p.cities.some(c => c.id === bus.driver.firstCity))?.name ||
                                bus.driver.firstCity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">مقصد:</span>
                            <span className="font-medium block mr-1 truncate">
                              {provincesCities
                                .find(p => p.cities.some(c => c.id === bus.driver.lastCity))?.name ||
                                bus.driver.lastCity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-100 rounded-lg ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-500 text-xs">تاریخ حرکت:</span>
                            <span className="font-medium block mr-1 truncate">{bus.driver.movingDate}</span>
                          </div>
                        </div>
                        {filters.ticketType === 'twoSide' && (
                          <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg ml-2 flex-shrink-0">
                              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <span className="text-gray-500 text-xs">تاریخ برگشت:</span>
                              <span className="font-medium block mr-1 truncate">{bus.driver.returningDate}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and booking */}
                      <div className="flex flex-col justify-between gap-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500 text-sm sm:text-base">قیمت:</span>
                          <span className="font-bold text-lg sm:text-xl text-orange-500 ltr inline-block">
                            {formatPrice(bus.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookNow(bus._id)}
                          className="w-full px-3 py-2 sm:py-3 bg-white text-green-600 border-2 border-green-600 border-dashed rounded-lg cursor-pointer font-bold transition-all hover:bg-green-50 hover:shadow-md text-sm sm:text-base"
                        >
                          رزرو بلیط
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            ) : isSearching ? (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 text-center">
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
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-base sm:text-lg">نتیجه‌ای یافت نشد. لطفا فیلترهای جستجو را تغییر دهید.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img 
                      src="../images/bookingbus/bookingbus.png" 
                      alt="Search for bus tickets" 
                      className="w-80 h-40 sm:w-100 sm:h-50 object-cover rounded-lg opacity-90 mx-auto"
                    />
                  </div>
                  <p className="text-gray-500 text-base sm:text-lg">برای مشاهده نتایج، جستجو کنید.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBus;