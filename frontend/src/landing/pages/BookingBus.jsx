// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import Spinner from 'react-spinner';
// import DatePicker from 'react-datepicker2';
// import './BookingBus.css'



// import moment from 'moment';

// const itemsPerPage = 8;

// const BookingBus = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const travelDate = queryParams.get('travelDate') || '';
//   const passengers = queryParams.get('passengers') || '1';

//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [origin, setOrigin] = useState('');
//   const [destination, setDestination] = useState('');
//   const [departureDate, setDepartureDate] = useState('');
//   const [returnDate, setReturnDate] = useState('');
//   const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
//   const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
//   const [filteredOriginCities, setFilteredOriginCities] = useState([]);
//   const [filteredDestinationCities, setFilteredDestinationCities] = useState([]);
//   const [isRoundTrip, setIsRoundTrip] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   // Enhanced filters state
//   const [filters, setFilters] = useState({
//     company: [],
//     departureTime: [],
//     busType: [],
//     priceRange: [0, 1000000],
//     amenities: [],
//     driverExperience: [],
//     driverRating: 0,
//     driverAvailability: false,
//     capacity: [],
//     serviceProvider: [],
//     hasAC: null,
//     options: []
//   });

//   const [sortBy, setSortBy] = useState('earliest');

//   const activeLink = {
//     bus: true
//   };

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     async function searchBuses() {
//       try {
//         // Enhanced mock data with driver information
//         const mockBuses = [
//           {
//             _id: '1',
//             company: 'هما',
//             type: 'VIP',
//             origin: 'تهران',
//             destination: 'مشهد',
//             departureTime: '2023-06-15T08:00:00',
//             arrivalTime: '2023-06-15T16:00:00',
//             duration: '8',
//             price: 350000,
//             amenities: ['تهویه مطبوع', 'یخچال', 'Wi-Fi'],
//             seats: 30,
//             availableSeats: 15,
//             driver: {
//               _id: 'driver1',
//               name: 'رضا محمدی',
//               avatar: '/driver1.jpg',
//               rating: 4.5,
//               yearsOfExperience: 7,
//               isAvailable: true,
//               phone: '09123456789'
//             }
//           },
//           {
//             _id: '2',
//             company: 'سپاهان',
//             type: 'لوکس',
//             origin: 'تهران',
//             destination: 'مشهد',
//             departureTime: '2023-06-15T10:30:00',
//             arrivalTime: '2023-06-15T18:30:00',
//             duration: '8',
//             price: 280000,
//             amenities: ['تهویه مطبوع', 'تلویزیون'],
//             seats: 36,
//             availableSeats: 20,
//             driver: {
//               _id: 'driver2',
//               name: 'علی احمدی',
//               avatar: '/driver2.jpg',
//               rating: 4.2,
//               yearsOfExperience: 5,
//               isAvailable: true,
//               phone: '09123456780'
//             }
//           },
//           {
//             _id: '3',
//             company: 'ایران پیما',
//             type: 'معمولی',
//             origin: 'تهران',
//             destination: 'مشهد',
//             departureTime: '2023-06-15T23:30:00',
//             arrivalTime: '2023-06-16T07:30:00',
//             duration: '8',
//             price: 180000,
//             amenities: ['تهویه مطبوع'],
//             seats: 40,
//             availableSeats: 10,
//             driver: {
//               _id: 'driver3',
//               name: 'محمد حسینی',
//               avatar: '/driver3.jpg',
//               rating: 3.8,
//               yearsOfExperience: 3,
//               isAvailable: false,
//               phone: '09123456781'
//             }
//           }
//         ];

//         setBuses(mockBuses);
//         const timer = setTimeout(() => setLoading(false), 1000);
//         return () => clearTimeout(timer);
//       } catch (err) {
//         console.error(err);
//         setError('خطا در بارگذاری نتایج جستجو');
//         setLoading(false);
//       }
//     }

//     searchBuses();
//   }, [origin, destination, travelDate, passengers]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

//   const persianCities = [
//     { id: 1, name: 'تهران', province: 'تهران' },
//     { id: 2, name: 'مشهد', province: 'خراسان رضوی' },
//     { id: 3, name: 'اصفهان', province: 'اصفهان' },
//     { id: 4, name: 'شیراز', province: 'فارس' },
//     { id: 5, name: 'تبریز', province: 'آذربایجان شرقی' },
//     { id: 6, name: 'کرج', province: 'البرز' },
//     { id: 7, name: 'قم', province: 'قم' },
//     { id: 8, name: 'اهواز', province: 'خوزستان' },
//     { id: 9, name: 'کرمانشاه', province: 'کرمانشاه' },
//     { id: 10, name: 'ارومیه', province: 'آذربایجان غربی' },
//     { id: 11, name: 'رشت', province: 'گیلان' },
//     { id: 12, name: 'زاهدان', province: 'سیستان و بلوچستان' },
//     { id: 13, name: 'همدان', province: 'همدان' },
//     { id: 14, name: 'کرمان', province: 'کرمان' },
//     { id: 15, name: 'یزد', province: 'یزد' },
//     { id: 16, name: 'اردبیل', province: 'اردبیل' },
//     { id: 17, name: 'بندر عباس', province: 'هرمزگان' },
//     { id: 18, name: 'قزوین', province: 'قزوین' },
//     { id: 19, name: 'گرگان', province: 'گلستان' },
//     { id: 20, name: 'ساری', province: 'مازندران' },
//   ];

//   const originRef = useRef(null);
//   const destinationRef = useRef(null);
//   const datePickerRef = useRef(null);

//   useEffect(() => {
//     if (origin.length > 1) {
//       const filtered = persianCities.filter(city =>
//         city.name.includes(origin) || city.province.includes(origin)
//       );
//       setFilteredOriginCities(filtered);
//       setShowOriginSuggestions(true);
//     } else {
//       setFilteredOriginCities([]);
//       setShowOriginSuggestions(false);
//     }
//   }, [origin]);

//   useEffect(() => {
//     if (destination.length > 1) {
//       const filtered = persianCities.filter(city =>
//         city.name.includes(destination) || city.province.includes(destination)
//       );
//       setFilteredDestinationCities(filtered);
//       setShowDestinationSuggestions(true);
//     } else {
//       setFilteredDestinationCities([]);
//       setShowDestinationSuggestions(false);
//     }
//   }, [destination]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (originRef.current && !originRef.current.contains(event.target)) {
//         setShowOriginSuggestions(false);
//       }
//       if (destinationRef.current && !destinationRef.current.contains(event.target)) {
//         setShowDestinationSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleOriginSelect = (city) => {
//     setOrigin(city.name);
//     setShowOriginSuggestions(false);
//   };

//   const handleDestinationSelect = (city) => {
//     setDestination(city.name);
//     setShowDestinationSuggestions(false);
//   };

//   const handleSearch = async () => {
//     if (!origin || !destination || !departureDate) {
//       alert('لطفا مبدا، مقصد و تاریخ رفت را وارد کنید');
//       return;
//     }

//     if (isRoundTrip && !returnDate) {
//       alert('لطفا تاریخ برگشت را وارد کنید');
//       return;
//     }

//     setIsSearching(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//     } catch (error) {
//       console.error('Error searching for tickets:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const swapCities = () => {
//     const temp = origin;
//     setOrigin(destination);
//     setDestination(temp);
//   };

//   const handleFilterChange = (filterType, value) => {
//     setFilters(prev => {
//       const newFilters = { ...prev };
//       if (filterType === 'priceRange') {
//         newFilters[filterType] = value;
//       } else if (filterType === 'driverRating') {
//         newFilters[filterType] = value;
//       } else if (filterType === 'driverAvailability') {
//         newFilters[filterType] = value;
//       } else {
//         const index = newFilters[filterType].indexOf(value);
//         if (index === -1) {
//           newFilters[filterType] = [...newFilters[filterType], value];
//         } else {
//           newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
//         }
//       }
//       return newFilters;
//     });
//   };

//   const applyFilters = (buses) => {
//     return buses.filter(bus => {
//       if (filters.company.length > 0 && !filters.company.includes(bus.company)) {
//         return false;
//       }

//       if (filters.busType.length > 0 && !filters.busType.includes(bus.type)) {
//         return false;
//       }

//       if (bus.price < filters.priceRange[0] || bus.price > filters.priceRange[1]) {
//         return false;
//       }

//       if (filters.amenities.length > 0) {
//         const hasAllAmenities = filters.amenities.every(amenity =>
//           bus.amenities.includes(amenity)
//         );
//         if (!hasAllAmenities) return false;
//       }

//       // Driver experience filter
//       if (filters.driverExperience.length > 0 && bus.driver) {
//         const driverExp = bus.driver.yearsOfExperience || 0;
//         const matchesExp = filters.driverExperience.some(range => {
//           if (range === '0-2') return driverExp >= 0 && driverExp <= 2;
//           if (range === '3-5') return driverExp >= 3 && driverExp <= 5;
//           if (range === '5+') return driverExp > 5;
//           return false;
//         });
//         if (!matchesExp) return false;
//       }

//       // Driver rating filter
//       if (filters.driverRating > 0 && bus.driver) {
//         if ((bus.driver.rating || 0) < filters.driverRating) return false;
//       }

//       // Driver availability filter
//       if (filters.driverAvailability && bus.driver) {
//         if (!bus.driver.isAvailable) return false;
//       }

//       // Capacity filter
//       if (filters.capacity.length > 0) {
//         const busCapacity = bus.capacity || bus.seats;
//         const capacityRanges = filters.capacity.map(range => range.split('-'));
//         const matchesCapacity = capacityRanges.some(([min, max]) => {
//           return busCapacity >= parseInt(min) && busCapacity <= parseInt(max);
//         });
//         if (!matchesCapacity) return false;
//       }

//       return true;
//     });
//   };

//   const sortBuses = (buses) => {
//     switch (sortBy) {
//       case 'earliest':
//         return [...buses].sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
//       case 'latest':
//         return [...buses].sort((a, b) => new Date(b.departureTime) - new Date(a.departureTime));
//       case 'cheapest':
//         return [...buses].sort((a, b) => a.price - b.price);
//       case 'expensive':
//         return [...buses].sort((a, b) => b.price - a.price);
//       case 'driver-rating':
//         return [...buses].sort((a, b) => (b.driver?.rating || 0) - (a.driver?.rating || 0));
//       case 'driver-experience':
//         return [...buses].sort((a, b) => (b.driver?.yearsOfExperience || 0) - (a.driver?.yearsOfExperience || 0));
//       default:
//         return buses;
//     }
//   };

//   const filteredAndSortedBuses = sortBuses(applyFilters(buses));
//   const currentFilteredBuses = filteredAndSortedBuses.slice(indexOfFirstItem, indexOfLastItem);

//   return (
//     <div className="min-h-screen flex flex-col">

//       <main className="flex-grow">
//         {/* Search Section */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rtl my-6 md:my-10 relative">
//           {/* Hero Image with Gradient */}
//           <div className="relative overflow-hidden rounded-md shadow-md" style={{ height: '280px', maxHeight: '350px' }}>
//             <img
//               src="../../images/covers/bus-cover.jpg"
//               alt="اتوبوس"
//               className="w-full h-full object-cover object-center"
//               loading="lazy"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//           </div>

//           {/* Search Box - Enhanced Card */}
//           <div className="bg-white rounded-md shadow-xl p-5 md:p-7 relative z-10 -mt-10 md:-mt-20 mx-3 md:mx-6 border border-gray-200">
//             {/* Ticket Type Selection - Improved Toggle */}
//             <div className="flex mb-5 border-b pb-5">
//               <div className="flex items-center mr-6">
//                 <input
//                   type="radio"
//                   id="oneSide"
//                   name="ticketType"
//                   checked={!isRoundTrip}
//                   onChange={() => setIsRoundTrip(false)}
//                   className="ml-3 h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                 />
//                 <label htmlFor="oneSide" className="text-base font-medium text-gray-700 cursor-pointer flex items-center">
//                   <span className="ml-2">یک طرفه</span>
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="twoSide"
//                   name="ticketType"
//                   checked={isRoundTrip}
//                   onChange={() => setIsRoundTrip(true)}
//                   className="ml-3 h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                 />
//                 <label htmlFor="twoSide" className="text-base font-medium text-gray-700 cursor-pointer flex items-center">
//                   <span className="ml-2">دو طرفه</span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-4 md:gap-6">
//               {/* firstCity */}
//               <div className="relative flex-1 w-full" ref={originRef}>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="origin"
//                     value={origin}
//                     onChange={(e) => setOrigin(e.target.value)}
//                     onFocus={() => setShowOriginSuggestions(true)}
//                     className="w-full p-3.5 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-blue-900 focus:border-blue-900 transition-all text-base"
//                     placeholder="مبدا"
//                     autoComplete="off"
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   </div>
//                   {showOriginSuggestions && filteredOriginCities.length > 0 && (
//                     <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto">
//                       {filteredOriginCities.map((city) => (
//                         <li
//                           key={city.id}
//                           className="p-3 hover:bg-blue-50 cursor-pointer text-right transition-colors border-b border-gray-100 last:border-0 flex items-center"
//                           onClick={() => handleOriginSelect(city)}
//                         >
//                           <div>
//                             <div className="font-medium text-gray-800">{city.name}</div>
//                             <div className="text-xs text-gray-500 mt-1">{city.province}</div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           </svg>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* Swap Button - Better Visual */}
//               <div className="my-auto md:mt-10">
//                 <button
//                   onClick={swapCities}
//                   className="p-2.5 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors shadow-md text-blue-600"
//                   aria-label="تعویض مبدا و مقصد"
//                   title="تعویض مبدا و مقصد"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//                   </svg>
//                 </button>
//               </div>

//               {/* lastCity Input */}
//               <div className="relative flex-1 w-full" ref={destinationRef}>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="destination"
//                     value={destination}
//                     onChange={(e) => setDestination(e.target.value)}
//                     onFocus={() => setShowDestinationSuggestions(true)}
//                     className="w-full p-3.5 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-blue-900 focus:border-blue-900 transition-all text-base"
//                     placeholder="مقصد"
//                     autoComplete="off"
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                   </div>
//                   {showDestinationSuggestions && filteredDestinationCities.length > 0 && (
//                     <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto">
//                       {filteredDestinationCities.map((city) => (
//                         <li
//                           key={city.id}
//                           className="p-3 hover:bg-blue-50 cursor-pointer text-right transition-colors border-b border-gray-100 last:border-0 flex items-center"
//                           onClick={() => handleDestinationSelect(city)}
//                         >
//                           <div>
//                             <div className="font-medium text-gray-800">{city.name}</div>
//                             <div className="text-xs text-gray-500 mt-1">{city.province}</div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           </svg>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>

//               {/* moving date */}
//               <div className="flex flex-col w-full md:w-auto">
//                 <div className="flex flex-col md:flex-row gap-4 md:gap-5">
//                   {/* Departure Date */}
//                   <div className="flex-1 min-w-[280px] max-w-[380px]">
//                     <div className="react-datepicker-wrapper w-full">
//                       <DatePicker
//                         id="departureDate"
//                         value={departureDate ? moment(departureDate, 'YYYY/MM/DD') : null}
//                         onChange={(value) => setDepartureDate(value.format('YYYY/MM/DD'))}
//                         isGregorian={false}
//                         timePicker={false}
//                         inputClass="w-full p-4 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-blue-900 focus:border-blue-900 cursor-pointer text-[20px]"
//                         placeholder="تاریخ رفت را انتخاب کنید"
//                         inputFormat="YYYY/MM/DD"
//                         showTodayButton={true}
//                         todayButton="امروز"
//                         calendarStyles={{
//                           width: '380px',
//                           fontSize: '20px',
//                         }}
//                         calendarPosition="bottom-right"
//                         minDate={moment()}
//                         selectedDayClassName="rounded-[5px] bg-blue-600 text-white"
//                       />
//                     </div>
//                   </div>

//                   {/* Return Date */}
//                   {isRoundTrip && (
//                     <div className="flex-1 min-w-[280px] max-w-[380px]">
//                       <div className="react-datepicker-wrapper w-full">
//                         <DatePicker
//                           id="returnDate"
//                           value={returnDate ? moment(returnDate, 'YYYY/MM/DD') : null}
//                           onChange={(value) => setReturnDate(value.format('YYYY/MM/DD'))}
//                           isGregorian={false}
//                           timePicker={false}
//                           inputClass="w-full p-4 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-blue-900 focus:border-blue-900 cursor-pointer text-[20px]"
//                           placeholder="تاریخ برگشت را انتخاب کنید"
//                           inputFormat="YYYY/MM/DD"
//                           disabled={!departureDate}
//                           minDate={departureDate ? moment(departureDate, 'YYYY/MM/DD') : moment()}
//                           showTodayButton={true}
//                           todayButton="امروز"
//                           calendarStyles={{
//                             width: '380px',
//                             fontSize: '20px',
//                           }}
//                           calendarPosition="bottom-right"
//                           selectedDayClassName="rounded-[5px] bg-blue-600 text-white"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>


//               {/* Search Button - Enhanced */}
//               <div className="w-full md:w-auto mt-6">
//                 <button
//                   onClick={handleSearch}
//                   disabled={isSearching || !origin || !destination || !departureDate}
//                   className={`w-full md:w-auto px-10 md:px-14 py-2 rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center
//             ${(!origin || !destination || !departureDate) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
//                       'bg-blue-900 text-white'}`}
//                 >
//                   {isSearching ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     </>
//                   ) : (
//                     <>
//                       <span className="text-base">جستجو </span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* show the search result */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <Spinner />
//           </div>
//         ) : error ? (
//           <div className="text-center py-12">
//             <p className="text-red-600 text-lg font-medium">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-full transition-colors"
//             >
//               تلاش دوباره
//             </button>
//           </div>
//         ) : (
//           <div className="max-w-7xl mx-auto px-4 py-6">
//             {/* Filters and Results */}
//             <div className="flex flex-col md:flex-row gap-6">
//               {/* Filters Sidebar */}
//               <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 h-fit sticky top-4">
//                 <div className="mb-6">
//                   <h3 className="font-bold text-lg mb-4">فیلترها</h3>

//                   {/* Company Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">شرکت مسافربری</h4>
//                     {['هما', 'سپاهان', 'ایران پیما', 'تسلیمی', 'سیروسپهر'].map(company => (
//                       <div key={company} className="flex items-center mb-2">
//                         <input
//                           type="checkbox"
//                           id={`company-${company}`}
//                           checked={filters.company.includes(company)}
//                           onChange={() => handleFilterChange('company', company)}
//                           className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                         />
//                         <label htmlFor={`company-${company}`} className="text-sm">
//                           {company}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Bus Type Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">نوع اتوبوس</h4>
//                     {['VIP', 'لوکس', 'معمولی'].map(type => (
//                       <div key={type} className="flex items-center mb-2">
//                         <input
//                           type="checkbox"
//                           id={`type-${type}`}
//                           checked={filters.busType.includes(type)}
//                           onChange={() => handleFilterChange('busType', type)}
//                           className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                         />
//                         <label htmlFor={`type-${type}`} className="text-sm">
//                           {type}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Price Range Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">محدوده قیمت</h4>
//                     <input
//                       type="range"
//                       min="0"
//                       max="1000000"
//                       step="10000"
//                       value={filters.priceRange[1]}
//                       onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
//                       className="w-full"
//                     />
//                     <div className="flex justify-between text-xs mt-1">
//                       <span>0 تومان</span>
//                       <span>{filters.priceRange[1].toLocaleString()} تومان</span>
//                     </div>
//                   </div>

//                   {/* Amenities Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">امکانات</h4>
//                     {['تهویه مطبوع', 'یخچال', 'تلویزیون', 'Wi-Fi', 'پارکینگ'].map(amenity => (
//                       <div key={amenity} className="flex items-center mb-2">
//                         <input
//                           type="checkbox"
//                           id={`amenity-${amenity}`}
//                           checked={filters.amenities.includes(amenity)}
//                           onChange={() => handleFilterChange('amenities', amenity)}
//                           className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                         />
//                         <label htmlFor={`amenity-${amenity}`} className="text-sm">
//                           {amenity}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Driver Experience Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">سابقه راننده</h4>
//                     {['0-2', '3-5', '5+'].map(exp => (
//                       <div key={exp} className="flex items-center mb-2">
//                         <input
//                           type="checkbox"
//                           id={`exp-${exp}`}
//                           checked={filters.driverExperience.includes(exp)}
//                           onChange={() => handleFilterChange('driverExperience', exp)}
//                           className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                         />
//                         <label htmlFor={`exp-${exp}`} className="text-sm">
//                           {exp === '0-2' ? '0-2 سال' : exp === '3-5' ? '3-5 سال' : 'بیش از 5 سال'}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Driver Rating Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">حداقل امتیاز راننده</h4>
//                     <div className="flex items-center">
//                       {[1, 2, 3, 4, 5].map(star => (
//                         <button
//                           key={star}
//                           onClick={() => handleFilterChange('driverRating', star)}
//                           className={`text-xl ${star <= filters.driverRating ? 'text-yellow-400' : 'text-gray-300'}`}
//                         >
//                           ★
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Driver Availability Filter */}
//                   <div className="mb-6">
//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id="driver-availability"
//                         checked={filters.driverAvailability}
//                         onChange={(e) => handleFilterChange('driverAvailability', e.target.checked)}
//                         className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                       />
//                       <label htmlFor="driver-availability" className="text-sm">
//                         فقط رانندگان available
//                       </label>
//                     </div>
//                   </div>

//                   {/* Capacity Filter */}
//                   <div className="mb-6">
//                     <h4 className="font-medium mb-2">ظرفیت اتوبوس</h4>
//                     {['10-20', '21-30', '31-40', '41+'].map(capacity => (
//                       <div key={capacity} className="flex items-center mb-2">
//                         <input
//                           type="checkbox"
//                           id={`capacity-${capacity}`}
//                           checked={filters.capacity.includes(capacity)}
//                           onChange={() => handleFilterChange('capacity', capacity)}
//                           className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
//                         />
//                         <label htmlFor={`capacity-${capacity}`} className="text-sm">
//                           {capacity === '41+' ? 'بیش از 40 نفر' : `${capacity} نفر`}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Results Section */}
//               <div className="w-full md:w-3/4">
//                 {/* Sorting Bar */}
//                 <div className="bg-white rounded-lg shadow p-4 mb-6">
//                   <div className="flex flex-wrap items-center justify-between">
//                     <div className="text-sm mb-2 md:mb-0">
//                       <span className="font-medium">{filteredAndSortedBuses.length}</span> نتیجه یافت شد
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-sm ml-2">مرتب‌سازی بر اساس:</span>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-900"
//                       >
//                         <option value="earliest">زودترین زمان حرکت</option>
//                         <option value="latest">دیرترین زمان حرکت</option>
//                         <option value="cheapest">ارزان‌ترین</option>
//                         <option value="expensive">گران‌ترین</option>
//                         <option value="driver-rating">بالاترین امتیاز راننده</option>
//                         <option value="driver-experience">بیشترین سابقه راننده</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bus Tickets List */}
//                 {currentFilteredBuses.length > 0 ? (
//                   <div className="space-y-4">
//                     {currentFilteredBuses.map(bus => (
//                       <div key={bus._id} className="bg-white rounded-lg shadow overflow-hidden">
//                         <div className="p-4">
//                           <div className="flex flex-col md:flex-row justify-between">
//                             {/* Company and Driver Info */}
//                             <div className="flex items-center mb-4 md:mb-0">
//                               <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
//                                 <img
//                                   src={bus.driver?.avatar || '/default-driver.jpg'}
//                                   alt={bus.driver?.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <div className="ml-3">
//                                 <h3 className="font-bold">{bus.company}</h3>
//                                 <div className="text-xs text-gray-600">{bus.driver?.name}</div>
//                                 {bus.driver?.rating && (
//                                   <div className="flex items-center mt-1">
//                                     <span className="text-yellow-400">★</span>
//                                     <span className="text-xs mr-1">{bus.driver.rating.toFixed(1)}</span>
//                                     {bus.driver?.yearsOfExperience && (
//                                       <span className="text-xs text-gray-500 mr-2">
//                                         ({bus.driver.yearsOfExperience} سال تجربه)
//                                       </span>
//                                     )}
//                                   </div>
//                                 )}
//                                 <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded">
//                                   {bus.type}
//                                 </span>
//                               </div>
//                             </div>

//                             {/* Departure and Arrival Times */}
//                             <div className="flex items-center justify-between md:justify-start md:space-x-8">
//                               <div className="text-center">
//                                 <div className="font-bold">{new Date(bus.departureTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
//                                 <div className="text-xs text-gray-500">{bus.origin}</div>
//                               </div>
//                               <div className="flex flex-col items-center mx-2">
//                                 <div className="text-xs text-gray-500">{bus.duration} ساعت</div>
//                                 <div className="w-16 h-px bg-gray-300 my-1"></div>
//                                 <div className="text-xs text-gray-500">مستقیم</div>
//                               </div>
//                               <div className="text-center">
//                                 <div className="font-bold">{new Date(bus.arrivalTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
//                                 <div className="text-xs text-gray-500">{bus.destination}</div>
//                               </div>
//                             </div>

//                             {/* Price and Book Button */}
//                             <div className="flex flex-col items-end mt-4 md:mt-0">
//                               <div className="font-bold text-lg mb-2">
//                                 {bus.price.toLocaleString('fa-IR')} تومان
//                               </div>
//                               <Link
//                                 to={`/bus-details/${bus._id}?passengers=${passengers}`}
//                                 className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 transition"
//                               >
//                                 انتخاب بلیط
//                               </Link>
//                             </div>
//                           </div>

//                           {/* Amenities */}
//                           <div className="mt-4 pt-4 border-t border-gray-100">
//                             <div className="flex flex-wrap gap-2">
//                               {bus.amenities.map((amenity, index) => (
//                                 <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
//                                   <i className="ml-1 text-blue-900">
//                                     {amenity === 'تهویه مطبوع' && <i className="fas fa-wind"></i>}
//                                     {amenity === 'یخچال' && <i className="fas fa-ice-cream"></i>}
//                                     {amenity === 'تلویزیون' && <i className="fas fa-tv"></i>}
//                                     {amenity === 'Wi-Fi' && <i className="fas fa-wifi"></i>}
//                                     {amenity === 'پارکینگ' && <i className="fas fa-parking"></i>}
//                                   </i>
//                                   {amenity}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-lg shadow p-8 text-center">
//                     <h3 className="text-lg font-medium mb-2">نتیجه‌ای یافت نشد</h3>
//                     <p className="text-gray-500 mb-4">با تغییر فیلترها دوباره امتحان کنید</p>
//                     <button
//                       onClick={() => setFilters({
//                         company: [],
//                         departureTime: [],
//                         busType: [],
//                         priceRange: [0, 1000000],
//                         amenities: [],
//                         driverExperience: [],
//                         driverRating: 0,
//                         driverAvailability: false,
//                         capacity: [],
//                         serviceProvider: [],
//                         hasAC: null,
//                         options: []
//                       })}
//                       className="text-blue-900 border border-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition"
//                     >
//                       حذف همه فیلترها
//                     </button>
//                   </div>
//                 )}

//                 {/* Pagination */}
//                 {filteredAndSortedBuses.length > itemsPerPage && (
//                   <div className="flex justify-center items-center space-x-2 p-8">
//                     {Array(Math.ceil(filteredAndSortedBuses.length / itemsPerPage)).fill().map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => handlePageChange(index + 1)}
//                         className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === index + 1
//                           ? 'bg-blue-900 text-white'
//                           : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
//                           }`}
//                         aria-label={`صفحه ${index + 1}`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//     </div>
//   );
// };

// export default BookingBus;



import React from 'react'

const BookingBus = () => {
  return (
    <div>BookingBus</div>
  )
}

export default BookingBus


