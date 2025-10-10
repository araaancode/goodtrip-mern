import { useEffect, useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from '../features/common/headerSlice'
import { useDispatch } from "react-redux";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDriverAuthStore } from "../stores/authStore";
import axios from "axios";

// Icons
import { 
  IoBusOutline, 
  IoInformationCircleOutline, 
  IoColorPaletteOutline,
  IoPricetagOutline,
  IoChevronDown
} from "react-icons/io5";
import { GoNumber, GoPerson } from "react-icons/go";
import { BsCardHeading } from "react-icons/bs";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { TfiMoney } from "react-icons/tfi";
import { LiaBusSolid } from "react-icons/lia";
import { SlCalender } from "react-icons/sl";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";
import { TbAirConditioning, TbAirConditioningDisabled } from "react-icons/tb";

const typesList = [
  { value: "scania", label: "اسکانیا" },
  { value: "volvo", label: "ولوو" },
  { value: "man", label: "مان" },
  { value: "mercedes-benz", label: "مرسدس بنز" },
  { value: "irankhodro_dissel", label: "ایران خودرو دیزل" },
  { value: "Hyundai", label: "هیوندا" },
  { value: "Akea", label: "آکیا" },
  { value: "other", label: "سایر" },
];

const modelsList = [
  { value: "benz-0457", label: "بنز O457" },
  { value: "benz-0500", label: "بنز O500" },
  { value: "benz-travego", label: "بنز Travego" },
  { value: "sortme", label: "سورتمه" },
  { value: "scania-maral", label: "اسکانیا مارال" },
  { value: "scania-dorsa", label: "اسکانیا درسا" },
  { value: "scania-parsa", label: "اسکانیا پارسا" },
  { value: "volvo-b12", label: "ولوو B12" },
  { value: "volvo-b9r", label: "ولوو B9R" },
  { value: "shahab-man-r07", label: "شهاب مان R07" },
  { value: "shahab-man-r08", label: "شهاب مان R08" },
  { value: "akea-302", label: "آکیا 302" },
  { value: "akea-new", label: "آکیا جدید شهری و بین‌شهری" },
  { value: "other", label: "سایر" },
];

const heatList = [
  { value: "water-heater", label: "بخاری آبگرم" },
  { value: "electric-heater", label: "بخاری برقی" },
  { value: "gas-heater", label: "بخاری گازی" },
  { value: "diesel-heater", label: "بخاری دیزلی" },
  { value: "HVAC-system", label: "سیستم گرمایشی مبتنی بر تهویه مطبوع" },
  { value: "auxiliary-heater", label: "بخاری مستقل" },
  { value: "no-heater", label: "ندارد" },
  { value: "other", label: "سایر" },
];

const coldnessList = [
  { value: "air-conditioning", label: "سیستم تهویه مطبوع" },
  { value: "bus-chiller", label: "چیلر اتوبوس" },
  { value: "roof-mounted-air-conditioner", label: "کولر گازی سقفی" },
  { value: "ventilation-fan", label: "پنکه یا فن تهویه" },
  { value: "vent-windows", label: "پنجره‌های تهویه‌ای" },
  { value: "evaporative-cooling-system", label: "سیستم سرمایشی مبتنی بر آب" },
  { value: "auxiliary-air-conditioner", label: "کولر گازی کمکی" },
  { value: "no-heater", label: "ندارد" },
  { value: "other", label: "سایر" },
];

const optionsList = [
  {
    label: "امکانات اضافی",
    options: [
      { value: "window-curtains", label: "پرده‌های پنجره" },
      { value: "audio-video-system", label: "سیستم صوتی و تصویری" },
      { value: "wifi", label: "وای‌فای" },
      { value: "power-outlet-USB", label: "پریز برق یا پورت USB" },
      { value: "mini-fridge", label: "یخچال کوچک" },
      { value: "reception", label: "پذیرایی" },
      { value: "seat-belts", label: "کمربند ایمنی برای هر صندلی" },
      { value: "CCTV", label: "دوربین مداربسته" },
      { value: "fire-extinguisher-emergency-hammer", label: "کپسول آتش‌نشانی و چکش اضطراری" },
      { value: "GPS-driver-monitoring-system", label: "GPS و سیستم مانیتورینگ راننده" },
      { value: "other", label: "سایر" },
    ],
  },
];

function AddBus() {
  const dispatch = useDispatch();
  const { isDriverAuthenticated } = useDriverAuthStore();

  useEffect(() => {
    dispatch(setPageTitle({ title: "ثبت اطلاعات اتوبوس" }));
  }, []);

  // States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "",
    type: null,
    model: null,
    licensePlate: "",
    serviceProvider: "",
    price: "",
    seats: "",
    capacity: "",
    options: null,
    heat: null,
    coldness: null,
  });

  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "* نام اتوبوس الزامی است";
    if (!formData.model) newErrors.model = "* مدل اتوبوس الزامی است";
    if (!formData.color.trim()) newErrors.color = "* رنگ اتوبوس الزامی است";
    if (!formData.type) newErrors.type = "* نوع اتوبوس الزامی است";
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "* پلاک اتوبوس الزامی است";
    if (!formData.serviceProvider.trim()) newErrors.serviceProvider = "* نام ارائه دهنده الزامی است";
    if (!formData.price) newErrors.price = "* قیمت بلیط الزامی است";
    if (!formData.seats) newErrors.seats = "* تعداد صندلی‌ها الزامی است";
    if (!formData.capacity) newErrors.capacity = "* ظرفیت اتوبوس الزامی است";
    if (!formData.options || formData.options.length === 0) newErrors.options = "* امکانات اضافی الزامی است";
    if (!formData.heat) newErrors.heat = "* سیستم گرمایشی الزامی است";
    if (!formData.coldness) newErrors.coldness = "* سیستم سرمایشی الزامی است";
    if (selectedFiles.length === 0) newErrors.photo = "* تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.photos = "* تصاویر اتوبوس الزامی است";
    if (!formData.description.trim()) newErrors.description = "* توضیحات الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // File handling functions with drag and drop
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

  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles, "photo");
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles2, "photos");
  };

  const processFiles = (filesArray, setFilesFunction, errorField) => {
    const newSelectedFiles = [...(setFilesFunction === setSelectedFiles ? selectedFiles : selectedFiles2)];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    
    filesArray.forEach((file) => {
      if (newSelectedFiles.some((f) => f.name === file.name)) {
        toast.error("نام فایل ها باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setFilesFunction(newSelectedFiles);
      if (errors[errorField]) setErrors(prev => ({ ...prev, [errorField]: "" }));
    }
  };

  const handleFileDelete = (index, setFilesFunction, errorField) => {
    const updatedFiles = [...(setFilesFunction === setSelectedFiles ? selectedFiles : selectedFiles2)];
    updatedFiles.splice(index, 1);
    setFilesFunction(updatedFiles);
  };

  const addBusHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setBtnSpinner(true);

    try {
      const optionsArr = formData.options.map(option => option.label);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("type", formData.type.label);
      formDataToSend.append("model", formData.model.label);
      formDataToSend.append("licensePlate", formData.licensePlate);
      formDataToSend.append("serviceProvider", formData.serviceProvider);
      formDataToSend.append("seats", formData.seats);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("options", JSON.stringify(optionsArr));
      formDataToSend.append("heat", formData.heat.label);
      formDataToSend.append("coldness", formData.coldness.label);
      formDataToSend.append("photo", selectedFiles[0]);
      
      selectedFiles2.forEach((image) => {
        formDataToSend.append("photos", image);
      });

      await axios.post("/api/drivers/bus", formDataToSend, {
        withCredentials: true
      });

      // Reset form on success
      setFormData({
        name: "",
        description: "",
        color: "",
        type: null,
        model: null,
        licensePlate: "",
        serviceProvider: "",
        price: "",
        seats: "",
        capacity: "",
        options: null,
        heat: null,
        coldness: null,
      });
      setSelectedFiles([]);
      setSelectedFiles2([]);
      setErrors({});

      toast.success("اتوبوس با موفقیت اضافه شد");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "خطایی در اضافه کردن اتوبوس رخ داد";
      toast.error(errorMessage);
    } finally {
      setBtnSpinner(false);
    }
  };

  // Enhanced select class names with better z-index handling
  const selectClassNames = {
    menuButton: ({ isDisabled }) => 
      `flex text-sm text-gray-500 border border-gray-300 rounded-2xl shadow-sm w-full pl-14 pr-10 py-4 text-right transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
        isDisabled
          ? "bg-gray-200"
          : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      }`,
    menu: "absolute z-50 w-full bg-white shadow-xl border border-gray-200 rounded-2xl mt-1 py-2 overflow-hidden",
    list: "py-1 max-h-60 overflow-y-auto",
    listItem: ({ isSelected }) => 
      `block transition duration-200 px-4 py-3 text-right cursor-pointer select-none truncate rounded-none mx-2 ${
        isSelected
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`,
    searchBox: "w-full py-2 px-3 border-b border-gray-200 text-sm text-gray-500 focus:outline-none focus:ring-0",
    tagItem: ({ item, isDisabled }) => 
      `flex items-center gap-1 p-1 px-2 rounded-md text-xs bg-blue-100 text-blue-700 ${
        isDisabled ? "opacity-50" : ""
      }`,
    tagItemText: "text-xs font-medium",
    tagItemIcon: "w-3 h-3 mt-0.5",
    listGroupLabel: "block text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 bg-gray-50",
    noOptionsMessage: "p-4 text-center text-sm text-gray-500"
  };

  return (
    <div className="min-h-screen py-1 px-1 relative">
      <div className="w-full mx-auto">
        <TitleCard 
          title={
            <div className="flex space-x-3 rtl:space-x-reverse">
              <span>افزودن اتوبوس جدید</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden relative"
        >
          <div className="p-6 md:p-8 relative">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                افزودن اتوبوس جدید
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                اطلاعات اتوبوس جدید را با دقت وارد کنید تا در سامانه شما نمایش داده شود
              </p>
            </div>

            <form className="space-y-6 md:space-y-8 relative">
              {/* Bus Name */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoBusOutline className="ml-2 text-blue-500" />
                  نام اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoBusOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.name 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="نام اتوبوس"
                  />
                </div>
                {errors.name && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Bus Model */}
              <div className="flex flex-col relative z-30">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoBusOutline className="ml-2 text-blue-500" />
                  مدل اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoBusOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.model}
                    onChange={(value) => handleSelectChange("model", value)}
                    options={modelsList}
                    placeholder="انتخاب مدل اتوبوس"
                    classNames={selectClassNames}
                    primaryColor="blue"
                  />
                </div>
                {errors.model && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.model}
                  </span>
                )}
              </div>

              {/* Color */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoColorPaletteOutline className="ml-2 text-blue-500" />
                  رنگ اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoColorPaletteOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.color 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="رنگ اتوبوس"
                  />
                </div>
                {errors.color && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.color}
                  </span>
                )}
              </div>

              {/* Bus Type */}
              <div className="flex flex-col relative z-30">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoBusOutline className="ml-2 text-blue-500" />
                  نوع اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoBusOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.type}
                    onChange={(value) => handleSelectChange("type", value)}
                    options={typesList}
                    placeholder="انتخاب نوع اتوبوس"
                    classNames={selectClassNames}
                    primaryColor="blue"
                  />
                </div>
                {errors.type && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.type}
                  </span>
                )}
              </div>

              {/* License Plate */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <BsCardHeading className="ml-2 text-blue-500" />
                  پلاک اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <BsCardHeading className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.licensePlate 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="پلاک اتوبوس"
                  />
                </div>
                {errors.licensePlate && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.licensePlate}
                  </span>
                )}
              </div>

              {/* Service Provider */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <LiaBusSolid className="ml-2 text-blue-500" />
                  ارائه دهنده سرویس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <LiaBusSolid className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="serviceProvider"
                    value={formData.serviceProvider}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.serviceProvider 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="نام ارائه دهنده سرویس"
                  />
                </div>
                {errors.serviceProvider && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.serviceProvider}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoPricetagOutline className="ml-2 text-blue-500" />
                  قیمت بلیط (هر نفر)
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoPricetagOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.price 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="قیمت بلیط"
                  />
                </div>
                {errors.price && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.price}
                  </span>
                )}
              </div>

              {/* Seats */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <GoPerson className="ml-2 text-blue-500" />
                  تعداد صندلی‌ها
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <GoPerson className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="seats"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.seats 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="تعداد صندلی‌ها"
                  />
                </div>
                {errors.seats && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.seats}
                  </span>
                )}
              </div>

              {/* Capacity */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <MdOutlineReduceCapacity className="ml-2 text-blue-500" />
                  ظرفیت اتوبوس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <MdOutlineReduceCapacity className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="capacity"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.capacity 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="ظرفیت اتوبوس"
                  />
                </div>
                {errors.capacity && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.capacity}
                  </span>
                )}
              </div>

              {/* Heating System */}
              <div className="flex flex-col relative z-30">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <TbAirConditioning className="ml-2 text-blue-500" />
                  سیستم گرمایشی
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <TbAirConditioning className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.heat}
                    onChange={(value) => handleSelectChange("heat", value)}
                    options={heatList}
                    placeholder="انتخاب سیستم گرمایشی"
                    classNames={selectClassNames}
                    primaryColor="blue"
                  />
                </div>
                {errors.heat && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.heat}
                  </span>
                )}
              </div>

              {/* Cooling System */}
              <div className="flex flex-col relative z-30">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <TbAirConditioningDisabled className="ml-2 text-blue-500" />
                  سیستم سرمایشی
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <TbAirConditioningDisabled className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.coldness}
                    onChange={(value) => handleSelectChange("coldness", value)}
                    options={coldnessList}
                    placeholder="انتخاب سیستم سرمایشی"
                    classNames={selectClassNames}
                    primaryColor="blue"
                  />
                </div>
                {errors.coldness && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.coldness}
                  </span>
                )}
              </div>

              {/* Additional Options */}
              <div className="flex flex-col relative z-40">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <SlCalender className="ml-2 text-blue-500" />
                  امکانات اضافی
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <SlCalender className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.options}
                    onChange={(value) => handleSelectChange("options", value)}
                    options={optionsList}
                    isMultiple={true}
                    placeholder="انتخاب امکانات اضافی"
                    classNames={selectClassNames}
                    primaryColor="blue"
                  />
                </div>
                {errors.options && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.options}
                  </span>
                )}
              </div>

              {/* Main Photo */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصویر اصلی اتوبوس
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
                  onDrop={(e) => handleDrop(e, setIsDragOver, (files) => processFiles(files, setSelectedFiles, "photo"))}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDragOver 
                      ? "from-blue-50 to-indigo-50" 
                      : errors.photo 
                        ? "from-red-50 to-red-50" 
                        : "from-gray-50 to-blue-50/30"
                  } backdrop-blur-sm`} />
                  
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? "border-blue-400 shadow-inner" 
                      : errors.photo 
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
                    onChange={handleFileChange}
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
                            onClick={() => handleFileDelete(index, setSelectedFiles, "photo")}
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

                {errors.photo && (
                  <span className="mt-3 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.photo}
                  </span>
                )}
              </div>

              {/* Additional Photos */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصاویر اتوبوس
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
                  onDrop={(e) => handleDrop(e, setIsDragOver2, (files) => processFiles(files, setSelectedFiles2, "photos"))}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDragOver2 
                      ? "from-blue-50 to-indigo-50" 
                      : errors.photos 
                        ? "from-red-50 to-red-50" 
                        : "from-gray-50 to-blue-50/30"
                  } backdrop-blur-sm`} />
                  
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver2 
                      ? "border-blue-400 shadow-inner" 
                      : errors.photos 
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
                          {isDragOver2 ? "فایل‌ها را رها کنید" : "آپلود تصاویر اتوبوس"}
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
                    onChange={handleFileChange2}
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
                            onClick={() => handleFileDelete(index, setSelectedFiles2, "photos")}
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

                {errors.photos && (
                  <span className="mt-3 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.photos}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col relative z-10">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoInformationCircleOutline className="ml-2 text-blue-500" />
                  توضیحات
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 z-10">
                    <div className="p-2">
                      <IoInformationCircleOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                      errors.description 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="توضیحات کامل درباره اتوبوس، امکانات، و ویژگی‌های خاص..."
                  />
                </div>
                {errors.description && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-6 relative z-10">
                <button
                  className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={addBusHandler}
                  disabled={btnSpinner}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال اضافه کردن اتوبوس...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineAdd className="w-5 h-5" />
                        <span>افزودن اتوبوس</span>
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

export default AddBus;