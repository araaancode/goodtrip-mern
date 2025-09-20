import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PiTelevision,
  PiSolarRoof,
  PiPark,
  PiRadio,
  PiBroom,
  PiHouseLine,
  PiInfo,
  PiListChecks,
  PiMapPinLine
} from "react-icons/pi";

// Components
import BookingWidget from "../components/BookingWidget";
import HouseGallery from "../components/HouseGallery";
import AddressLink from "../components/AddressLink";
import MapPage from "../components/MapPage";

// Store
import houseStore from "../store/houseStore";

export default function HousePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');

  // Get state and actions from the store
  const {
    currentHouse,
    fetchHouse,
    loading,
    error
  } = houseStore();

  useEffect(() => {
    if (id) {
      fetchHouse(id);
    }
  }, [id, fetchHouse]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">خطا در بارگذاری</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );

  if (!currentHouse) return null;

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Gallery Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <HouseGallery house={currentHouse} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Content */}
          <div className="lg:w-3/5">
            <div dir="rtl" className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{currentHouse.name}</h1>
              <AddressLink />
            </div>

            {/* Tabs Navigation */}
            <div dir="rtl" className="border-b border-gray-200 mb-6 overflow-x-auto">
              <nav className="-mb-px flex min-w-max sm:min-w-0">
                {[
                  { id: 'description', label: 'توضیحات', icon: <PiInfo className="ml-2" /> },
                  { id: 'amenities', label: 'امکانات', icon: <PiListChecks className="ml-2" /> },
                  { id: 'rules', label: 'قوانین', icon: <PiHouseLine className="ml-2" /> },
                ].map((tab, index) => (
                  <div key={tab.id} className="flex items-center">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 font-medium text-sm flex items-center
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                    {index < 2 && (
                      <span className="mx-1 sm:mx-2 text-gray-300">|</span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div dir="rtl">
              {activeTab === 'description' && (
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
                    <PiInfo className="ml-2 text-blue-500" />
                    درباره اقامتگاه
                  </h2>
                  <p className="text-gray-700 leading-7">{currentHouse.description || 'توضیحاتی برای این اقامتگاه ثبت نشده است.'}</p>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                      <PiListChecks className="ml-2 text-blue-500" />
                      امکانات رفاهی
                    </h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {currentHouse.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="text-blue-500 flex-shrink-0">
                            {getAmenityIcon(option)}
                          </span>
                          <span className="text-gray-700 text-sm font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                      <PiHouseLine className="ml-2 text-blue-500" />
                      قوانین صاحبخانه
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {currentHouse.houseRoles?.map((rule, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="bg-blue-100 text-blue-600 rounded-full p-1 flex items-center justify-center mr-2 flex-shrink-0">
                            <PiInfo className="text-xs" />
                          </span>
                          <span className="text-gray-700 text-sm font-medium">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:w-2/5 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-4">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <BookingWidget house={currentHouse} id={id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border-t border-gray-200 py-6 sm:py-8 mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center flex items-center justify-center">
            <PiMapPinLine className="ml-2 text-blue-500" />
            موقعیت مکانی
          </h2>
          <div className="h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-gray-200">
            <MapPage currentHouse={currentHouse} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get icons for amenities
function getAmenityIcon(amenity) {
  const icons = {
    'تلویزیون': <PiTelevision className="w-5 h-5" />,
    'پارکینگ': <PiPark className="w-5 h-5" />,
    'رادیو': <PiRadio className="w-5 h-5" />,
    'جاروبرقی': <PiBroom className="w-5 h-5" />,
    'بالکن': <PiSolarRoof className="w-5 h-5" />,
    'آلاچیق': <PiHouseLine className="w-5 h-5" />
  };

  return icons[amenity] || <PiInfo className="w-5 h-5" />;
}