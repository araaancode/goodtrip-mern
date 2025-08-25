import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiTentLine, RiMapPinLine, RiCalendarEventLine, RiUserLine } from "@remixicon/react";
import axios from "axios";
import useUserAuthStore from "../store/authStore";

export default function Hero() {
  const { isAuthenticated, checkAuth, user } = useUserAuthStore();
  const navigate = useNavigate();
  const [currentBackground, setCurrentBackground] = useState(0);
  const [searchData, setSearchData] = useState({
    city: "",
    houseType: "",
    environmentType: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // High-quality images of Iran's historical places
  const backgroundImages = [
    '../../../images/covers/cover1.jpg',
    '../../../images/covers/cover2.jpg',
    '../../../images/covers/cover3.jpg',
    '../../../images/covers/cover4.jpg',
  ];

  // Configure axios to include credentials with all requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
    checkAuth();
    
    // Change background every 5 seconds
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [checkAuth, backgroundImages.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryClick = (type, value) => {
    setSearchData(prev => ({
      ...prev,
      [type]: prev[type] === value ? "" : value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/api/users/houses/search-houses', searchData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(searchData)

      if (response.data.success) {
        // Navigate to search results page with the data
        navigate(`/search-houses?city=${searchData.city}`, { 
          state: { 
            houses: response.data.houses,
            searchCriteria: searchData
          } 
        });
      } else {
        setError(response.data.message || 'خطا در جستجو');
      }
    } catch (error) {
      console.error('Error during search:', error);
      if (error.response) {
        // The server responded with an error status
        setError(error.response.data.message || 'خطا در ارتباط با سرور');
      } else if (error.request) {
        // The request was made but no response was received
        setError('سرور پاسخ نمی‌دهد. لطفا دوباره تلاش کنید.');
      } else {
        // Something happened in setting up the request
        setError('خطا در ارسال درخواست. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative mb-12 h-[85vh] min-h-[600px] rounded-b-3xl overflow-hidden shadow-xl transition-all duration-700"
      style={{ cursor: 'none' }}
    >
      {/* Background Images with Fade Transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentBackground ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
      
      {/* Persian Pattern Overlay */}
      <div className="absolute inset-0"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-blue-800/30"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Content */}
        <div className="flex flex-col justify-center items-center text-center text-white flex-grow px-4 pt-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md leading-tight">
              بهترین اقامتگاه‌های <span className="text-blue-300">ایران</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mb-10 drop-shadow-md leading-relaxed">
              تجربه‌ای فراموش‌نشدنی در دل طبیعت ایران با انتخاب از میان صدها اقامتگاه بومگردی و ویلا
            </p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 w-full max-w-4xl shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-white/80 mb-2 text-right">مقصد</label>
                <div className="relative">
                  <RiMapPinLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="city"
                    placeholder="شهر یا منطقه" 
                    className="w-full p-4 pr-4 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
                    value={searchData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-white/80 mb-2 text-right">نوع اقامتگاه</label>
                <div className="relative">
                  <RiCalendarEventLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    name="houseType"
                    className="w-full p-4 pr-4 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
                    value={searchData.houseType}
                    onChange={handleInputChange}
                  >
                    <option value="">همه انواع</option>
                    <option value="villa">ویلا</option>
                    <option value="apartment">آپارتمان</option>
                    <option value="traditional">سنتي</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-white/80 mb-2 text-right">محیط</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    name="environmentType"
                    className="w-full p-4 pr-4 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
                    value={searchData.environmentType}
                    onChange={handleInputChange}
                  >
                    <option value="">همه محیط‌ها</option>
                    <option value="coastal">ساحلی</option>
                    <option value="mountain">کوهستانی</option>
                    <option value="forest">جنگلی</option>
                    <option value="desert">کویری</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 h-full flex items-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RiTentLine className="ml-2" />
                  {loading ? 'درحال جستجو...' : 'جستجو'}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
          
          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button 
              onClick={() => handleCategoryClick('houseType', 'villa')}
              className={`bg-white/15 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/25 transition-all duration-300 border text-lg hover:scale-105 flex items-center ${
                searchData.houseType === 'villa' ? 'border-blue-400 bg-white/30' : 'border-white/20'
              }`}
            >
              <i className="fas fa-home ml-2"></i>
              ویلا
            </button>
            <button 
              onClick={() => handleCategoryClick('environmentType', 'coastal')}
              className={`bg-white/15 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/25 transition-all duration-300 border text-lg hover:scale-105 flex items-center ${
                searchData.environmentType === 'coastal' ? 'border-blue-400 bg-white/30' : 'border-white/20'
              }`}
            >
              <i className="fas fa-umbrella-beach ml-2"></i>
              ساحلی
            </button>
            <button 
              onClick={() => handleCategoryClick('environmentType', 'mountain')}
              className={`bg-white/15 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/25 transition-all duration-300 border text-lg hover:scale-105 flex items-center ${
                searchData.environmentType === 'mountain' ? 'border-blue-400 bg-white/30' : 'border-white/20'
              }`}
            >
              <i className="fas fa-mountain ml-2"></i>
              کوهستانی
            </button>
            <button 
              onClick={() => handleCategoryClick('houseType', 'traditional')}
              className={`bg-white/15 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/25 transition-all duration-300 border text-lg hover:scale-105 flex items-center ${
                searchData.houseType === 'traditional' ? 'border-blue-400 bg-white/30' : 'border-white/20'
              }`}
            >
              <i className="fas fa-building ml-2"></i>
              سنتی
            </button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-900/40 to-teal-800/40 backdrop-blur-md py-5 px-8 mt-auto">
          <div className="flex flex-wrap justify-around text-white text-center">
            <div className="px-5 py-3 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-200">۵۰۰+</div>
              <div className="text-md opacity-80 mt-1">اقامتگاه</div>
            </div>
            <div className="px-5 py-3 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-200">۱۰۰+</div>
              <div className="text-md opacity-80 mt-1">مقصد</div>
            </div>
            <div className="px-5 py-3 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-200">۱۵۰۰۰+</div>
              <div className="text-md opacity-80 mt-1">مهمان راضی</div>
            </div>
            <div className="px-5 py-3 transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-200">۹۸%</div>
              <div className="text-md opacity-80 mt-1">رضایت‌مندی</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}