import { useState, useEffect } from 'react';
import { useBusStore, useBookingStore, useUserStore } from '../store/busStore';

const ConfirmBookingBus = () => {
  // Zustand stores
  const { currentBus, bookTicket, loading, error } = useBusStore();
  const { 
    selectedSeats, 
    passengerDetails, 
    setSelectedSeats, 
    setPassengerDetails, 
    setBookingStep, 
    bookingStep,
    resetBooking
  } = useBookingStore();
  const { user, isAuthenticated } = useUserStore();

  // Local state
  const [ticketType, setTicketType] = useState('oneSide');
  const [movingDate, setMovingDate] = useState('');
  const [returningDate, setReturningDate] = useState('');
  const [passengers, setPassengers] = useState([{ name: '', nationalCode: '' }]);

  // Handle seat selection
  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < passengers.length) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  // Handle passenger input change
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  // Add more passengers
  const addPassenger = () => {
    if (passengers.length < currentBus?.seats) {
      setPassengers([...passengers, { name: '', nationalCode: '' }]);
    }
  };

  // Remove passenger
  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = [...passengers];
      updatedPassengers.splice(index, 1);
      setPassengers(updatedPassengers);
      // Also remove the corresponding seat if selected
      if (selectedSeats[index]) {
        const updatedSeats = [...selectedSeats];
        updatedSeats.splice(index, 1);
        setSelectedSeats(updatedSeats);
      }
    }
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!isAuthenticated) {
      alert('لطفاً برای رزرو بلیط وارد حساب کاربری خود شوید');
      return;
    }

    if (selectedSeats.length !== passengers.length) {
      alert('لطفاً برای همه مسافران صندلی انتخاب کنید');
      return;
    }

    const ticketData = {
      busId: currentBus._id,
      passengers: passengers.map((p, index) => ({
        name: p.name,
        nationalCode: p.nationalCode,
        price: currentBus.price,
        seatNumber: selectedSeats[index]
      })),
      firstCity: currentBus.driver.firstCity,
      lastCity: currentBus.driver.lastCity,
      movingDate: new Date(movingDate),
      returningDate: ticketType === 'twoSide' ? new Date(returningDate) : undefined,
      ticketType,
    };

    await bookTicket(ticketData);
    resetBooking();
    setBookingStep(1);
  };

  // Render seat map
  const renderSeatMap = () => {
    const seats = [];
    for (let i = 1; i <= currentBus?.capacity; i++) {
      const isBooked = currentBus?.seats < i;
      const isSelected = selectedSeats.includes(i);
      
      seats.push(
        <button
          key={i}
          onClick={() => !isBooked && handleSeatSelect(i)}
          disabled={isBooked}
          className={`w-10 h-10 m-1 rounded-md flex items-center justify-center
            ${isBooked ? 'bg-gray-300 cursor-not-allowed' : 
              isSelected ? 'bg-green-500 text-white' : 'bg-blue-100 hover:bg-blue-200'}
          `}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  // Steps for booking process
  const steps = [
    { id: 1, name: 'نوع بلیط' },
    { id: 2, name: 'اطلاعات مسافران' },
    { id: 3, name: 'انتخاب صندلی' },
    { id: 4, name: 'تایید نهایی' },
  ];

  // Persian date formatter
  const formatPersianDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl" dir="rtl">
      {/* Booking Steps */}
      <nav className="flex items-center justify-center mb-8">
        <ol className="flex items-center space-x-4">
          {steps.map((step) => (
            <li key={step.id}>
              <div className={`flex items-center ${bookingStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                {bookingStep > step.id ? (
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                ) : (
                  <span className={`flex items-center justify-center w-8 h-8 border-2 rounded-full ${bookingStep === step.id ? 'border-blue-600' : 'border-gray-300'}`}>
                    {step.id}
                  </span>
                )}
                <span className={`ml-2 text-sm font-medium ${bookingStep === step.id ? 'text-blue-600' : ''}`}>
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Step 1: Ticket Type */}
      {bookingStep === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">انتخاب نوع بلیط</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setTicketType('oneSide')}
              className={`px-4 py-2 rounded-md ${ticketType === 'oneSide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              یک طرفه
            </button>
            <button
              onClick={() => setTicketType('twoSide')}
              className={`px-4 py-2 rounded-md ${ticketType === 'twoSide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              دو طرفه
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ رفت</label>
              <input
                type="date"
                value={movingDate}
                onChange={(e) => setMovingDate(e.target.value)}
                className="w-full p-2 border rounded-md text-left"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            {ticketType === 'twoSide' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ برگشت</label>
                <input
                  type="date"
                  value={returningDate}
                  onChange={(e) => setReturningDate(e.target.value)}
                  className="w-full p-2 border rounded-md text-left"
                  min={movingDate || new Date().toISOString().split('T')[0]}
                  disabled={!movingDate}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => setBookingStep(2)}
              disabled={!movingDate || (ticketType === 'twoSide' && !returningDate)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              مرحله بعد
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Passenger Details */}
      {bookingStep === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">اطلاعات مسافران</h2>
          
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">مسافر {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded-md text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                  <input
                    type="text"
                    value={passenger.nationalCode}
                    onChange={(e) => handlePassengerChange(index, 'nationalCode', e.target.value)}
                    className="w-full p-2 border rounded-md text-left"
                    required
                  />
                </div>
              </div>
              {passengers.length > 1 && (
                <button
                  onClick={() => removePassenger(index)}
                  className="text-red-600 text-sm"
                >
                  حذف مسافر
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setBookingStep(3)}
              disabled={passengers.some(p => !p.name || !p.nationalCode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              مرحله بعد
            </button>
            <div className="flex space-x-2">
              {passengers.length < currentBus?.seats && (
                <button
                  onClick={addPassenger}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  افزودن مسافر
                </button>
              )}
              <button
                onClick={() => setBookingStep(1)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
              بازگشت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Select Seats */}
      {bookingStep === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">انتخاب صندلی</h2>
          <p className="mb-4">تعداد صندلی های خالی: {currentBus?.seats}</p>
          
          <div className="mb-6">
            <div className="flex flex-wrap justify-center">
              {renderSeatMap()}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 ml-2"></div>
                <span>خالی</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 ml-2"></div>
                <span>انتخاب شده</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 ml-2"></div>
                <span>رزرو شده</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setBookingStep(4)}
              disabled={selectedSeats.length !== passengers.length}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              مرحله بعد
            </button>
            <button
              onClick={() => setBookingStep(2)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm Booking */}
      {bookingStep === 4 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">تایید نهایی</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">جزئیات سفر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">مبدا:</p>
                <p className="font-medium">{currentBus?.driver.firstCity}</p>
              </div>
              <div>
                <p className="text-gray-600">مقصد:</p>
                <p className="font-medium">{currentBus?.driver.lastCity}</p>
              </div>
              <div>
                <p className="text-gray-600">تاریخ رفت:</p>
                <p className="font-medium">{formatPersianDate(movingDate)}</p>
              </div>
              {ticketType === 'twoSide' && (
                <div>
                  <p className="text-gray-600">تاریخ برگشت:</p>
                  <p className="font-medium">{formatPersianDate(returningDate)}</p>
                </div>
              )}
            </div>

            <h3 className="font-medium mb-2 mt-4">اطلاعات مسافران</h3>
            {passengers.map((passenger, index) => (
              <div key={index} className="mb-2 p-3 border rounded-lg">
                <p className="font-medium">مسافر {index + 1}</p>
                <p>نام: {passenger.name}</p>
                <p>کد ملی: {passenger.nationalCode}</p>
                <p>شماره صندلی: {selectedSeats[index]}</p>
              </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">خلاصه پرداخت</h3>
              <p>قیمت بلیط: {currentBus?.price.toLocaleString('fa-IR')} تومان × {passengers.length}</p>
              <p className="font-bold mt-2">مجموع: {(currentBus?.price * passengers.length).toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال پردازش...' : 'تایید و پرداخت'}
            </button>
            <button
              onClick={() => setBookingStep(3)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmBookingBus;