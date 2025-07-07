import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";

import { PiHouseLight } from "react-icons/pi";
import { TfiUser } from "react-icons/tfi";
import { TbPhone } from "react-icons/tb";
import { RxRulerHorizontal } from "react-icons/rx";
import { PiHourglassSimpleLow } from "react-icons/pi";
import { VscLaw } from "react-icons/vsc";
import { FaUsers } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { PiImagesLight } from "react-icons/pi";
import { PiWarehouseLight } from "react-icons/pi";
import { SlOptions } from "react-icons/sl";
import { PiThermometerColdLight } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";
import { PiSolarRoof } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { RiPriceTagLine } from "react-icons/ri";
import { TbCircleDashedNumber4 } from "react-icons/tb";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { TbHomeEdit } from "react-icons/tb";
import { LiaConciergeBellSolid } from "react-icons/lia";
import { RiPriceTag3Line } from "react-icons/ri";
import { FiInfo, FiMapPin } from "react-icons/fi";
import { BsHouseExclamation } from "react-icons/bs";
import { PiSignpostLight } from "react-icons/pi";
import { CiCircleQuestion } from "react-icons/ci";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import provincesData from "../components/provinces_cities.json";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Dialog } from "@headlessui/react";

const markerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/312483/location-indicator-red.svg",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  //   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  //   shadowSize: [55, 55],
});

const hobbiesList = [
  { value: "swimming_pool", label: "استخر" },
  { value: "jacuzzi", label: "جکوزی" },
  { value: "sauna", label: "سونا" },
  { value: "home_cinema", label: "سینمای خانگی" },
  { value: "game_room", label: "اتاق بازی" },
  { value: "billiard_table", label: "میز بیلیارد" },
  { value: "ping_pong_table", label: "میز پینگ‌پنگ" },
  { value: "football_table", label: "فوتبال‌دستی" },
  { value: "music_system", label: "سیستم صوتی" },
  { value: "video_game_console", label: "کنسول بازی" },
  { value: "library", label: "کتابخانه" },
  { value: "barbecue", label: "باربیکیو" },
  { value: "garden", label: "باغچه" },
  { value: "playground", label: "زمین بازی کودکان" },
  { value: "terrace", label: "تراس با ویو" },
  { value: "basketball_hoop", label: "حلقه بسکتبال" },
  { value: "mini_golf", label: "مینی‌گلف" },
  { value: "karaoke", label: "کارائوکه" },
  { value: "board_games", label: "بازی‌های رومیزی" },
  { value: "fireplace", label: "شومینه" },
  { value: "other", label: "سایر" },
];

const enviornmentList = [
  { value: "mountain", label: "کوهستانی" },
  { value: "wood", label: "جنگلی" },
  { value: "sea", label: "دریا" },
  { value: "beach", label: "ساحلی" },
  { value: "dessert", label: "بیابانی" },
  { value: "wild", label: "حیات وحش" },
  { value: "ecotourism", label: "بوم گردی" },
  { value: "antiquities", label: "باستانی تاریخی" },
  { value: "central", label: "مرکز شهر" },
  { value: "village", label: "روستایی" },
  { value: "other", label: "سایر" },
];

const ownerTypeList = [
  { value: "personal", label: "شخصی" },
  { value: "co_owned", label: "مشاع" },
  { value: "leased", label: "استیجاری" },
  { value: "mortgaged", label: "رهنی" },
  { value: "official_contract", label: "دارای سند رسمی" },
  { value: "non_official_contract", label: "قولنامه‌ای (غیررسمی)" },
  { value: "endowment", label: "وقفی" },
  { value: "inheritance", label: "ارثی" },
  { value: "cooperative", label: "تعاونی" },
  { value: "governmental", label: "دولتی" },
  { value: "confiscated", label: "تملیکی" },
  { value: "other", label: "سایر" },
];

const weekDays = [
  {
    label: "روزهای هفته",
    options: [
      { value: "sat", label: "شنبه" },
      { value: "sun", label: "یکشنبه" },
      { value: "mon", label: "دوشنبه" },
      { value: "thu", label: "سه شنبه" },
      { value: "wed", label: "چهارشنبه" },
      { value: "thur", label: "پنج شنبه" },
      { value: "fri", label: "جمعه" },
    ],
  },
];

const houseTypeList = [
  { value: "residential", label: "مسکونی" },
  { value: "commercial", label: "تجاری" },
  { value: "office", label: "اداری" },
  { value: "industrial", label: "صنعتی" },
  { value: "agricultural", label: "کشاورزی" },
  { value: "villa", label: "ویلا" },
  { value: "land", label: "زمین" },
  { value: "garden", label: "باغ" },
  { value: "warehouse", label: "انبار" },
  { value: "shop", label: "مغازه" },
  { value: "apartment", label: "آپارتمان" },
  { value: "penthouse", label: "پنت‌هاوس" },
  { value: "duplex", label: "دوبلکس" },
  { value: "suite", label: "سوییت" },
  { value: "hotel", label: "هتل" },
  { value: "clinic", label: "کلینیک" },
  { value: "cottage", label: "کلبه" },
  { value: "room", label: "اتاق" },
  { value: "old", label: "قدیمی" },
  { value: "new", label: "نوساز" },
  { value: "rebuild", label: "بازسازی" },
  { value: "farm", label: "دامداری / مرغداری" },
  { value: "other", label: "سایر" },
];

const houseOptions = [
  { value: "parking", label: "پارکینگ" },
  { value: "elevator", label: "آسانسور" },
  { value: "private_elevator", label: "آسانسور اختصاصی" },
  { value: "storage", label: "انباری" },
  { value: "balcony", label: "بالکن" },
  { value: "terrace", label: "تراس" },
  { value: "yard", label: "حیاط" },
  { value: "garden", label: "باغچه" },
  { value: "roof_garden", label: "روف گاردن" },
  { value: "swimming_pool", label: "استخر" },
  { value: "jacuzzi", label: "جکوزی" },
  { value: "sauna", label: "سونا" },
  { value: "gym", label: "باشگاه ورزشی" },
  { value: "barbecue", label: "باربیکیو" },
  { value: "gazebo", label: "آلاچیق" },
  { value: "fireplace", label: "شومینه" },
  { value: "fountain", label: "آبنما" },
  { value: "playground", label: "زمین بازی کودکان" },
  { value: "security_door", label: "درب ضد سرقت" },
  { value: "video_door_phone", label: "آیفون تصویری" },
  { value: "alarm_system", label: "سیستم امنیتی" },
  { value: "cctv", label: "دوربین مداربسته" },
  { value: "security_guard", label: "نگهبانی ۲۴ ساعته" },
  { value: "smart_home", label: "خانه هوشمند" },
  { value: "remote_control_gate", label: "درب ریموت دار" },
  { value: "furnished", label: "مبله" },
  { value: "air_conditioning", label: "کولر گازی" },
  { value: "central_heating", label: "سیستم گرمایشی مرکزی" },
  { value: "floor_heating", label: "گرمایش از کف" },
  { value: "package_heater", label: "پکیج" },
  { value: "radiator", label: "رادیاتور" },
  { value: "split_ac", label: "اسپیلت" },
  { value: "chiller", label: "چیلر" },
  { value: "fan_coil", label: "فن‌کویل" },
  { value: "well_water", label: "چاه آب" },
  { value: "electricity", label: "برق" },
  { value: "three_phase_electricity", label: "برق سه‌فاز" },
  { value: "generator", label: "ژنراتور برق" },
  { value: "natural_gas", label: "گاز شهری" },
  { value: "sewage_connection", label: "اتصال به فاضلاب شهری" },
  { value: "water_tank", label: "مخزن آب" },
  { value: "booster_pump", label: "پمپ تقویت فشار" },
  { value: "solar_panel", label: "پنل خورشیدی" },
  { value: "internet", label: "اینترنت" },
  { value: "adsl", label: "اینترنت ADSL" },
  { value: "fiber_optic", label: "فیبر نوری" },
  { value: "satellite_tv", label: "ماهواره" },
  { value: "landline", label: "تلفن ثابت" },
  { value: "private_entrance", label: "ورودی مجزا" },
  { value: "indoor_parking", label: "پارکینگ سرپوشیده" },
  { value: "outdoor_parking", label: "پارکینگ روباز" },
  { value: "multi_unit", label: "چند واحدی" },
  { value: "single_unit", label: "تک واحدی" },
  { value: "duplex", label: "دوبلکس" },
  { value: "triplex", label: "تریپلکس" },
  { value: "seaview", label: "ویو دریا" },
  { value: "mountain_view", label: "ویو کوهستان" },
  { value: "forest_view", label: "ویو جنگل" },
  { value: "lake_view", label: "ویو دریاچه" },
  { value: "city_view", label: "ویو شهر" },
  { value: "private_beach", label: "ساحل اختصاصی" },
  { value: "agricultural_license", label: "مجوز کشاورزی" },
  { value: "well_documented", label: "دارای سند شش دانگ" },
  { value: "partitioned_document", label: "سند تفکیکی" },
  { value: "cooperative_ownership", label: "سند تعاونی" },
  { value: "endowment_land", label: "زمین وقفی" },
  { value: "building_permit", label: "پروانه ساخت" },
  { value: "renovated", label: "بازسازی شده" },
  { value: "newly_built", label: "نوساز" },
  { value: "under_construction", label: "در حال ساخت" },
  { value: "old_but_sound", label: "قدیمی ولی قابل سکونت" },
  { value: "commercial_license", label: "مجوز تجاری" },
  { value: "residential_license", label: "مجوز مسکونی" },
  { value: "industrial_license", label: "مجوز صنعتی" },
  { value: "frontage", label: "بر خیابان" },
  { value: "corner_lot", label: "زمین دو بر" },
  { value: "access_road", label: "دسترسی مناسب" },
  { value: "other", label: "سایر" },
];

const coolingList = [
  { value: "split_ac", label: "اسپیلت" },
  { value: "gas_cooler", label: "کولر گازی" },
  { value: "water_cooler", label: "کولر آبی" },
  { value: "central_cooling", label: "سیستم سرمایش مرکزی" },
  { value: "chiller", label: "چیلر" },
  { value: "fan_coil", label: "فن‌کویل" },
  { value: "vrf_system", label: "سیستم VRF" },
  { value: "package_unit_cooling", label: "پکیج یونیت سرمایشی" },
  { value: "ceiling_fan", label: "پنکه سقفی" },
  { value: "wall_fan", label: "پنکه دیواری" },
  { value: "floor_fan", label: "پنکه ایستاده" },
  { value: "natural_ventilation", label: "تهویه طبیعی" },
  { value: "other", label: "سایر" },
];

const heatingList = [
  { value: "radiator", label: "رادیاتور" },
  { value: "floor_heating", label: "گرمایش از کف" },
  { value: "central_heating", label: "سیستم گرمایشی مرکزی" },
  { value: "package_heater", label: "پکیج" },
  { value: "wall_heater", label: "بخاری گازی دیواری" },
  { value: "gas_heater", label: "بخاری گازی" },
  { value: "oil_heater", label: "بخاری نفتی" },
  { value: "wood_stove", label: "بخاری هیزمی" },
  { value: "fireplace", label: "شومینه" },
  { value: "electric_heater", label: "بخاری برقی" },
  { value: "fan_coil", label: "فن‌کویل" },
  { value: "chiller_heating", label: "سیستم چیلر گرمایشی" },
  { value: "vrf_heating", label: "سیستم VRF گرمایشی" },
  { value: "kerosene_heater", label: "بخاری چراغی (نفتی سنتی)" },
  { value: "solar_heating", label: "سیستم گرمایش خورشیدی" },
  { value: "other", label: "سایر" },
];

const floorTypeList = [
  { value: "ceramic", label: "سرامیک" },
  { value: "porcelain", label: "پرسلان" },
  { value: "tile", label: "کاشی" },
  { value: "laminate", label: "لمینت" },
  { value: "parquet", label: "پارکت" },
  { value: "hardwood", label: "چوب طبیعی" },
  { value: "vinyl", label: "وینیل" },
  { value: "epoxy", label: "اپوکسی" },
  { value: "cement", label: "سیمانی" },
  { value: "stone", label: "سنگ" },
  { value: "granite", label: "سنگ گرانیت" },
  { value: "marble", label: "سنگ مرمر" },
  { value: "mosaic", label: "موزاییک" },
  { value: "carpet", label: "موکت" },
  { value: "carpet_flooring", label: "فرش دیواری" },
  { value: "pvc", label: "کفپوش PVC" },
  { value: "brick", label: "آجر فرش" },
  { value: "rubber", label: "کفپوش لاستیکی" },
  { value: "decking", label: "کفپوش چوبی فضای باز (دکینگ)" },
  { value: "turquoise_tile", label: "کاشی فیروزه‌ای (سنتی)" },
  { value: "terrazzo", label: "ترازو" },
];

const kitchenOptionList = [
  { value: "open_kitchen", label: "آشپزخانه اپن" },
  { value: "island_kitchen", label: "جزیره آشپزخانه" },
  { value: "closed_kitchen", label: "آشپزخانه بسته" },
  { value: "iranian_kitchen", label: "آشپزخانه سنتی (ایرانی)" },
  { value: "western_kitchen", label: "آشپزخانه مدرن (فرنگی)" },
  { value: "kitchenette", label: "آشپزخانه کوچک (کیت‌چن)" },
  { value: "pantry", label: "پنتری (انباری آشپزخانه)" },
  { value: "dishwasher", label: "ماشین ظرفشویی" },
  { value: "gas_stove", label: "اجاق گاز رومیزی" },
  { value: "oven", label: "فر توکار" },
  { value: "microwave", label: "مایکروویو" },
  { value: "refrigerator", label: "یخچال" },
  { value: "hood", label: "هود" },
  { value: "sink_double", label: "سینک دولگنه" },
  { value: "sink_single", label: "سینک تک‌لگنه" },
  { value: "granite_counter", label: "صفحه گرانیتی" },
  { value: "quartz_counter", label: "صفحه کوارتز" },
  { value: "marble_counter", label: "صفحه مرمری" },
  { value: "melamine_cabinets", label: "کابینت ملامینه" },
  { value: "mdf_cabinets", label: "کابینت MDF" },
  { value: "wooden_cabinets", label: "کابینت چوبی" },
  { value: "high_gloss_cabinets", label: "کابینت های‌گلاس" },
  { value: "lighting_under_cabinets", label: "نور زیر کابینتی" },
  { value: "built_in_appliances", label: "وسایل توکار" },
  { value: "smart_kitchen", label: "آشپزخانه هوشمند" },
  { value: "breakfast_bar", label: "بار صبحانه" },
  { value: "water_purifier", label: "تصفیه آب" },
  { value: "garbage_disposal", label: "دستگاه زباله‌خردکن" },
  { value: "laundry_space", label: "فضای لباسشویی" },
  { value: "kitchen_storage_drawers", label: "کشوهای نظم‌دهنده" },
  { value: "pull_out_pantry", label: "پنتری کشویی" },
  { value: "corner_carousel", label: "گردان کنج کابینت" },
  { value: "chimney_hood", label: "هود شومینه‌ای" },
  { value: "touch_controls", label: "پنل لمسی" },
];

const bedRoomOptionList = [
  { value: "master_bedroom", label: "اتاق خواب مستر" },
  { value: "built_in_closet", label: "کمد دیواری" },
  { value: "walk_in_closet", label: "کلوزت روم (رختکن)" },
  { value: "ensuite_bathroom", label: "حمام داخل اتاق" },
  { value: "balcony_access", label: "دسترسی به بالکن" },
  { value: "soundproofing", label: "عایق صدا" },
  { value: "floor_heating", label: "گرمایش از کف" },
  { value: "split_ac", label: "کولر اسپیلت" },
  { value: "fan", label: "پنکه" },
  { value: "fireplace", label: "شومینه" },
  { value: "smart_lighting", label: "نورپردازی هوشمند" },
  { value: "ceiling_lights", label: "نور مخفی سقف" },
  { value: "curtains", label: "پرده" },
  { value: "blackout_curtains", label: "پرده ضخیم (بلک‌اوت)" },
  { value: "tv_mount", label: "محل نصب تلویزیون" },
  { value: "wallpaper", label: "کاغذ دیواری" },
  { value: "laminate_flooring", label: "کفپوش لمینت" },
  { value: "parquet_flooring", label: "کفپوش پارکت" },
  { value: "carpet_flooring", label: "موکت" },
  { value: "bed_headboard_lighting", label: "نور بالای تخت" },
  { value: "furniture_included", label: "مبلمان کامل" },
  { value: "desk_space", label: "فضای میز مطالعه" },
  { value: "vanity_table", label: "میز آرایش" },
  { value: "mirror", label: "آینه قدی" },
  { value: "book_shelves", label: "قفسه کتاب" },
  { value: "safe_box", label: "گاوصندوق" },
  { value: "smart_blinds", label: "پرده هوشمند" },
  { value: "ceiling_fan", label: "پنکه سقفی" },
  { value: "decorative_ceiling", label: "سقف دکوراتیو" },
  { value: "bed_lamp", label: "چراغ کنار تخت" },
];

function UpdateHouse() {
  const [name, setName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [description, setDescription] = useState("");
  const [houseOwner, setHouseOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [phone, setPhone] = useState("");

  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [housePhone, setHousePhone] = useState("");
  const [meters, setMeters] = useState(0);
  const [year, setYear] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [houseRoles, setHouseRoles] = useState([]);
  const [critrias, setCritrias] = useState([]);
  const [houseType, setHouseType] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [floor, setFloor] = useState(0);
  const [options, setOptions] = useState([]);
  const [heating, setHeating] = useState([]);
  const [cooling, setCooling] = useState([]);
  const [parking, setParking] = useState(0);
  const [bill, setBill] = useState([]);
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [enviornment, setEnviornment] = useState([]);
  const [ownerType, setOwnerType] = useState(null);
  const [rooms, setRooms] = useState(0);
  const [freeDates, setFreeDates] = useState([]);
  const [document, setDocument] = useState([]);
  const [floorType, setFloorType] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [kitchenOptions, setKitchenOptions] = useState([]);
  const [reservationRoles, setReservationRoles] = useState([]);
  const [bedRoomOptions, setBedRoomOptions] = useState([]);
  const [house, setHouse] = useState({});
  // const [selectedLocation, setSelectedLocation] = useState(null);

  let token = localStorage.getItem("userToken");

  // btn spinner
  const [btnSpinnerInfo, setBtnSpinnerInfo] = useState(false);
  const [btnSpinnerMap, setBtnSpinnerMap] = useState(false);
  const [btnSpinnerBill, setBtnSpinnerBill] = useState(false);
  const [btnSpinnerDocument, setBtnSpinnerDocument] = useState(false);
  const [btnSpinnerCover, setBtnSpinnerCover] = useState(false);
  const [btnSpinnerImages, setBtnSpinnerImages] = useState(false);

  // const [coords, setCoords] = useState({ lat: null, lng: null });
  // const handleLocationSelect = (location) => {
  //   setCoords(location);
  //   console.log("Selected Location:", location);
  // };

  const [isOpen, setIsOpen] = useState(false);

  // errors
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [provinceError, setProvinceError] = useState(false);
  const [provinceErrorMsg, setProvinceErrorMsg] = useState("");

  const [cityError, setCityError] = useState(false);
  const [cityErrorMsg, setCityErrorMsg] = useState("");

  const [houseOwnerError, setHouseOwnerError] = useState(false);
  const [houseOwnerErrorMsg, setHouseOwnerErrorMsg] = useState("");

  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");

  const [priceError, setPriceError] = useState(false);
  const [priceErrorMsg, setPriceErrorMsg] = useState("");

  const [coverError, setCoverError] = useState(false);
  const [coverErrorMsg, setCoverErrorMsg] = useState("");

  const [imagesError, setImagesError] = useState(false);
  const [imagesErrorMsg, setImagesErrorMsg] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");

  const [postalCodeError, setPostalCodeError] = useState(false);
  const [postalCodeErrorMsg, setPostalCodeErrorMsg] = useState("");

  const [housePhoneError, setHousePhoneError] = useState(false);
  const [housePhoneErrorMsg, setHousePhoneErrorMsg] = useState("");

  const [metersError, setMetersError] = useState(false);
  const [metersErrorMsg, setMetersErrorMsg] = useState("");

  const [yearError, setYearError] = useState(false);
  const [yearErrorMsg, setYearErrorMsg] = useState("");

  const [capacityError, setCapacityError] = useState(false);
  const [capacityErrorMsg, setCapacityErrorMsg] = useState("");

  const [houseRolesError, setHouseRolesError] = useState(false);
  const [houseRolesErrorMsg, setHouseRolesErrorMsg] = useState("");

  const [critriasError, setCritriasError] = useState(false);
  const [critriasErrorMsg, setCritriasErrorMsg] = useState("");

  const [houseTypeError, setHouseTypeError] = useState(false);
  const [houseTypeErrorMsg, setHouseTypeErrorMsg] = useState("");

  // const [latError, setLatError] = useState(false);
  // const [latErrorMsg, setLatErrorMsg] = useState("");

  // const [lngError, setLngError] = useState(false);
  // const [lngErrorMsg, setLngErrorMsg] = useState("");

  const [positionError, setPositionError] = useState(false);
  const [positionErrorMsg, setPositionErrorMsg] = useState("");

  const [floorError, setFloorError] = useState(false);
  const [floorErrorMsg, setFloorErrorMsg] = useState("");

  const [optionsError, setOptionsError] = useState(false);
  const [optionsErrorMsg, setOptionsErrorMsg] = useState("");

  const [heatingError, setHeatingError] = useState(false);
  const [heatingErrorMsg, setHeatingErrorMsg] = useState("");

  const [coolingError, setCoolingError] = useState(false);
  const [coolingErrorMsg, setCoolingErrorMsg] = useState("");

  const [parkingError, setParkingError] = useState(false);
  const [parkingErrorMsg, setParkingErrorMsg] = useState("");

  const [billError, setBillError] = useState(false);
  const [billErrorMsg, setBillErrorMsg] = useState("");

  const [addressError, setAddressError] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");

  const [houseNumberError, setHouseNumberError] = useState(false);
  const [houseNumberErrorMsg, setHouseNumberErrorMsg] = useState("");

  const [hobbiesError, setHobbiesError] = useState(false);
  const [hobbiesErrorMsg, setHobbiesErrorMsg] = useState("");

  const [enviornmentError, setEnviornmentError] = useState(false);
  const [enviornmentErrorMsg, setEnviornmentErrorMsg] = useState("");

  const [ownerTypeError, setOwnerTypeError] = useState(false);
  const [ownerTypeErrorMsg, setOwnerTypeErrorMsg] = useState("");

  const [roomsError, setRoomsError] = useState(false);
  const [roomsErrorMsg, setRoomsErrorMsg] = useState("");

  const [freeDatesError, setFreeDatesError] = useState(false);
  const [freeDatesErrorMsg, setFreeDatesErrorMsg] = useState("");

  const [documentError, setDocumentError] = useState(false);
  const [documentErrorMsg, setDocumentErrorMsg] = useState("");

  const [floorTypeError, setFloorTypeError] = useState(false);
  const [floorTypeErrorMsg, setFloorTypeErrorMsg] = useState("");

  const [discountError, setDiscountError] = useState(false);
  const [discountErrorMsg, setDiscountErrorMsg] = useState("");

  const [kitchenOptionsError, setKitchenOptionsError] = useState(false);
  const [kitchenOptionsErrorMsg, setKitchenOptionsErrorMsg] = useState("");

  const [reservationRolesError, setReservationRolesError] = useState(false);
  const [reservationRolesErrorMsg, setReservationRolesErrorMsg] = useState("");

  const [bedRoomOptionsError, setBedRoomOptionsError] = useState(false);
  const [bedRoomOptionsErrorMsg, setBedRoomOptionsErrorMsg] = useState("");

  // page main Title
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle({ title: "ویرایش ملک" }));
  }, []);

  // photo vars
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray);
  };

  const processFiles = (filesArray) => {
    const newSelectedFiles = [...selectedFiles];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    filesArray.forEach((file) => {
      console.log(file);

      if (newSelectedFiles.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensions.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles(newSelectedFiles);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // photos vars
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions2 = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString2 = acceptedFileExtensions2
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles2(newFilesArray);
  };

  const processFiles2 = (filesArray) => {
    const newSelectedFiles2 = [...selectedFiles2];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions2.join("|"), "i");
    filesArray.forEach((file) => {
      if (newSelectedFiles2.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensions2.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFiles2.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles2(newSelectedFiles2);
    }
  };

  const handleCustomButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileDelete2 = (index) => {
    const updatedFiles = [...selectedFiles2];
    updatedFiles.splice(index, 1);
    setSelectedFiles2(updatedFiles);
  };

  // bill vars
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);

  const fileInputRefBill = useRef(null);
  const acceptedFileExtensionsBill = [
    "jpg",
    "png",
    "jpeg",
    "pdf",
    "txt",
    "docx",
  ];

  const acceptedFileTypesStringBill = acceptedFileExtensionsBill
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChangeBill = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFilesBill(newFilesArray);
  };

  const processFilesBill = (filesArray) => {
    const newSelectedFilesBill = [...selectedFilesBill];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensionsBill.join("|"), "i");
    filesArray.forEach((file) => {
      if (newSelectedFilesBill.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensionsBill.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFilesBill.push(file);
      }
    });

    if (!hasError) {
      setSelectedFilesBill(newSelectedFilesBill);
    }
  };

  const handleCustomButtonClickBill = () => {
    fileInputRefBill.current.click();
  };

  const handleFileDeleteBill = (index) => {
    const updatedFiles = [...selectedFilesBill];
    updatedFiles.splice(index, 1);
    setSelectedFilesBill(updatedFiles);
  };

  // document vars
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);

  const fileInputRefDocument = useRef(null);
  const acceptedFileExtensionsDocument = [
    "jpg",
    "png",
    "jpeg",
    "pdf",
    "txt",
    "docx",
  ];

  const acceptedFileTypesStringDocument = acceptedFileExtensionsDocument
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChangeDocument = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFilesDocument(newFilesArray);
  };

  const processFilesDocument = (filesArray) => {
    const newSelectedFilesDocument = [...selectedFilesDocument];
    let hasError = false;
    const fileTypeRegex = new RegExp(
      acceptedFileExtensionsDocument.join("|"),
      "i"
    );
    filesArray.forEach((file) => {
      if (newSelectedFilesDocument.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensionsDocument.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFilesDocument.push(file);
      }
    });

    if (!hasError) {
      setSelectedFilesDocument(newSelectedFilesDocument);
    }
  };

  const handleCustomButtonClickDocument = () => {
    fileInputRefDocument.current.click();
  };

  const handleFileDeleteDocument = (index) => {
    const updatedFiles = [...selectedFilesDocument];
    updatedFiles.splice(index, 1);
    setSelectedFilesDocument(updatedFiles);
  };

  // province and city data
  useEffect(() => {
    // تبدیل داده‌ها به فرمتی که کامپوننت Select نیاز دارد
    const formattedProvinces = provincesData.map((province) => ({
      label: province.name,
      value: province.id,
      cities: province.cities.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    }));
    setProvinces(formattedProvinces);
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
  };

  // fecth house
  let houseId = window.location.href.split("/houses/")[1].split("/update")[0];

  // set up map
  let iran = [32.4279, 53.688];
  const [position, setPosition] = useState(iran);
  const markerRef = useRef(null);

  // وقتی روی نقشه کلیک می‌کنیم
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  // وقتی مارکر کشیده و رها می‌شود
  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      setLat(newPos.lat);
      setLng(newPos.lng);
    }
  };

  // get single house
  useEffect(() => {
    axios
      .get(`/api/owners/houses/${houseId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHouse(res.data.house);
        setName(res.data.house.name);
        setDescription(res.data.house.description);
        setHouseOwner(res.data.house.houseOwner);
        setPrice(res.data.house.price);
        setCover(res.data.house.cover);
        setImages(res.data.house.images);
        setPostalCode(res.data.house.postalCode);
        setMeters(res.data.house.meters);
        setYear(res.data.house.year);
        setCapacity(res.data.house.capacity);
        setHouseRoles(res.data.house.houseRoles);
        setCritrias(res.data.house.critrias);
        setHouseRoles(res.data.house.houseRoles);
        setHouseType(res.data.house.houseType);
        setFloor(res.data.house.floor);
        // setLat(res.data.house.lat);
        // setLng(res.data.house.lng);
        setPosition([res.data.house.lat, res.data.house.lng]);
        // setOptions(res.data.house.options);
        // setHeating(res.data.house.heating);
        // setCooling(res.data.house.cooling);
        setParking(res.data.house.parking);
        setBill(res.data.house.bill);
        setHousePhone(res.data.house.housePhone);
        setAddress(res.data.house.address);
        setHouseNumber(res.data.house.houseNumber);
        // setHobbies(res.data.house.hobbies);
        // setEnviornment(res.data.house.enviornment);
        setOwnerType(res.data.house.ownerType);
        setRooms(res.data.house.rooms);
        // setFreeDates(res.data.house.freeDates);
        setDocument(res.data.house.document);
        // setFloorType(res.data.house.floorType);
        setDiscount(res.data.house.discount);
        // setKitchenOptions(res.data.house.kitchenOptions);
        setReservationRoles(res.data.house.reservationRoles);
        // setBedRoomOptions(res.data.house.bedRoomOptions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Call API add house
  const UpdateHouseFunction = () => {
    setBtnSpinnerInfo(true);

    if (
      !name ||
      name === "" ||
      name === undefined ||
      name === null ||
      name.length === 0
    ) {
      setNameError(true);
      setNameErrorMsg("* نام ملک باید وارد شود");
    }

    if (
      !selectedProvince ||
      selectedProvince === "" ||
      selectedProvince === undefined ||
      selectedProvince === null ||
      selectedProvince.length === 0 ||
      selectedProvince.label === undefined
    ) {
      setProvinceError(true);
      setProvinceErrorMsg("* نام استان باید وارد شود");
    }

    if (
      !selectedCity ||
      selectedCity === "" ||
      selectedCity === undefined ||
      selectedCity === null ||
      selectedCity.length === 0
    ) {
      setCityError(true);
      setCityErrorMsg("* نام شهر باید وارد شود");
    }

    if (
      !houseOwner ||
      houseOwner === "" ||
      houseOwner === undefined ||
      houseOwner === null ||
      houseOwner.length === 0
    ) {
      setHouseOwnerError(true);
      setHouseOwnerErrorMsg("* نام و نام خانوادگی صاحب ملک باید وارد شود");
    }

    if (
      !housePhone ||
      housePhone === "" ||
      housePhone === undefined ||
      housePhone === null ||
      housePhone.length === 0
    ) {
      setHousePhoneError(true);
      setHousePhoneErrorMsg("* شماره ثابت ملک باید وارد شود");
    }

    if (
      !meters ||
      meters === "" ||
      meters === undefined ||
      meters === null ||
      meters.length === 0
    ) {
      setMetersError(true);
      setMetersErrorMsg("* متراژ ملک باید وارد شود");
    }

    if (
      !year ||
      year === "" ||
      year === undefined ||
      year === null ||
      year.length === 0
    ) {
      setYearError(true);
      setYearErrorMsg("* سال ساخت ملک باید وارد شود");
    }

    if (
      !capacity ||
      capacity === "" ||
      capacity === undefined ||
      capacity === null ||
      capacity.length === 0
    ) {
      setCapacityError(true);
      setCapacityErrorMsg("* ظرفیت ملک باید وارد شود");
    }

    if (
      !postalCode ||
      postalCode === "" ||
      postalCode === undefined ||
      postalCode === null ||
      postalCode.length === 0
    ) {
      setPostalCodeError(true);
      setPostalCodeErrorMsg("* کدپستی ملک باید وارد شود");
    }

    if (
      !hobbies ||
      hobbies === "" ||
      hobbies === undefined ||
      hobbies === null ||
      hobbies.length === 0
    ) {
      setHobbiesError(true);
      setHobbiesErrorMsg("* امکانات تفریحی و سرگرمی ملک باید وارد شود");
    }

    if (
      !enviornment ||
      enviornment === "" ||
      enviornment === undefined ||
      enviornment === null ||
      enviornment.length === 0
    ) {
      setEnviornmentError(true);
      setEnviornmentErrorMsg("* محیط ملک باید وارد شود");
    }

    if (
      !ownerType ||
      ownerType === "" ||
      ownerType === undefined ||
      ownerType === null ||
      ownerType.length === 0
    ) {
      setOwnerTypeError(true);
      setOwnerTypeErrorMsg("* نوع مالکیت ملک باید وارد شود");
    }

    if (
      !freeDates ||
      freeDates === "" ||
      freeDates === undefined ||
      freeDates === null ||
      freeDates.length === 0
    ) {
      setFreeDatesError(true);
      setFreeDatesErrorMsg("* روزهای باید وارد شود");
    }

    // if (
    //   !selectedFiles ||
    //   selectedFiles === "" ||
    //   selectedFiles === undefined ||
    //   selectedFiles === null ||
    //   selectedFiles.length === 0
    // ) {
    //   setCoverError(true);
    //   setCoverErrorMsg("* تصویر اصلی ملک باید وارد شود");
    // }

    // if (
    //   !selectedFiles2 ||
    //   selectedFiles2 === "" ||
    //   selectedFiles2 === undefined ||
    //   selectedFiles2 === null ||
    //   selectedFiles2.length === 0
    // ) {
    //   setImagesError(true);
    //   setImagesErrorMsg("* تصاویر ملک باید وارد شود");
    // }

    if (
      !houseType ||
      houseType === "" ||
      houseType === undefined ||
      houseType === null ||
      houseType.length === 0
    ) {
      setHouseTypeError(true);
      setHouseTypeErrorMsg("* نوع ملک باید وارد شود");
    }

    if (
      !rooms ||
      rooms === "" ||
      rooms === undefined ||
      rooms === null ||
      rooms.length === 0
    ) {
      setRoomsError(true);
      setRoomsErrorMsg("* تعداد اتاق ها باید وارد شود");
    }

    if (
      !floor ||
      floor === "" ||
      floor === undefined ||
      floor === null ||
      floor.length === 0
    ) {
      setFloorError(true);
      setFloorErrorMsg("* تعداد طبقه ها باید وارد شود");
    }

    if (
      !options ||
      options === "" ||
      options === undefined ||
      options === null ||
      options.length === 0
    ) {
      setOptionsError(true);
      setOptionsErrorMsg("* امکانات ملک باید وارد شود");
    }

    if (
      !cooling ||
      cooling === "" ||
      cooling === undefined ||
      cooling === null ||
      cooling.length === 0
    ) {
      setCoolingError(true);
      setCoolingErrorMsg("* سیستم سرمایش ملک باید وارد شود");
    }

    if (
      !heating ||
      heating === "" ||
      heating === undefined ||
      heating === null ||
      heating.length === 0
    ) {
      setHeatingError(true);
      setHeatingErrorMsg("* سیستم گرمایش ملک باید وارد شود");
    }

    if (
      !parking ||
      parking === "" ||
      parking === undefined ||
      parking === null
    ) {
      setParkingError(true);
      setParkingErrorMsg("* تعداد پارکینگ ها باید وارد شود");
    }

    if (!price || price === "" || price === undefined || price === null) {
      setPriceError(true);
      setPriceErrorMsg("* اجاره بها باید وارد شود");
    }

    if (
      !houseNumber ||
      houseNumber === "" ||
      houseNumber === undefined ||
      houseNumber === null
    ) {
      setHouseNumberError(true);
      setHouseNumberErrorMsg("* پلاک ملک باید وارد شود");
    }

    // if (
    //   !document ||
    //   document === "" ||
    //   document === undefined ||
    //   document === null
    // ) {
    //   setDocumentError(true);
    //   setDocumentErrorMsg("* مدارک ملک دار باید وارد شود");
    // }

    // if (!bill || bill === "" || bill === undefined || bill === null) {
    //   setBillError(true);
    //   setBillErrorMsg("* قبوض ملک باید وارد شود");
    // }

    if (
      !floorType ||
      floorType === "" ||
      floorType === undefined ||
      floorType === null ||
      floorType.length === 0
    ) {
      setFloorTypeError(true);
      setFloorTypeErrorMsg("* نوع کف پوش ملک باید وارد شود");
    }

    if (
      !discount ||
      discount === "" ||
      discount === undefined ||
      discount === null
    ) {
      setDiscountError(true);
      setDiscountErrorMsg("* تخفیف ملک باید وارد شود");
    }

    if (
      !kitchenOptions ||
      kitchenOptions === "" ||
      kitchenOptions === undefined ||
      kitchenOptions === null ||
      kitchenOptions.length === 0
    ) {
      setKitchenOptionsError(true);
      setKitchenOptionsErrorMsg("* امکانات آشپزخانه باید وارد شود");
    }

    if (
      !bedRoomOptions ||
      bedRoomOptions === "" ||
      bedRoomOptions === undefined ||
      bedRoomOptions === null ||
      bedRoomOptions.length === 0
    ) {
      setBedRoomOptionsError(true);
      setBedRoomOptionsErrorMsg("* امکانات اتاق خواب باید وارد شود");
    }

    if (
      !reservationRoles ||
      reservationRoles === "" ||
      reservationRoles === undefined ||
      reservationRoles === null ||
      reservationRoles.length === 0
    ) {
      setReservationRolesError(true);
      setReservationRolesErrorMsg("* قوانین رزرو ملک باید وارد شود");
    }

    if (
      !houseRoles ||
      houseRoles === "" ||
      houseRoles === undefined ||
      houseRoles === null ||
      houseRoles.length === 0
    ) {
      setHouseRolesError(true);
      setHouseRolesErrorMsg("* ضوابط و مقررات ملک باید وارد شود");
    }

    if (
      !critrias ||
      critrias === "" ||
      critrias === undefined ||
      critrias === null ||
      critrias.length === 0
    ) {
      setCritriasError(true);
      setCritriasErrorMsg("* محدویت های ملک باید وارد شود");
    }

    if (
      !description ||
      description === "" ||
      description === undefined ||
      description === null
    ) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* درباره ملک باید وارد شود");
    }

    if (
      !description ||
      description === "" ||
      description === undefined ||
      description === null
    ) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* درباره ملک باید وارد شود");
    }

    if (
      !address ||
      address === "" ||
      address === undefined ||
      address === null
    ) {
      setAddressError(true);
      setAddressErrorMsg("* آدرس ملک باید وارد شود");
    } else {
      setBtnSpinnerInfo(false);

      let newOptions = [];
      options.forEach((item) => {
        newOptions.push(item.label);
      });

      let newHeating = [];
      heating.forEach((item) => {
        newHeating.push(item.label);
      });

      let newCooling = [];
      cooling.forEach((item) => {
        newCooling.push(item.label);
      });

      let newHobbies = [];
      hobbies.forEach((item) => {
        newHobbies.push(item.label);
      });

      let newEnviornment = [];
      enviornment.forEach((item) => {
        newEnviornment.push(item.label);
      });

      let newFreeDates = [];
      freeDates.forEach((item) => {
        newFreeDates.push(item.label);
      });

      let newFloorTypes = [];
      floorType.forEach((item) => {
        newFloorTypes.push(item.label);
      });

      let newKitchenOptions = [];
      kitchenOptions.forEach((item) => {
        newKitchenOptions.push(item.label);
      });

      let newBedroomOptions = [];
      bedRoomOptions.forEach((item) => {
        newBedroomOptions.push(item.label);
      });

      axios
        .put(
          `/api/owners/houses/${houseId}/update-house`,
          {
            name: name,
            province: selectedProvince.label ? selectedProvince.label : "",
            city: selectedCity.label ? selectedCity.label : "",
            description: description,
            price: price,
            postalCode: postalCode,
            housePhone: housePhone,
            meters: meters,
            year: year,
            capacity: capacity,
            houseRoles: houseRoles,
            critrias: critrias,
            houseType: houseType.label,
            floor: floor,
            options: newOptions,
            heating: newHeating,
            cooling: newCooling,
            parking: parking,
            address: address,
            houseNumber: houseNumber,
            houseOwner: houseOwner,
            hobbies: newHobbies,
            enviornment: newEnviornment,
            ownerType: ownerType.label,
            rooms: rooms,
            discount: discount,
            reservationRoles: reservationRoles,
            freeDates: newFreeDates,
            floorType: newFloorTypes,
            kitchenOptions: newKitchenOptions,
            bedRoomOptions: newBedroomOptions,
          },
          {
            headers: {
              authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          setBtnSpinnerInfo(false);
          toast.success("ملک ویرایش شد", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((error) => {
          setBtnSpinnerInfo(false);
          console.log("error", error);
          toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  // update house cover image
  const UpdateHouseCover = async (e) => {
    e.preventDefault();

    if (
      !selectedFiles ||
      selectedFiles === "" ||
      selectedFiles === undefined ||
      selectedFiles === null ||
      selectedFiles.length === 0
    ) {
      setCoverError(true);
      setCoverErrorMsg("* تصویر اصلی ملک باید وارد شود");
    } else {
      setBtnSpinnerCover(true);

      const formData = new FormData();
      formData.append("cover", selectedFiles[0]);

      try {
        setBtnSpinnerCover(true);

        await axios
          .put(`/api/owners/houses/${houseId}/update-cover`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBtnSpinnerCover(false);

            toast.success("تصویر اصلی ویرایش شد", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("Response:", res.data.house);
            setCover(res.data.house.cover);
          })
          .catch((error) => {
            setBtnSpinnerCover(false);
            console.log("error", error);
            toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } catch (error) {
        setBtnSpinnerCover(false);
        console.log("error", error);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setBtnSpinnerCover(false);
      }
    }
  };

  // update house images
  const UpdateHouseImages = async (e) => {
    e.preventDefault();

    if (
      !selectedFiles2 ||
      selectedFiles2 === "" ||
      selectedFiles2 === undefined ||
      selectedFiles2 === null ||
      selectedFiles2.length === 0
    ) {
      setImagesError(true);
      setImagesErrorMsg("* تصاویر ملک باید وارد شوند");
    } else {
      setBtnSpinnerImages(true);

      const formData = new FormData();

      selectedFiles2.forEach((img) => {
        formData.append("images", img);
      });

      try {
        setBtnSpinnerImages(true);

        await axios
          .put(`/api/owners/houses/${houseId}/update-images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log(res);
            
            setBtnSpinnerImages(false);

            toast.success("تصاویر ملک ویرایش شدند", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setImages(res.data.house.images);
          })
          .catch((error) => {
            setBtnSpinnerImages(false);
            console.log("error", error);
            toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } catch (error) {
        setBtnSpinnerImages(false);
        console.log("error", error);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setBtnSpinnerImages(false);
      }
    }
  };

  // update house bill
  const UpdateHouseBill = async (e) => {
    e.preventDefault();

    if (
      !selectedFilesBill ||
      selectedFilesBill === "" ||
      selectedFilesBill === undefined ||
      selectedFilesBill === null ||
      selectedFilesBill.length === 0
    ) {
      setBillError(true);
      setBillErrorMsg("* قبوض ملک باید وارد شوند");
    } else {
      setBtnSpinnerBill(true);

      const formData = new FormData();

      selectedFilesBill.forEach((img) => {
        formData.append("bill", img);
      });

      try {
        setBtnSpinnerBill(true);

        await axios
          .put(`/api/owners/houses/${houseId}/update-bill`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBtnSpinnerBill(false);

            toast.success("قبوض ملک ویرایش شدند", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("Response:", res.data.house);
            setBill(res.data.house.bill);
          })
          .catch((error) => {
            setBtnSpinnerBill(false);
            console.log("error", error);
            toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } catch (error) {
        setBtnSpinnerBill(false);
        console.log("error", error);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setBtnSpinnerBill(false);
      }
    }
  };

  // update house document
  const UpdateHouseDocument = async (e) => {
    e.preventDefault();

    if (
      !selectedFilesDocument ||
      selectedFilesDocument === "" ||
      selectedFilesDocument === undefined ||
      selectedFilesDocument === null ||
      selectedFilesDocument.length === 0
    ) {
      setDocumentError(true);
      setDocumentErrorMsg("* مدارک ملک باید وارد شوند");
    } else {
      setBtnSpinnerDocument(true);

      const formData = new FormData();

      selectedFilesDocument.forEach((img) => {
        formData.append("document", img);
      });

      try {
        setBtnSpinnerDocument(true);

        await axios
          .put(`/api/owners/houses/${houseId}/update-document`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBtnSpinnerDocument(false);

            toast.success("مدارک ملک ویرایش شدند", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("Response:", res.data.house);
            setDocument(res.data.house.document);
          })
          .catch((error) => {
            setBtnSpinnerDocument(false);
            console.log("error", error);
            toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } catch (error) {
        setBtnSpinnerDocument(false);
        console.log("error", error);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setBtnSpinnerDocument(false);
      }
    }
  };

  // update house map
  const UpdateHouseMap = () => {
    if (
      (!lat || lat === "" || lat === undefined || lat === null) &&
      (!lng || lng === "" || lng === undefined || lng === null)
    ) {
      setPositionError(true);
      setPositionErrorMsg("*موقعیت مکانی باید وارد شود");
    } else {
      setBtnSpinnerMap(true);
      axios
        .put(
          `/api/owners/houses/${houseId}/update-map`,
          {
            lat: lat,
            lng: lng,
          },
          {
            headers: {
              authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          setBtnSpinnerMap(false);
          toast.success("نقشه ویرایش شد", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((error) => {
          setBtnSpinnerMap(false);
          console.log("error", error);
          toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  const sendUpdateRequest = () => {
    console.log("sendUpdateRequest");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              ویرایش ملک
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش ملک اطمینان دارید؟
            </Dialog.Description>

            <CiCircleQuestion className="my-2 flex justify-center items-center w-20 h-20 text-blue-900 mx-auto" />

            <div className="flex items-center justify-center">
              <button
                className="mt-4 rounded bg-blue-900 px-8 py-2 mx-2 text-white"
                onClick={() => sendUpdateRequest()}
              >
                تایید
              </button>

              <button
                className="mt-4 rounded bg-gray-300 px-8 py-2 mx-2"
                onClick={() => setIsOpen(false)}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="p-4 sm:p-6">
        {/* House Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10 transform transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right justify-start">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {house.name || "ـ"}
                </h2>
                <p className="text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 font-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-bold">نام ملک: </span>
                  {name || "نام ملک"}
                </p>
                <p className="text-gray-700 flex items-center gap-2 ">
                  <svg
                    className="w-5 h-5 font-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="font-bold">تلفن ملک: </span>
                  {housePhone || "_"}
                </p>

                <p className="text-gray-700 flex items-center gap-2 ">
                  <RiPriceTag3Line className="w-5 h-5 font-bold" />
                  <span className="font-bold">قیمت ملک: </span>
                  <span className="text-indigo-500 font-bold">
                    {price || "_"}
                  </span>
                </p>

                <p className="text-gray-700 items-center text-justify gap-2">
                  <span className="font-bold ">توضیحات ملک: </span>
                  {house.description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {cover ? (
                  <img
                    src={cover}
                    alt="Main House"
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400 font-medium">
                      تصویر اصلی
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-start gap-4">
              {images.length > 0 ? (
                images.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={`House ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  هیچ تصویر اضافی بارگذاری نشده است.
                </p>
              )}
            </div>
          </div>
        </div>

        <TitleCard title="ویرایش اطلاعات ملک " topMargin="mt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white">
              {/* ********************************* update house cover and images ********************************* */}
              {/*  house cover  */}
              <h2 className="mt-6 mb-4 text-xl font-bold">
                ویرایش تصویر اصلی ملک
              </h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cover"
                  className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  تصویر اصلی خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      className="app-btn-gray bg-white"
                      onClick={handleCustomButtonClick}
                    >
                      انتخاب تصویر اصلی
                    </button>

                    <input
                      type="file"
                      id="cover"
                      name="cover"
                      accept={acceptedFileTypesString}
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFiles.length > 0 ? (
                      <ul className="px-4">
                        {selectedFiles.map((file, index) => (
                          <li
                            key={file.name}
                            className="flex justify-between items-center border-b py-2"
                          >
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDelete(index)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M6 4l8 8M14 4l-8 8"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        هنوز تصویری آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-red-500 relative text-sm">
                  {coverError ? coverErrorMsg : ""}
                </span>
                <div className="mt-6">
                  <img
                    className="rounded-md"
                    src={cover}
                    style={{ width: "50px", height: "50px" }}
                    alt="تصویر اصلی ملک"
                  />
                </div>
                <button
                  className="app-btn-blue mt-4"
                  onClick={UpdateHouseCover}
                >
                  {btnSpinnerCover ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش تصویر اصلی </span>
                  )}
                </button>
              </div>

              <hr />
              {/* house images */}
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش تصاویر ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="images"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  تصاویر خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleCustomButtonClick2}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب تصاویر خانه
                    </button>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept={acceptedFileTypesString2}
                      ref={fileInputRef2}
                      className="hidden"
                      onChange={handleFileChange2}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFiles2.length > 0 ? (
                      <ul className="px-4">
                        {selectedFiles2.map((file, index) => (
                          <li
                            key={file.name}
                            className="flex justify-between items-center border-b py-2"
                          >
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDelete2(index)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M6 4l8 8M14 4l-8 8"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        هنوز تصویری آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-red-500 relative text-sm">
                  {imagesError ? imagesErrorMsg : ""}
                </span>
                <div className="mt-6 flex justify-start">
                  {images.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt="تصویر اصلی ملک"
                    />
                  ))}
                </div>
                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseImages}
                >
                  {btnSpinnerImages ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش تصاویر خانه</span>
                  )}
                </button>
              </div>

              <hr />
              {/* ********************************* update house info ********************************* */}

              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش ملک</h2>
              {/* house name */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="name"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  نام ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiHouseLight className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام ملک "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {nameError ? nameErrorMsg : ""}
                </span>
              </div>

              {/* province*/}
              <div className="mb-6">
                <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block">
                  استان
                </label>
                <small className="my-2 font-sm text-gray-500">
                  استان انتخاب شده: * {house.province}
                </small>
                <Select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  options={provinces}
                  primaryColor={"blue"}
                  placeholder="انتخاب استان"
                  isSearchable
                  searchInputPlaceholder="جستجو استان"
                  classNames={{
                    searchIcon: "hidden", // This hides the search icon
                  }}
                />
                <span className="text-red-500 relative text-sm">
                  {provinceError ? provinceErrorMsg : ""}
                </span>
              </div>

              {/* city */}
              <div>
                <label className="text-xs sm:text-sm tracking-wide text-gray-600 block">
                  شهرستان
                </label>
                <small className="my-2 font-sm text-gray-500">
                  شهرستان انتخاب شده: * {house.city}
                </small>
                <Select
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cities}
                  primaryColor={"blue"}
                  placeholder="انتخاب شهرستان"
                  isSearchable
                  isDisabled={!selectedProvince}
                  searchInputPlaceholder="جستجو شهرستان"
                  classNames={{
                    searchIcon: "hidden", // This hides the search icon
                  }}
                />

                <span className="text-red-500 relative text-sm">
                  {cityError ? cityErrorMsg : ""}
                </span>
              </div>

              {/* house owner name */}
              <div className="flex flex-col mb-4 mt-6">
                <label
                  htmlFor="houseOwner"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  نام و نام خانوادگی صاحب ملک
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <TfiUser className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={houseOwner}
                    onChange={(e) => setHouseOwner(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام و نام خانوادگی صاحب ملک  "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {houseOwnerError ? houseOwnerErrorMsg : ""}
                </span>
              </div>

              {/* house phone */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="housePhone"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  شماره ثابت ملک
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <TbPhone className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={housePhone}
                    onChange={(e) => setHousePhone(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="  شماره ثابت ملک  "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {housePhoneError ? housePhoneErrorMsg : ""}
                </span>
              </div>

              {/* house meters */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="meters"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  متراژ ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RxRulerHorizontal className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={meters}
                    onChange={(e) => setMeters(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="متراژ ملک"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {metersError ? metersErrorMsg : ""}
                </span>
              </div>

              {/* house year */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="year"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  سال ساخت ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiHourglassSimpleLow className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="  سال ساخت ملک   "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {yearError ? yearErrorMsg : ""}
                </span>
              </div>

              {/* house capacity */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="capacity"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  ظرفیت ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <FaUsers className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="  ظرفیت ملک   "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {capacityError ? capacityErrorMsg : ""}
                </span>
              </div>

              {/* house postalCode */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="postalCode"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  کدپستی{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiSignpostLight className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="کدپستی"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {postalCodeError ? postalCodeErrorMsg : ""}
                </span>
              </div>

              {/* house hobbies */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="hobbies"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  امکانات تفریحی و سرگرمی{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  امکانات تفریحی و سرگرمی انتخاب شده: * {house.hobbies}
                </small>
                <div className="relative">
                  <Select
                    value={hobbies}
                    onChange={(e) => setHobbies(e)}
                    options={hobbiesList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات تفریحی و سرگرمی"
                    classNames={`placholder-gray-400`}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {hobbiesError ? hobbiesErrorMsg : ""}
                </span>
              </div>

              {/* house enviornment */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="enviornment"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  محیط ملک{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  محیط انتخاب شده: * {house.enviornment}
                </small>
                <div className="relative">
                  <Select
                    value={enviornment}
                    onChange={(e) => setEnviornment(e)}
                    options={enviornmentList}
                    isMultiple={true}
                    placeholder="انتخاب محیط ملک"
                    classNames={`placholder-gray-400`}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {enviornmentError ? enviornmentErrorMsg : ""}
                </span>
              </div>

              {/* house ownerType */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="ownerType"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  نوع مالکیت ملک{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  نوع مالکیت انتخاب شده: * {house.ownerType}
                </small>
                <div className="relative">
                  <Select
                    value={ownerType}
                    onChange={(e) => setOwnerType(e)}
                    options={ownerTypeList}
                    // isMultiple={true}
                    placeholder="انتخاب نوع مالکیت ملک"
                    classNames={`placholder-gray-400`}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {ownerTypeError ? ownerTypeErrorMsg : ""}
                </span>
              </div>

              {/* house free dates */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="freeDates"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  روزهای أزاد{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  روزهای آزاد انتخاب شده: * {house.freeDates}
                </small>
                <div className="relative">
                  <Select
                    value={freeDates}
                    onChange={(e) => setFreeDates(e)}
                    options={weekDays}
                    isMultiple={true}
                    placeholder="انتخاب روزهای آزاد"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {freeDatesError ? freeDatesErrorMsg : ""}
                </span>
              </div>

              {/* house type */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="houseType"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  نوع ملک{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  نوع ملک انتخاب شده: * {house.houseType}
                </small>
                <div className="relative">
                  <Select
                    value={houseType}
                    onChange={(e) => setHouseType(e)}
                    options={houseTypeList}
                    // isMultiple={true}
                    placeholder="انتخاب نوع ملک"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {houseTypeError ? houseTypeErrorMsg : ""}
                </span>
              </div>

              {/* house rooms */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="rooms"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  تعداد اتاق ها
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiWarehouseLight className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="تعداد اتاق ها  "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {roomsError ? roomsErrorMsg : ""}
                </span>
              </div>

              {/* house roof */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="floor"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  تعداد طبقه ها
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiSolarRoof className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="تعداد طبقه ها  "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {floorError ? floorErrorMsg : ""}
                </span>
              </div>

              {/* house options */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="options"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  امکانات ملک{" "}
                </label>

                <small className="my-2 font-sm text-gray-500">
                  امکانات انتخاب شده: * {house.options}
                </small>
                <div className="relative">
                  <Select
                    value={options}
                    onChange={(e) => setOptions(e)}
                    options={houseOptions}
                    isMultiple={true}
                    placeholder="انتخاب امکانات ملک"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {optionsError ? optionsErrorMsg : ""}
                </span>
              </div>

              {/* house cooling */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cooling"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  سیستم سرمایش{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  سیستم سرمایش انتخاب شده: * {house.cooling}
                </small>
                <div className="relative">
                  <Select
                    value={cooling}
                    onChange={(e) => setCooling(e)}
                    options={coolingList}
                    isMultiple={true}
                    placeholder="انتخاب سیستم سرمایش"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {coolingError ? coolingErrorMsg : ""}
                </span>
              </div>

              {/* house heating */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="heating"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  سیستم گرمایش{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  سیستم گرمایش انتخاب شده: * {house.heating}
                </small>
                <div className="relative">
                  <Select
                    value={heating}
                    onChange={(e) => setHeating(e)}
                    options={heatingList}
                    isMultiple={true}
                    placeholder="انتخاب سیستم گرمایش"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {heatingError ? heatingErrorMsg : ""}
                </span>
              </div>

              {/* house parking */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="parking"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  تعداد پارکینگ
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <LuCircleParking className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="تعداد پارکینگ"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {parkingError ? parkingErrorMsg : ""}
                </span>
              </div>

              {/* house price*/}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="price"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  اجاره بها
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <RiPriceTagLine className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="اجاره بها"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {priceError ? priceErrorMsg : ""}
                </span>
              </div>

              {/* house number*/}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="houseNumber"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  پلاک ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <TbCircleDashedNumber4 className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="پلاک ملک"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {houseNumberError ? houseNumberErrorMsg : ""}
                </span>
              </div>

              {/* floorType*/}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="floorType"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  نوع کف پوش{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  نوع کف پوش انتخاب شده: * {house.floorType}
                </small>
                <div className="relative">
                  <Select
                    value={floorType}
                    onChange={(e) => setFloorType(e)}
                    options={floorTypeList}
                    isMultiple={true}
                    placeholder="انتخاب نوع کف پوش"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {floorTypeError ? floorTypeErrorMsg : ""}
                </span>
              </div>

              {/* discount*/}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="discount"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  تخفیف ملک{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <HiOutlineDocumentArrowUp className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="  تخفیف ملک"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {discountError ? discountErrorMsg : ""}
                </span>
              </div>

              {/* kitchenOptions*/}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="kitchenOptions"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  امکانات آشپزخانه{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  امکانات آشپزخانه انتخاب شده: * {house.kitchenOptions}
                </small>
                <div className="relative">
                  <Select
                    value={kitchenOptions}
                    onChange={(e) => setKitchenOptions(e)}
                    options={kitchenOptionList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات آشپزخانه"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {kitchenOptionsError ? kitchenOptionsErrorMsg : ""}
                </span>
              </div>

              {/* bedRoomOptions*/}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="bedRoomOptions"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  {" "}
                  امکانات اتاق خواب{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  امکانات اتاق خواب انتخاب شده: * {house.bedRoomOptions}
                </small>
                <div className="relative">
                  <Select
                    value={bedRoomOptions}
                    onChange={(e) => setBedRoomOptions(e)}
                    options={bedRoomOptionList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات اتاق خواب"
                    formatGroupLabel={(data) => (
                      <div
                        className={`py-2 text-xs flex items-center justify-between`}
                      >
                        <span className="font-bold">{data.label}</span>
                      </div>
                    )}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {bedRoomOptionsError ? bedRoomOptionsErrorMsg : ""}
                </span>
              </div>

              {/* reservationRoles*/}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="reservationRoles"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  قوانین رزرو ملک{" "}
                </label>
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <LiaConciergeBellSolid className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={reservationRoles}
                    onChange={(e) => setReservationRoles(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="قوانین رزرو ملک "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {reservationRolesError ? reservationRolesErrorMsg : ""}
                </span>
              </div>

              {/* house roles */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="houseRoles"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  ضوابط و مقررات ملک{" "}
                </label>
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <TbHomeEdit className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={houseRoles}
                    onChange={(e) => setHouseRoles(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="ضوابط و مقررات ملک "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {houseRolesError ? houseRolesErrorMsg : ""}
                </span>
              </div>

              {/* house critrias */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="critrias"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  محدویت های ملک{" "}
                </label>
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <BsHouseExclamation className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={critrias}
                    onChange={(e) => setCritrias(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="محدویت های ملک "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {critriasError ? critriasErrorMsg : ""}
                </span>
              </div>

              {/* description */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="description"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  درباره ملک{" "}
                </label>
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <FiInfo className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="درباره ملک "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {descriptionError ? descriptionErrorMsg : ""}
                </span>
              </div>

              {/*  address */}
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="address"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 block"
                >
                  آدرس{" "}
                </label>
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <FiMapPin className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="آدرس "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {addressError ? addressErrorMsg : ""}
                </span>
              </div>

              <div className="mt-4 mb-8 w-32">
                <button
                  className="app-btn-blue w-full"
                  onClick={UpdateHouseFunction}
                >
                  {btnSpinnerInfo ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش ملک</span>
                  )}
                </button>
              </div>

              {/* ********************************* update bill ********************************* */}
              {/* bill*/}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش قبوض ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="bill"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  قبوض خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleCustomButtonClickBill}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب قبوض خانه
                    </button>
                    <input
                      type="file"
                      id="bill"
                      name="bill"
                      multiple
                      accept={acceptedFileTypesStringBill}
                      ref={fileInputRefBill}
                      className="hidden"
                      onChange={handleFileChangeBill}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFilesBill.length > 0 ? (
                      <ul className="px-4">
                        {selectedFilesBill.map((file, index) => (
                          <li
                            key={file.name}
                            className="flex justify-between items-center border-b py-2"
                          >
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDeleteBill(index)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M6 4l8 8M14 4l-8 8"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        هنوز قبض آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-red-500 relative text-sm">
                  {billError ? billErrorMsg : ""}
                </span>

                <div className="mt-6 flex justify-start">
                  {bill.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt=" قبوض ملک"
                    />
                  ))}
                </div>
                <div className="mt-4 mb-8 w-32">
                  <button
                    className="app-btn-blue w-full"
                    onClick={UpdateHouseBill}
                  >
                    {btnSpinnerBill ? (
                      <div className="px-10 py-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <span className="text-lg">ویرایش قبض</span>
                    )}
                  </button>
                </div>
              </div>

              {/* ********************************* update house document ********************************* */}
              {/* house document*/}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش مدارک ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="document"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  مدارک ملک{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleCustomButtonClickDocument}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب مدارک ملک
                    </button>
                    <input
                      type="file"
                      id="document"
                      name="document"
                      multiple
                      accept={acceptedFileTypesStringDocument}
                      ref={fileInputRefDocument}
                      className="hidden"
                      onChange={handleFileChangeDocument}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFilesDocument.length > 0 ? (
                      <ul className="px-4">
                        {selectedFilesDocument.map((file, index) => (
                          <li
                            key={file.name}
                            className="flex justify-between items-center border-b py-2"
                          >
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDeleteDocument(index)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="w-6 h-6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M6 4l8 8M14 4l-8 8"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 text-sm">
                        هنوز مدارک آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-red-500 relative text-sm">
                  {documentError ? documentErrorMsg : ""}
                </span>
                <div className="mt-6 flex justify-start">
                  {document.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt=" مدارک ملک"
                    />
                  ))}
                </div>
                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseDocument}
                >
                  {btnSpinnerDocument ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش مدارک</span>
                  )}
                </button>
              </div>

              {/* ********************************* update map ********************************* */}
              {/* map */}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش نقشه ملک</h2>
              <div>
                <h2 className="mb-2">آدرس خود را روی نقشه انتخاب کنید</h2>
                <div>
                  <MapContainer
                    center={position}
                    zoom={5}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <Marker
                      draggable={true}
                      eventHandlers={{ dragend: onDragEnd }}
                      position={position}
                      icon={markerIcon}
                      ref={markerRef}
                    />
                    <MapClickHandler />
                  </MapContainer>

                  <span className="text-red-500 relative text-sm">
                    {positionError ? positionErrorMsg : ""}
                  </span>
                </div>

                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseMap}
                >
                  {btnSpinnerMap ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش نقشه</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </TitleCard>
      </div>
      <ToastContainer />
    </>
  );
}

export default UpdateHouse;
