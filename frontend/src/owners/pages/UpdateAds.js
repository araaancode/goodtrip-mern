import { useState, useRef, useEffect, useMemo } from "react";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@headlessui/react";

// Icons
import { IoPricetagOutline, IoInformationCircleOutline } from "react-icons/io5";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage, FiDollarSign, FiEdit2, FiRefreshCw } from "react-icons/fi";

function UpdateAds() {
  const { isOwnerAuthenticated } = useOwnerAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: 0,
  });
  
  const [media, setMedia] = useState({
    photo: null,
    photos: [],
  });
  
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [photoSpinner, setPhotoSpinner] = useState(false);
  const [photosSpinner, setPhotosSpinner] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  const adsId = useMemo(() => {
    return window.location.href.split("/advertisments/")[1].split("/update")[0];
  }, []);

  // File handling variables
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");
  const fallbackImage = "https://via.placeholder.com/150?text=بدون+تصویر";

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (!isOwnerAuthenticated) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    const fetchAdData = async () => {
      try {
        const response = await axios.get(`/api/owners/ads/${adsId}`, {
          withCredentials: true,
        });
        const { company, ...adData } = response.data.ads;
        
        setFormData({
          name: company.name,
          phone: company.phone,
          address: company.address,
          title: adData.title,
          description: adData.description,
          price: adData.price,
        });
        
        setMedia({
          photo: adData.photo,
          photos: adData.photos || [],
        });
        
      } catch (error) {
        toast.error(error.response?.data?.message || "خطا در بارگذاری آگهی");
      }
    };

    fetchAdData();
  }, [adsId, isOwnerAuthenticated]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "* نام مشتری الزامی است";
    if (!formData.phone.trim()) newErrors.phone = "* شماره تلفن الزامی است";
    if (!formData.address.trim()) newErrors.address = "* آدرس الزامی است";
    if (!formData.title.trim()) newErrors.title = "* عنوان آگهی الزامی است";
    if (!formData.description.trim()) newErrors.description = "* توضیحات الزامی است";
    if (!formData.price) newErrors.price = "* قیمت الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateAdsHandle = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setBtnSpinner(true);
      setIsOpen(true);
    }
  };

  const sendUpdateRequest = async () => {
    setIsOpen(false);
    setBtnSpinner(true);

    try {
      await axios.put(
        `/api/owners/ads/${adsId}/update-ads`,
        formData,
        { withCredentials: true }
      );
      toast.success("آگهی با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error(error.response?.data?.message || "خطا در به‌روزرسانی آگهی");
    } finally {
      setBtnSpinner(false);
    }
  };

  const updatePhotoFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrors(prev => ({ ...prev, photo: "* تصویر اصلی آگهی باید انتخاب شود" }));
      return;
    }

    setPhotoSpinner(true);
    const formData = new FormData();
    formData.append("photo", selectedFiles[0]);

    try {
      const response = await axios.put(
        `/api/owners/ads/${adsId}/update-photo`,
        formData,
        { withCredentials: true }
      );
      
      setMedia(prev => ({
        ...prev,
        photo: response.data.ads.photo,
      }));
      
      setSelectedFiles([]);
      toast.success("تصویر اصلی با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش تصویر اصلی");
    } finally {
      setPhotoSpinner(false);
    }
  };

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
        `/api/owners/ads/${adsId}/update-photos`,
        formData,
        { withCredentials: true }
      );
      
      setMedia(prev => ({
        ...prev,
        photos: response.data.ads.photos,
      }));
      
      setSelectedFiles2([]);
      toast.success("تصاویر با موفقیت ویرایش شدند");
    } catch (error) {
      toast.error("خطا در ویرایش تصاویر");
    } finally {
      setPhotosSpinner(false);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const img = new Image();
    img.src = url;
    return img.complete || img.width + img.height > 0;
  };

  // File Upload Section Component
  const FileUploadSection = ({ 
    type, 
    label, 
    selectedFiles, 
    setSelectedFiles, 
    isDragOver, 
    setIsDragOver, 
    fileInputRef, 
    handleFileChange, 
    handleFileDelete, 
    updateFunction, 
    spinner,
    existingFiles
  }) => (
    <div className="flex flex-col">
      <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
        <FiImage className="ml-2 text-blue-500" />
        {label}
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
        onDrop={(e) => handleDrop(e, setIsDragOver, (files) => 
          type === 'photo' 
            ? processFiles(files, setSelectedFiles, "photo")
            : processFiles2(files, setSelectedFiles, "photos")
        )}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isDragOver 
            ? "from-blue-50 to-indigo-50" 
            : errors[type] 
              ? "from-red-50 to-red-50" 
              : "from-gray-50 to-blue-50/30"
        } backdrop-blur-sm`} />
        
        <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          isDragOver 
            ? "border-blue-400 shadow-inner" 
            : errors[type] 
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
                {isDragOver ? "فایل را رها کنید" : `آپلود ${label}`}
              </p>
              <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
              </p>
            </div>
          </div>
        </div>
        <input
          type="file"
          multiple={type === 'photos'}
          accept={acceptedFileTypesString}
          ref={fileInputRef}
          className="hidden"
          onChange={type === 'photo' ? handleFileChange : handleFileChange2}
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
                فایل‌های انتخاب شده ({selectedFiles.length})
              </span>
            </div>
            <button
              type="button"
              onClick={updateFunction}
              disabled={spinner}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse"
            >
              {spinner ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <FiRefreshCw className="w-4 h-4" />
              )}
              <span>آپلود {label}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
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

      {/* Existing Files Preview */}
      {existingFiles && (
        <div className="mt-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-200/50">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
            <FiCheckCircle className="text-blue-500 w-4 h-4" />
            <span className="text-sm font-semibold text-gray-700">
              فایل‌های موجود
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {type === 'photo' ? (
              media.photo && isValidImageUrl(media.photo) ? (
                <img
                  src={media.photo}
                  alt="تصویر اصلی آگهی"
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">بدون تصویر</span>
                </div>
              )
            ) : (
              media.photos.length > 0 ? (
                media.photos.map((file, index) => (
                  isValidImageUrl(file) && (
                    <img
                      key={index}
                      src={file}
                      alt={`تصویر آگهی ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                  )
                ))
              ) : (
                <p className="text-gray-500 text-sm">هیچ تصویر اضافی وجود ندارد</p>
              )
            )}
          </div>
        </div>
      )}

      {errors[type] && (
        <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
          <FiX className="ml-1 w-4 h-4" />
          {errors[type]}
        </span>
      )}
    </div>
  );

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
              ویرایش آگهی
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 text-center mb-6">
              آیا از ویرایش آگهی اطمینان دارید؟
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
                <span>ویرایش آگهی</span>
              </div>
            } 
            topMargin="mt-0"
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                  ویرایش آگهی
                </h2>
                <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  اطلاعات آگهی را ویرایش کنید و تغییرات را ذخیره نمایید
                </p>
              </div>

              {/* Current Ad Preview */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 mb-8 border border-blue-100/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiEdit2 className="ml-2 text-blue-500" />
                  پیش نمایش آگهی فعلی
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">عنوان آگهی:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{formData.title || "عنوان آگهی"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">نام مشتری:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{formData.name || "نام مشتری"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">قیمت:</h4>
                      <p className="text-indigo-600 font-semibold bg-white/50 p-3 rounded-xl">
                        {formData.price ? formData.price.toLocaleString() + " تومان" : "تعیین نشده"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">تلفن:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {formData.phone || "تعیین نشده"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {media.photo && isValidImageUrl(media.photo) ? (
                      <img
                        src={media.photo}
                        alt="Ad Photo"
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-medium">تصویر اصلی</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {media.photos.length > 0 ? (
                        media.photos.map((file, index) => (
                          isValidImageUrl(file) && (
                            <img
                              key={index}
                              src={file}
                              alt={`Ad ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              onError={(e) => (e.target.src = fallbackImage)}
                            />
                          )
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
                <FileUploadSection
                  type="photo"
                  label="تصویر اصلی آگهی"
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  isDragOver={isDragOver}
                  setIsDragOver={setIsDragOver}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleFileDelete={handleFileDelete}
                  updateFunction={updatePhotoFunction}
                  spinner={photoSpinner}
                  existingFiles={media.photo}
                />

                {/* Update Additional Photos */}
                <FileUploadSection
                  type="photos"
                  label="تصاویر اضافی آگهی"
                  selectedFiles={selectedFiles2}
                  setSelectedFiles={setSelectedFiles2}
                  isDragOver={isDragOver2}
                  setIsDragOver={setIsDragOver2}
                  fileInputRef={fileInputRef2}
                  handleFileChange={handleFileChange2}
                  handleFileDelete={handleFileDelete2}
                  updateFunction={updatePhotosFunction}
                  spinner={photosSpinner}
                  existingFiles={media.photos}
                />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Customer Name */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <CiUser className="ml-2 text-blue-500" />
                      نام مشتری
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <CiUser className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.name 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="نام مشتری"
                      />
                    </div>
                    {errors.name && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <BsTelephone className="ml-2 text-blue-500" />
                      شماره تلفن
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <BsTelephone className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`w-full pl-14 pr-4 py-4 text-base text-right rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.phone 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="شماره تلفن"
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
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.title 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="عنوان آگهی"
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
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.price 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="قیمت"
                      />
                    </div>
                    {errors.price && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.price}
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
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                        errors.description 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="توضیحات کامل درباره آگهی..."
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
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[120px] resize-none backdrop-blur-sm ${
                        errors.address 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="آدرس دقیق..."
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
                    onClick={updateAdsHandle}
                    disabled={btnSpinner}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {btnSpinner ? (
                        <>
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          <span>در حال ویرایش آگهی...</span>
                        </>
                      ) : (
                        <>
                          <span>ویرایش آگهی</span>
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

export default UpdateAds;