import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import { useCookAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Icons
import { IoPricetagOutline, IoInformationCircleOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage, FiDollarSign, FiCalendar, FiUsers } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";

function CreateAds() {
  const { isCookAuthenticated } = useCookAuthStore();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: 0,
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);

  // File upload refs and states
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

  // File handling functions
  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles, "photo");
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles2(newFilesArray, setSelectedFiles2, "photos");
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

  const processFiles2 = (filesArray, setFiles, field) => {
    const newSelectedFiles = [...selectedFiles2];
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
      setFiles(newSelectedFiles);
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "* نام و نام خانوادگی مشتری الزامی است";
    if (!formData.phone.trim() || formData.phone.length !== 11) newErrors.phone = "* شماره تماس باید 11 رقمی باشد";
    if (!formData.address.trim()) newErrors.address = "* آدرس الزامی است";
    if (!formData.title.trim()) newErrors.title = "* عنوان آگهی الزامی است";
    if (!formData.description.trim()) newErrors.description = "* توضیحات الزامی است";
    if (selectedFiles.length === 0) newErrors.photo = "* تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.photos = "* حداقل یک تصویر اضافی الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCookAuthenticated) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    setBtnSpinner(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("photo", selectedFiles[0]);
      selectedFiles2.forEach((image) => formDataToSend.append("photos", image));

      await axios.post(`/api/cooks/ads`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("آگهی با موفقیت ایجاد شد");
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        address: "",
        title: "",
        description: "",
        price: 0,
      });
      setSelectedFiles([]);
      setSelectedFiles2([]);
      setErrors({});
      
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error(error.response?.data?.message || "خطا در ایجاد آگهی");
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
              <span>ایجاد آگهی جدید</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                ایجاد آگهی جدید
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                اطلاعات آگهی جدید را با دقت وارد کنید تا در پلتفرم ما نمایش داده شود
              </p>
            </div>

            <form className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Customer Name */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <CiUser className="ml-2 text-blue-500" />
                    نام و نام خانوادگی مشتری
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <CiUser className="w-5 h-5 text-blue-600" />
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
                      placeholder="نام و نام خانوادگی مشتری"
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

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <BsTelephone className="ml-2 text-blue-500" />
                    شماره مشتری
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <BsTelephone className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-4 text-right text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.phone 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="شماره مشتری"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.phone && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Ad Title */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <TbClipboardText className="ml-2 text-blue-500" />
                    عنوان آگهی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <TbClipboardText className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.title 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="عنوان آگهی"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.title && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.title}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <IoPricetagOutline className="ml-2 text-blue-500" />
                    قیمت آگهی
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FiDollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 border-gray-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                      placeholder="قیمت آگهی"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                </div>
              </div>

              {/* Main Photo */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  تصویر اصلی آگهی
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
                  تصاویر اضافی آگهی
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
                  onDrop={(e) => handleDrop(e, setIsDragOver2, (files) => processFiles2(files, setSelectedFiles2, "photos"))}
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
                          {isDragOver2 ? "فایل‌ها را رها کنید" : "آپلود تصاویر اضافی"}
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
                    placeholder="توضیحات کامل درباره آگهی..."
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
                  <HiOutlineMapPin className="ml-2 text-blue-500" />
                  آدرس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 z-10">
                    <div className="p-2">
                      <HiOutlineMapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[100px] resize-none backdrop-blur-sm ${
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

              {/* Submit button */}
              <div className="pt-6">
                <button
                  className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={handleSubmit}
                  disabled={btnSpinner}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال ایجاد آگهی...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineAdd className="w-5 h-5" />
                        <span>ایجاد آگهی</span>
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

export default CreateAds;