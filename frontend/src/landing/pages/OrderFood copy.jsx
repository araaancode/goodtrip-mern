import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import HeaderPages from '../components/HeaderPages';
import Spinner from 'react-spinner';

const itemsPerPage = 8;

const OrderFood = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // State for filters
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [0, 100000],
    rating: 0,
    deliveryTime: [],
    features: []
  });

  // State for sorting
  const [sortBy, setSortBy] = useState('popular');

  const activeLink = {
    food: true
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function fetchRestaurants() {
      try {
        // Mock data for demonstration
        const mockRestaurants = [
          {
            _id: '1',
            name: 'رستوران ایرانی شاندیز',
            cuisine: 'ایرانی',
            rating: 4.5,
            deliveryTime: '30-45',
            minOrder: 50000,
            deliveryFee: 15000,
            image: '/images/restaurant1.jpg',
            features: ['پیک رایگان', 'تخفیف نقدی'],
            menu: [
              { name: 'کباب کوبیده', price: 120000 },
              { name: 'جوجه کباب', price: 100000 },
              { name: 'چلو خورشت', price: 85000 }
            ]
          },
          {
            _id: '2',
            name: 'پیتزا هات',
            cuisine: 'فست فود',
            rating: 4.2,
            deliveryTime: '20-35',
            minOrder: 60000,
            deliveryFee: 10000,
            image: '/images/restaurant2.jpg',
            features: ['پیک رایگان'],
            menu: [
              { name: 'پیتزا مخلوط', price: 150000 },
              { name: 'پیتزا مخصوص', price: 180000 },
              { name: 'سالاد سزار', price: 45000 }
            ]
          },
          {
            _id: '3',
            name: 'رستوران چینی دینگ دانگ',
            cuisine: 'چینی',
            rating: 4.7,
            deliveryTime: '40-55',
            minOrder: 70000,
            deliveryFee: 20000,
            image: '/images/restaurant3.jpg',
            features: ['تخفیف نقدی'],
            menu: [
              { name: 'مرغ سوخاری', price: 110000 },
              { name: 'میگوی تند', price: 140000 },
              { name: 'نودل سبزیجات', price: 90000 }
            ]
          },
          {
            _id: '4',
            name: 'ساندویچی آوا',
            cuisine: 'فست فود',
            rating: 3.9,
            deliveryTime: '15-25',
            minOrder: 30000,
            deliveryFee: 5000,
            image: '/images/restaurant4.jpg',
            features: [],
            menu: [
              { name: 'ساندویچ مرغ', price: 60000 },
              { name: 'ساندویچ ویژه', price: 75000 },
              { name: 'سیب زمینی سرخ کرده', price: 30000 }
            ]
          }
        ];

        setRestaurants(mockRestaurants);
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error(err);
        setError('خطا در بارگذاری رستوران‌ها');
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [category]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const popularFoods = [
    { id: 1, name: 'پیتزا' },
    { id: 2, name: 'سوشی' },
    { id: 3, name: 'برگر' },
    { id: 4, name: 'کباب' },
    { id: 5, name: 'پاستا' }
  ];

  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = popularFoods.filter(food =>
        food.name.includes(searchQuery)
      );
      setFilteredFoods(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredFoods([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFoodSelect = (food) => {
    setSearchQuery(food.name);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      alert('لطفا نام غذا یا رستوران را وارد کنید');
      return;
    }

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error searching for food:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Filter functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (filterType === 'priceRange' || filterType === 'rating') {
        newFilters[filterType] = value;
      } else {
        const index = newFilters[filterType].indexOf(value);
        if (index === -1) {
          newFilters[filterType] = [...newFilters[filterType], value];
        } else {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        }
      }
      return newFilters;
    });
  };

  const applyFilters = (restaurants) => {
    return restaurants.filter(restaurant => {
      if (filters.cuisine.length > 0 && !filters.cuisine.includes(restaurant.cuisine)) {
        return false;
      }

      if (restaurant.minOrder < filters.priceRange[0] || restaurant.minOrder > filters.priceRange[1]) {
        return false;
      }

      if (restaurant.rating < filters.rating) {
        return false;
      }

      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature =>
          restaurant.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });
  };

  const sortRestaurants = (restaurants) => {
    switch (sortBy) {
      case 'popular':
        return [...restaurants].sort((a, b) => b.rating - a.rating);
      case 'fastest':
        return [...restaurants].sort((a, b) =>
          parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0])
        );
      case 'expensive':
        return [...restaurants].sort((a, b) => b.minOrder - a.minOrder);
      case 'cheapest':
        return [...restaurants].sort((a, b) => a.minOrder - b.minOrder);
      default:
        return restaurants;
    }
  };

  const filteredAndSortedRestaurants = sortRestaurants(applyFilters(restaurants));
  const currentFilteredRestaurants = filteredAndSortedRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderPages isActive={activeLink} />

      <main className="flex-grow">
        {/* Search Section */}
        <div className="max-w-7xl mx-auto px-8 rtl mt-10 relative">
          {/*food image*/}
          <div className="relative overflow-hidden rounded-t-lg" style={{ height: '300px' }}>
            <img
              src="https://wallpapercave.com/wp/wp8887550.jpg"
              sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
              alt="کوبیده کباب ایرانی"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* بخش جستجو با همپوشانی */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative z-10 -mt-16 mx-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 w-full" ref={searchRef}>
                <label htmlFor="search" className="block text-sm font-medium text-gray-500 mb-1">
                  جستجوی غذا یا رستوران
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-3 border border-gray-300 text-right focus:outline-0"
                    placeholder="نام غذا یا رستوران را وارد کنید"
                    autoComplete="off"
                    style={{ borderRadius: '8px', padding: '12px' }}
                  />
                  {showSuggestions && filteredFoods.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredFoods.map((food) => (
                        <li
                          key={food.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer text-right"
                          onClick={() => handleFoodSelect(food)}
                        >
                          <div className="font-medium">{food.name}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <div className="w-full md:w-auto mt-6">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full md:w-auto px-16 py-3 bg-blue-900 text-white rounded-md font-bold focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      در حال جستجو...
                    </span>
                  ) : (
                    'جستجو'
                  )}
                </button>
              </div>
            </div>

            {/* Popular Foods */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">غذاهای پرطرفدار:</h3>
              <div className="flex flex-wrap gap-2">
                {popularFoods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(food.name)}
                    className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    {food.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-full transition-colors"
            >
              تلاش دوباره
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Filters and Results */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Sidebar */}
              <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 h-fit sticky top-4">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">فیلترها</h3>

                  {/* Cuisine Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">نوع غذا</h4>
                    {['ایرانی', 'فست فود', 'چینی', 'ایتالیایی', 'ساندویچ'].map(cuisine => (
                      <div key={cuisine} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`cuisine-${cuisine}`}
                          checked={filters.cuisine.includes(cuisine)}
                          onChange={() => handleFilterChange('cuisine', cuisine)}
                          className="ml-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">محدوده قیمت</h4>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>0 تومان</span>
                      <span>{filters.priceRange[1].toLocaleString()} تومان</span>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">حداقل امتیاز</h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleFilterChange('rating', star)}
                          className={`text-xl ${star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-sm mr-2">{filters.rating}+</span>
                    </div>
                  </div>

                  {/* Features Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">ویژگی‌ها</h4>
                    {['پیک رایگان', 'تخفیف نقدی', 'تحویل سریع'].map(feature => (
                      <div key={feature} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`feature-${feature}`}
                          checked={filters.features.includes(feature)}
                          onChange={() => handleFilterChange('features', feature)}
                          className="ml-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <label htmlFor={`feature-${feature}`} className="text-sm">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="w-full md:w-3/4">
                {/* Sorting Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="text-sm mb-2 md:mb-0">
                      <span className="font-medium">{filteredAndSortedRestaurants.length}</span> رستوران یافت شد
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm ml-2">مرتب‌سازی بر اساس:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                      >
                        <option value="popular">محبوب‌ترین</option>
                        <option value="fastest">سریع‌ترین ارسال</option>
                        <option value="expensive">گران‌ترین</option>
                        <option value="cheapest">ارزان‌ترین</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Restaurants List */}
                {currentFilteredRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentFilteredRestaurants.map(restaurant => (
                      <div key={restaurant._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="relative">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-xs">
                            {restaurant.rating} ★
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{restaurant.name}</h3>
                              <p className="text-gray-500 text-sm">{restaurant.cuisine}</p>
                            </div>
                            <div className="text-left">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {restaurant.deliveryTime} دقیقه
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div>
                              <span className="text-sm">حداقل سفارش: </span>
                              <span className="font-medium">{restaurant.minOrder.toLocaleString()} تومان</span>
                            </div>
                            <div>
                              <span className="text-sm">هزینه ارسال: </span>
                              <span className="font-medium">
                                {restaurant.deliveryFee === 0 ? 'رایگان' : `${restaurant.deliveryFee.toLocaleString()} تومان`}
                              </span>
                            </div>
                          </div>

                          {/* Features */}
                          {restaurant.features.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex flex-wrap gap-2">
                                {restaurant.features.map((feature, index) => (
                                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
                                    <i className="ml-1 text-green-600">
                                      {feature === 'پیک رایگان' && <i className="fas fa-motorcycle"></i>}
                                      {feature === 'تخفیف نقدی' && <i className="fas fa-percentage"></i>}
                                      {feature === 'تحویل سریع' && <i className="fas fa-bolt"></i>}
                                    </i>
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Menu Preview */}
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">منوی نمونه:</h4>
                            <div className="space-y-2">
                              {restaurant.menu.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.name}</span>
                                  <span>{item.price.toLocaleString()} تومان</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Button */}
                          <button className="w-full mt-4 bg-blue-900 text-white py-2 rounded-md hover:bg-green-700 transition">
                            مشاهده منو و سفارش
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">نتیجه‌ای یافت نشد</h3>
                    <p className="text-gray-500 mb-4">با تغییر فیلترها دوباره امتحان کنید</p>
                    <button
                      onClick={() => setFilters({
                        cuisine: [],
                        priceRange: [0, 100000],
                        rating: 0,
                        deliveryTime: [],
                        features: []
                      })}
                      className="text-green-600 border border-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition"
                    >
                      حذف همه فیلترها
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {filteredAndSortedRestaurants.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2 p-8">
                    {Array(Math.ceil(filteredAndSortedRestaurants.length / itemsPerPage)).fill().map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === index + 1
                          ? 'bg-blue-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        aria-label={`صفحه ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderFood;