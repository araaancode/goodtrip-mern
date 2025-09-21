import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import PhotoCard from "../components/PhotoCard";
import Spinner from "../components/Spinner";
import { houseTypes, enviornmentTypes, favoriteCities } from "../data/data.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Fallback image in case of loading failure
const fallbackImage = 'https://via.placeholder.com/400x300?text=Image+Not+Found';

// Reusable Slider Component
const SliderSection = ({
  title,
  subtitle,
  data,
  linkGenerator,
  currentIndex,
  imagesPerPage,
  onNext,
  onPrev,
  disabledNext,
  disabledPrev
}) => {
  return (
    <section className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base">{subtitle}</p>
        </div>
        <div className="flex space-x-2 rtl:space-x-reverse self-end sm:self-auto">
          <button
            onClick={onPrev}
            aria-label="اسلاید قبلی"
            className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${disabledPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabledPrev}
          >
            <FaChevronRight className="text-xs xs:text-sm" />
          </button>
          <button
            onClick={onNext}
            aria-label="اسلاید بعدی"
            className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${disabledNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabledNext}
          >
            <FaChevronLeft className="text-xs xs:text-sm" />
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 xs:py-10 sm:py-12 text-gray-600 text-sm xs:text-base">هیچ موردی یافت نشد.</div>
      ) : (
        <div className="relative w-full overflow-hidden">
          {/* Mobile view - single image with centered navigation */}
          <div className="block sm:hidden">
            <div className="flex justify-center">
              <div className="w-full max-w-xs group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
                  <img
                    src={data[currentIndex]?.src || fallbackImage}
                    alt={data[currentIndex]?.type || data[currentIndex]?.text || 'تصویر'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => (e.target.src = fallbackImage)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                    <Link
                      to={linkGenerator(data[currentIndex])}
                      className="text-white font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 rounded-lg"
                    >
                      مشاهده همه
                      <FaChevronLeft className="text-white mr-1 xs:mr-2 text-xs xs:text-sm" />
                    </Link>
                  </div>
                </div>
                <div className="p-2 xs:p-3">
                  <p className="text-gray-900 font-semibold text-xs xs:text-sm sm:text-base truncate text-center">
                    {data[currentIndex]?.type || data[currentIndex]?.text}
                  </p>
                  {data[currentIndex]?.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 text-center">
                      {data[currentIndex]?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile navigation dots */}
            <div className="flex justify-center mt-4 space-x-2 rtl:space-x-reverse">
              {data.slice(0, Math.min(5, data.length)).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
              {data.length > 5 && (
                <span className="text-xs text-gray-500">+{data.length - 5}</span>
              )}
            </div>
          </div>
          
          {/* Desktop view - grid layout */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4">
            {data.slice(currentIndex, currentIndex + imagesPerPage).map((item, index) => (
              <div key={index} className="group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
                  <img
                    src={item.src || fallbackImage}
                    alt={item.type || item.text || 'تصویر'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => (e.target.src = fallbackImage)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                    <Link
                      to={linkGenerator(item)}
                      className="text-white font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2 rounded-lg"
                    >
                      مشاهده همه
                      <FaChevronLeft className="text-white mr-1 xs:mr-2 text-xs xs:text-sm" />
                    </Link>
                  </div>
                </div>
                <div className="p-2 xs:p-3">
                  <p className="text-gray-900 font-semibold text-xs xs:text-sm sm:text-base truncate">{item.type || item.text}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default function IndexPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for sliders
  const [imagesPerPage, setImagesPerPage] = useState(6);
  const [houseTypesIndex, setHouseTypesIndex] = useState(0);
  const [environmentIndex, setEnvironmentIndex] = useState(0);
  const [citiesIndex, setCitiesIndex] = useState(0);

  // Fetch houses with useCallback to prevent unnecessary recreations
  const getHouses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/houses');
      if (!response.data.houses || response.data.houses.length === 0) {
        throw new Error("No houses data received from API");
      }
      setHouses(response.data.houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHouses();
  }, [getHouses]);

  // Dynamic images per page based on screen size
  useEffect(() => {
    const updateImagesPerPage = () => {
      if (window.innerWidth < 640) {
        setImagesPerPage(1); // Single image for mobile
      } else if (window.innerWidth < 768) {
        setImagesPerPage(2); // 2 images for small tablets
      } else if (window.innerWidth < 1024) {
        setImagesPerPage(3); // 3 images for tablets
      } else if (window.innerWidth < 1280) {
        setImagesPerPage(4); // 4 images for small laptops
      } else if (window.innerWidth < 1536) {
        setImagesPerPage(5); // 5 images for standard laptops
      } else {
        setImagesPerPage(6); // 6 images for large screens (xl and above)
      }
    };

    updateImagesPerPage();
    window.addEventListener('resize', updateImagesPerPage);

    return () => window.removeEventListener('resize', updateImagesPerPage);
  }, []);

  // Navigation handlers
  const nextSlide = (setIndex, data) => {
    setIndex(prev => {
      if (window.innerWidth < 640) {
        // For mobile, move one by one
        return (prev + 1) % data.length;
      } else {
        return Math.min(prev + imagesPerPage, data.length - imagesPerPage);
      }
    });
  };

  const prevSlide = (setIndex, data) => {
    setIndex(prev => {
      if (window.innerWidth < 640) {
        // For mobile, move one by one
        return prev === 0 ? data.length - 1 : prev - 1;
      } else {
        return Math.max(prev - imagesPerPage, 0);
      }
    });
  };

  // Link generators for different slider types
  const houseTypeLink = (item) => `/search-houses?houseType=${item.type}`;
  const environmentLink = (item) => `/search-houses?environmentType=${item.type}`;
  const cityLink = (item) => `/search-houses?city=${item.text}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />

      {/* Latest Accommodations */}
      <section className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-5 sm:mb-6">
          <div className="mb-4 xs:mb-0">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">جدیدترین بومگردی‌ها و اقامتگاه‌ها</h1>
            <p className="text-gray-600 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base">بومگردی‌ و اقامتگاه، اختصاصی با ما</p>
          </div>
          <Link to="/search-houses" className="text-blue-800 font-semibold flex items-center text-sm xs:text-base">
            مشاهده همه
            <FaChevronLeft className="mr-1 xs:mr-2 text-xs xs:text-sm" />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-8 xs:py-10 sm:py-12 text-red-600 text-sm xs:text-base">
            خطا در بارگذاری داده‌ها: {error}
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center py-8 xs:py-10 sm:py-12 text-gray-600 text-sm xs:text-base">
            هیچ اقامتگاهی یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-5">
            {houses.slice(0, 20).map((house, index) => (
              <PhotoCard key={index} images={house.images || [fallbackImage]} house={house} />
            ))}
          </div>
        )}
      </section>

      {/* Accommodation Types Slider */}
      <SliderSection
        title="انواع اقامتگاه‌ها"
        subtitle="انواع اقامتگاه‌های موجود را می‌توانید در زیر انتخاب کنید"
        data={houseTypes}
        linkGenerator={houseTypeLink}
        currentIndex={houseTypesIndex}
        imagesPerPage={imagesPerPage}
        onNext={() => nextSlide(setHouseTypesIndex, houseTypes)}
        onPrev={() => prevSlide(setHouseTypesIndex, houseTypes)}
        disabledNext={window.innerWidth < 640 ? false : houseTypesIndex >= houseTypes.length - imagesPerPage}
        disabledPrev={houseTypesIndex === 0}
      />

      {/* Environment Types Slider */}
      <SliderSection
        title="بافت زیست‌محیطی"
        subtitle="محیط‌های گوناگون را در زیر می‌توانید ببینید"
        data={enviornmentTypes}
        linkGenerator={environmentLink}
        currentIndex={environmentIndex}
        imagesPerPage={imagesPerPage}
        onNext={() => nextSlide(setEnvironmentIndex, enviornmentTypes)}
        onPrev={() => prevSlide(setEnvironmentIndex, enviornmentTypes)}
        disabledNext={window.innerWidth < 640 ? false : environmentIndex >= enviornmentTypes.length - imagesPerPage}
        disabledPrev={environmentIndex === 0}
      />

      {/* Popular Cities Slider */}
      <section className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">محبوب‌ترین شهرهای ایران</h2>
            <p className="text-gray-600 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base">محبوب‌ترین شهرهای ایران برای مقاصد گردشگری</p>
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse self-end sm:self-auto">
            <button
              onClick={() => prevSlide(setCitiesIndex, favoriteCities)}
              aria-label="اسلاید قبلی"
              className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${citiesIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={citiesIndex === 0}
            >
              <FaChevronRight className="text-xs xs:text-sm" />
            </button>
            <button
              onClick={() => nextSlide(setCitiesIndex, favoriteCities)}
              aria-label="اسلاید بعدی"
              className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${citiesIndex >= favoriteCities.length - imagesPerPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={citiesIndex >= favoriteCities.length - imagesPerPage}
            >
              <FaChevronLeft className="text-xs xs:text-sm" />
            </button>
          </div>
        </div>

        {favoriteCities.length === 0 ? (
          <div className="text-center py-8 xs:py-10 sm:py-12 text-gray-600 text-sm xs:text-base">هیچ شهری یافت نشد.</div>
        ) : (
          <div className="relative w-full overflow-hidden">
            {/* Mobile view - single image with centered navigation */}
            <div className="block sm:hidden">
              <div className="flex justify-center">
                <div className="w-full max-w-xs group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
                    <img
                      src={favoriteCities[citiesIndex]?.src || fallbackImage}
                      alt={favoriteCities[citiesIndex]?.text || 'شهر'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                      <Link
                        to={cityLink(favoriteCities[citiesIndex])}
                        className="flex items-center text-white text-xs xs:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 xs:px-3 py-1 xs:py-2"
                      >
                        <p>{favoriteCities[citiesIndex]?.text}</p>
                        <FaChevronLeft className="text-white mr-1 xs:mr-2 text-xs xs:text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile navigation dots */}
              <div className="flex justify-center mt-4 space-x-2 rtl:space-x-reverse">
                {favoriteCities.slice(0, Math.min(5, favoriteCities.length)).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${citiesIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
                {favoriteCities.length > 5 && (
                  <span className="text-xs text-gray-500">+{favoriteCities.length - 5}</span>
                )}
              </div>
            </div>
            
            {/* Desktop view - grid layout with 6 columns on large screens */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4">
              {favoriteCities.slice(citiesIndex, citiesIndex + imagesPerPage).map((city, index) => (
                <div key={index} className="group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
                    <img
                      src={city.src || fallbackImage}
                      alt={city.text || 'شهر'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                      <Link
                        to={cityLink(city)}
                        className="flex items-center text-white text-xs xs:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 xs:px-3 py-1 xs:py-2"
                      >
                        <p>{city.text}</p>
                        <FaChevronLeft className="text-white mr-1 xs:mr-2 text-xs xs:text-sm" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}