import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import { useOwnerAuthStore } from "../stores/authStore";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { PiHouseLight } from "react-icons/pi";
import { TfiUser } from "react-icons/tfi";
import { TbPhone } from "react-icons/tb";
import { RxRulerHorizontal } from "react-icons/rx";
import { PiHourglassSimpleLow } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { PiSignpostLight } from "react-icons/pi";
import { PiWarehouseLight } from "react-icons/pi";
import { PiSolarRoof } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";
import { RiPriceTagLine } from "react-icons/ri";
import { TbCircleDashedNumber4 } from "react-icons/tb";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { TbHomeEdit } from "react-icons/tb";
import { LiaConciergeBellSolid } from "react-icons/lia";
import { FiInfo, FiMapPin } from "react-icons/fi";
import { BsHouseExclamation } from "react-icons/bs";

// Select component
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";

// Map components
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import provincesData from "../components/provinces_cities.json";

const markerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/312483/location-indicator-red.svg",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Data lists
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

function AddHouse() {
  const { token, isOwnerAuthenticated } = useOwnerAuthStore();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    houseOwner: "",
    price: 0,
    postalCode: "",
    housePhone: "",
    meters: 0,
    year: 0,
    capacity: 0,
    houseRoles: "",
    critrias: "",
    floor: 0,
    parking: 0,
    address: "",
    houseNumber: "",
    rooms: 0,
    reservationRoles: "",
    discount: 1,
    lat: 35.6892,
    lng: 51.389,
  });

  // Select states
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [enviornment, setEnviornment] = useState([]);
  const [ownerType, setOwnerType] = useState(null);
  const [freeDates, setFreeDates] = useState([]);
  const [houseType, setHouseType] = useState(null);
  const [options, setOptions] = useState([]);
  const [cooling, setCooling] = useState([]);
  const [heating, setHeating] = useState([]);
  const [floorType, setFloorType] = useState([]);
  const [kitchenOptions, setKitchenOptions] = useState([]);
  const [bedRoomOptions, setBedRoomOptions] = useState([]);

  // File states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);

  // UI states
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRefBill = useRef(null);
  const fileInputRefDocument = useRef(null);

  // Error states
  const [errors, setErrors] = useState({});

  // Page title effect
  useEffect(() => {
    dispatch(setPageTitle({ title: "ثبت ملک" }));
  }, [dispatch]);

  // Province data effect
  useEffect(() => {
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

  // Map handlers
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
  };

  // File handlers
  const handleFileChange = (event, setFiles, acceptedExtensions) => {
    const newFilesArray = Array.from(event.target.files);
    const fileTypeRegex = new RegExp(acceptedExtensions.join("|"), "i");
    
    const validFiles = newFilesArray.filter(file => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${acceptedExtensions.join(", ")} مجاز هستند`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileDelete = (index, files, setFiles) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'name', 'houseOwner', 'housePhone', 'meters', 'year', 
      'capacity', 'postalCode', 'address', 'houseNumber',
      'price', 'parking', 'rooms', 'floor', 'discount',
      'description', 'houseRoles', 'critrias', 'reservationRoles'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `فیلد ${field} الزامی است`;
      }
    });

    // Select fields validation
    if (!selectedProvince) newErrors.province = "انتخاب استان الزامی است";
    if (!selectedCity) newErrors.city = "انتخاب شهر الزامی است";
    if (!ownerType) newErrors.ownerType = "نوع مالکیت الزامی است";
    if (!houseType) newErrors.houseType = "نوع ملک الزامی است";
    if (hobbies.length === 0) newErrors.hobbies = "امکانات تفریحی الزامی است";
    if (enviornment.length === 0) newErrors.enviornment = "محیط ملک الزامی است";
    if (freeDates.length === 0) newErrors.freeDates = "روزهای آزاد الزامی است";
    if (options.length === 0) newErrors.options = "امکانات ملک الزامی است";
    if (cooling.length === 0) newErrors.cooling = "سیستم سرمایش الزامی است";
    if (heating.length === 0) newErrors.heating = "سیستم گرمایش الزامی است";
    if (floorType.length === 0) newErrors.floorType = "نوع کف پوش الزامی است";
    if (kitchenOptions.length === 0) newErrors.kitchenOptions = "امکانات آشپزخانه الزامی است";
    if (bedRoomOptions.length === 0) newErrors.bedRoomOptions = "امکانات اتاق خواب الزامی است";
    if (selectedFiles.length === 0) newErrors.cover = "تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.images = "تصاویر ملک الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const addHouseFunction = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید");
      return;
    }

    if (!isOwnerAuthenticated) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    setBtnSpinner(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add position
      formDataToSend.append('lat', position[0]);
      formDataToSend.append('lng', position[1]);

      // Add select values
      formDataToSend.append('province', selectedProvince.label);
      formDataToSend.append('city', selectedCity.label);
      formDataToSend.append('ownerType', ownerType.label);
      formDataToSend.append('houseType', houseType.label);
      
      // Add arrays
      hobbies.forEach(item => formDataToSend.append('hobbies', item.label));
      enviornment.forEach(item => formDataToSend.append('enviornment', item.label));
      freeDates.forEach(item => formDataToSend.append('freeDates', item.label));
      options.forEach(item => formDataToSend.append('options', item.label));
      cooling.forEach(item => formDataToSend.append('cooling', item.label));
      heating.forEach(item => formDataToSend.append('heating', item.label));
      floorType.forEach(item => formDataToSend.append('floorType', item.label));
      kitchenOptions.forEach(item => formDataToSend.append('kitchenOptions', item.label));
      bedRoomOptions.forEach(item => formDataToSend.append('bedRoomOptions', item.label));

      // Add files
      formDataToSend.append('cover', selectedFiles[0]);
      selectedFiles2.forEach(file => formDataToSend.append('images', file));
      selectedFilesBill.forEach(file => formDataToSend.append('bill', file));
      selectedFilesDocument.forEach(file => formDataToSend.append('document', file));

      const response = await axios.post(`/api/owners/houses`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + token,
        },
      });

      toast.success("ملک با موفقیت ثبت شد");
      // Reset form or redirect as needed
      
    } catch (error) {
      console.error("Error adding house:", error);
      toast.error(error.response?.data?.msg || "خطایی در ثبت ملک رخ داد");
    } finally {
      setBtnSpinner(false);
    }
  };

  return (
    <>
      <TitleCard title="ثبت اطلاعات ملک" topMargin="mt-2">
        <form onSubmit={addHouseFunction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* House Name */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نام ملک
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <PiHouseLight className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="نام ملک"
                />
              </div>
              {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            </div>

            {/* House Owner */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نام صاحب ملک
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <TfiUser className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="houseOwner"
                  value={formData.houseOwner}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="نام صاحب ملک"
                />
              </div>
              {errors.houseOwner && <span className="text-red-500 text-sm">{errors.houseOwner}</span>}
            </div>

            {/* House Phone */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                شماره ثابت ملک
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <TbPhone className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="housePhone"
                  value={formData.housePhone}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="شماره ثابت ملک"
                />
              </div>
              {errors.housePhone && <span className="text-red-500 text-sm">{errors.housePhone}</span>}
            </div>

            {/* House Meters */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                متراژ ملک
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <RxRulerHorizontal className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="meters"
                  type="number"
                  value={formData.meters}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="متراژ ملک"
                />
              </div>
              {errors.meters && <span className="text-red-500 text-sm">{errors.meters}</span>}
            </div>

            {/* Year Built */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                سال ساخت
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <PiHourglassSimpleLow className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="سال ساخت"
                />
              </div>
              {errors.year && <span className="text-red-500 text-sm">{errors.year}</span>}
            </div>

            {/* Capacity */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                ظرفیت
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <FaUsers className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="ظرفیت"
                />
              </div>
              {errors.capacity && <span className="text-red-500 text-sm">{errors.capacity}</span>}
            </div>

            {/* Postal Code */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                کد پستی
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <PiSignpostLight className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="کد پستی"
                />
              </div>
              {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
            </div>

            {/* Hobbies */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                امکانات تفریحی
              </label>
              <Select
                value={hobbies}
                onChange={setHobbies}
                options={hobbiesList}
                isMultiple={true}
                placeholder="انتخاب امکانات تفریحی"
              />
              {errors.hobbies && <span className="text-red-500 text-sm">{errors.hobbies}</span>}
            </div>

            {/* Environment */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                محیط ملک
              </label>
              <Select
                value={enviornment}
                onChange={setEnviornment}
                options={enviornmentList}
                isMultiple={true}
                placeholder="انتخاب محیط ملک"
              />
              {errors.enviornment && <span className="text-red-500 text-sm">{errors.enviornment}</span>}
            </div>

            {/* Owner Type */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نوع مالکیت
              </label>
              <Select
                value={ownerType}
                onChange={setOwnerType}
                options={ownerTypeList}
                placeholder="انتخاب نوع مالکیت"
              />
              {errors.ownerType && <span className="text-red-500 text-sm">{errors.ownerType}</span>}
            </div>

            {/* Free Dates */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                روزهای آزاد
              </label>
              <Select
                value={freeDates}
                onChange={setFreeDates}
                options={weekDays}
                isMultiple={true}
                placeholder="انتخاب روزهای آزاد"
              />
              {errors.freeDates && <span className="text-red-500 text-sm">{errors.freeDates}</span>}
            </div>

            {/* House Type */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نوع ملک
              </label>
              <Select
                value={houseType}
                onChange={setHouseType}
                options={houseTypeList}
                placeholder="انتخاب نوع ملک"
              />
              {errors.houseType && <span className="text-red-500 text-sm">{errors.houseType}</span>}
            </div>

            {/* Rooms */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                تعداد اتاق‌ها
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <PiWarehouseLight className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="تعداد اتاق‌ها"
                />
              </div>
              {errors.rooms && <span className="text-red-500 text-sm">{errors.rooms}</span>}
            </div>

            {/* Floors */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                تعداد طبقات
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <PiSolarRoof className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="تعداد طبقات"
                />
              </div>
              {errors.floor && <span className="text-red-500 text-sm">{errors.floor}</span>}
            </div>

            {/* House Options */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                امکانات ملک
              </label>
              <Select
                value={options}
                onChange={setOptions}
                options={houseOptions}
                isMultiple={true}
                placeholder="انتخاب امکانات ملک"
              />
              {errors.options && <span className="text-red-500 text-sm">{errors.options}</span>}
            </div>

            {/* Cooling System */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                سیستم سرمایش
              </label>
              <Select
                value={cooling}
                onChange={setCooling}
                options={coolingList}
                isMultiple={true}
                placeholder="انتخاب سیستم سرمایش"
              />
              {errors.cooling && <span className="text-red-500 text-sm">{errors.cooling}</span>}
            </div>

            {/* Heating System */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                سیستم گرمایش
              </label>
              <Select
                value={heating}
                onChange={setHeating}
                options={heatingList}
                isMultiple={true}
                placeholder="انتخاب سیستم گرمایش"
              />
              {errors.heating && <span className="text-red-500 text-sm">{errors.heating}</span>}
            </div>

            {/* Parking */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                تعداد پارکینگ
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <LuCircleParking className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="parking"
                  type="number"
                  value={formData.parking}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="تعداد پارکینگ"
                />
              </div>
              {errors.parking && <span className="text-red-500 text-sm">{errors.parking}</span>}
            </div>

            {/* Price */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                قیمت
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <RiPriceTagLine className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="قیمت"
                />
              </div>
              {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
            </div>

            {/* House Number */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                پلاک ملک
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <TbCircleDashedNumber4 className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="پلاک ملک"
                />
              </div>
              {errors.houseNumber && <span className="text-red-500 text-sm">{errors.houseNumber}</span>}
            </div>

            {/* Floor Type */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نوع کف‌پوش
              </label>
              <Select
                value={floorType}
                onChange={setFloorType}
                options={floorTypeList}
                isMultiple={true}
                placeholder="انتخاب نوع کف‌پوش"
              />
              {errors.floorType && <span className="text-red-500 text-sm">{errors.floorType}</span>}
            </div>

            {/* Discount */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                تخفیف
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <HiOutlineDocumentArrowUp className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="تخفیف"
                />
              </div>
              {errors.discount && <span className="text-red-500 text-sm">{errors.discount}</span>}
            </div>

            {/* Kitchen Options */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                امکانات آشپزخانه
              </label>
              <Select
                value={kitchenOptions}
                onChange={setKitchenOptions}
                options={kitchenOptionList}
                isMultiple={true}
                placeholder="انتخاب امکانات آشپزخانه"
              />
              {errors.kitchenOptions && <span className="text-red-500 text-sm">{errors.kitchenOptions}</span>}
            </div>

            {/* Bedroom Options */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                امکانات اتاق خواب
              </label>
              <Select
                value={bedRoomOptions}
                onChange={setBedRoomOptions}
                options={bedRoomOptionList}
                isMultiple={true}
                placeholder="انتخاب امکانات اتاق خواب"
              />
              {errors.bedRoomOptions && <span className="text-red-500 text-sm">{errors.bedRoomOptions}</span>}
            </div>
          </div>

          {/* Province */}
          <div className="flex flex-col mb-8 mt-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              استان
            </label>
            <Select
              value={selectedProvince}
              onChange={handleProvinceChange}
              options={provinces}
              placeholder="انتخاب استان"
              isSearchable
            />
            {errors.province && <span className="text-red-500 text-sm">{errors.province}</span>}
          </div>

          {/* City */}
          <div className="flex flex-col mb-10">
            <label className="text-xs sm:text-sm tracking-wide text-gray-600 mb-1">
              شهرستان
            </label>
            <Select
              value={selectedCity}
              onChange={setSelectedCity}
              options={cities}
              placeholder="انتخاب شهرستان"
              isSearchable
              isDisabled={!selectedProvince}
            />
            {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
          </div>

          {/* Cover Photo */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
              تصویر اصلی خانه
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  className="app-btn-gray"
                  onClick={() => fileInputRef.current.click()}
                >
                  انتخاب تصویر اصلی
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setSelectedFiles, ["jpg", "png", "jpeg"])}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles.length > 0 ? (
                  <ul className="px-4">
                    {selectedFiles.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center border-b py-2">
                        <span className="text-base mx-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, selectedFiles, setSelectedFiles)}
                          className="text-red-500 hover:text-red-700"
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
            {errors.cover && <span className="text-red-500 text-sm">{errors.cover}</span>}
          </div>

          {/* House Images */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm text-gray-600">
              تصاویر خانه
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  className="app-btn-gray"
                  onClick={() => fileInputRef2.current.click()}
                >
                  انتخاب تصاویر خانه
                </button>
                <input
                  type="file"
                  ref={fileInputRef2}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange(e, setSelectedFiles2, ["jpg", "png", "jpeg"])}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles2.length > 0 ? (
                  <ul className="px-4">
                    {selectedFiles2.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center border-b py-2">
                        <span className="text-base mx-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, selectedFiles2, setSelectedFiles2)}
                          className="text-red-500 hover:text-red-700"
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
            {errors.images && <span className="text-red-500 text-sm">{errors.images}</span>}
          </div>

          {/* Documents */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm text-gray-600">
              مدارک ملک
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  className="app-btn-gray"
                  onClick={() => fileInputRefDocument.current.click()}
                >
                  انتخاب مدارک ملک
                </button>
                <input
                  type="file"
                  ref={fileInputRefDocument}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange(e, setSelectedFilesDocument, ["jpg", "png", "jpeg", "pdf"])}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFilesDocument.length > 0 ? (
                  <ul className="px-4">
                    {selectedFilesDocument.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center border-b py-2">
                        <span className="text-base mx-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, selectedFilesDocument, setSelectedFilesDocument)}
                          className="text-red-500 hover:text-red-700"
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
                    هنوز مدرکی آپلود نشده است...
                  </p>
                )}
              </div>
            </div>
            {errors.document && <span className="text-red-500 text-sm">{errors.document}</span>}
          </div>

          {/* Bills */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm text-gray-600">
              قبوض خانه
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  className="app-btn-gray"
                  onClick={() => fileInputRefBill.current.click()}
                >
                  انتخاب قبوض خانه
                </button>
                <input
                  type="file"
                  ref={fileInputRefBill}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange(e, setSelectedFilesBill, ["jpg", "png", "jpeg", "pdf"])}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFilesBill.length > 0 ? (
                  <ul className="px-4">
                    {selectedFilesBill.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center border-b py-2">
                        <span className="text-base mx-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, selectedFilesBill, setSelectedFilesBill)}
                          className="text-red-500 hover:text-red-700"
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
                    هنوز قبضی آپلود نشده است...
                  </p>
                )}
              </div>
            </div>
            {errors.bill && <span className="text-red-500 text-sm">{errors.bill}</span>}
          </div>

          {/* Reservation Rules */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              قوانین رزرو ملک
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <LiaConciergeBellSolid className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="reservationRoles"
                value={formData.reservationRoles}
                onChange={handleChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="قوانین رزرو ملک"
                rows={4}
              />
            </div>
            {errors.reservationRoles && <span className="text-red-500 text-sm">{errors.reservationRoles}</span>}
          </div>

          {/* House Rules */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              ضوابط و مقررات ملک
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <TbHomeEdit className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="houseRoles"
                value={formData.houseRoles}
                onChange={handleChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="ضوابط و مقررات ملک"
                rows={4}
              />
            </div>
            {errors.houseRoles && <span className="text-red-500 text-sm">{errors.houseRoles}</span>}
          </div>

          {/* House Criteria */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              محدودیت‌های ملک
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <BsHouseExclamation className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="critrias"
                value={formData.critrias}
                onChange={handleChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="محدودیت‌های ملک"
                rows={4}
              />
            </div>
            {errors.critrias && <span className="text-red-500 text-sm">{errors.critrias}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              درباره ملک
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <FiInfo className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="درباره ملک"
                rows={4}
              />
            </div>
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
          </div>

          {/* Address */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              آدرس
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <FiMapPin className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="آدرس"
                rows={4}
              />
            </div>
            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
          </div>

          {/* Map */}
          <div className="mb-6">
            <h2 className="mb-2">آدرس خود را روی نقشه انتخاب کنید</h2>
            <div>
              <MapContainer
                center={position}
                zoom={13}
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="mb-2 mt-6 w-32">
            <button 
              type="submit"
              className="bg-black text-white w-full"
              disabled={btnSpinner}
            >
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span className="text-lg">ثبت ملک</span>
              )}
            </button>
          </div>
        </form>
      </TitleCard>
      <ToastContainer />
    </>
  );
}

export default AddHouse;