import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookAuthStore } from "../stores/authStore";
import axios from "axios";
import TitleCard from "../components/Cards/TitleCard";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { IoPricetagOutline, IoInformationCircleOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiImage, FiDollarSign, FiEdit2 } from "react-icons/fi";
import { CiCircleQuestion } from "react-icons/ci";

function UpdateAds() {
  const { adsId } = useParams();
  const navigate = useNavigate();
  const { isCookAuthenticated } = useCookAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: 0,
    photo: "",
    photos: []
  });

  // File states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);

  // File refs
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions.map((ext) => `.${ext}`).join(",");

  // Error states
  const [errors, setErrors] = useState({});

  // Fetch ad data
  useEffect(() => {
    if (!isCookAuthenticated) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      navigate("/cooks/login");
      return;
    }

    const fetchAd = async () => {
      try {
        const response = await axios.get(`/api/cooks/ads/${adsId}`, {
          withCredentials: true
        });
        setFormData({
          name: response.data.ads.company?.name || "",
          phone: response.data.ads.company?.phone || "",
          address: response.data.ads.company?.address || "",
          title: response.data.ads.title || "",
          description: response.data.ads.description || "",
          price: response.data.ads.price || 0,
          photo: response.data.ads.photo || "",
          photos: response.data.ads.photos || []
        });
      } catch (error) {
        console.error("Error fetching ad:", error);
        toast.error("خطا در دریافت اطلاعات آگهی");
      }
    };

    fetchAd();
  }, [adsId, isCookAuthenticated, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
    processFiles(newFilesArray, setSelectedFiles2, "photos");
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
        setErrors(prev => ({
          ...prev,
          [field]: ""
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
        setErrors(prev => ({
          ...prev,
          [field]: ""
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handlers
  const updateAdsHandle = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setBtnSpinner(true);
      setIsOpen(true);
    }
  };

  const updatePhotoFunction = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrors(prev => ({
        ...prev,
        photo: "* تصویر اصلی باید انتخاب شود"
      }));
      return;
    }

    setBtnSpinner(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("photo", selectedFiles[0]);

      const response = await axios.put(
        `/api/cooks/ads/${adsId}/update-photo`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        photo: response.data.ads.photo
      }));
      setSelectedFiles([]);
      toast.success("تصویر اصلی با موفقیت ویرایش شد");
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("خطا در ویرایش تصویر اصلی");
    } finally {
      setBtnSpinner(false);
    }
  };

  const updatePhotosFunction = async (e) => {
    e.preventDefault();
    if (selectedFiles2.length === 0) {
      setErrors(prev => ({
        ...prev,
        photos: "* حداقل یک تصویر باید انتخاب شود"
      }));
      return;
    }

    setBtnSpinner(true);
    try {
      const formDataToSend = new FormData();
      selectedFiles2.forEach(image => formDataToSend.append("photos", image));

      const response = await axios.put(
        `/api/cooks/ads/${adsId}/update-photos`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setFormData(prev => ({
        ...prev,
        photos: response.data.ads.photos
      }));
      setSelectedFiles2([]);
      toast.success("تصاویر با موفقیت ویرایش شدند");
    } catch (error) {
      console.error("Error updating photos:", error);
      toast.error("خطا در ویرایش تصاویر");
    } finally {
      setBtnSpinner(false);
    }
  };

  const sendUpdateRequest = async () => {
    try {
      await axios.put(
        `/api/cooks/ads/${adsId}/update-ads`,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          title: formData.title,
          description: formData.description,
          price: formData.price
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("آگهی با موفقیت ویرایش شد");
    } catch (error) {
      console.error("Error updating ad:", error);
      toast.error("خطا در ویرایش آگهی");
    } finally {
      setIsOpen(false);
      setBtnSpinner(false);
    }
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
                      <h4 className="font-bold text-gray-700 mb-2">مشتری:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{formData.name || "نام و نام خانوادگی مشتری"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">قیمت:</h4>
                      <p className="text-indigo-600 font-semibold bg-white/50 p-3 rounded-xl">
                        {formData.price ? formData.price.toLocaleString() + " ریال" : "تعیین نشده"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Main Ad"
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-medium">تصویر اصلی</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.photos.length > 0 ? (
                        formData.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Ad ${index + 1}`}
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
                    ویرایش تصویر اصلی آگهی
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
                      <button
                        type="button"
                        onClick={updatePhotoFunction}
                        disabled={btnSpinner}
                        className="w-75 mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-md font-bold disabled:opacity-50 transition-all duration-200"
                      >
                        {btnSpinner ? "در حال آپلود..." : "ویرایش تصویر اصلی"}
                      </button>
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
                    ویرایش تصاویر اضافی آگهی
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
                      <button
                        type="button"
                        onClick={updatePhotosFunction}
                        disabled={btnSpinner}
                        className="w-75 mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-md font-bold disabled:opacity-50 transition-all duration-200"
                      >
                        {btnSpinner ? "در حال آپلود..." : "ویرایش تصاویر اضافی"}
                      </button>
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
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
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
                        className="w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 border-gray-200/80 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                        placeholder="قیمت آگهی"
                        style={{borderRadius: '8px'}}
                      />
                    </div>
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
                          <FiEdit2 className="w-5 h-5" />
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