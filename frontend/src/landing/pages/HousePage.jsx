import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiTelevision, PiSolarRoof } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";
import { HiOutlineRadio } from "react-icons/hi2";
import { GiVacuumCleaner } from "react-icons/gi";
import { LiaWarehouseSolid } from "react-icons/lia";

// Components
import BookingWidget from "../components/BookingWidget";
import HouseGallery from "../components/HouseGallery";
import AddressLink from "../components/AddressLink";
import MapPage from "../components/MapPage";

// Store
import houseStore from "../store/houseStore";

export default function HousePage() {
  const id = window.document.URL.split('/house/')[1]
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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">
      {error}
    </div>
  );

  if (!currentHouse) return null;

  return (
    <div className="bg-gray-50">
      {/* Gallery Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HouseGallery house={currentHouse} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Content */}
          <div className="lg:w-3/5">
            <div dir="rtl" className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentHouse.name}</h1>
              <AddressLink />
            </div>

            {/* Tabs Navigation */}
            <div dir="rtl" className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'description', label: 'توضیحات' },
                  { id: 'amenities', label: 'امکانات' },
                  { id: 'rules', label: 'قوانین' },
                ].map((tab, index) => (
                  <div key={tab.id} className="flex items-center">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
          `}
                    >
                      {tab.label}
                    </button>
                    {index < 2 && (
                      <span className="mx-2 text-gray-300">|</span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div dir="rtl">
              {activeTab === 'description' && (
                <div className="prose prose-lg text-gray-700 max-w-none">
                  <h2 className="text-xl font-semibold mb-4">درباره اقامتگاه</h2>
                  <p>{currentHouse.description || 'توضیحاتی برای این اقامتگاه ثبت نشده است.'}</p>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">امکانات رفاهی</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {currentHouse.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">
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
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">قوانین صاحبخانه</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentHouse.houseRoles?.map((rule, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
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
          <div className="lg:w-2/5">
            <div className="sticky top-4">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <BookingWidget house={currentHouse} id={id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4 text-center">موقعیت مکانی</h2>
          <div className="h-96 rounded-xl overflow-hidden">
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
    'تلویزیون': <PiTelevision className="w-6 h-6" />,
    'پارکینگ': <LuCircleParking className="w-6 h-6" />,
    'رادیو': <HiOutlineRadio className="w-6 h-6" />,
    'جاروبرقی': <GiVacuumCleaner className="w-6 h-6" />,
    'بالکن': <PiSolarRoof className="w-6 h-6" />,
    'آلاچیق': <LiaWarehouseSolid className="w-6 h-6" />
  };

  return icons[amenity] || <PiTelevision className="w-6 h-6" />;
}