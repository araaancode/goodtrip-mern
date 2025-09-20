import { useEffect, useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from '../features/common/headerSlice'
import { useDispatch } from "react-redux";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";

import { IoColorPaletteOutline } from "react-icons/io5";
import { LuBus } from "react-icons/lu";
import { BsCardHeading } from "react-icons/bs";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { TfiMoney } from "react-icons/tfi";
import { LiaBusSolid } from "react-icons/lia";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDriverAuthStore } from "../stores/authStore";

const typesList = [
  { value: "scania", label: "اسکانیا" },
  { value: "volvo", label: "ولوو" },
  { value: "man", label: "مان" },
  { value: "mercedes-benz", label: "مرسدس بنز" },
  { value: "irankhodro_dissel", label: "ایران خودرو دیزل" },
  { value: "Hyundai", label: "هیوندا" },
  { value: "Akea", label: "آکیا" },
  { value: "other", label: "سایر" },
];

const modelsList = [
  { value: "benz-0457", label: "بنز O457" },
  { value: "benz-0500", label: "بنز O500" },
  { value: "benz-travego", label: "بنز Travego" },
  { value: "sortme", label: "سورتمه" },
  { value: "scania-maral", label: "اسکانیا مارال" },
  { value: "scania-dorsa", label: "اسکانیا درسا" },
  { value: "scania-parsa", label: "اسکانیا پارسا" },
  { value: "volvo-b12", label: "ولوو B12" },
  { value: "volvo-b9r", label: "ولوو B9R" },
  { value: "shahab-man-r07", label: "شهاب مان R07" },
  { value: "shahab-man-r08", label: "شهاب مان R08" },
  { value: "akea-302", label: "آکیا 302" },
  { value: "akea-new", label: "آکیا جدید شهری و بین‌شهری" },
  { value: "other", label: "سایر" },
];

const heatList = [
  { value: "water-heater", label: "بخاری آبگرم" },
  { value: "electric-heater", label: "بخاری برقی" },
  { value: "gas-heater", label: "بخاری گازی" },
  { value: "diesel-heater", label: "بخاری دیزلی" },
  { value: "HVAC-system", label: "سیستم گرمایشی مبتنی بر تهویه مطبوع" },
  { value: "auxiliary-heater", label: "بخاری مستقل" },
  { value: "no-heater", label: "ندارد" },
  { value: "other", label: "سایر" },
];

const coldnessList = [
  { value: "air-conditioning", label: "سیستم تهویه مطبوع" },
  { value: "bus-chiller", label: "چیلر اتوبوس" },
  { value: "roof-mounted-air-conditioner", label: "کولر گازی سقفی" },
  { value: "ventilation-fan", label: "پنکه یا فن تهویه" },
  { value: "vent-windows", label: "پنجره‌های تهویه‌ای" },
  { value: "evaporative-cooling-system", label: "سیستم سرمایشی مبتنی بر آب" },
  { value: "auxiliary-air-conditioner", label: "کولر گازی کمکی" },
  { value: "no-heater", label: "ندارد" },
  { value: "other", label: "سایر" },
];

const optionsList = [
  {
    label: "امکانات اضافی",
    options: [
      { value: "window-curtains", label: " پرده‌های پنجره" },
      { value: "audio-video-system", label: "سیستم صوتی و تصویری" },
      { value: "wifi", label: "وای‌فای" },
      { value: "power-outlet-USB", label: "پریز برق یا پورت USB" },
      { value: "mini-fridge", label: " یخچال کوچک" },
      { value: "reception", label: "پذیرایی" },
      { value: "seat-belts", label: "کمربند ایمنی برای هر صندلی" },
      { value: "CCTV", label: "دوربین مداربسته" },
      {
        value: "fire-extinguisher-emergency-hammer",
        label: "کپسول آتش‌نشانی و چکش اضطراری",
      },
      {
        value: "GPS-driver-monitoring-system",
        label: "GPS و سیستم مانیتورینگ راننده",
      },
      { value: "other", label: "سایر" },
    ],
  },
];

function AddBus() {
  const dispatch = useDispatch();
  const { isDriverAuthenticated } = useDriverAuthStore();
  
  // // Check authentication status
  // useEffect(() => {
  //   if (!isDriverAuthenticated) {
  //     toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
  //   }
  // }, [isDriverAuthenticated]);

  useEffect(() => {
    dispatch(setPageTitle({ title: "ثبت اطلاعات اتوبوس" }));
  }, []);

  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const [price, setPrice] = useState(0);
  const [seats, setSeats] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [options, setOptions] = useState(null);
  const [heat, setHeat] = useState("");
  const [coldness, setColdness] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const [btnSpinner, setBtnSpinner] = useState(false);

  // Error state - consolidated into a single object
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    color: "",
    type: "",
    model: "",
    licensePlate: "",
    serviceProvider: "",
    price: "",
    seats: "",
    capacity: "",
    options: "",
    heat: "",
    coldness: "",
    photo: "",
    photos: ""
  });

  // File input refs
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "* نام اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!model || !model.value) {
      newErrors.model = "* مدل اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!color.trim()) {
      newErrors.color = "* رنگ اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!type || !type.value) {
      newErrors.type = "* نوع اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!licensePlate.trim()) {
      newErrors.licensePlate = "* پلاک اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!serviceProvider.trim()) {
      newErrors.serviceProvider = "* نام ارائه دهنده اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!price || price <= 0) {
      newErrors.price = "* قیمت بلیط اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!seats || seats <= 0) {
      newErrors.seats = "* تعداد صندلی های اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!capacity || capacity <= 0) {
      newErrors.capacity = "* ظرفیت اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!options || options.length === 0) {
      newErrors.options = "* امکانات اضافی اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!heat || !heat.value) {
      newErrors.heat = "* سیستم سرمایشی اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!coldness || !coldness.value) {
      newErrors.coldness = "* سیستم گرمایشی اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (selectedFiles.length === 0) {
      newErrors.photo = "* تصویر اصلی اتوبوس باید وارد شود";
      isValid = false;
    }

    if (selectedFiles2.length === 0) {
      newErrors.photos = "* تصاویر اتوبوس باید وارد شوند";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "* توضیحات اتوبوس باید وارد شود";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // File handling functions
  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles);
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles2);
  };

  const processFiles = (filesArray, setFilesFunction) => {
    const newSelectedFiles = [];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    
    filesArray.forEach((file) => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError && newSelectedFiles.length > 0) {
      setFilesFunction(prev => [...prev, ...newSelectedFiles]);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCustomButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileDelete = (index, setFilesFunction) => {
    setFilesFunction(prev => prev.filter((_, i) => i !== index));
  };

  const addBusHandler = async (e) => {
    e.preventDefault();
    
    // if (!isDriverAuthenticated) {
    //   toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
    //   return;
    // }

    if (!validateForm()) {
      return;
    }

    setBtnSpinner(true);

    try {
      const optionsArr = options.map(option => option.label);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("color", color);
      formData.append("type", type.label);
      formData.append("model", model.label);
      formData.append("licensePlate", licensePlate);
      formData.append("serviceProvider", serviceProvider);
      formData.append("seats", seats);
      formData.append("capacity", capacity);
      formData.append("price", price);
      formData.append("options", JSON.stringify(optionsArr));
      formData.append("heat", heat.label);
      formData.append("coldness", coldness.label);
      formData.append("photo", selectedFiles[0]);
      
      selectedFiles2.forEach((image) => {
        formData.append("photos", image);
      });

      const response = await axios.post("/api/drivers/bus", formData, {
        withCredentials: true
      });

      // Reset form on success
      setName("");
      setDescription("");
      setColor("");
      setType("");
      setModel("");
      setLicensePlate("");
      setServiceProvider("");
      setPrice(0);
      setSeats(0);
      setCapacity(0);
      setOptions(null);
      setHeat(null);
      setColdness(null);
      setSelectedFiles([]);
      setSelectedFiles2([]);
      setErrors({});

      toast.success("اتوبوس با موفقیت اضافه شد", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error adding bus:", error);
      const errorMessage = error.response?.data?.msg || "خطایی در اضافه کردن اتوبوس رخ داد";
      toast.error(errorMessage, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setBtnSpinner(false);
    }
  };

  // if (!isDriverAuthenticated) {
  //   return (
  //     <TitleCard title="ثبت اطلاعات اتوبوس" topMargin="mt-2">
  //       <div className="text-center py-10">
  //         <p className="text-red-500 text-lg">لطفا ابتدا وارد حساب کاربری خود شوید</p>
  //       </div>
  //     </TitleCard>
  //   );
  // }

  return (
    <>
      <TitleCard title="ثبت اطلاعات اتوبوس" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* name */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="name"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نام اتوبوس
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LuBus className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام اتوبوس"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.name}
            </span>
          </div>

          {/* models */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="models"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              مدل اتوبوس
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LuBus className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={model}
                onChange={(e) => setModel(e)}
                options={modelsList}
                placeholder="انتخاب مدل اتوبوس"
                classNames={`placholder-gray-400`}
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.model}
            </span>
          </div>

          {/* color */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="color"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              رنگ وسیله
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <IoColorPaletteOutline className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="رنگ وسیله"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.color}
            </span>
          </div>

          {/* type */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="type"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نوع اتوبوس
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LuBus className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={type}
                onChange={(e) => setType(e)}
                options={typesList}
                placeholder="انتخاب نوع اتوبوس"
                classNames={`placholder-gray-400`}
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.type}
            </span>
          </div>

          {/* pelak -> licensePlate */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="licensePlate"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              پلاک{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <BsCardHeading className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="پلاک "
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.licensePlate}
            </span>
          </div>

          {/* service name provider */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="serviceProvider"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نام ارائه دهنده سرویس
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LiaBusSolid className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام ارائه دهنده سرویس"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.serviceProvider}
            </span>
          </div>

          {/* price */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="price"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              {" "}
              قیمت به ازای هر نفر
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <TfiMoney className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder=" قیمت به ازای هر نفر"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.price}
            </span>
          </div>

          {/* seats */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="seats"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              تعداد صندلی ها
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <MdOutlineReduceCapacity className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="number"
                value={seats}
                min={0}
                max={50}
                onChange={(e) => setSeats(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="تعداد صندلی ها"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.seats}
            </span>
          </div>

          {/* capacity */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="capacity"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              ظرفیت اتوبوس{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <MdOutlineReduceCapacity className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="number"
                value={capacity}
                min={0}
                max={50}
                onChange={(e) => setCapacity(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="ظرفیت اتوبوس "
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.capacity}
            </span>
          </div>

          {/* options */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="options"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              امکانات اضافی
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <SlCalender className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={options}
                onChange={(e) => setOptions(e)}
                options={optionsList}
                isMultiple={true}
                placeholder="انتخاب امکانات اضافی"
                formatGroupLabel={(data) => (
                  <div
                    className={`py-2 text-xs flex items-center justify-between`}
                  >
                    <span className="font-bold">{data.label}</span>
                    <span className="bg-gray-200 h-5 h-5 p-1.5 flex items-center justify-center rounded-full">
                      {data.options.length}
                    </span>
                  </div>
                )}
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.options}
            </span>
          </div>

          {/* heat */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="heat"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              {" "}
              سیستم گرمایشی
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LuBus className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={heat}
                onChange={(e) => setHeat(e)}
                options={heatList}
                placeholder="انتخاب سیستم گرمایشی"
                classNames={`placholder-gray-400`}
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.heat}
            </span>
          </div>

          {/* coldness */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="coldness"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              {" "}
              سیستم سرمایشی
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <LuBus className="w-6 h-6 text-gray-400" />
              </div>
              <Select
                value={coldness}
                onChange={(e) => setColdness(e)}
                options={coldnessList}
                placeholder="انتخاب سیستم سرمایشی"
                classNames={`placholder-gray-400`}
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.coldness}
            </span>
          </div>

          {/*  bus photo  */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="photo"
              className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              تصویر اصلی اتوبوس{" "}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
              <div className="flex items-center">
                <button
                  className="app-btn-gray"
                  onClick={handleCustomButtonClick}
                >
                  انتخاب تصویر اصلی
                </button>

                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept={acceptedFileTypesString}
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
              </div>

              <div className="rounded-3xl py-4 max-h-[23rem] overflow-auto">
                {selectedFiles.length > 0 ? (
                  <ul className="px-4">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div className="flex items-center">
                          <span className="text-base mx-2">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, setSelectedFiles)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-6 h-6"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M6 4l8 8M14 4l-8 8"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <p className="text-center text-gray-500 text-sm">
                      هنوز تصویری آپلود نشده است...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <span className="text-red-500 relative text-sm">
              {errors.photo}
            </span>
          </div>

          {/* bus photos */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="photo"
              className="mb-2 text-xs sm:text-sm text-gray-600"
            >
              تصاویر اتوبوس{" "}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleCustomButtonClick2}
                  className="app-btn-gray"
                >
                  انتخاب تصاویر اتوبوس
                </button>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  multiple
                  accept={acceptedFileTypesString}
                  ref={fileInputRef2}
                  className="hidden"
                  onChange={handleFileChange2}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
              </div>

              <div className="rounded-3xl py-4 max-h-[23rem] overflow-auto">
                {selectedFiles2.length > 0 ? (
                  <ul className="px-4">
                    {selectedFiles2.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div className="flex items-center">
                          <span className="text-base mx-2">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index, setSelectedFiles2)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-6 h-6"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M6 4l8 8M14 4l-8 8"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <p className="text-center text-gray-500 text-sm">
                      هنوز تصویری آپلود نشده است...
                    </p>
                  </div>
                )}
              </div>
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.photos}
            </span>
          </div>

          {/*  description */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="description"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              توضیحات{" "}
            </label>
            <div className="relative">
              <div
                className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                style={{ bottom: "52px" }}
              >
                <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                style={{ borderRadius: "5px", resize: "none" }}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="توضیحات "
              ></textarea>
            </div>
            <span className="text-red-500 relative text-sm">
              {errors.description}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button className="app-btn-blue" onClick={addBusHandler} disabled={btnSpinner}>
            {btnSpinner ? (
              <div className="px-10 py-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span> ثبت اطلاعات اتوبوس </span>
            )}
          </button>
        </div>
      </TitleCard>

      <ToastContainer />
    </>
  );
}

export default AddBus;