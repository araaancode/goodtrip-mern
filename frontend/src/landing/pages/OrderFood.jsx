import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import HeaderPages from '../components/HeaderPages';
import axios from "axios"
import { TiStarFullOutline } from "react-icons/ti";
import { FaStar } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import useCartStore from '../store/cartStore';
import useUserAuthStore from "../store/authStore"

import './OrderFood.css'

const itemsPerPage = 6;

const OrderFood = () => {

  // ************** navigation hook **************
  const navigate = useNavigate()

  // ************** store states **************
  const { isAuthenticated } = useUserAuthStore()
  const { addItemToCart } = useCartStore()

  // ************** State management **************
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [foodNameError, setFoodNameError] = useState(false);
  const [foodNameErrorMsg, setFoodNameErrorMsg] = useState("");




  // Filters state
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000000],
    rating: 0,
    preparationTime: [0, 120],
    dietaryOptions: [],
    cuisineTypes: [],
    cookRating: 0,
    availableNow: false
  });

  const [sortBy, setSortBy] = useState('popular');

  const activeLink = { food: true };

  // Mock data for popular foods and suggestions
  const popularFoods = [
    { id: 1, name: "چلوکباب کوبیده", category: 'ایرانی', image: 'https://cdn-icons-png.flaticon.com/128/2755/2755351.png' },
    { id: 2, name: "چلوکباب برگ", category: 'ایرانی', image: "https://cdn-icons-png.flaticon.com/128/2403/2403406.png" },
    { id: 3, name: "جوجه کباب", category: 'ایرانی', image: "https://cdn-icons-png.flaticon.com/128/2776/2776887.png" },
    { id: 4, name: "زرشک پلو با مرغ", category: 'ایرانی', image: "https://cdn-icons-png.flaticon.com/128/1895/1895685.png" },
    { id: 5, name: "قورمه سبزی", category: 'ایرانی', image: "https://cdn-icons-png.flaticon.com/128/10811/10811793.png" },
    { id: 6, name: "قیمه", category: 'ایرانی', image: "https://cdn-icons-png.flaticon.com/128/3846/3846181.png" },
  ];

  // All available categories
  const allCategories = [
    'پیش غذا', 'غذای اصلی', 'دسر و نوشیدنی', 'ایتالیایی', 'ایرانی', 'ساندویچ', 'فست فود', 'سوپ', 'آش'
  ];

  const searchRef = useRef(null);

  // Load mock data on initial render
  useEffect(() => {
    setFoods(foods);
  }, []);

  // Show suggestions when typing
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

  // Handle clicks outside search suggestions
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

  // Handle food selection from suggestions
  const handleFoodSelect = (food) => {
    setSearchQuery(food.name);
    setShowSuggestions(false);
  };

  // Handle search
  const handleSearch = async () => {
    setHasSearched(true)

    if (!searchQuery) {
      setFoodNameError(true);
      setFoodNameErrorMsg("* نام غذا را وارد کنید ");
      return;
    }

    setHasSearched(true);
    setIsSearching(true);
    setLoading(true);

    try {
      const response = await axios.post('/api/users/foods/search-foods', {
        name: searchQuery,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const foods = response.data.foods;
      setFoods(foods)
      setLoading(false)
      setIsSearching(false);

    } catch (error) {
      // setNoResult(true)
      setLoading(false)
      setIsSearching(false);
      console.error("API error:", error.response?.data || error.message);
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter handler
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (filterType === 'priceRange' || filterType === 'preparationTime') {
        newFilters[filterType] = value;
      }
      else if (filterType === 'rating' || filterType === 'cookRating') {
        newFilters[filterType] = value;
      }
      else if (filterType === 'availableNow') {
        newFilters[filterType] = value;
      }
      else {
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

  // Apply filters
  const applyFilters = (foods) => {
    return foods.filter(food => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(food.category)) {
        return false;
      }

      // Price range filter
      if (food.price < filters.priceRange[0] || food.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (food.rating < filters.rating) {
        return false;
      }

      // Preparation time filter
      if (food.preparationTime < filters.preparationTime[0] ||
        food.preparationTime > filters.preparationTime[1]) {
        return false;
      }

      // Dietary options filter
      if (filters.dietaryOptions.length > 0) {
        const hasAllDietary = filters.dietaryOptions.every(option =>
          food.dietaryOptions.includes(option)
        );
        if (!hasAllDietary) return false;
      }

      // Cuisine type filter
      if (filters.cuisineTypes.length > 0 && !filters.cuisineTypes.includes(food.cuisineType)) {
        return false;
      }

      // Cook rating filter
      if (food.cook.rating < filters.cookRating) {
        return false;
      }

      // Available now filter
      if (filters.availableNow && !food.available) {
        return false;
      }

      return true;
    });
  };

  // Sort foods
  const sortFoods = (foods) => {
    switch (sortBy) {
      case 'popular':
        return [...foods].sort((a, b) => b.rating - a.rating);
      case 'expensive':
        return [...foods].sort((a, b) => b.price - a.price);
      case 'cheapest':
        return [...foods].sort((a, b) => a.price - b.price);
      case 'food-rating':
        return [...foods].sort((a, b) => a.rating - b.rating);
      case 'cook-rating':
        return [...foods].sort((a, b) => b.cook.rating - a.cook.rating);
      default:
        return foods;
    }
  };

  const filteredAndSortedFoods = sortFoods(applyFilters(foods));
  const currentFoods = filteredAndSortedFoods.slice(indexOfFirstItem, indexOfLastItem);




  // ****************************** ordering food logic ******************************
  // ****************************** ******************* ******************************
  // ****************************** ******************* ******************************
  const handleOrderFood = async (e, food) => {
    e.preventDefault();

    if (isAuthenticated) {
      await addItemToCart(food)


    } else {
      navigate('/login')
    }

  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-grow">
        {/* Search Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rtl my-10 relative">
          {/* Food cover image */}
          <div className="relative overflow-hidden rounded-md" style={{ height: '300px' }}>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="غذای ایرانی"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative z-10 -mt-16 mx-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 w-full" ref={searchRef}>
                <label htmlFor="search" className="block text-sm font-medium text-gray-500 mb-1">
                  جستجوی غذا
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFoodNameError(false);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className={`w-full pr-10 pl-3 py-3 border ${foodNameError ? 'border-red-500' : 'border-gray-300'} text-right outline-none focus:[border:1px_solid_#1e3a8a]`}
                    placeholder="نام غذا را وارد کنید"
                    autoComplete="off"
                    style={{ borderRadius: '8px' }}
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      ✕
                    </button>
                  )}

                  {foodNameError && (
                    <span className="absolute right-0 -bottom-5 text-red-500 text-xs">
                      {foodNameErrorMsg}
                    </span>
                  )}

                  {showSuggestions && filteredFoods.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredFoods.map((food) => (
                        <li
                          key={food.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer text-right"
                          onClick={() => handleFoodSelect(food)}
                        >
                          <div className="font-medium">{food.name}</div>
                          <div className="text-xs text-gray-500">{food.category}</div>
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
                  className="w-full md:w-auto px-16 py-3 bg-blue-900 text-white rounded-md font-bold focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed "
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
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

                    </span>
                  ) : (
                    'جستجو'
                  )}
                </button>
              </div>
            </div>

            {/* Popular Foods */}
            <div className="popular-foods-section mt-6 px-4 py-5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm">
              <h3 className="section-title text-lg font-bold text-gray-800 mb-3 flex items-center">
                غذاهای پرطرفدار
              </h3>

              <div className="food-tags-container flex flex-wrap gap-3">
                {popularFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      setSearchQuery(food.name);
                      setFoodNameError(false);
                    }}
                    className="food-tag-button 
                   text-sm px-4 py-2
                   bg-white border border-gray-200 rounded-full
                   hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600
                   focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent
                   active:scale-95 active:bg-primary-100
                   shadow-xs
                   transition-all duration-200 ease-in-out"
                    aria-label={`جستجوی ${food.name}`}
                  >
                    <div className="flex items-center gap-2">
                      <img className="w-6 h-6" src={food.image} alt={food.name} />
                      <span>{food.name}</span>
                    </div>

                  </button>
                ))}
              </div>
            </div>


          </div>
        </div>


        {/* Results Section */}
        {hasSearched ? (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 flex items-center justify-center flex-col">
                <h1 className="text-2xl font-semibold text-gray-700 mb-8">نتیجه ای پیدا نشد</h1>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1925/1925988.png"
                  alt="No results"
                  className="w-24 h-24 mb-6"
                />
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 inline-block px-16 py-3 font-semibold bg-white text-blue-900 border border-blue-600 rounded-md hover:text-white hover:bg-blue-900 transition-colors"
                >
                  تلاش دوباره
                </button>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters and Results */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Filters Sidebar */}
                  <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 h-fit sticky top-4">
                    <div className="mb-6">

                      {/* Category Filter */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-2">دسته بندی</h3>
                        {allCategories.map(category => (
                          <div key={category} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              checked={filters.categories.includes(category)}
                              onChange={() => handleFilterChange('categories', category)}
                              className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                            />
                            <label htmlFor={`category-${category}`} className="text-sm">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Price Range Filter */}
                      <div className="mb-6">
                        <h4 className="font-bold mb-2">محدوده قیمت</h4>
                        <input
                          type="range"
                          min="0"
                          max="1000000"
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
                        <h3 className="font-bold mb-2"> امتیاز غذا</h3>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => handleFilterChange('rating', star)}
                              className={`text-xl ${star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <FaStar />
                            </button>
                          ))}
                          <span className="text-sm mr-2">{filters.rating}</span>
                        </div>
                      </div>


                      {/* Cook Rating Filter */}
                      <div className="mb-6">
                        <h3 className="font-bold mb-2"> امتیاز آشپز</h3>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => handleFilterChange('cookRating', star)}
                              className={`text-xl ${star <= filters.cookRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <FaStar />
                            </button>
                          ))}
                          <span className="text-sm mr-2">{filters.cookRating}</span>
                        </div>
                      </div>

                      {/* Available Now Filter */}
                      <div className="mb-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="available-now"
                            checked={filters.availableNow}
                            onChange={(e) => handleFilterChange('availableNow', e.target.checked)}
                            className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                          />
                          <label htmlFor="available-now" className="text-sm">
                            فقط غذاهای موجود
                          </label>
                        </div>
                      </div>

                      {/* Reset Filters Button */}
                      <button
                        onClick={() => setFilters({
                          categories: [],
                          priceRange: [0, 1000000],
                          rating: 0,
                          preparationTime: [0, 120],
                          dietaryOptions: [],
                          cuisineTypes: [],
                          cookRating: 0,
                          availableNow: false
                        })}
                        className="w-full mt-4 text-blue-900 border border-blue-600 py-2 rounded-md hover:bg-blue-50 transition"
                      >
                        حذف همه فیلترها
                      </button>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="w-full md:w-3/4">
                    {/* Sorting Bar */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Results count */}
                        <div className="text-sm font-medium text-gray-700">
                          <span className="text-blue-900 font-semibold">
                            {filteredAndSortedFoods.length.toLocaleString()}
                          </span>{" "}
                          غذا یافت شد
                        </div>

                        {/* Sort dropdown */}
                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="sort-select"
                            className="text-sm font-medium text-gray-700"
                          >
                            مرتب‌سازی بر اساس:
                          </label>

                          <div className="relative">
                            <select
                              id="sort-select"
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 transition-all cursor-pointer shadow-sm hover:border-gray-400"
                            >
                              <option value="popular">محبوب‌ترین</option>
                              <option value="expensive">گران‌ترین</option>
                              <option value="cheapest">ارزان‌ترین</option>
                              <option value="food-rating">بالاترین امتیاز غذا</option>
                              <option value="cook-rating">بالاترین امتیاز آشپز</option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Foods List */}
                    {currentFoods.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentFoods.map(food => (
                          <div
                            key={food._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out text-right"
                            dir="rtl"
                          >
                            {/* Image Section */}
                            <div className="relative">
                              <img
                                src={food.photo}
                                alt={food.name}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                              />

                              {/* Rating Badge */}
                              <div className="absolute top-2 right-2 bg-blue-900 text-white px-2 py-1 rounded text-xs font-bold">
                                ★ {food.rating.toFixed(1)}
                              </div>

                              {/* Out of Stock Overlay */}
                              {!food.isAvailable && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <span className="text-white font-bold bg-red-500 px-3 py-1 rounded text-sm">
                                    ناموجود
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4 space-y-4">
                              {/* Header with Food Info and Cook Details */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-gray-800">{food.name}</h3>
                                  <p className="text-gray-500 text-sm mt-1">{food.category}</p>
                                </div>


                                {/* Cook Profile */}
                                <div className="flex items-center flex-row-reverse">

                                  <div className="mr-2 text-right">
                                    <span className="block text-sm text-gray-700">{food.cookName}</span>
                                    <span className="flex items-center justify-start text-xs text-yellow-500">
                                      <TiStarFullOutline className="w-3 h-3 ml-1" />
                                      {food.cook.rating.toFixed(1)}

                                    </span>
                                  </div>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/128/7780/7780470.png"
                                    alt={food.cookName}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                  />
                                </div>


                              </div>

                              {/* Description */}
                              <p className="text-gray-600 text-sm line-clamp-2 leading-5">
                                {`${food.description.substring(0, 20)}...`}
                              </p>

                              {/* Cooking Details & Price - Improved Layout */}
                              <div className="grid grid-cols-3 gap-2 text-sm border-t border-gray-100 pt-3 mt-2">
                                {/* Cooking Days */}
                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-2">
                                  <div className="flex items-center text-gray-700">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs mr-2">روزهای پخت</span>

                                  </div>
                                  <span className="font-medium text-gray-800 mt-1">{food.cookDate[0]}</span>
                                </div>

                                {/* Cooking Hours */}
                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-2">
                                  <div className="flex items-center text-gray-700">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs mr-2">ساعت پخت</span>

                                  </div>
                                  <span className="font-medium text-gray-800 mt-1">{food.cookHour}</span>
                                </div>

                                {/* Price */}
                                <div className="flex flex-col items-center justify-center bg-blue-50 rounded p-2">
                                  <span className="text-xs text-gray-700">قیمت</span>
                                  <span className="font-bold text-blue-900 mt-1">
                                    {new Intl.NumberFormat('fa-IR').format(food.price)} تومان
                                  </span>
                                </div>
                              </div>


                              {/* Order Button */}
                              <button
                                className={`w-full mt-3 py-2 rounded-md font-bold transition-colors duration-200
                               ${food.isAvailable
                                    ? 'bg-blue-900 text-white'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                disabled={!food.isAvailable}
                                onClick={(e) => handleOrderFood(e, food)}
                              >
                                {food.isAvailable ? (
                                  <span className="flex items-center justify-center">
                                    <span>سفارش غذا</span>
                                  </span>
                                ) : 'موجود نیست'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h3 className="text-lg font-medium mb-2">نتیجه‌ای یافت نشد</h3>
                        <p className="text-gray-500 mb-4">با تغییر فیلترها دوباره امتحان کنید</p>
                      </div>
                    )}

                    {/* Pagination */}
                    {filteredAndSortedFoods.length > itemsPerPage && (
                      <div className="flex justify-center items-center space-x-2 p-8">
                        {Array(Math.ceil(filteredAndSortedFoods.length / itemsPerPage)).fill().map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-3 mx-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === index + 1
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg mb-12">
            <img
              src="https://img.freepik.com/premium-vector/drawing-chef-cooking-with-spoon-sauce_1087929-12556.jpg?uid=R156737658&ga=GA1.1.1404144783.1745138448&semt=ais_items_boosted&w=740"
              alt="Search for food"
              className="w-80 h-80 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800 text-center">
              همین الان غذای خود را سفارش دهید
            </h1>
          </div>
        )}
      </main>

      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderFood;