import { useState, useRef, useEffect, useMemo } from "react";
import TitleCard from "../components/Cards/TitleCard";
import "react-tailwindcss-select/dist/index.css";
import Swal from "sweetalert2";
import axios from "axios";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { RiPriceTag3Line } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { CiCircleQuestion } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@headlessui/react";
import { useDriverAuthStore } from "../stores/authStore";

function UpdateAds() {
  const { isDriverAuthenticated } = useDriverAuthStore();

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
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    photo: [],
    photos: [],
  });

  const fileInputRefs = {
    photo: useRef(null),
    photos: useRef(null),
  };

  const acceptedFileTypes = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileTypes
    .map((ext) => `.${ext}`)
    .join(",");
  const fallbackImage = "https://via.placeholder.com/150?text=بدون+تصویر";

  const adsId = useMemo(() => {
    return window.location.href.split("/advertisments/")[1].split("/update")[0];
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (type, event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const updatedFiles = [...selectedFiles[type]];
    let hasError = false;

    files.forEach((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!acceptedFileTypes.includes(extension)) {
        toast.error(`فقط فایل‌های ${acceptedFileTypes.join("، ")} مجاز هستند`);
        hasError = true;
      } else if (updatedFiles.some((f) => f.name === file.name)) {
        toast.error("نام فایل‌ها باید منحصر به فرد باشد");
        hasError = true;
      } else {
        updatedFiles.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles((prev) => ({ ...prev, [type]: updatedFiles }));
    }
  };

  const handleFileDelete = (type, index) => {
    const updatedFiles = [...selectedFiles[type]];
    updatedFiles.splice(index, 1);
    setSelectedFiles((prev) => ({ ...prev, [type]: updatedFiles }));
  };

  useEffect(() => {
    // if (!isDriverAuthenticated) {
    //   toast.error("لطفا ابتدا وارد شوید");
    //   return;
    // }

    const fetchAdData = async () => {
      try {
        const response = await axios.get(`/api/drivers/ads/${adsId}`, {
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
  }, [adsId, isDriverAuthenticated]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "* نام مشتری الزامی است";
    if (!formData.phone) newErrors.phone = "* شماره تلفن الزامی است";
    if (!formData.address) newErrors.address = "* آدرس الزامی است";
    if (!formData.title) newErrors.title = "* عنوان آگهی الزامی است";
    if (!formData.description) newErrors.description = "* توضیحات الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateAdsHandle = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setBtnSpinner(true);
    setIsOpen(true);
  };

  const sendUpdateRequest = async () => {
    setIsOpen(false);
    setBtnSpinner(true);

    try {
      await axios.put(`/api/drivers/ads/${adsId}/update-ads`, formData, {
        withCredentials: true,
      });
      toast.success("آگهی با موفقیت به‌روزرسانی شد");
    } catch (error) {
      toast.error(error.response?.data?.message || "خطا در به‌روزرسانی آگهی");
    } finally {
      setBtnSpinner(false);
    }
  };

  const updateMedia = async (type) => {
    if (!selectedFiles[type].length) {
      setErrors((prev) => ({
        ...prev,
        [type]: `* ${type === "photo" ? "تصویر اصلی" : "تصاویر"} الزامی است`,
      }));
      return;
    }

    setBtnSpinner(true);
    const formData = new FormData();
    selectedFiles[type].forEach((file) => formData.append(type, file));

    try {
      const response = await axios.put(
        `/api/drivers/ads/${adsId}/update-${type}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMedia((prev) => ({
        ...prev,
        [type]: response.data.ads[type],
      }));

      setSelectedFiles((prev) => ({ ...prev, [type]: [] }));
      toast.success(
        `${type === "photo" ? "تصویر اصلی" : "تصاویر"} با موفقیت آپلود شد`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `خطا در آپلود ${type === "photo" ? "تصویر اصلی" : "تصاویر"}`
      );
    } finally {
      setBtnSpinner(false);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const img = new Image();
    img.src = url;
    return img.complete || img.width + img.height > 0;
  };

  const Spinner = () => (
    <div className="px-10 py-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );

  const FileUploadSection = ({ type, label }) => (
    <div className="mx-auto mb-8">
      <h4 className="font-semibold text-lg text-gray-700 mb-4">
        به‌روزرسانی {label}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center">
          <button
            className="app-btn-gray"
            onClick={() => fileInputRefs[type].current.click()}
          >
            انتخاب {label}
          </button>
          <input
            type="file"
            ref={fileInputRefs[type]}
            className="hidden"
            accept={acceptedFileTypesString}
            onChange={(e) => handleFileChange(type, e)}
            onClick={(e) => (e.target.value = null)}
            {...(type === "photos" && { multiple: true })}
          />
        </div>
        <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
          {selectedFiles[type].length > 0 ? (
            <ul>
              {selectedFiles[type].map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleFileDelete(type, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              هنوز فایلی انتخاب نشده است...
            </p>
          )}
        </div>
      </div>
      <div className="my-4 flex flex-wrap gap-2">
        {type === "photo" ? (
          media.photo ? (
            isValidImageUrl(media.photo) ? (
              <img
                src={media.photo}
                alt="تصویر اصلی آگهی"
                className="w-20 h-20 object-cover rounded-md shadow-sm"
                onError={(e) => (e.target.src = fallbackImage)}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500 text-xs">تصویر نامعتبر</p>
              </div>
            )
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500 text-xs">تصویری وجود ندارد</p>
            </div>
          )
        ) : media.photos.length > 0 ? (
          media.photos.map((file, index) => (
            <div key={`photo-${index}`} className="relative">
              {isValidImageUrl(file) ? (
                <img
                  src={file}
                  alt={`تصویر آگهی ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md shadow-sm"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 text-xs">نامعتبر</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full py-4 text-center">
            <p className="text-gray-500">تصویری وجود ندارد</p>
          </div>
        )}
      </div>
      <button className="app-btn-blue mt-4" onClick={() => updateMedia(type)}>
        {btnSpinner ? <Spinner /> : `به‌روزرسانی ${label}`}
      </button>
      {errors[type] && (
        <span className="text-red-500 text-sm mt-2 block">{errors[type]}</span>
      )}
    </div>
  );

  console.log(formData);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              تایید به‌روزرسانی آگهی
            </Dialog.Title>
            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از به‌روزرسانی این آگهی اطمینان دارید؟
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
                انصراف
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="p-4 sm:p-6">
        {/* پیش‌نمایش آگهی */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10 transform transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {formData.title || "—"}
                </h2>
                <p className="text-gray-700 flex items-center gap-2">
                  <CiUser className="w-5 h-5 font-bold" />
                  <span className="font-bold">نام مشتری: </span>
                  {formData.name || "نام مشتری"}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <BsTelephone className="w-5 h-5 font-bold" />
                  <span className="font-bold">تلفن: </span>
                  {formData.phone || "_"}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <RiPriceTag3Line className="w-5 h-5 font-bold" />
                  <span className="font-bold">قیمت: </span>
                  <span className="text-indigo-500 font-bold">
                    {formData.price
                      ? `${formData.price.toLocaleString()} تومان`
                      : "_"}
                  </span>
                </p>
                <p className="text-gray-700 items-center text-justify gap-2">
                  <span className="font-bold">توضیحات: </span>
                  {formData.description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {media.photo && isValidImageUrl(media.photo) ? (
                  <img
                    src={media.photo}
                    alt="تصویر اصلی آگهی"
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                    onError={(e) => (e.target.src = fallbackImage)}
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
            <div className="flex flex-wrap justify-start gap-4">
              {media.photos.length > 0 ? (
                media.photos.map(
                  (file, index) =>
                    isValidImageUrl(file) && (
                      <img
                        key={`additional-${index}`}
                        src={file}
                        alt={`تصویر آگهی ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                    )
                )
              ) : (
                <p className="text-gray-500">
                  تصویر اضافه‌ای بارگذاری نشده است.
                </p>
              )}
            </div>
          </div>
        </div>

        <TitleCard title="به‌روزرسانی آگهی" topMargin="mt-2">
          {/* به‌روزرسانی عکس اصلی */}
          <FileUploadSection type="photo" label="تصویر اصلی" />

          <hr className="my-6 border-gray-200" />

          {/* به‌روزرسانی تصاویر اضافی */}
          <FileUploadSection type="photos" label="تصاویر اضافی" />

          <hr className="my-6 border-gray-200" />

          {/* ویرایش اطلاعات آگهی */}
          <div className="mx-auto">
            <h4 className="font-semibold text-lg text-gray-700 mb-6">
              ویرایش اطلاعات آگهی
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نام مشتری */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm text-gray-600 mb-1">
                  نام مشتری
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام مشتری"
                  />
                </div>
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* تلفن */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-sm text-gray-600 mb-1">
                  شماره تلفن
                </label>
                <div className="relative">
                  <BsTelephone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="number"
                    min={11}
                    max={11}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="شماره تلفن"
                  />
                </div>
                {errors.phone && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* عنوان آگهی */}
              <div className="flex flex-col">
                <label htmlFor="title" className="text-sm text-gray-600 mb-1">
                  عنوان آگهی
                </label>
                <div className="relative">
                  <TbClipboardText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="عنوان آگهی"
                  />
                </div>
                {errors.title && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </span>
                )}
              </div>

              {/* قیمت */}
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm text-gray-600 mb-1">
                  قیمت (تومان)
                </label>
                <div className="relative">
                  <IoPricetagOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="قیمت"
                  />
                </div>
                {errors.price && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.price}
                  </span>
                )}
              </div>
            </div>

            {/* توضیحات */}
            <div className="flex flex-col mt-6">
              <label
                htmlFor="description"
                className="text-sm text-gray-600 mb-1"
              >
                توضیحات
              </label>
              <div className="relative">
                <IoIosInformationCircleOutline className="absolute left-3 top-4 text-gray-400 w-6 h-6" />
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="توضیحات آگهی"
                  rows={4}
                />
              </div>
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description}
                </span>
              )}
            </div>

            {/* آدرس */}
            <div className="flex flex-col mt-6">
              <label htmlFor="address" className="text-sm text-gray-600 mb-1">
                آدرس
              </label>
              <div className="relative">
                <HiOutlineMapPin className="absolute left-3 top-4 text-gray-400 w-6 h-6" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="آدرس دقیق"
                  rows={4}
                />
              </div>
              {errors.address && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.address}
                </span>
              )}
            </div>

            {/* دکمه ارسال */}
            <div className="mt-6">
              <button className="app-btn-blue" onClick={updateAdsHandle}>
                {btnSpinner ? <Spinner /> : "به‌روزرسانی آگهی"}
              </button>
            </div>
          </div>
          <ToastContainer rtl />
        </TitleCard>
      </div>
    </>
  );
}

export default UpdateAds;
