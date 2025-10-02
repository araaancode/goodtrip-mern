import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookAuthStore } from "../stores/authStore";
import axios from "axios";

// Icons
import { IoFastFoodOutline, IoInformationCircleOutline, IoPricetagOutline } from "react-icons/io5";
import { GoNumber } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { TbClockHour12 } from "react-icons/tb";
import { PiChefHatLight, PiBowlFood } from "react-icons/pi";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";

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

const hourOptions = [
  { value: "morning", label: "صبح تا ظهر (7 تا 12)" },
  { value: "noon", label: "صبح تا شب (7 تا 0)" },
  { value: "night", label: "ظهر تا شب (12 تا 0)" },
  { value: "none", label: "هیچکدام" },
];

const categoryOptions = [
  { value: "پیش غذا", label: "پیش غذا" },
  { value: "غذای اصلی", label: "غذای اصلی" },
  { value: "دسر و نوشیدنی", label: "دسر و نوشیدنی" },
  { value: "ایتالیایی", label: "ایتالیایی" },
  { value: "ایرانی", label: "ایرانی" },
  { value: "ساندویچ", label: "ساندویچ" },
  { value: "فست فود", label: "فست فود" },
  { value: "سوپ", label: "سوپ" },
  { value: "آش", label: "آش" },
];

function AddFood() {
  const { token } = useCookAuthStore();
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    count: "",
    cookDate: null,
    cookHour: null,
    price: null,
    description: "",
    category: null,
    cookName: "",
  });

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
    
    if (!formData.name.trim()) newErrors.name = "* نام غذا الزامی است";
    if (!formData.count) newErrors.count = "* تعداد غذا الزامی است";
    if (!formData.price) newErrors.price = "* قیمت غذا الزامی است";
    if (!formData.cookDate) newErrors.cookDate = "* تاریخ پخت الزامی است";
    if (!formData.cookHour) newErrors.cookHour = "* ساعت پخت الزامی است";
    if (!formData.category) newErrors.category = "* دسته بندی غذا الزامی است";
    if (!formData.cookName.trim()) newErrors.cookName = "* نام سرآشپز الزامی است";
    if (!formData.description.trim()) newErrors.description = "* توضیحات الزامی است";
    if (selectedFiles.length === 0) newErrors.photo = "* تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.photos = "* تصاویر غذا الزامی است";

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
    processFiles(newFilesArray);
  };

  const processFiles = (filesArray) => {
    const newSelectedFiles = [...selectedFiles];
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
      setSelectedFiles(newSelectedFiles);
      if (errors.photo) setErrors(prev => ({ ...prev, photo: "" }));
    }
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles2(newFilesArray);
  };

  const processFiles2 = (filesArray) => {
    const newSelectedFiles2 = [...selectedFiles2];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    
    filesArray.forEach((file) => {
      if (newSelectedFiles2.some((f) => f.name === file.name)) {
        toast.error("نام فایل ها باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
        hasError = true;
      } else {
        newSelectedFiles2.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles2(newSelectedFiles2);
      if (errors.photos) setErrors(prev => ({ ...prev, photos: "" }));
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleFileDelete2 = (index) => {
    const updatedFiles = [...selectedFiles2];
    updatedFiles.splice(index, 1);
    setSelectedFiles2(updatedFiles);
  };

  const addFoodHandle = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setBtnSpinner(true);

    try {
      const cookDatesArr = formData.cookDate.map(date => date.label);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("count", formData.count);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("cookDate", cookDatesArr);
      formDataToSend.append("cookHour", formData.cookHour.label);
      formDataToSend.append("photo", selectedFiles[0]);
      selectedFiles2.forEach(image => formDataToSend.append("photos", image));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category.value);
      formDataToSend.append("cookName", formData.cookName);

      await axios.post(`/api/cooks/foods`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });

      // Reset form on success
      setFormData({
        name: "",
        count: "",
        cookDate: null,
        cookHour: null,
        price: null,
        description: "",
        category: null,
        cookName: "",
      });
      setSelectedFiles([]);
      setSelectedFiles2([]);

      toast.success("غذا با موفقیت اضافه شد");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "خطایی در اضافه کردن غذا رخ داد";
      toast.error(errorMessage);
    } finally {
      setBtnSpinner(false);
    }
  };

  return (
    <div className="min-h-screen py-1 px-1">
      <div className="w-full mx-auto">
        <TitleCard 
          title={
            <div className="flex space-x-3 rtl:space-x-reverse">
              <span>افزودن غذای جدید</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                افزودن غذای جدید
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                اطلاعات غذای جدید را با دقت وارد کنید تا در منوی رستوران شما نمایش داده شود
              </p>
            </div>

            <form className="space-y-6 md:space-y-8">
              {/* Food Name */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoFastFoodOutline className="ml-2 text-blue-500" />
                  نام غذا
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <IoFastFoodOutline className="w-5 h-5 text-blue-600" />
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
                    placeholder="نام غذا"
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

              {/* Food Count */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <GoNumber className="ml-2 text-blue-500" />
                  تعداد غذاها
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <GoNumber className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="count"
                    type="number"
                    min={1}
                    value={formData.count}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.count 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-100 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="تعداد غذاها"
                    style={{borderRadius: '8px'}}
                  />
                </div>
                {errors.count && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.count}
                  </span>
                )}
              </div>

              {/* Cook Date */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <SlCalender className="ml-2 text-blue-500" />
                  تاریخ پخت
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <SlCalender className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.cookDate}
                    onChange={(value) => handleSelectChange("cookDate", value)}
                    options={weekDays}
                    isMultiple={true}
                    placeholder="انتخاب تاریخ پخت"
                    classNames={{
                      menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                        errors.cookDate 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                      menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                      option: "px-4 py-3 hover:bg-blue-50"
                    }}
                  />
                </div>
                {errors.cookDate && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.cookDate}
                  </span>
                )}
              </div>

              {/* Cook Hour */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <TbClockHour12 className="ml-2 text-blue-500" />
                  ساعت پخت
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <TbClockHour12 className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.cookHour}
                    onChange={(value) => handleSelectChange("cookHour", value)}
                    options={hourOptions}
                    placeholder="انتخاب ساعت پخت"
                    classNames={{
                      menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                        errors.cookHour 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                      menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                      option: "px-4 py-3 hover:bg-blue-50"
                    }}
                  />
                </div>
                {errors.cookHour && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.cookHour}
                  </span>
                )}
              </div>

              {/* Food Category */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <PiBowlFood className="ml-2 text-blue-500" />
                  دسته بندی غذا
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <PiBowlFood className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <Select
                    value={formData.category}
                    onChange={(value) => handleSelectChange("category", value)}
                    options={categoryOptions}
                    placeholder="انتخاب دسته بندی"
                    classNames={{
                      menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                        errors.category 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                      menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                      option: "px-4 py-3 hover:bg-blue-50"
                    }}
                  />
                </div>
                {errors.category && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.category}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <IoPricetagOutline className="ml-2 text-blue-500" />
                  قیمت غذا به ازای هر نفر
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
                        : "border-gray-100 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="قیمت غذا"
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

              {/* Cook Name */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <PiChefHatLight className="ml-2 text-blue-500" />
                  نام سرآشپز
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2">
                      <PiChefHatLight className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    name="cookName"
                    value={formData.cookName}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                      errors.cookName 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="نام سرآشپز"
                    style={{borderRadius: '8px'}}
                  />
                </div>
                {errors.cookName && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {errors.cookName}
                  </span>
                )}
              </div>

              {/* Main Photo */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصویر اصلی غذا
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
                  onDrop={(e) => handleDrop(e, setIsDragOver, processFiles)}
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
                            onClick={() => handleFileDelete(index)}
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
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصاویر غذا
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
                  onDrop={(e) => handleDrop(e, setIsDragOver2, processFiles2)}
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
                          {isDragOver2 ? "فایل‌ها را رها کنید" : "آپلود تصاویر غذا"}
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
                            onClick={() => handleFileDelete2(index)}
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
              <div className="flex flex-col">
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
                    placeholder="توضیحات کامل درباره غذا، مواد اولیه، و ویژگی‌های خاص..."
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

              {/* Submit button */}
              <div className="pt-6">
                <button
                  className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={addFoodHandle}
                  disabled={btnSpinner}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال اضافه کردن غذا...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineAdd className="w-5 h-5" />
                        <span>افزودن غذا</span>
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

export default AddFood;