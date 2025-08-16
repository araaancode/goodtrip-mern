import { useState, useRef } from "react";
import { useOwnerAuthStore } from "../stores/authStore";
import TitleCard from "../components/Cards/TitleCard";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios"

// icons
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineMapPin } from "react-icons/hi2";

function CreateAds() {
  const { token, isOwnerAuthenticated } = useOwnerAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: "",
    photo: "",
    photos: "",
  });

  const [btnSpinner, setBtnSpinner] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "نام و نام خانوادگی مشتری باید وارد شود";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "شماره مشتری باید وارد شود";
      isValid = false;
    } else if (formData.phone.length !== 11) {
      newErrors.phone = "شماره تماس باید 11 رقم باشد";
      isValid = false;
    } else {
      newErrors.phone = "";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "آدرس مشتری باید وارد شود";
      isValid = false;
    } else {
      newErrors.address = "";
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "عنوان آگهی باید وارد شود";
      isValid = false;
    } else {
      newErrors.title = "";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "توضیحات آگهی باید وارد شود";
      isValid = false;
    } else {
      newErrors.description = "";
    }

    // Photo validation
    if (selectedFiles.length === 0) {
      newErrors.photo = "تصویر اصلی آگهی باید وارد شود";
      isValid = false;
    } else {
      newErrors.photo = "";
    }

    // Photos validation
    if (selectedFiles2.length === 0) {
      newErrors.photos = "تصاویر آگهی باید وارد شوند";
      isValid = false;
    } else {
      newErrors.photos = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles, "photo");
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles2, "photos");
  };

  const processFiles = (filesArray, setFiles, field) => {
    const newSelectedFiles = [...(field === "photo" ? selectedFiles : selectedFiles2)];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");

    filesArray.forEach((file) => {
      if (newSelectedFiles.some((f) => f.name === file.name)) {
        toast.error("نام فایل ها باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل های ${acceptedFileExtensions.join(", ")} قابل قبول هستند`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setFiles(newSelectedFiles);
      // Clear photo error when files are selected
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: "",
        });
      }
    }
  };

  const handleFileDelete = (index, setFiles, field) => {
    const updatedFiles = [...(field === "photo" ? selectedFiles : selectedFiles2)];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    // Set error if no files left
    if (updatedFiles.length === 0) {
      setErrors({
        ...errors,
        [field]: field === "photo" 
          ? "تصویر اصلی آگهی باید وارد شود" 
          : "تصاویر آگهی باید وارد شوند",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwnerAuthenticated) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }

    if (!validateForm()) {
      return;
    }

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

      const response = await axios.post(`/api/owners/ads`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });

      // Reset form on success
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
      setErrors({
        name: "",
        phone: "",
        address: "",
        title: "",
        description: "",
        price: "",
        photo: "",
        photos: "",
      });

      toast.success("آگهی با موفقیت اضافه شد");
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error(
        error.response?.data?.message || "خطایی در ایجاد آگهی رخ داد"
      );
    } finally {
      setBtnSpinner(false);
    }
  };

  return (
    <TitleCard title="افزودن آگهی" topMargin="mt-2">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Name field */}
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
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Phone field */}
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
                type="number"
                value={formData.phone}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="شماره مشتری"
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          {/* Title field */}
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
              />
            </div>
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title}</span>
            )}
          </div>

          {/* Price field */}
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
              />
            </div>
            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price}</span>
            )}
          </div>
        </div>

        {/* Main photo upload */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
            تصویر اصلی آگهی
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="app-btn-gray"
              >
                انتخاب تصویر اصلی
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.png,.jpeg"
                onClick={(e) => (e.target.value = null)}
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
                      <span className="text-base mx-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(index, setSelectedFiles, "photo")}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
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
          {errors.photo && (
            <span className="text-red-500 text-sm">{errors.photo}</span>
          )}
        </div>

        {/* Additional photos upload */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-xs sm:text-sm text-gray-600">
            تصاویر آگهی
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef2.current.click()}
                className="app-btn-gray bg-white"
              >
                انتخاب تصاویر آگهی
              </button>
              <input
                type="file"
                ref={fileInputRef2}
                className="hidden"
                onChange={handleFileChange2}
                multiple
                accept=".jpg,.png,.jpeg"
                onClick={(e) => (e.target.value = null)}
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
                      <span className="text-base mx-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(index, setSelectedFiles2, "photos")}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
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
          {errors.photos && (
            <span className="text-red-500 text-sm">{errors.photos}</span>
          )}
        </div>

        {/* Description field */}
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
              rows={4}
            />
          </div>
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </div>

        {/* Address field */}
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
              rows={4}
            />
          </div>
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address}</span>
          )}
        </div>

        {/* Submit button */}
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
      <ToastContainer />
    </TitleCard>
  );
}

export default CreateAds;