import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ArrowLeftIcon from '@iconscout/react-unicons/icons/uil-angle-left';
import ArrowRightIcon from '@iconscout/react-unicons/icons/uil-angle-right';
import Hero from "../components/Hero";
import PhotoCard from "../components/PhotoCard";
import Spinner from "../components/Spinner";
import { houseTypes, enviornmentTypes, favoriteCities } from "../data/data.js";

// Fallback image in case of loading failure
const fallbackImage = 'https://via.placeholder.com/400x300?text=Image+Not+Found';



export default function IndexPage() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for accommodation slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(6);

  // State for cities/types/environment sliders
  const [currentIndexCities, setCurrentIndexCities] = useState(0);
  const [imagesPerPageCites, setImagesPerPageCites] = useState(6);

  // Fetch houses
  useEffect(() => {
    const getHouses = async () => {
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
    };

    getHouses();
  }, []);

  // Dynamic images per page based on screen size
  useEffect(() => {
    const updateImagesPerPage = () => {
      if (window.innerWidth < 640) {
        setImagesPerPage(2);
        setImagesPerPageCites(2);
      } else if (window.innerWidth < 768) {
        setImagesPerPage(3);
        setImagesPerPageCites(3);
      } else if (window.innerWidth < 1024) {
        setImagesPerPage(4);
        setImagesPerPageCites(4);
      } else {
        setImagesPerPage(6);
        setImagesPerPageCites(6);
      }
    };

    updateImagesPerPage();
    window.addEventListener('resize', updateImagesPerPage);

    return () => window.removeEventListener('resize', updateImagesPerPage);
  }, []);


  // Cities/types/environment slider navigation
  const nextSlideCities = () => {
    if (currentIndexCities < Math.max(favoriteCities.length, houseTypes.length, enviornmentTypes.length) - imagesPerPageCites) {
      setCurrentIndexCities(currentIndexCities + imagesPerPageCites);
    }
  };

  const prevSlideCities = () => {
    if (currentIndexCities > 0) {
      setCurrentIndexCities(currentIndexCities - imagesPerPageCites);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-iran">
      <Hero />

      {/* Latest Accommodations */}
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
        <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">جدیدترین بومگردی‌ها و اقامتگاه‌ها</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">بومگردی‌ و اقامتگاه، اختصاصی با ما</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {houses.slice(0, 20).map((house, index) => (
              <PhotoCard key={index} images={house.images || [fallbackImage]} house={house} />
            ))}
          </div>
        </section>
      )}

      {/* Accommodation Types Slider */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">انواع اقامتگاه‌ها</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">انواع اقامتگاه‌های موجود را می‌توانید در زیر انتخاب کنید</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={prevSlideCities}
              aria-label="اسلاید قبلی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities === 0}
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlideCities}
              aria-label="اسلاید بعدی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities >= houseTypes.length - imagesPerPageCites ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities >= houseTypes.length - imagesPerPageCites}
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        {houseTypes.length === 0 ? (
          <div className="text-center py-12 text-gray-600">هیچ نوع اقامتگاهی یافت نشد.</div>
        ) : (
          <div className="relative w-full overflow-x-auto snap-x snap-mandatory">
            <div className="flex">
              {houseTypes.slice(currentIndexCities, currentIndexCities + imagesPerPageCites).map((item, index) => (
                <div key={index} className="w-1/2 xs:w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 px-2 snap-center shrink-0">
                  <div className="relative group rounded-lg overflow-hidden">
                    <img
                      src={item.src || fallbackImage}
                      alt={item.type || 'اقامتگاه'}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/search-houses?houseType=${item.type}`} className="text-white font-semibold flex items-center text-sm sm:text-base">
                        مشاهده همه <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                      </Link>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-900 font-semibold text-sm sm:text-base">{item.type}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

    
      {/* Environment Types Slider */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">بافت زیست‌محیطی</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">محیط‌های گوناگون را در زیر می‌توانید ببینید</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={prevSlideCities}
              aria-label="اسلاید قبلی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities === 0}
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlideCities}
              aria-label="اسلاید بعدی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities >= enviornmentTypes.length - imagesPerPageCites ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities >= enviornmentTypes.length - imagesPerPageCites}
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        {enviornmentTypes.length === 0 ? (
          <div className="text-center py-12 text-gray-600">هیچ نوع محیطی یافت نشد.</div>
        ) : (
          <div className="relative w-full overflow-x-auto snap-x snap-mandatory">
            <div className="flex">
              {enviornmentTypes.slice(currentIndexCities, currentIndexCities + imagesPerPageCites).map((item, index) => (
                <div key={index} className="w-1/2 xs:w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 px-2 snap-center shrink-0">
                  <div className="relative group rounded-lg overflow-hidden">
                    <img
                      src={item.src || fallbackImage}
                      alt={item.type || 'محیط'}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/search-houses?environmentType=${item.type}`} className="text-white font-semibold flex items-center text-sm sm:text-base">
                        مشاهده همه <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                      </Link>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-900 font-semibold text-sm sm:text-base">{item.type}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Popular Cities Slider */}
      <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">محبوب‌ترین شهرهای ایران</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">محبوب‌ترین شهرهای ایران برای مقاصد گردشگری</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={prevSlideCities}
              aria-label="اسلاید قبلی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities === 0}
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlideCities}
              aria-label="اسلاید بعدی"
              className={`w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition ${currentIndexCities >= favoriteCities.length - imagesPerPageCites ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndexCities >= favoriteCities.length - imagesPerPageCites}
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        {favoriteCities.length === 0 ? (
          <div className="text-center py-12 text-gray-600">هیچ شهری یافت نشد.</div>
        ) : (
          <div className="relative w-full overflow-x-auto snap-x snap-mandatory">
            <div className="flex">
              {favoriteCities.slice(currentIndexCities, currentIndexCities + imagesPerPageCites).map((city, index) => (
                <div key={index} className="w-1/2 xs:w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 px-2 snap-center shrink-0">
                  <div className="relative group rounded-lg overflow-hidden">
                    <img
                      src={city.src || fallbackImage}
                      alt={city.text || 'شهر'}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link to={`/search-houses?city=${city.text}`} className="text-white text-sm sm:text-lg font-semibold">
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