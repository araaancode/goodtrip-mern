import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../components/BookingWidget";
import HouseGallery from "../components/HouseGallery";
import AddressLink from "../components/AddressLink";
import MapPage from "../components/MapPage";
import Footer from "../components/Footer";
import HeaderPages from "../components/HeaderPages";

// Icons
import { PiTelevision, PiBathtub, PiSwimmingPool, PiWashingMachine, PiForkKnifeDuotone, PiOvenDuotone, PiSolarRoof } from "react-icons/pi";
import { LuCircleParking, LuRefrigerator } from "react-icons/lu";
import { HiOutlineRadio } from "react-icons/hi2";
import { GiVacuumCleaner, GiBarbecue } from "react-icons/gi";
import { LiaWarehouseSolid } from "react-icons/lia";
import { BiSpeaker } from "react-icons/bi";
import { MdOutlineKebabDining, MdOutlineCoffeeMaker, MdOutlineMicrowave } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";

export default function HousePage() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/users/houses/${id}`).then(response => {
      setHouse(response.data.house);
    });
  }, [id]);

  if (!house) return '';

  return (
    <>
      <HeaderPages />

      <div className="bg-gray-50">
        {/* Gallery Section with proper containment */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HouseGallery house={house} />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Content */}
            <div className="lg:w-3/5">
              <div dir="rtl" className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{house.name}</h1>
                <AddressLink house={house} className="text-lg text-gray-600" />
              </div>

              {/* Tabs Navigation */}
              <div dir="rtl" className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    توضیحات
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'amenities' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    امکانات
                  </button>
                  <button
                    onClick={() => setActiveTab('rules')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rules' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    قوانین
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div dir="rtl">
                {activeTab === 'description' && (
                  <div className="prose prose-lg text-gray-700 max-w-none">
                    <h2 className="text-xl font-semibold mb-4">درباره اقامتگاه</h2>
                    <p>
                      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                    </p>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">امکانات رفاهی</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { icon: <PiTelevision className="w-6 h-6" />, label: "تلویزیون" },
                          { icon: <LuCircleParking className="w-6 h-6" />, label: "پارکینگ رایگان" },
                          { icon: <HiOutlineRadio className="w-6 h-6" />, label: "رادیو" },
                          { icon: <GiVacuumCleaner className="w-6 h-6" />, label: "جاروبرقی" },
                          { icon: <PiSolarRoof className="w-6 h-6" />, label: "بالکن" },
                          { icon: <LiaWarehouseSolid className="w-6 h-6" />, label: "آلاچیق" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{item.icon}</span>
                            <span className="text-gray-700 text-sm font-medium">{item.label}</span>
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
                        {[
                          "ساعت ورود: 15:00",
                          "حداقل مدت اقامت مهمان: 1 شب",
                          "ورود حیوانات خانگی مجاز است",
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700 text-sm font-medium">{item}</span>
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
                  <BookingWidget house={house} id={id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Now properly separated */}
        <div className="bg-white border-t border-gray-200 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold mb-4 text-center">موقعیت مکانی</h2>
            <div className="h-96 rounded-xl overflow-hidden">
              <MapPage />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}