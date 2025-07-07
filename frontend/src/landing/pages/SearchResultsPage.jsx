import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import HeaderPages from '../components/HeaderPages';
import Spinner from 'react-spinner';
import PhotoCard from "../components/PhotoCard";

const itemsPerPage = 8;

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('city') || '';
  const houseType = queryParams.get('houseType') || '';
  const environmentType = queryParams.get('environmentType') || '';

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    async function searchHouses() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        const response = await axios.post('/api/users/houses/search-houses', {
          city,
          houseType,
          environmentType
        }, config);
        setHouses(response.data.houses);

        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error(err);
        setError('خطا در بارگذاری نتایج جستجو');
      } finally {
        setLoading(false);
      }
    }

    searchHouses();
  }, [city, houseType, environmentType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHouses = houses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderPages />

      <main className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-fulltransition-colors"
            >
              تلاش دوباره
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6 p-4 md:p-6 mx-auto max-w-7xl rounded-lg">
              {currentHouses.length > 0 ? (
                currentHouses.map(house => (
                  <PhotoCard key={house._id} house={house} images={house.images} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 flex justify-center items-center flex-col">
                  <h1 className="text-2xl font-semibold text-gray-700">نتیجه ای پیدا نشد</h1>
                  <img src='../../../images/blank_map.png' alt="unexpored-area" />
                  <Link to="/" className="mt-4 inline-block px-5 py-3 font-semibold bg-white text-blue-900 border border-blue-900 rounded-md hover:text-white hover:bg-blue-900 hover:border-collapse transition-colors">
                    بازگشت به صفحه اصلی
                  </Link>
                </div>
              )}
            </div>

            {houses.length > itemsPerPage && (
              <div className="flex justify-center items-center space-x-2 p-8">
                {Array(Math.ceil(houses.length / itemsPerPage)).fill().map((_, index) => (
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;