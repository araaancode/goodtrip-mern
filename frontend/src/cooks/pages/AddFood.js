import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { toast,ToastContainer } from "react-toastify";
import { useCookAuthStore } from "../stores/authStore";
import axios from "axios";

// Icons
import { IoFastFoodOutline } from "react-icons/io5";
import { GoNumber } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { TbClockHour12 } from "react-icons/tb";
import { PiChefHatLight } from "react-icons/pi";
import { PiBowlFood } from "react-icons/pi";
import { IoPricetagOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "نام غذا الزامی است";
    if (!formData.count) newErrors.count = "تعداد غذا الزامی است";
    if (!formData.price) newErrors.price = "قیمت غذا الزامی است";
    if (!formData.cookDate) newErrors.cookDate = "تاریخ پخت الزامی است";
    if (!formData.cookHour) newErrors.cookHour = "ساعت پخت الزامی است";
    if (!formData.category) newErrors.category = "دسته بندی غذا الزامی است";
    if (!formData.cookName.trim()) newErrors.cookName = "نام سرآشپز الزامی است";
    if (!formData.description.trim()) newErrors.description = "توضیحات الزامی است";
    if (selectedFiles.length === 0) newErrors.photo = "تصویر اصلی الزامی است";
    if (selectedFiles2.length === 0) newErrors.photos = "تصاویر غذا الزامی است";

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

  // File handling functions (same as before)
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

  // Similar functions for photos (selectedFiles2)
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
    <>
      <TitleCard title="افزودن غذا" topMargin="mt-2">
        <div className="grid grid-cols-1 gap-6 items-center">
          {/* Food Name */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              نام غذا
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <IoFastFoodOutline className="w-6 h-6 text-gray-400" />
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام غذا"
              />
            </div>
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>

          {/* Other form fields with similar structure */}
          {/* Food Count */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              تعداد غذاها
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <GoNumber className="w-6 h-6 text-gray-400" />
              </div>
              <input
                name="count"
                type="number"
                min={1}
                value={formData.count}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="تعداد غذاها"
              />
            </div>
            {errors.count && <span className="text-red-500 text-sm">{errors.count}</span>}
          </div>

          {/* Cook Date */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              تاریخ پخت
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <SlCalender className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={formData.cookDate}
                onChange={(value) => handleSelectChange("cookDate", value)}
                options={weekDays}
                isMultiple={true}
                placeholder="انتخاب"
              />
            </div>
            {errors.cookDate && <span className="text-red-500 text-sm">{errors.cookDate}</span>}
          </div>

          {/* Cook Hour */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              ساعت پخت
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <TbClockHour12 className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={formData.cookHour}
                onChange={(value) => handleSelectChange("cookHour", value)}
                options={hourOptions}
                placeholder="انتخاب"
              />
            </div>
            {errors.cookHour && <span className="text-red-500 text-sm">{errors.cookHour}</span>}
          </div>

          {/* Food Category */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              دسته بندی غذا
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <PiBowlFood className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={formData.category}
                onChange={(value) => handleSelectChange("category", value)}
                options={categoryOptions}
                placeholder="انتخاب دسته بندی"
              />
            </div>
            {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
          </div>

          {/* Price */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              قیمت غذا به ازای هر نفر
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
                placeholder="قیمت غذا"
              />
            </div>
            {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
          </div>

          {/* Cook Name */}
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              نام سرآشپز
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <PiChefHatLight className="w-6 h-6 text-gray-400" />
              </div>
              <input
                name="cookName"
                value={formData.cookName}
                onChange={handleInputChange}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام سرآشپز"
              />
            </div>
            {errors.cookName && <span className="text-red-500 text-sm">{errors.cookName}</span>}
          </div>

          {/* Main Photo */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
              تصویر اصلی غذا
            </label>
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
                  onClick={(e) => e.target.value = null}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles.length > 0 ? (
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => handleFileDelete(index)}
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
            {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>}
          </div>

          {/* Additional Photos */}
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
              تصاویر غذا
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  className="app-btn-gray"
                  onClick={() => fileInputRef2.current.click()}
                >
                  انتخاب تصاویر
                </button>
                <input
                  type="file"
                  ref={fileInputRef2}
                  multiple
                  className="hidden"
                  onChange={handleFileChange2}
                  onClick={(e) => e.target.value = null}
                />
              </div>
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles2.length > 0 ? (
                  <ul>
                    {selectedFiles2.map((file, index) => (
                      <li key={file.name} className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => handleFileDelete2(index)}
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
            {errors.photos && <span className="text-red-500 text-sm">{errors.photos}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col mb-2">
            <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
              توضیحات
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
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
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button className="app-btn-blue" onClick={addFoodHandle} disabled={btnSpinner}>
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>اضافه کردن غذا</span>
              )}
            </button>
          </div>
        </div>
      </TitleCard>
      <ToastContainer />
    </>
  );
}

export default AddFood;