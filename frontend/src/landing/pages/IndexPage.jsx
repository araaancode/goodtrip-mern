import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import PhotoCard from "../components/PhotoCard";
import Spinner from "../components/Spinner";
import { houseTypes, enviornmentTypes, favoriteCities } from "../data/data.js";

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
    <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{subtitle}</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0 rtl:space-x-reverse">
          <button
            onClick={onPrev}
            aria-label="اسلاید قبلی"
            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${disabledPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabledPrev}
          >
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
          <button
            onClick={onNext}
            aria-label="اسلاید بعدی"
            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${disabledNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabledNext}
          >
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-600">هیچ موردی یافت نشد.</div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                      className="text-white font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm sm:text-base px-3 py-2 bg-purple-600 rounded-lg"
                    >
                      مشاهده همه
                      <i className="fas fa-chevron-left mr-1 text-sm"></i>
                    </Link>
                  </div>
                </div>
                <div className="p-2">
                  <p className="mt-2 text-gray-900 font-semibold text-sm sm:text-base truncate">{item.type || item.text}</p>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{item.description}</p>
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
      if (window.innerWidth < 480) {
        setImagesPerPage(2);
      } else if (window.innerWidth < 640) {
        setImagesPerPage(3);
      } else if (window.innerWidth < 768) {
        setImagesPerPage(4);
      } else if (window.innerWidth < 1024) {
        setImagesPerPage(5);
      } else {
        setImagesPerPage(6);
      }
    };

    updateImagesPerPage();
    window.addEventListener('resize', updateImagesPerPage);

    return () => window.removeEventListener('resize', updateImagesPerPage);
  }, []);

  // Navigation handlers
  const nextSlide = (setIndex, data) => {
    setIndex(prev => Math.min(prev + imagesPerPage, data.length - imagesPerPage));
  };

  const prevSlide = (setIndex) => {
    setIndex(prev => Math.max(prev - imagesPerPage, 0));
  };

  // Link generators for different slider types
  const houseTypeLink = (item) => `/search-houses?houseType=${item.type}`;
  const environmentLink = (item) => `/search-houses?environmentType=${item.type}`;
  const cityLink = (item) => `/search-houses?city=${item.text}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />

      {/* Latest Accommodations */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">جدیدترین بومگردی‌ها و اقامتگاه‌ها</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">بومگردی‌ و اقامتگاه، اختصاصی با ما</p>
          </div>
          <Link to="/search-houses" className="text-purple-700 hover:text-purple-800 font-semibold flex items-center">
            مشاهده همه
            <i className="fas fa-chevron-left mr-1"></i>
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            خطا در بارگذاری داده‌ها: {error}
          </div>
        ) : houses.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            هیچ اقامتگاهی یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
        onPrev={() => prevSlide(setHouseTypesIndex)}
        disabledNext={houseTypesIndex >= houseTypes.length - imagesPerPage}
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
        onPrev={() => prevSlide(setEnvironmentIndex)}
        disabledNext={environmentIndex >= enviornmentTypes.length - imagesPerPage}
        disabledPrev={environmentIndex === 0}
      />

      {/* Popular Cities Slider */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">محبوب‌ترین شهرهای ایران</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">محبوب‌ترین شهرهای ایران برای مقاصد گردشگری</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0 rtl:space-x-reverse">
            <button
              onClick={() => prevSlide(setCitiesIndex)}
              aria-label="اسلاید قبلی"
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${citiesIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={citiesIndex === 0}
            >
              <i className="fas fa-chevron-right text-gray-600"></i>
            </button>
            <button
              onClick={() => nextSlide(setCitiesIndex, favoriteCities)}
              aria-label="اسلاید بعدی"
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${citiesIndex >= favoriteCities.length - imagesPerPage ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={citiesIndex >= favoriteCities.length - imagesPerPage}
            >
              <i className="fas fa-chevron-left text-gray-600"></i>
            </button>
          </div>
        </div>

        {favoriteCities.length === 0 ? (
          <div className="text-center py-12 text-gray-600">هیچ شهری یافت نشد.</div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                        className="text-white text-sm sm:text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-2 bg-purple-600 rounded-lg"
                      >
                        {city.text}
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