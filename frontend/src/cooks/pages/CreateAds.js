import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import { useCookAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Icons
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineMapPin } from "react-icons/hi2";

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
    price: 0
  });

  // Error state initialization
  const initialErrors = {
    name: { status: false, message: "" },
    phone: { status: false, message: "" },
    address: { status: false, message: "" },
    title: { status: false, message: "" },
    description: { status: false, message: "" },
    photo: { status: false, message: "" },
    photos: { status: false, message: "" }
  };

  const [errors, setErrors] = useState(initialErrors);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);

  // File upload refs
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]?.status) {
      setErrors(prev => ({
        ...prev,
        [name]: { status: false, message: "" }
      }));
    }
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
      if (errors[field]?.status) {
        setErrors(prev => ({
          ...prev,
          [field]: { status: false, message: "" }
        }));
      }
    }
  };

  const handleFileDelete = (index, setFiles) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...initialErrors };

    if (!formData.name.trim()) {
      newErrors.name = { 
        status: true, 
        message: "* نام و نام خانوادگی مشتری باید وارد شود" 
      };
      isValid = false;
    }

    if (!formData.phone.trim() || formData.phone.length !== 11) {
      newErrors.phone = { 
        status: true, 
        message: "* شماره تماس باید 11 رقمی باشد" 
      };
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = { 
        status: true, 
        message: "* آدرس باید وارد شود" 
      };
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = { 
        status: true, 
        message: "* عنوان آگهی باید وارد شود" 
      };
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = { 
        status: true, 
        message: "* توضیحات باید وارد شود" 
      };
      isValid = false;
    }

    if (selectedFiles.length === 0) {
      newErrors.photo = { 
        status: true, 
        message: "* تصویر اصلی باید انتخاب شود" 
      };
      isValid = false;
    }

    if (selectedFiles2.length === 0) {
      newErrors.photos = { 
        status: true, 
        message: "* حداقل یک تصویر باید انتخاب شود" 
      };
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
      selectedFiles2.forEach(image => formDataToSend.append("photos", image));

      await axios.post(`/api/cooks/ads`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("آگهی با موفقیت ایجاد شد");
      resetForm();
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error(error.response?.data?.message || "خطا در ایجاد آگهی");
    } finally {
      setBtnSpinner(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      title: "",
      description: "",
      price: 0
    });
    setSelectedFiles([]);
    setSelectedFiles2([]);
    setErrors(initialErrors);
  };

  return (
    <>
      <TitleCard title="افزودن آگهی" topMargin="mt-2">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Name Field */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                نام و نام خانوادگی مشتری
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <CiUser className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="نام و نام خانوادگی مشتری"
                  style={{ borderRadius: "5px" }}
                />
              </div>
              {errors.name?.status && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                شماره مشتری
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <BsTelephone className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="شماره مشتری"
                  style={{ borderRadius: "5px" }}
                />
              </div>
              {errors.phone?.status && (
                <span className="text-red-500 text-sm">{errors.phone.message}</span>
              )}
            </div>

            {/* Title Field */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                عنوان آگهی
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <TbClipboardText className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="عنوان آگهی"
                  style={{ borderRadius: "5px" }}
                />
              </div>
              {errors.title?.status && (
                <span className="text-red-500 text-sm">{errors.title.message}</span>
              )}
            </div>

            {/* Price Field */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                قیمت آگهی
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <IoPricetagOutline className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="قیمت آگهی"
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </div>
          </div>

          {/* Main Photo Upload */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
              تصویر اصلی آگهی
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
                  onChange={handleFileChange}
                  accept=".jpg,.png,.jpeg"
                  onClick={(e) => e.target.value = null}
                />
              </div>

              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles.length > 0 ? (
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, setSelectedFiles)}
                          className="text-red-500 hover:text-red-700"
                        >
                          حذف
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
            {errors.photo?.status && (
              <span className="text-red-500 text-sm">{errors.photo.message}</span>
            )}
          </div>

          {/* Additional Photos Upload */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
              تصاویر اضافی آگهی
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  className="app-btn-gray"
                  onClick={() => fileInputRef2.current.click()}
                >
                  انتخاب تصاویر اضافی
                </button>
                <input
                  type="file"
                  ref={fileInputRef2}
                  className="hidden"
                  onChange={handleFileChange2}
                  accept=".jpg,.png,.jpeg"
                  multiple
                  onClick={(e) => e.target.value = null}
                />
              </div>

              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles2.length > 0 ? (
                  <ul>
                    {selectedFiles2.map((file, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, setSelectedFiles2)}
                          className="text-red-500 hover:text-red-700"
                        >
                          حذف
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
            {errors.photos?.status && (
              <span className="text-red-500 text-sm">{errors.photos.message}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              توضیحات
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400">
                <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="توضیحات"
                style={{ borderRadius: "5px", resize: "none", minHeight: "100px" }}
              />
            </div>
            {errors.description?.status && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

          {/* Address Field */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              آدرس
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400">
                <HiOutlineMapPin className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="آدرس"
                style={{ borderRadius: "5px", resize: "none", minHeight: "100px" }}
              />
            </div>
            {errors.address?.status && (
              <span className="text-red-500 text-sm">{errors.address.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button 
              type="submit" 
              className="app-btn-blue"
              disabled={btnSpinner}
            >
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>اضافه کردن آگهی</span>
              )}
            </button>
          </div>
        </form>
      </TitleCard>
      <ToastContainer rtl position="top-center" />
    </>
  );
}

export default CreateAds;