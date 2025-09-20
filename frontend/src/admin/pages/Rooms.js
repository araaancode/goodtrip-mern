import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { openModal } from "../features/common/modalSlice";
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil';
import Swal from 'sweetalert2';
import axios from "axios";
import { useAdminAuthStore } from '../stores/authStore';
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt';

const convertCityEnglishToPersian = (city) => {
  const cityMap = {
    "arak": "اراک",
    "ardebil": "اردبیل",
    "oromieh": "ارومیه",
    "isfahan": "اصفهان",
    "ahvaz": "اهواز",
    "elam": "ایلام",
    "bognord": "بجنورد",
    "bandar_abbas": "بندرعباس",
    "boshehr": "بوشهر",
    "birgand": "بیرجند",
    "tabriz": "تبریز",
    "tehran": "تهران",
    "khoram_abad": "خرم آباد",
    "rasht": "رشت",
    "zahedan": "زاهدان",
    "zanjan": "زنجان",
    "sari": "ساری",
    "semnan": "سمنان",
    "sanandaj": "سنندج",
    "sharekord": "شهرکرد",
    "shiraz": "شیراز",
    "ghazvin": "قزوین",
    "ghom": "قم",
    "karaj": "کرج",
    "kerman": "کرمان",
    "kermanshah": "کرمانشاه",
    "gorgan": "گرگان",
    "mashhad": "مشهد",
    "hamedan": "همدان",
    "yasoj": "یاسوج",
    "yazd": "یزد"
  };
  
  return cityMap[city] || city;
};

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const createNewUser = () => {
    dispatch(openModal({ 
      title: "ایجاد ادمین جدید", 
      bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN 
    }));
  };

  return (
    <button className="btn btn-primary btn-sm" onClick={createNewUser}>
      ایجاد ادمین جدید
    </button>
  );
};

const Rooms = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAdminAuthenticated, logout } = useAdminAuthStore();

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/admins/houses', {
        withCredentials: true,
        timeout: 10000 // 10 second timeout
      });
      
      if (response.data && response.data.houses) {
        setHouses(response.data.houses);
      } else {
        throw new Error('فرمت پاسخ سرور نامعتبر است');
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
      
      let errorMessage = 'خطا در دریافت اطلاعات اقامتگاه‌ها';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'اتصال به سرور timeout خورد';
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = 'لطفا مجدداً وارد شوید';
          logout();
        } else if (err.response.status === 403) {
          errorMessage = 'شما دسترسی لازم را ندارید';
        } else if (err.response.status === 404) {
          errorMessage = 'آدرس API یافت نشد';
        } else if (err.response.status >= 500) {
          errorMessage = 'مشکلی در سرور رخ داده است';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'پاسخی از سرور دریافت نشد. لطفا اتصال اینترنت را بررسی کنید';
      }
      
      setError(errorMessage);
      
      // Only show Swal for non-auth errors to avoid multiple popups
      if (!err.response || err.response.status !== 401) {
        Swal.fire({
          title: "<small>خطا</small>",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "متوجه شدم"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateHouseStatus = async (isActiveState, houseId) => {
    try {
      const result = await Swal.fire({
        title: `<small>آیا از ${isActiveState ? 'غیر فعال' : 'فعال'} کردن اقامتگاه اطمینان دارید؟</small>`,
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`,
        icon: "question"
      });
      
      if (!result.isConfirmed) {
        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
        return;
      }
      
      const endpoint = `/api/admins/houses/${houseId}/${isActiveState ? 'deactive' : 'active'}`;
      await axios.put(endpoint, {}, {
        withCredentials: true,
        timeout: 10000
      });
      
      setHouses(prevHouses => 
        prevHouses.map(house => 
          house._id === houseId 
            ? { ...house, isActive: !isActiveState } 
            : house
        )
      );
      
      Swal.fire("<small>وضعیت اقامتگاه با موفقیت تغییر کرد!</small>", "", "success");
    } catch (err) {
      console.error('Error updating house status:', err);
      
      let errorMessage = "تغییرات ذخیره نشد";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'لطفا مجدداً وارد شوید';
          logout();
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      Swal.fire({
        title: "<small>خطا</small>",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "متوجه شدم"
      });
    }
  };

  if (loading) {
    return (
      <TitleCard title="اقامتگاه ها" topMargin="mt-2">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="mr-2">در حال دریافت اطلاعات...</span>
        </div>
      </TitleCard>
    );
  }

  if (error) {
    return (
      <TitleCard title="اقامتگاه ها" topMargin="mt-2">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm btn-ghost" onClick={fetchHouses}>
              تلاش مجدد
            </button>
          </div>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard 
      title="اقامتگاه ها" 
      topMargin="mt-2" 
      TopSideButtons={<TopSideButtons />}
    >
      <div className="overflow-x-auto w-full">
        {houses.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th>نام خانه</th>
                <th>استان(شهرستان)</th>
                <th>نام مالک</th>
                <th>شماره تلفن مالک</th>
                <th>تاریخ ایجاد</th>
                <th>وضعیت</th>
                <th>تغییر وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {houses.map((house) => (
                <tr key={house._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <svg 
                          stroke="currentColor" 
                          fill="currentColor" 
                          strokeWidth="0" 
                          viewBox="0 0 256 256" 
                          className="h-8 w-8 text-gray-800" 
                          height="1em" 
                          width="1em" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold mr-3">{house.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{convertCityEnglishToPersian(house.province)}</td>
                  <td>{house.owner.name}</td>
                  <td>{house.owner.phone}</td>
                  <td>{new Date(house.createdAt).toLocaleDateString('fa')}</td>
                  <td>
                    <span className={`badge ${house.isActive ? 'badge-success' : 'badge-error'}`}>
                      {house.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => updateHouseStatus(house.isActive, house._id)}
                      title="تغییر وضعیت"
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-500 mt-4">
              هیچ اقامتگاهی هنوز اضافه نشده است...
            </h3>
          </div>
        )}
      </div>
    </TitleCard>
  );
};

export default Rooms;