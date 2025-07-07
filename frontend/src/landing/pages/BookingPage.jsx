import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";

import AddressLink from "../components/AddressLink";
import HouseGallery from "../components/HouseGallery";
import BookingDates from "../components/BookingDates";

import { PiDog, PiTelevision, PiSolarRoof, PiBathtub, PiSwimmingPool, PiWashingMachine, PiForkKnifeDuotone, PiOvenDuotone } from "react-icons/pi"
import { LuCircleParking, LuRefrigerator } from "react-icons/lu";
import { HiOutlineRadio } from "react-icons/hi2";
import { GiVacuumCleaner, GiBarbecue } from "react-icons/gi";
import { LiaWarehouseSolid } from "react-icons/lia"
import { BiSpeaker } from "react-icons/bi";
import { MdOutlineKebabDining, MdOutlineCoffeeMaker, MdOutlineMicrowave } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";
import BookingWidget from "../components/BookingWidget";
import HeaderPages from "../components/HeaderPages";
import { FaCircleCheck } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCalendarOutline } from "react-icons/io5";
import { TbClockHour7 } from "react-icons/tb";
import { RiGroup2Line } from "react-icons/ri";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import MapPage from "../components/MapPage"
import Footer from "../components/Footer"


const cities = [
  "arak",
  "ardebil",
  "oromieh",
  "isfahan",
  "ahvaz",
  "elam",
  "bognord",
  "bandar_abbas",
  "boshehr",
  "birgand",
  "tabriz",
  "tehran",
  "khoram_abad",
  "rasht",
  "zahedan",
  "zanjan",
  "sari",
  "semnan",
  "sanandaj",
  "sharekord",
  "shiraz",
  "ghazvin",
  "ghom",
  "karaj",
  "kerman",
  "kermanshah",
  "gorgan",
  "mashhad",
  "hamedan",
  "yasoj",
  "yazd",
];


const convertCityEnglishToPersian = (city) => {

  switch (city) {
      case "arak":
          return "اراک"
          break;

      case "ardebil":
          return "اردبیل"
          break;


      case "oromieh":
          return "ارومیه"
          break;


      case "isfahan":
          return "اصفهان"
          break;

      case "ahvaz":
          return "اهواز"
          break;

      case "elam":
          return "ایلام"
          break;

      case "bognord":
          return "بجنورد"
          break;

      case "bandar_abbas":
          return "بندرعباس"
          break;

      case "boshehr":
          return "بوشهر"
          break;

      case "birgand":
          return "بیرجند"
          break;

      case "tabriz":
          return "تبریز"
          break;

      case "tehran":
          return "تهران"
          break;

      case "khoram_abad":
          return "خرم آباد "
          break;

      case "rasht":
          return "رشت"
          break;

      case "zahedan":
          return "زاهدان"
          break;

      case "zanjan":
          return "زنجان"
          break;

      case "sari":
          return "ساری"
          break;

      case "semnan":
          return "سمنان"
          break;

      case "sanandaj":
          return "سنندج"
          break;

      case "sharekord":
          return "شهرکرد"
          break;


      case "shiraz":
          return "شیراز"
          break;


      case "ghazvin":
          return "قزوین"
          break;

      case "ghom":
          return "قم"
          break;

      case "karaj":
          return "کرج"
          break;

      case "kerman":
          return "کرمان"
          break;

      case "kermanshah":
          return "کرمانشاه"
          break;


      case "gorgan":
          return "گرگان"
          break;

      case "mashhad":
          return "مشهد"
          break;

      case "hamedan":
          return "همدان"
          break;

      case "yasoj":
          return "یاسوج"
          break;

      case "yazd":
          return "یزد"
          break;

      default:
          break;
  }
}


export default function BookingPage() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState('')
  const [items, setItems] = useState([])
  const [house, setHouse] = useState(null);
  const [owner, setOwner] = useState(null);

  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null

  axios.defaults.headers.common['authorization'] = userToken;

  useEffect(() => {
    axios.get('/api/users/me', {
      headers: {
        'authorization': 'Bearer ' + userToken
      }
    })
      .then((res) => {
        setUser(res.data.user)
      })
      .catch((err) => {
        console.error(err)
      });


    if (id) {
      axios.get('/api/users/bookings', {
        headers: {
          'authorization': 'Bearer ' + userToken
        }
      }).then(response => {
        const foundBooking = response.data.bookings.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          setHouse(foundBooking.house)
          setOwner(foundBooking.owner)
        }
      });
    }

  }, []);

  if (!booking) {
    return '';
  }

  const confirmBooking = async (e) => {
    e.preventDefault();
    await axios.put(`/api/users/confirm-booking/${booking._id}`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      }
    })
      .then((res) => {
        toast.info(res.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

      })
      .catch((err) => {
        toast.error(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      });
  }



  return (
    <>
      <HeaderPages />
      <div className="flex flex-col md:flex-row p-4 rtl mt-4">

        {/* User Basic Information Column 1 */}
        <div className="w-full md:w-3/5 py-6 bg-white mb-4 md:mb-0">
          {/* <div className="flex justify-between px-2 py-2 mx-6">
            <h1 className="text-2xl text-blue-800 font-bold">وضعیت رزرو</h1>
            <p className="text-gray-100">----------------------------------------------</p>
            <span className="bg-blue-100 p-4 text-blue-800 rounded-full">در انتظار تایید</span>
          </div> */}

          <div className="flex items-center w-full px-4 py-2 bg-white">
            <div className="flex-none">
              <h1 className="text-2xl text-blue-800">وضعیت رزرو</h1>
            </div>

            <div className="flex-grow border-t border-dashed border-gray-300 mx-4"></div>

            <div className="flex-none">
              {booking.isConfirmed ? (<span className="bg-blue-100 py-4 px-12 text-green-800 rounded-full"> تایید شده</span>) : (<span className="bg-blue-100 py-4 px-12 text-blue-800 rounded-full">در انتظار تایید</span>)}
            </div>
          </div>

          <div className="flex border items-center mx-6 my-6 p-4 rounded-md">
            <img src={`../${owner.avatar}`} alt={owner.name} className="rounded-full w-14 h-14" />
            <h1 className="text-gray-400 mx-2">میزبان</h1>
            <h1 className="mr-4">{owner.name ? owner.name : owner.phone}</h1>
            <FaCircleCheck className="text-green-400 w-6 h-6 mr-2" />
          </div>

          <div className="flex border items-center mx-6 my-6 p-4 rounded-md">
            <img src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png" alt="avatar" className="rounded-full w-14 h-14" />
            <h1 className="mx-2">{user.name ? user.name : user.phone}</h1>
          </div>

          <div className="flex justify-center items-center my-2 p-2">
            {booking.isConfirmed ? (
            <button disabled="true" style={{cursor:'not-allowed'}} className="rounded mx-auto mb-0 py-4 px-12 w-50 text-white bg-green-800 shadow-lg focus:outline-none focus:ring-2">تایید شده</button>
            ) : (<button onClick={confirmBooking} className="rounded mx-auto mb-0 py-4 px-12 w-50 text-white bg-blue-800 shadow-lg hover:bg-blue-900 focus:outline-none focus:ring-2">تایید رزرو</button>)}

          </div>
        </div>

        {/* Update User Information Column 2 */}
        <div className="w-full flex flex-col justify-between md:w-2/5 bg-white border border-gray-200 rounded-lg shadow mx-4">

          <div className="flex bg-white rounded-lg flex-col justify-between mt-5 mb-6 md:flex-row">
            <div className="flex flex-col mx-4">
              <h1 className="block text-2xl">{convertCityEnglishToPersian(house.name)}</h1>
              <span className="flex items-center mt-4 text-gray-400 font-sm"><HiOutlineLocationMarker className="w-6 h-6" />{house.city}</span>
              <span className="block text-gray-400 font-sm">شناسه اقامتگاه: {house._id}</span>
              <span className="block text-gray-400 font-sm">کد رزرو: {booking._id}</span>
            </div>
            <div className="mx-4 my-0">
              <img src={house.cover} alt={house.name}
                className="object-cover rounded-md" />
            </div>

          </div>
          <div className="border border-gray-200 mb-0 mx-4"></div>

          <div className="flex flex-col">
            <div className="flex items-center w-full mb-0 px-0 py-6">
              <div className="flex-none">
                <h1 className="mx-4 flex items-center text-gray-400"><RiGroup2Line className="w-6 h-6 ml-2" /> تعداد نفرات </h1>
              </div>

              <div className="flex-grow border-t border-dashed border-gray-300 mx-4"></div>
              <div className="flex-none">
                <span className="mx-4">{booking.guests}</span>
              </div>
            </div>
            <div className="flex items-center w-full mb-0 px-0 py-6">
              <div className="flex-none">
                <h1 className="mx-4 flex items-center text-gray-400"><IoCalendarOutline className="w-6 h-6 ml-2" /> تاریخ رزرو </h1>
              </div>

              <div className="flex-grow border-t border-dashed border-gray-300 mx-4"></div>
              <div className="flex-none">
                <span className="mx-4">از {new Date(booking.checkIn).toLocaleDateString("fa")} تا {new Date(booking.checkOut).toLocaleDateString("fa")}</span>
              </div>
            </div>
            <div className="flex items-center w-full mb-0 px-0 py-6">
              <div className="flex-none">
                <h1 className="mx-4 flex items-center text-gray-400 text-gray-400"><TbClockHour7 className="w-6 h-6 ml-2" /> مدت کل اقامت </h1>
              </div>

              <div className="flex-grow border-t border-dashed border-gray-300 mx-4"></div>
              <div className="flex-none">
                <span className="mx-4">{differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} شب</span>
              </div>
            </div>
          </div>


          <div className="border border-gray-200 mb-0"></div>
          <div className="flex items-center w-full bg-blue-50 mb-0 px-0 py-6">
            <div className="flex-none">
              <h1 className="mx-4">هزینه کل</h1>
            </div>

            <div className="flex-grow border-t border-dashed border-gray-300 mx-4"></div>
            <div className="flex-none">
              <span className="text-2xl mx-4">{booking.price}</span>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
}