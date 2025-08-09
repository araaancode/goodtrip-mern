import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookAuthStore } from "../stores/authStore";
import axios from "axios";
import TitleCard from "../components/Cards/TitleCard";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiUser, CiCircleQuestion } from "react-icons/ci";
import { RiPriceTag3Line } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";

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

  // File refs
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  // Error states
  const [errors, setErrors] = useState({
    name: { status: false, message: "" },
    phone: { status: false, message: "" },
    address: { status: false, message: "" },
    title: { status: false, message: "" },
    description: { status: false, message: "" },
    photo: { status: false, message: "" },
    photos: { status: false, message: "" }
  });

  // Fetch ad data
  useEffect(() => {
    // if (!isCookAuthenticated) {
    //   toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید");
    //   navigate("/cooks/login");
    //   return;
    // }

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
  }, [adsId, navigate]);

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
    const newErrors = {
      name: { status: false, message: "" },
      phone: { status: false, message: "" },
      address: { status: false, message: "" },
      title: { status: false, message: "" },
      description: { status: false, message: "" },
      photo: { status: false, message: "" },
      photos: { status: false, message: "" }
    };

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

    setErrors(newErrors);
    return isValid;
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
        photo: { status: true, message: "* تصویر اصلی باید انتخاب شود" }
      }));
      return;
    }

    setBtnSpinner(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFiles[0]);

      const response = await axios.put(
        `/api/cooks/ads/${adsId}/update-photo`,
        formData,
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
        photos: { status: true, message: "* حداقل یک تصویر باید انتخاب شود" }
      }));
      return;
    }

    setBtnSpinner(true);
    try {
      const formData = new FormData();
      selectedFiles2.forEach(image => formData.append("photos", image));

      const response = await axios.put(
        `/api/cooks/ads/${adsId}/update-photos`,
        formData,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]?.status) {
      setErrors(prev => ({
        ...prev,
        [name]: { status: false, message: "" }
      }));
    }
  };


  console.log(isCookAuthenticated)

  return (

    <>
      {/* Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              ویرایش آگهی
            </Dialog.Title>
            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش آگهی اطمینان دارید؟
            </Dialog.Description>
            <CiCircleQuestion className="my-2 flex justify-center items-center w-20 h-20 text-blue-900 mx-auto" />
            <div className="flex items-center justify-center">
              <button
                className="mt-4 rounded bg-blue-900 px-8 py-2 mx-2 text-white"
                onClick={sendUpdateRequest}
              >
                تایید
              </button>
              <button
                className="mt-4 rounded bg-gray-300 px-8 py-2 mx-2"
                onClick={() => setIsOpen(false)}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="p-4 sm:p-6">
        {/* Advertisement Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {formData.title || "عنوان آگهی"}
                </h2>
                <p className="text-gray-700 flex items-center gap-2">
                  <CiUser className="w-5 h-5" />
                  <span className="font-bold">نام مشتری: </span>
                  {formData.name || "نام و نام خانوادگی مشتری"}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <BsTelephone className="w-5 h-5" />
                  <span className="font-bold">تلفن مشتری: </span>
                  {formData.phone || "_"}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <RiPriceTag3Line className="w-5 h-5" />
                  <span className="font-bold">قیمت آگهی: </span>
                  <span className="text-indigo-500 font-bold">
                    {formData.price ? formData.price.toLocaleString() + " ریال" : "_"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">توضیحات آگهی: </span>
                  {formData.description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Main Ad"
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-full h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400 font-medium">
                      تصویر اصلی
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {formData.photos.length > 0 ? (
                formData.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Ad ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md shadow-sm"
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  هیچ تصویر اضافی بارگذاری نشده است.
                </p>
              )}
            </div>
          </div>
        </div>

        <TitleCard title="ویرایش آگهی" topMargin="mt-2">
          {/* Update Main Photo */}
          <div className="mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-4">
              ویرایش عکس اصلی آگهی
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
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
            <button
              className="app-btn-blue mt-4"
              onClick={updatePhotoFunction}
              disabled={btnSpinner}
            >
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>ویرایش تصویر</span>
              )}
            </button>
            {errors.photo?.status && (
              <span className="text-red-500 text-sm mt-2 block">
                {errors.photo.message}
              </span>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Update Additional Photos */}
          <div className="mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-4">
              ویرایش تصاویر آگهی
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  className="app-btn-gray"
                  onClick={() => fileInputRef2.current.click()}
                >
                  انتخاب تصاویر آگهی
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
            <button
              className="app-btn-blue mt-4"
              onClick={updatePhotosFunction}
              disabled={btnSpinner}
            >
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>ویرایش تصاویر</span>
              )}
            </button>
            {errors.photos?.status && (
              <span className="text-red-500 text-sm mt-2 block">
                {errors.photos.message}
              </span>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Update Ad Details */}
          <div>
            <h4 className="font-semibold text-lg text-gray-700 mb-6">
              ویرایش اطلاعات آگهی
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  نام و نام خانوادگی مشتری
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام و نام خانوادگی مشتری"
                  />
                </div>
                {errors.name?.status && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  شماره مشتری
                </label>
                <div className="relative">
                  <BsTelephone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="شماره مشتری"
                  />
                </div>
                {errors.phone?.status && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  عنوان آگهی
                </label>
                <div className="relative">
                  <TbClipboardText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="عنوان آگهی"
                  />
                </div>
                {errors.title?.status && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  قیمت آگهی
                </label>
                <div className="relative">
                  {/* <IoPricetagOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="قیمت آگهی"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col mt-6">
              <label className="text-sm text-gray-600 mb-1">
                توضیحات
              </label>
              <div className="relative">
                <IoIosInformationCircleOutline className="absolute left-3 top-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="توضیحات"
                  rows={4}
                />
              </div>
              {errors.description?.status && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col mt-6">
              <label className="text-sm text-gray-600 mb-1">
                آدرس
              </label>
              <div className="relative">
                <HiOutlineMapPin className="absolute left-3 top-4 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="آدرس"
                  rows={4}
                />
              </div>
              {errors.address?.status && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                className="app-btn-blue"
                onClick={updateAdsHandle}
                disabled={btnSpinner}
              >
                {btnSpinner ? (
                  <div className="px-10 py-1 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <span>ویرایش آگهی</span>
                )}
              </button>
            </div>
          </div>
        </TitleCard>
      </div>
      <ToastContainer rtl position="top-center" />
    </>
  );
}

export default UpdateAds;