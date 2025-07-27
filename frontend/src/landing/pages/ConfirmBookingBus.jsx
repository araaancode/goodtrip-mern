import React, { useRef } from 'react';
import { FaBus, FaUser, FaCalendarAlt, FaClock, FaChair, FaMapMarkerAlt, FaDownload, FaPrint } from 'react-icons/fa';

const ConfirmBookingBus = () => {
  // Sample ticket data
  const ticket = {
    bookingId: 'بلیط۷۸۹۴۵۶۱۲',
    passengerName: 'محمد رضایی',
    from: 'تهران',
    to: 'مشهد',
    date: '۱۴۰۲/۰۸/۲۵',
    departureTime: '۰۸:۳۰ صبح',
    arrivalTime: '۱۲:۴۵ بعدازظهر',
    seatNumber: 'A۱۲',
    busType: 'اتوبوس VIP',
    fare: '۴۵۰,۰۰۰ تومان',
    boardingPoint: 'ترمینال جنوب، میدان راه آهن',
    dropPoint: 'ترمینال مشهد، بلوار آزادی',
    duration: '۴ ساعت ۱۵ دقیقه',
    busNumber: '۷۴۳۵',
    ticketNumber: '۱۲۳۴۵۶'
  };

  const ticketRef = useRef();

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');
    
    const input = ticketRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', [120, 150]); // Wider ticket size (120mm width)
    pdf.addImage(imgData, 'PNG', 0, 0, 120, 150);
    pdf.save(`بلیط-اتوبوس-${ticket.bookingId}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-lg mx-auto"> {/* Increased container width */}
        <div className="text-center mb-8">
          <h1 className="mt-2 text-indigo-600">لطفا بلیط خود را ذخیره یا چاپ کنید</h1>
        </div>

        {/* Wider Ticket Design */}
        <div className="relative mb-8">
          {/* Ticket */}
          <div 
            ref={ticketRef} 
            className="bg-white border-2 border-indigo-500 rounded-lg shadow-lg overflow-hidden w-6xl mx-auto print:max-w-none print:shadow-none"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #ffffff, #f0f4ff)',
              borderStyle: 'dashed',
              borderWidth: '2px'
            }}
          >
            {/* Ticket Header */}
            <div className="bg-indigo-600 p-3 text-white text-center">
              <h2 className="text-xl font-bold">{ticket.busType}</h2>
              <div className="flex justify-center gap-4 mt-1 text-xs">
                <p>شماره اتوبوس: {ticket.busNumber}</p>
                <p>شماره بلیط: {ticket.ticketNumber}</p>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-4">
              {/* Route Information */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b">
                <div className="text-center">
                  <p className="text-sm text-gray-500">مبدا</p>
                  <p className="font-bold text-lg">{ticket.from}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaBus className="text-indigo-600 text-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">مقصد</p>
                  <p className="font-bold text-lg">{ticket.to}</p>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <FaUser className="text-indigo-600 ml-2" />
                  <div>
                    <p className="text-gray-500">مسافر</p>
                    <p className="font-medium">{ticket.passengerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <FaCalendarAlt className="text-indigo-600 ml-2" />
                  <div>
                    <p className="text-gray-500">تاریخ حرکت</p>
                    <p className="font-medium">{ticket.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <FaClock className="text-indigo-600 ml-2" />
                  <div>
                    <p className="text-gray-500">ساعت حرکت</p>
                    <p className="font-medium">{ticket.departureTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <FaClock className="text-indigo-600 ml-2" />
                  <div>
                    <p className="text-gray-500">ساعت رسیدن</p>
                    <p className="font-medium">{ticket.arrivalTime}</p>
                  </div>
                </div>
              </div>

              {/* Boarding and Seat Info */}
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <FaChair className="text-indigo-600 ml-2" />
                  <div>
                    <p className="text-gray-500">شماره صندلی</p>
                    <p className="font-medium">{ticket.seatNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-indigo-50 p-2 rounded">
                  <div>
                    <p className="text-gray-500">قیمت بلیط</p>
                    <p className="font-medium text-indigo-600">{ticket.fare}</p>
                  </div>
                </div>
              </div>

              {/* Boarding Points */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start bg-indigo-50 p-2 rounded">
                  <FaMapMarkerAlt className="text-indigo-600 ml-2 mt-1" />
                  <div>
                    <p className="text-gray-500">محل سوار شدن</p>
                    <p className="font-medium">{ticket.boardingPoint}</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-indigo-50 p-2 rounded">
                  <FaMapMarkerAlt className="text-indigo-600 ml-2 mt-1" />
                  <div>
                    <p className="text-gray-500">محل پیاده شدن</p>
                    <p className="font-medium">{ticket.dropPoint}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="bg-indigo-600 p-2 text-center text-xs text-white">
              <div className="flex justify-between px-4">
                <p>مدت سفر: {ticket.duration}</p>
                <p>شماره رزرو: {ticket.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Ticket Notches */}
          
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 print:hidden">
          <div className="flex flex-col space-y-4">
            <button 
              onClick={handlePrint}
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
            >
              چاپ بلیط
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
            >
              دانلود بلیط (PDF)
            </button>

               <button 
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
            >
              رزرو نهایی بلیط 
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-6 print:hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">راهنمای سفر</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-indigo-600 ml-2">•</span>
              لطفاً حداقل ۴۵ دقیقه قبل از حرکت در محل سوار شدن حاضر باشید
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 ml-2">•</span>
              کارت شناسایی معتبر همراه داشته باشید
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 ml-2">•</span>
              بلیط چاپ شده یا دیجیتال خود را به راننده نشان دهید
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 ml-2">•</span>
              شرایط کنسلی: تا ۲۴ ساعت قبل از حرکت امکان کنسلی وجود دارد
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingBus;