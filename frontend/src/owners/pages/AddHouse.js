import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import { useOwnerAuthStore } from "../stores/authStore";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons (keeping all your existing icons)
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
import { FiInfo, FiMapPin, FiUpload, FiX, FiFile, FiCheckCircle, FiImage } from "react-icons/fi";
import { BsHouseExclamation } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";

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

  // File states with drag and drop
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);
  const [isDragOverBill, setIsDragOverBill] = useState(false);
  const [isDragOverDocument, setIsDragOverDocument] = useState(false);

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

  const acceptedFileExtensions = ["jpg", "png", "jpeg", "pdf"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");

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

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
  };

  // Drag and drop handlers
  const handleDragOver = (e, setter) => {
    e.preventDefault();
    setter(true);
  };

  const handleDragLeave = (e, setter) => {
    e.preventDefault();
    setter(false);
  };

  const handleDrop = (e, setter, processFunction) => {
    e.preventDefault();
    setter(false);
    const files = Array.from(e.dataTransfer.files);
    processFunction(files);
  };

  // File handlers
  const handleFileChange = (event, setFiles, field) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setFiles, field);
  };

  const processFiles = (filesArray, setFiles, field) => {
    const newSelectedFiles = [];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");

    filesArray.forEach((file) => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${acceptedFileExtensions.join(", ")} قابل قبول هستند`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setFiles(newSelectedFiles);
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }
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
        newErrors[field] = `* ${field} الزامی است`;
      }
    });

    // Select fields validation
    if (!selectedProvince) newErrors.province = "* انتخاب استان الزامی است";
    if (!selectedCity) newErrors.city = "* انتخاب شهر الزامی است";
    if (!ownerType) newErrors.ownerType = "* نوع مالکیت الزامی است";
    if (!houseType) newErrors.houseType = "* نوع ملک الزامی است";
    if (hobbies.length === 0) newErrors.hobbies = "* امکانات تفریحی الزامی است";
    if (enviornment.length === 0) newErrors.enviornment = "* محیط ملک الزامی است";
    if (freeDates.length === 0) newErrors.freeDates = "* روزهای آزاد الزامی است";
    if (options.length === 0) newErrors.options = "* امکانات ملک الزامی است";
    if (cooling.length === 0) newErrors.cooling = "* سیستم سرمایش الزامی است";
    if (heating.length === 0) newErrors.heating = "* سیستم گرمایش الزامی است";
    if (floorType.length === 0) newErrors.floorType = "* نوع کف پوش الزامی است";
    if (kitchenOptions.length === 0) newErrors.kitchenOptions = "* امکانات آشپزخانه الزامی است";
    if (bedRoomOptions.length === 0) newErrors.bedRoomOptions = "* امکانات اتاق خواب الزامی است";
    if (selectedFiles.length === 0) newErrors.cover = "* تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.images = "* تصاویر ملک الزامی است";

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

  // Custom select styles to match the design
  const customSelectStyles = {
    menu: (provided) => ({
      ...provided,
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }),
    control: (provided, state) => ({
      ...provided,
      borderRadius: '12px',
      border: `2px solid ${errors[state.name] ? '#fca5a5' : '#e5e7eb'}`,
      padding: '8px 4px',
      backgroundColor: errors[state.name] ? '#fef2f2' : 'rgba(255, 255, 255, 0.5)',
      backdropBlur: 'sm',
      minHeight: '56px',
      '&:focus-within': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
    }),
  };

  return (
    <div className="min-h-screen py-1 px-1">
      <div className="w-full mx-auto">
        <TitleCard 
          title={
            <div className="flex space-x-3 rtl:space-x-reverse">
              <span>ثبت ملک جدید</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                ثبت ملک جدید
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                اطلاعات ملک جدید را با دقت وارد کنید تا در پلتفرم ما نمایش داده شود
              </p>
            </div>

            <form className="space-y-6 md:space-y-8" onSubmit={addHouseFunction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* House Name */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <PiHouseLight className="ml-2 text-blue-500" />
                    نام ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <PiHouseLight className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.name 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="نام ملک"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.name && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* House Owner */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <TfiUser className="ml-2 text-blue-500" />
                    نام صاحب ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <TfiUser className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="houseOwner"
                      value={formData.houseOwner}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.houseOwner 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="نام صاحب ملک"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.houseOwner && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.houseOwner}
                    </span>
                  )}
                </div>

                {/* House Phone */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <TbPhone className="ml-2 text-blue-500" />
                    شماره ثابت ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <TbPhone className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="housePhone"
                      value={formData.housePhone}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.housePhone 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="شماره ثابت ملک"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.housePhone && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.housePhone}
                    </span>
                  )}
                </div>

                {/* House Meters */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <RxRulerHorizontal className="ml-2 text-blue-500" />
                    متراژ ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <RxRulerHorizontal className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="meters"
                      type="number"
                      value={formData.meters}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.meters 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="متراژ ملک"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.meters && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.meters}
                    </span>
                  )}
                </div>

                {/* Year Built */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <PiHourglassSimpleLow className="ml-2 text-blue-500" />
                    سال ساخت
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <PiHourglassSimpleLow className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.year 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="سال ساخت"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.year && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.year}
                    </span>
                  )}
                </div>

                {/* Capacity */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FaUsers className="ml-2 text-blue-500" />
                    ظرفیت
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FaUsers className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.capacity 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="ظرفیت"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.capacity && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.capacity}
                    </span>
                  )}
                </div>

                {/* Postal Code */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <PiSignpostLight className="ml-2 text-blue-500" />
                    کد پستی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <PiSignpostLight className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.postalCode 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="کد پستی"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.postalCode && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.postalCode}
                    </span>
                  )}
                </div>

                {/* Rooms */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <PiWarehouseLight className="ml-2 text-blue-500" />
                    تعداد اتاق‌ها
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <PiWarehouseLight className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.rooms 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="تعداد اتاق‌ها"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.rooms && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.rooms}
                    </span>
                  )}
                </div>

                {/* Floors */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <PiSolarRoof className="ml-2 text-blue-500" />
                    تعداد طبقات
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <PiSolarRoof className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="floor"
                      type="number"
                      value={formData.floor}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.floor 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="تعداد طبقات"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.floor && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.floor}
                    </span>
                  )}
                </div>

                {/* Parking */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <LuCircleParking className="ml-2 text-blue-500" />
                    تعداد پارکینگ
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <LuCircleParking className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="parking"
                      type="number"
                      value={formData.parking}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.parking 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="تعداد پارکینگ"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.parking && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.parking}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <RiPriceTagLine className="ml-2 text-blue-500" />
                    قیمت
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <RiPriceTagLine className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.price 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="قیمت"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.price && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.price}
                    </span>
                  )}
                </div>

                {/* House Number */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <TbCircleDashedNumber4 className="ml-2 text-blue-500" />
                    پلاک ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <TbCircleDashedNumber4 className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.houseNumber 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="پلاک ملک"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.houseNumber && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.houseNumber}
                    </span>
                  )}
                </div>

                {/* Discount */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <HiOutlineDocumentArrowUp className="ml-2 text-blue-500" />
                    تخفیف
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <HiOutlineDocumentArrowUp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.discount 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="تخفیف"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.discount && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Select Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Province */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    استان
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    options={provinces}
                    placeholder="انتخاب استان"
                    isSearchable
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.province 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.province && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.province}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    شهرستان
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={selectedCity}
                    onChange={setSelectedCity}
                    options={cities}
                    placeholder="انتخاب شهرستان"
                    isSearchable
                    isDisabled={!selectedProvince}
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.city 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.city && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.city}
                    </span>
                  )}
                </div>

                {/* Owner Type */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    نوع مالکیت
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={ownerType}
                    onChange={setOwnerType}
                    options={ownerTypeList}
                    placeholder="انتخاب نوع مالکیت"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.ownerType 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.ownerType && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.ownerType}
                    </span>
                  )}
                </div>

                {/* House Type */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    نوع ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={houseType}
                    onChange={setHouseType}
                    options={houseTypeList}
                    placeholder="انتخاب نوع ملک"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.houseType 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.houseType && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.houseType}
                    </span>
                  )}
                </div>

                {/* Hobbies */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    امکانات تفریحی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={hobbies}
                    onChange={setHobbies}
                    options={hobbiesList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات تفریحی"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.hobbies 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.hobbies && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.hobbies}
                    </span>
                  )}
                </div>

                {/* Environment */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    محیط ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={enviornment}
                    onChange={setEnviornment}
                    options={enviornmentList}
                    isMultiple={true}
                    placeholder="انتخاب محیط ملک"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.enviornment 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.enviornment && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.enviornment}
                    </span>
                  )}
                </div>

                {/* Free Dates */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    روزهای آزاد
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={freeDates}
                    onChange={setFreeDates}
                    options={weekDays}
                    isMultiple={true}
                    placeholder="انتخاب روزهای آزاد"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.freeDates 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.freeDates && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.freeDates}
                    </span>
                  )}
                </div>

                {/* House Options */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    امکانات ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={options}
                    onChange={setOptions}
                    options={houseOptions}
                    isMultiple={true}
                    placeholder="انتخاب امکانات ملک"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.options 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.options && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.options}
                    </span>
                  )}
                </div>

                {/* Cooling System */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    سیستم سرمایش
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={cooling}
                    onChange={setCooling}
                    options={coolingList}
                    isMultiple={true}
                    placeholder="انتخاب سیستم سرمایش"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.cooling 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.cooling && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.cooling}
                    </span>
                  )}
                </div>

                {/* Heating System */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    سیستم گرمایش
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={heating}
                    onChange={setHeating}
                    options={heatingList}
                    isMultiple={true}
                    placeholder="انتخاب سیستم گرمایش"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.heating 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.heating && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.heating}
                    </span>
                  )}
                </div>

                {/* Floor Type */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    نوع کف‌پوش
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={floorType}
                    onChange={setFloorType}
                    options={floorTypeList}
                    isMultiple={true}
                    placeholder="انتخاب نوع کف‌پوش"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.floorType 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.floorType && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.floorType}
                    </span>
                  )}
                </div>

                {/* Kitchen Options */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    امکانات آشپزخانه
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={kitchenOptions}
                    onChange={setKitchenOptions}
                    options={kitchenOptionList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات آشپزخانه"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.kitchenOptions 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.kitchenOptions && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.kitchenOptions}
                    </span>
                  )}
                </div>

                {/* Bedroom Options */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800">
                    امکانات اتاق خواب
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={bedRoomOptions}
                    onChange={setBedRoomOptions}
                    options={bedRoomOptionList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات اتاق خواب"
                    classNames={{
                      menuButton: () => `rounded-2xl border-2 transition-all duration-300 ${
                        errors.bedRoomOptions 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                    }}
                  />
                  {errors.bedRoomOptions && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.bedRoomOptions}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Photo */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصویر اصلی ملک
                  <span className="text-red-500 mr-1">*</span>
                </label>
                
                <div 
                  className={`relative group rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isDragOver 
                      ? "scale-[1.02] shadow-lg" 
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => handleDragOver(e, setIsDragOver)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDragOver)}
                  onDrop={(e) => handleDrop(e, setIsDragOver, (files) => processFiles(files, setSelectedFiles, "cover"))}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDragOver 
                      ? "from-blue-50 to-indigo-50" 
                      : errors.cover 
                        ? "from-red-50 to-red-50" 
                        : "from-gray-50 to-blue-50/30"
                  } backdrop-blur-sm`} />
                  
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? "border-blue-400 shadow-inner" 
                      : errors.cover 
                        ? "border-red-300" 
                        : "border-gray-300 group-hover:border-blue-400"
                  }`}>
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        isDragOver ? "scale-110 bg-blue-100" : "bg-white/80 shadow-sm"
                      }`}>
                        <FiUpload className={`w-8 h-8 transition-colors ${
                          isDragOver ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div className="space-y-2">
                        <p className={`text-lg font-semibold transition-colors ${
                          isDragOver ? "text-blue-700" : "text-gray-700"
                        }`}>
                          {isDragOver ? "فایل را رها کنید" : "آپلود تصویر اصلی"}
                        </p>
                        <p className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                      >
                        انتخاب تصویر
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept={acceptedFileTypesString}
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setSelectedFiles, "cover")}
                    onClick={(e) => (e.target.value = null)}
                  />
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FiCheckCircle className="text-green-500 w-5 h-5" />
                        <span className="text-sm font-semibold text-gray-700">
                          تصویر انتخاب شده
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        آماده آپلود
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <FiFile className="text-blue-500 w-4 h-4 flex-shrink-0" />
                            </div>
                            <span className="text-sm font-medium truncate text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileDelete(index, selectedFiles, setSelectedFiles)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                            aria-label="حذف فایل"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.cover && (
                  <span className="mt-3 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.cover}
                  </span>
                )}
              </div>

              {/* House Images */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصاویر ملک
                  <span className="text-red-500 mr-1">*</span>
                </label>
                
                <div 
                  className={`relative group rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isDragOver2 
                      ? "scale-[1.02] shadow-lg" 
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={() => fileInputRef2.current.click()}
                  onDragOver={(e) => handleDragOver(e, setIsDragOver2)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDragOver2)}
                  onDrop={(e) => handleDrop(e, setIsDragOver2, (files) => processFiles(files, setSelectedFiles2, "images"))}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDragOver2 
                      ? "from-blue-50 to-indigo-50" 
                      : errors.images 
                        ? "from-red-50 to-red-50" 
                        : "from-gray-50 to-blue-50/30"
                  } backdrop-blur-sm`} />
                  
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver2 
                      ? "border-blue-400 shadow-inner" 
                      : errors.images 
                        ? "border-red-300" 
                        : "border-gray-300 group-hover:border-blue-400"
                  }`}>
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        isDragOver2 ? "scale-110 bg-blue-100" : "bg-white/80 shadow-sm"
                      }`}>
                        <FiUpload className={`w-8 h-8 transition-colors ${
                          isDragOver2 ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div className="space-y-2">
                        <p className={`text-lg font-semibold transition-colors ${
                          isDragOver2 ? "text-blue-700" : "text-gray-700"
                        }`}>
                          {isDragOver2 ? "فایل‌ها را رها کنید" : "آپلود تصاویر ملک"}
                        </p>
                        <p className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                      >
                        انتخاب تصاویر
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept={acceptedFileTypesString}
                    ref={fileInputRef2}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setSelectedFiles2, "images")}
                    onClick={(e) => (e.target.value = null)}
                  />
                </div>

                {/* Selected Files List */}
                {selectedFiles2.length > 0 && (
                  <div className="mt-6 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FiCheckCircle className="text-green-500 w-5 h-5" />
                        <span className="text-sm font-semibold text-gray-700">
                          تصاویر انتخاب شده ({selectedFiles2.length})
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        آماده آپلود
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                      {selectedFiles2.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <FiFile className="text-blue-500 w-4 h-4 flex-shrink-0" />
                            </div>
                            <span className="text-sm font-medium truncate text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileDelete(index, selectedFiles2, setSelectedFiles2)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                            aria-label="حذف فایل"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.images && (
                  <span className="mt-3 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.images}
                  </span>
                )}
              </div>

              {/* Text Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Description */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiInfo className="ml-2 text-blue-500" />
                    درباره ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 z-10">
                      <div className="p-2">
                        <FiInfo className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.description 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="درباره ملک..."
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.description && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.description}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="ml-2 text-blue-500" />
                    آدرس
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 z-10">
                      <div className="p-2">
                        <FiMapPin className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.address 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="آدرس کامل..."
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.address && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* Reservation Rules */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <LiaConciergeBellSolid className="ml-2 text-blue-500" />
                    قوانین رزرو ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 z-10">
                      <div className="p-2">
                        <LiaConciergeBellSolid className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <textarea
                      name="reservationRoles"
                      value={formData.reservationRoles}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.reservationRoles 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="قوانین رزرو ملک..."
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.reservationRoles && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.reservationRoles}
                    </span>
                  )}
                </div>

                {/* House Rules */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <TbHomeEdit className="ml-2 text-blue-500" />
                    ضوابط و مقررات ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 z-10">
                      <div className="p-2">
                        <TbHomeEdit className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <textarea
                      name="houseRoles"
                      value={formData.houseRoles}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.houseRoles 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="ضوابط و مقررات ملک..."
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.houseRoles && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.houseRoles}
                    </span>
                  )}
                </div>

                {/* House Criteria */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <BsHouseExclamation className="ml-2 text-blue-500" />
                    محدودیت‌های ملک
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 z-10">
                      <div className="p-2">
                        <BsHouseExclamation className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <textarea
                      name="critrias"
                      value={formData.critrias}
                      onChange={handleChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.critrias 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="محدودیت‌های ملک..."
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.critrias && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.critrias}
                    </span>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800">
                  موقعیت مکانی روی نقشه
                </label>
                <div className="rounded-2xl border-2 border-gray-200/80 overflow-hidden">
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
                <p className="mt-2 text-sm text-gray-600">مکان ملک خود را روی نقشه مشخص کنید</p>
              </div>

              {/* Submit button */}
              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={btnSpinner}

                  style={{backgroundColor:"blue",color:"#fff"}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال ثبت ملک...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineAdd className="w-5 h-5" />
                        <span>ثبت ملک</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </TitleCard>
      </div>
      
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl shadow-lg border border-gray-200/50"
        progressClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
      />
    </div>
  );
}

export default AddHouse;