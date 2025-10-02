import { useState, useRef, useEffect } from "react";
import { useCookAuthStore } from '../stores/authStore'; 
import TitleCard from "../components/Cards/TitleCard";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@headlessui/react";

// Icons
import { IoPricetagOutline, IoInformationCircleOutline } from "react-icons/io5";
import { CiUser, CiCircleQuestion } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText, TbClockHour12 } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage, FiDollarSign, FiEdit2, FiUsers, FiCalendar, FiClock, FiRefreshCw } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoNumber } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { PiChefHatLight, PiBowlFood } from "react-icons/pi";

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
  { value: "Appetizer", label: "پیش غذا و سوپ" },
  { value: "Main Course", label: "غذای اصلی" },
  { value: "Dessert", label: "دسر و نوشیدنی" },
];

function UpdateFood() {
  const { isCookAuthenticated, cook } = useCookAuthStore();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [cookDate, setCookDate] = useState([]);
  const [fetchCookDate, setFetchCookDate] = useState([]);
  const [cookHour, setCookHour] = useState(null);
  const [fetchCookHour, setFetchCookHour] = useState([]);
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState(null);
  const [fetchCategory, setFetchCategory] = useState(null);
  const [cookName, setCookName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [photoSpinner, setPhotoSpinner] = useState(false);
  const [photosSpinner, setPhotosSpinner] = useState(false);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  let foodId = window.location.href.split("/foods/")[1].split("/update")[0];

  // File handling variables
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");

  // Error states (unified like CreateAds)
  const [errors, setErrors] = useState({});

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

  // File handling for main photo
  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles, "photo");
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
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // File handling for additional photos
  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles2(newFilesArray, setSelectedFiles2, "photos");
  };

  const processFiles2 = (filesArray, setFiles, field) => {
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
      setFiles(newSelectedFiles2);
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    }
  };

  const handleFileDelete2 = (index) => {
    const updatedFiles = [...selectedFiles2];
    updatedFiles.splice(index, 1);
    setSelectedFiles2(updatedFiles);
  };

  // Get single food
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`/api/cooks/foods/${foodId}`, {
          withCredentials: true
        });
        setPhoto(response.data.food.photo);
        setPhotos(response.data.food.photos);
        setName(response.data.food.name);
        setCount(response.data.food.count);
        setPrice(response.data.food.price);
        setDescription(response.data.food.description);
        setCookName(response.data.food.cookName);
        setFetchCookDate(response.data.food.cookDate);
        setFetchCookHour(response.data.food.cookHour);
        setFetchCategory(response.data.food.category);
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات غذا");
      }
    };
    fetchFood();
  }, [foodId]);

  // Handle input changes
  const handleInputChange = (e, setter, field) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "* نام غذا الزامی است";
    if (!count) newErrors.count = "* تعداد غذا الزامی است";
    if (!price) newErrors.price = "* قیمت غذا الزامی است";
    if (!cookDate || cookDate.length === 0) newErrors.cookDate = "* تاریخ پخت غذا الزامی است";
    if (!cookHour) newErrors.cookHour = "* ساعت پخت غذا الزامی است";
    if (!description?.trim()) newErrors.description = "* توضیحات غذا الزامی است";
    if (!category) newErrors.category = "* دسته بندی غذا الزامی است";
    if (!cookName.trim()) newErrors.cookName = "* نام سرآشپز الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update food
  const updateFoodHandle = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setBtnSpinner(true);
      setIsOpen(true);
    }
  };

  // Update food main photo
  const updatePhotoFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrors(prev => ({ ...prev, photo: "* تصویر اصلی غذا باید انتخاب شود" }));
      return;
    }

    setPhotoSpinner(true);
    const formData = new FormData();
    formData.append("photo", selectedFiles[0]);

    try {
      const response = await axios.put(
        `/api/cooks/foods/${foodId}/update-food-photo`,
        formData,
        { withCredentials: true }
      );
      setPhoto(response.data.data.photo);
      setSelectedFiles([]);
      toast.success("تصویر اصلی با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش تصویر اصلی");
    } finally {
      setPhotoSpinner(false);
    }
  };

  // Update food photos
  const updatePhotosFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles2 || selectedFiles2.length === 0) {
      setErrors(prev => ({ ...prev, photos: "* حداقل یک تصویر باید انتخاب شود" }));
      return;
    }

    setPhotosSpinner(true);
    const formData = new FormData();
    selectedFiles2.forEach((img) => formData.append("photos", img));

    try {
      const response = await axios.put(
        `/api/cooks/foods/${foodId}/update-food-photos`,
        formData,
        { withCredentials: true }
      );
      setPhotos(response.data.food.photos);
      setSelectedFiles2([]);
      toast.success("تصاویر با موفقیت ویرایش شدند");
    } catch (error) {
      toast.error("خطا در ویرایش تصاویر");
    } finally {
      setPhotosSpinner(false);
    }
  };

  const givePersianFoodType = (item) => {
    if (item === "Main Course") return "غذا اصلی";
    if (item === "Appetizer") return "پیش غذا و سوپ و سالاد";
    if (item === "Dessert") return "دسر و نوشیدنی";
    return "";
  };

  // Update food
  const sendUpdateRequest = () => {
    setIsOpen(false);
    setBtnSpinner(true);

    axios
      .put(
        `/api/cooks/foods/${foodId}/update-food`,
        {
          name,
          count,
          price,
          cookDate,
          cookHour,
          description,
          category,
          cookName,
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("غذا با موفقیت ویرایش شد");
      })
      .catch((error) => {
        toast.error("خطا در ویرایش غذا");
      })
      .finally(() => {
        setBtnSpinner(false);
      });
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            <Dialog.Title className="text-xl font-bold text-gray-800 text-center mb-2">
              ویرایش غذا
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 text-center mb-6">
              آیا از ویرایش غذا اطمینان دارید؟
            </Dialog.Description>
            <CiCircleQuestion className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <div className="flex items-center justify-center gap-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                onClick={sendUpdateRequest}
              >
                تایید
              </button>
              <button
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="min-h-screen py-1 px-1">
        <div className="w-full mx-auto">
          <TitleCard 
            title={
              <div className="flex space-x-3 rtl:space-x-reverse">
                <span>ویرایش غذا</span>
              </div>
            } 
            topMargin="mt-0"
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                  ویرایش غذا
                </h2>
                <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  اطلاعات غذا را ویرایش کنید و تغییرات را ذخیره نمایید
                </p>
              </div>

              {/* Current Food Preview */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 mb-8 border border-blue-100/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiEdit2 className="ml-2 text-blue-500" />
                  پیش نمایش غذای فعلی
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">نام غذا:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{name || "نام غذا"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">سرآشپز:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{cookName || "نام سرآشپز"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">قیمت:</h4>
                      <p className="text-indigo-600 font-semibold bg-white/50 p-3 rounded-xl">
                        {price ? price.toLocaleString() + " ریال" : "تعیین نشده"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">دسته بندی:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {givePersianFoodType(fetchCategory) || "تعیین نشده"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Food Photo"
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-medium">تصویر اصلی</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {photos.length > 0 ? (
                        photos.map((file, index) => (
                          <img
                            key={index}
                            src={file}
                            alt={`Food ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">هیچ تصویر اضافی وجود ندارد</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <form className="space-y-6 md:space-y-8">
                {/* Update Main Photo */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiImage className="ml-2 text-blue-500" />
                    ویرایش تصویر اصلی غذا
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
                    
                    <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                      isDragOver 
                        ? "border-blue-400 shadow-inner" 
                        : errors.photo 
                          ? "border-red-300" 
                          : "border-gray-300 group-hover:border-blue-400"
                    }`}>
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-2">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isDragOver ? "scale-110 bg-blue-100" : "bg-white/80 shadow-sm"
                        }`}>
                          <FiUpload className={`w-6 h-6 transition-colors ${
                            isDragOver ? "text-blue-600" : "text-gray-400"
                          }`} />
                        </div>
                        <div className="space-y-1">
                          <p className={`text-base font-semibold transition-colors ${
                            isDragOver ? "text-blue-700" : "text-gray-700"
                          }`}>
                            {isDragOver ? "فایل را رها کنید" : "آپلود تصویر اصلی جدید"}
                          </p>
                          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                            فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
                          </p>
                        </div>
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
                    <div className="mt-4 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-4 border border-blue-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <FiCheckCircle className="text-green-500 w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-700">
                            تصویر انتخاب شده
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={updatePhotoFunction}
                          disabled={photoSpinner}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          {photoSpinner ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          ) : (
                            <FiRefreshCw className="w-4 h-4" />
                          )}
                          <span>آپلود تصویر اصلی</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-200/50"
                          >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0">
                              <div className="p-1 bg-blue-50 rounded">
                                <FiFile className="text-blue-500 w-3 h-3" />
                              </div>
                              <span className="text-sm truncate text-gray-700">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDelete(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.photo && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.photo}
                    </span>
                  )}
                </div>

                {/* Update Additional Photos */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiImage className="ml-2 text-blue-500" />
                    ویرایش تصاویر اضافی غذا
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
                    
                    <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                      isDragOver2 
                        ? "border-blue-400 shadow-inner" 
                        : errors.photos 
                          ? "border-red-300" 
                          : "border-gray-300 group-hover:border-blue-400"
                    }`}>
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-2">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isDragOver2 ? "scale-110 bg-blue-100" : "bg-white/80 shadow-sm"
                        }`}>
                          <FiUpload className={`w-6 h-6 transition-colors ${
                            isDragOver2 ? "text-blue-600" : "text-gray-400"
                          }`} />
                        </div>
                        <div className="space-y-1">
                          <p className={`text-base font-semibold transition-colors ${
                            isDragOver2 ? "text-blue-700" : "text-gray-700"
                          }`}>
                            {isDragOver2 ? "فایل‌ها را رها کنید" : "آپلود تصاویر اضافی جدید"}
                          </p>
                          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                            فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
                          </p>
                        </div>
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
                    <div className="mt-4 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-4 border border-blue-100/50 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <FiCheckCircle className="text-green-500 w-4 h-4" />
                          <span className="text-sm font-semibold text-gray-700">
                            تصاویر انتخاب شده ({selectedFiles2.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={updatePhotosFunction}
                          disabled={photosSpinner}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          {photosSpinner ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          ) : (
                            <FiRefreshCw className="w-4 h-4" />
                          )}
                          <span>آپلود تصاویر</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {selectedFiles2.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-200/50"
                          >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0">
                              <div className="p-1 bg-blue-50 rounded">
                                <FiFile className="text-blue-500 w-3 h-3" />
                              </div>
                              <span className="text-sm truncate text-gray-700">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileDelete2(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.photos && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      <FiX className="ml-1 w-4 h-4" />
                      {errors.photos}
                    </span>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                        value={name}
                        onChange={(e) => handleInputChange(e, setName, "name")}
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
                      تعداد غذا
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiUsers className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) => handleInputChange(e, setCount, "count")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.count 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="تعداد غذا"
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
                      <FiCalendar className="ml-2 text-blue-500" />
                      تاریخ پخت
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <small className="my-2 text-sm text-gray-600 bg-blue-50/50 px-3 py-2 rounded-lg">
                      تاریخ پخت انتخاب شده: {String(fetchCookDate).replace(/,/g, "، ")}
                    </small>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiCalendar className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Select
                        value={cookDate}
                        onChange={setCookDate}
                        options={weekDays}
                        isMultiple={true}
                        classNames={{
                          menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                            errors.cookDate 
                              ? "border-red-300 bg-red-50/50" 
                              : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                          }`
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
                      <FiClock className="ml-2 text-blue-500" />
                      ساعت پخت
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <small className="my-2 text-sm text-gray-600 bg-blue-50/50 px-3 py-2 rounded-lg">
                      ساعت پخت انتخاب شده: {fetchCookHour}
                    </small>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiClock className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Select
                        value={cookHour}
                        onChange={setCookHour}
                        options={hourOptions}
                        classNames={{
                          menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                            errors.cookHour 
                              ? "border-red-300 bg-red-50/50" 
                              : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                          }`
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

                  {/* Category */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <PiBowlFood className="ml-2 text-blue-500" />
                      دسته بندی
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <small className="my-2 text-sm text-gray-600 bg-blue-50/50 px-3 py-2 rounded-lg">
                      دسته بندی انتخاب شده: {givePersianFoodType(fetchCategory)}
                    </small>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <PiBowlFood className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Select
                        value={category}
                        onChange={setCategory}
                        options={categoryOptions}
                        classNames={{
                          menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                            errors.category 
                              ? "border-red-300 bg-red-50/50" 
                              : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                          }`
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
                      قیمت
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiDollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => handleInputChange(e, setPrice, "price")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.price 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
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
                        value={cookName}
                        onChange={(e) => handleInputChange(e, setCookName, "cookName")}
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
                      value={description}
                      onChange={(e) => handleInputChange(e, setDescription, "description")}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.description 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="توضیحات کامل درباره غذا..."
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
                    onClick={updateFoodHandle}
                    disabled={btnSpinner}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {btnSpinner ? (
                        <>
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          <span>در حال ویرایش غذا...</span>
                        </>
                      ) : (
                        <>
                          <FiEdit2 className="w-5 h-5" />
                          <span>ویرایش غذا</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </TitleCard>
        </div>
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
    </>
  );
}

export default UpdateFood;