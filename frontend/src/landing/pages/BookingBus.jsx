import { useState } from 'react';
import { useBusStore } from '../store/busStore';
import { useNavigate } from 'react-router-dom';
import { DateObject, Calendar } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';

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

  // Available cities
  const cities = [
    'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 
    'اهواز', 'قم', 'کرج', 'رشت', 'ارومیه'
  ];

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      direction: 'rtl',
      fontFamily: 'IRANSans, sans-serif'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#2c3e50'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      border: '1px solid #e2e8f0'
    },
    inputField: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s'
    },
    selectField: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.95rem',
      transition: 'border-color 0.2s',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left 0.5rem center',
      backgroundSize: '1rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    busCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1.25rem',
      border: '1px solid #f3f4f6',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    datePicker: {
      position: 'absolute',
      zIndex: 20,
      backgroundColor: 'white',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      border: '1px solid #e5e7eb',
      marginTop: '0.5rem',
      width: '100%',
      minWidth: '580px'
    }
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

    navigate(`/booking/${busId}`, {
      state: {
        ...filters
      }
    });
  };

  // Custom Range Date Picker component
  const RangeDatePicker = () => (
    <div style={styles.datePicker}>
      {dateError && (
        <div style={{
          color: '#ef4444',
          marginBottom: '0.75rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
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
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              marginTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}
          />
        ]}
        mapDays={({ date }) => {
          const today = new DateObject({ calendar: persian });
          const currentDate = new DateObject(date);
          if (currentDate.unix < today.unix) {
            return { disabled: true, style: { color: '#ccc' } };
          }
        }}
        style={{
          width: '100%',
          boxShadow: 'none',
          border: 'none'
        }}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {selectedDates.length > 0 && (
            <>
              <span>انتخاب شده: </span>
              <span style={{ fontWeight: 500 }}>
                {selectedDates.map(date => formatDate(date?.format('YYYY-MM-DD'))).join(' تا ')}
              </span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
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
            style={{
              padding: '0.5rem 1rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
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
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: '#d4af37',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>جستجوی بلیط اتوبوس</h1>

      {/* Search Filters */}
      <div style={styles.card}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            {/* City selectors */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>مبدا</label>
              <select
                name="firstCity"
                value={filters.firstCity}
                onChange={handleFilterChange}
                style={styles.selectField}
                required
              >
                <option value="">-- انتخاب کنید --</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>مقصد</label>
              <select
                name="lastCity"
                value={filters.lastCity}
                onChange={handleFilterChange}
                style={styles.selectField}
                required
              >
                <option value="">-- انتخاب کنید --</option>
                {cities.filter(c => c !== filters.firstCity).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                {filters.ticketType === 'twoSide' ? 'بازه زمانی سفر' : 'تاریخ رفت'}
              </label>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: `1px solid ${dateError ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <svg style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  marginLeft: '0.75rem',
                  color: '#6b7280'
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span style={{ color: '#374151' }}>
                  {filters.movingDate ? formatDate(filters.movingDate) : 'انتخاب تاریخ'}
                </span>
                {filters.ticketType === 'twoSide' && filters.returningDate && (
                  <>
                    <span style={{ margin: '0 0.5rem', color: '#9ca3af' }}>تا</span>
                    <span style={{ color: '#374151' }}>
                      {formatDate(filters.returningDate)}
                    </span>
                  </>
                )}
              </div>
              
              {showDatePicker && <RangeDatePicker />}
              {dateError && !showDatePicker && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>{dateError}</p>
              )}
            </div>

            {/* Passenger count */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>تعداد مسافران</label>
              <input
                type="number"
                name="count"
                min="1"
                max="10"
                value={filters.count}
                onChange={handleFilterChange}
                style={styles.inputField}
                required
              />
            </div>
          </div>

          {/* Ticket type */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              backgroundColor: '#f3f4f6',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="ticketType"
                  value="oneSide"
                  checked={filters.ticketType === 'oneSide'}
                  onChange={handleFilterChange}
                  style={{ marginLeft: '0.75rem' }}
                />
                <span style={{ fontWeight: 500 }}>یک طرفه</span>
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="ticketType"
                  value="twoSide"
                  checked={filters.ticketType === 'twoSide'}
                  onChange={handleFilterChange}
                  style={{ marginLeft: '0.75rem' }}
                />
                <span style={{ fontWeight: 500 }}>دو طرفه</span>
              </label>
            </div>
          </div>

          {/* Search button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              {loading ? 'در حال جستجو...' : 'جستجوی بلیط'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          borderLeft: '4px solid #ef4444',
          color: '#b91c1c',
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Search Results */}
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {searchResults.length > 0 ? (
          searchResults.map(bus => (
            <div key={bus._id} style={{
              ...styles.busCard,
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Bus details */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>شرکت:</span>
                    <span style={{ fontWeight: 500 }}>{bus.serviceProvider}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>مدل:</span>
                    <span style={{ fontWeight: 500 }}>{bus.model}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>تعداد صندلی خالی:</span>
                    <span style={{ fontWeight: 500 }}>{bus.seats}</span>
                  </div>
                </div>

                {/* Trip details */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>مبدا:</span>
                    <span style={{ fontWeight: 500 }}>{bus.driver.firstCity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>مقصد:</span>
                    <span style={{ fontWeight: 500 }}>{bus.driver.lastCity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style={{ color: '#6b7280' }}>تاریخ حرکت:</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(bus.driver.movingDate)}</span>
                  </div>
                  {filters.ticketType === 'twoSide' && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span style={{ color: '#6b7280' }}>تاریخ برگشت:</span>
                      <span style={{ fontWeight: 500 }}>{formatDate(bus.driver.returningDate)}</span>
                    </div>
                  )}
                </div>

                {/* Price and booking */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ color: '#6b7280' }}>قیمت:</span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.25rem', 
                      color: '#d4af37',
                      direction: 'ltr',
                      display: 'inline-block'
                    }}>
                      {formatPrice(bus.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookNow(bus._id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#059669'
                      }
                    }}
                  >
                    رزرو بلیط
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{
                  animation: 'spin 1s linear infinite',
                  marginLeft: '0.75rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  color: '#6b7280'
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال جستجو...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <svg style={{ width: '3rem', height: '3rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>نتیجه‌ای یافت نشد. لطفاً فیلترهای جستجو را تغییر دهید.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingBus;