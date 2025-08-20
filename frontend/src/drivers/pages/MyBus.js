import { useState, useRef, useEffect } from "react";
import axios from "axios";
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
import { CiCircleQuestion } from "react-icons/ci";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Dialog } from "@headlessui/react";
import { useDriverAuthStore } from "../stores/authStore";

// select options
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

function MyBus() {
  const { driver, isDriverAuthenticated } = useDriverAuthStore();
  
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

  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [adsId, setAdsId] = useState("");

  const [btnSpinner1, setBtnSpinner1] = useState(false);
  const [btnSpinner2, setBtnSpinner2] = useState(false);
  const [btnSpinner3, setBtnSpinner3] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  // photo vars
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  // photos vars
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions2 = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString2 = acceptedFileExtensions2
    .map((ext) => `.${ext}`)
    .join(",");

  // error vars
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");

  const [colorError, setColorError] = useState(false);
  const [colorErrorMsg, setColorErrorMsg] = useState("");

  const [typeError, setTypeError] = useState(false);
  const [typeErrorMsg, setTypeErrorMsg] = useState("");

  const [modelError, setModelError] = useState(false);
  const [modelErrorMsg, setModelErrorMsg] = useState("");

  const [licensePlateError, setLicensePlateError] = useState(false);
  const [licensePlateErrorMsg, setLicensePlateErrorMsg] = useState("");

  const [serviceProviderError, setServiceProviderError] = useState(false);
  const [serviceProviderErrorMsg, setServiceProviderErrorMsg] = useState("");

  const [priceError, setPriceError] = useState(false);
  const [priceErrorMsg, setPriceErrorMsg] = useState("");

  const [seatsError, setSeatsError] = useState(false);
  const [seatsErrorMsg, setSeatsErrorMsg] = useState("");

  const [capacityError, setCapacityError] = useState(false);
  const [capacityErrorMsg, setCapacityErrorMsg] = useState("");

  const [optionsError, setOptionsError] = useState(false);
  const [optionsErrorMsg, setOptionsErrorMsg] = useState("");

  const [heatError, setHeatError] = useState(false);
  const [heatErrorMsg, setHeatErrorMsg] = useState("");

  const [coldnessError, setColdnessError] = useState(false);
  const [coldnessErrorMsg, setColdnessErrorMsg] = useState("");

  const [photoError, setPhotoError] = useState(false);
  const [photoErrorMsg, setPhotoErrorMsg] = useState("");

  const [photosError, setPhotosError] = useState(false);
  const [photosErrorMsg, setPhotosErrorMsg] = useState("");

  const [bus, setBus] = useState(null);

  // Create axios instance with credentials and better error handling
  const apiClient = axios.create({
    withCredentials: true,
    timeout: 10000,
  });

  // Add response interceptor for better error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ECONNABORTED') {
        toast.error("اتصال به سرور زمان‌بر شد. لطفاً دوباره تلاش کنید");
      } else if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.msg || error.response.data?.message || "خطای سرور";
        
        switch (status) {
          case 401:
            toast.error("احراز هویت ناموفق. لطفاً دوباره وارد شوید");
            break;
          case 403:
            toast.error("دسترسی غیرمجاز");
            break;
          case 404:
            toast.error("منبع مورد نظر یافت نشد");
            break;
          case 422:
            toast.error("داده‌های ارسالی نامعتبر هستند");
            break;
          case 500:
            toast.error("خطای سرور داخلی. لطفاً بعداً تلاش کنید");
            break;
          default:
            toast.error(message);
        }
      } else if (error.request) {
        toast.error("اتصال به سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید");
      } else {
        toast.error("خطای غیرمنتظره رخ داد");
      }
      return Promise.reject(error);
    }
  );

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
        toast.error("نام فایل باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
        hasError = true;
      } else if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles(newSelectedFiles);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles2(newFilesArray);
  };

  const processFiles2 = (filesArray) => {
    const newSelectedFiles2 = [...selectedFiles2];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions2.join("|"), "i");
    
    filesArray.forEach((file) => {
      if (newSelectedFiles2.some((f) => f.name === file.name)) {
        toast.error("نام فایل باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${acceptedFileExtensions2.join(", ")} مجاز هستند`);
        hasError = true;
      } else if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
        hasError = true;
      } else {
        newSelectedFiles2.push(file);
      }
    });

    if (!hasError) {
      setSelectedFiles2(newSelectedFiles2);
    }
  };

  const handleCustomButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileDelete2 = (index) => {
    const updatedFiles = [...selectedFiles2];
    updatedFiles.splice(index, 1);
    setSelectedFiles2(updatedFiles);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!name || name.trim() === "") {
      errors.name = "* نام اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!model || !model.value) {
      errors.model = "* مدل اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!color || color.trim() === "") {
      errors.color = "* رنگ اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!type || !type.value) {
      errors.type = "* نوع اتوبوس باید انتخاب شود";
      isValid = false;
    }

    if (!licensePlate || licensePlate.trim() === "") {
      errors.licensePlate = "* پلاک اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!serviceProvider || serviceProvider.trim() === "") {
      errors.serviceProvider = "* نام ارائه دهنده اتوبوس باید وارد شود";
      isValid = false;
    }

    if (!price || price <= 0) {
      errors.price = "* قیمت بلیط باید معتبر باشد";
      isValid = false;
    }

    if (!seats || seats <= 0 || seats > 100) {
      errors.seats = "* تعداد صندلی‌ها باید بین ۱ تا ۱۰۰ باشد";
      isValid = false;
    }

    if (!capacity || capacity <= 0 || capacity > 100) {
      errors.capacity = "* ظرفیت اتوبوس باید بین ۱ تا ۱۰۰ باشد";
      isValid = false;
    }

    if (!options || options.length === 0) {
      errors.options = "* حداقل یک امکان اضافی باید انتخاب شود";
      isValid = false;
    }

    if (!heat || !heat.value) {
      errors.heat = "* سیستم گرمایشی باید انتخاب شود";
      isValid = false;
    }

    if (!coldness || !coldness.value) {
      errors.coldness = "* سیستم سرمایشی باید انتخاب شود";
      isValid = false;
    }

    if (!description || description.trim() === "") {
      errors.description = "* توضیحات اتوبوس باید وارد شود";
      isValid = false;
    }

    // Set error states
    setNameError(!!errors.name);
    setNameErrorMsg(errors.name || "");
    setModelError(!!errors.model);
    setModelErrorMsg(errors.model || "");
    setColorError(!!errors.color);
    setColorErrorMsg(errors.color || "");
    setTypeError(!!errors.type);
    setTypeErrorMsg(errors.type || "");
    setLicensePlateError(!!errors.licensePlate);
    setLicensePlateErrorMsg(errors.licensePlate || "");
    setServiceProviderError(!!errors.serviceProvider);
    setServiceProviderErrorMsg(errors.serviceProvider || "");
    setPriceError(!!errors.price);
    setPriceErrorMsg(errors.price || "");
    setSeatsError(!!errors.seats);
    setSeatsErrorMsg(errors.seats || "");
    setCapacityError(!!errors.capacity);
    setCapacityErrorMsg(errors.capacity || "");
    setOptionsError(!!errors.options);
    setOptionsErrorMsg(errors.options || "");
    setHeatError(!!errors.heat);
    setHeatErrorMsg(errors.heat || "");
    setColdnessError(!!errors.coldness);
    setColdnessErrorMsg(errors.coldness || "");
    setDescriptionError(!!errors.description);
    setDescriptionErrorMsg(errors.description || "");

    return isValid;
  };

  // get bus
  useEffect(() => {
    const fetchDriverBus = async () => {
      try {
        const response = await apiClient.get("/api/drivers/bus");
        const busData = response.data.bus;

        console.log(busData)
        
        setBus(busData);
        setName(busData.name || "");
        setColor(busData.color || "");
        setLicensePlate(busData.licensePlate || "");
        setServiceProvider(busData.serviceProvider || "");
        setPrice(busData.price || 0);
        setSeats(busData.seats || 0);
        setCapacity(busData.capacity || 0);
        setPhoto(busData.photo || null);
        setPhotos(busData.photos || []);
        setDescription(busData.description || "");
        
        // Set select values if they exist
        if (busData.model) {
          const modelOption = modelsList.find(m => m.value === busData.model.toLowerCase().replace(/\s+/g, '-'));
          if (modelOption) setModel(modelOption);
        }
        
        if (busData.type) {
          const typeOption = typesList.find(t => t.value === busData.type.toLowerCase().replace(/\s+/g, '-'));
          if (typeOption) setType(typeOption);
        }
        
        if (busData.heat) {
          const heatOption = heatList.find(h => h.value === busData.heat.toLowerCase().replace(/\s+/g, '-'));
          if (heatOption) setHeat(heatOption);
        }
        
        if (busData.coldness) {
          const coldnessOption = coldnessList.find(c => c.value === busData.coldness.toLowerCase().replace(/\s+/g, '-'));
          if (coldnessOption) setColdness(coldnessOption);
        }
        
        if (busData.options && busData.options.length > 0) {
          const selectedOptions = optionsList[0].options.filter(opt => 
            busData.options.some(busOpt => busOpt.includes(opt.label))
          );
          setOptions(selectedOptions);
        }
      } catch (error) {
        console.error("Error fetching bus data:", error);
        if (error.response?.status === 404) {
          // Bus not found is expected for new drivers
          setBus(null);
        } else if (error.response?.status !== 401) {
          toast.error("خطا در دریافت اطلاعات اتوبوس");
        }
      }
    };

    fetchDriverBus();
  }, []);

  // update bus photo -> bus cover
  const updatePhotoFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setPhotoError(true);
      setPhotoErrorMsg("* تصویر اصلی اتوبوس باید وارد شود");
      return;
    }

    setBtnSpinner2(true);
    setPhotoError(false);

    const formData = new FormData();
    formData.append("photo", selectedFiles[0]);

    try {
      const response = await apiClient.put(`/api/drivers/bus/${bus._id}/update-photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      toast.success("تصویر اصلی با موفقیت ویرایش شد");
      setPhoto(response.data.bus.photo);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error updating photo:", error);
    } finally {
      setBtnSpinner2(false);
    }
  };

  // update bus photos
  const updatePhotosFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles2 || selectedFiles2.length === 0) {
      setPhotosError(true);
      setPhotosErrorMsg("* حداقل یک تصویر باید انتخاب شود");
      return;
    }

    setBtnSpinner3(true);
    setPhotosError(false);

    const formData = new FormData();
    selectedFiles2.forEach((img) => {
      formData.append("photos", img);
    });

    try {
      const response = await apiClient.put(`/api/drivers/bus/${bus._id}/update-photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      toast.success("تصاویر اتوبوس با موفقیت ویرایش شدند");
      setPhotos(response.data.bus.photos);
      setSelectedFiles2([]);
    } catch (error) {
      console.error("Error updating photos:", error);
    } finally {
      setBtnSpinner3(false);
    }
  };

  // update bus handler
  const updateBusHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفاً تمام فیلدهای ضروری را به درستی پر کنید");
      return;
    }

    setBtnSpinner1(true);
    setIsOpen(true);
  };

  const sendUpdateRequest = async () => {
    setIsOpen(false);

    try {
      const newOptions = options.map(opt => opt.label);

      await apiClient.put(
        `/api/drivers/bus/${bus._id}/update-bus`,
        {
          name,
          model: model.label,
          color,
          type: type.label,
          licensePlate,
          serviceProvider,
          price,
          seats,
          capacity,
          options: newOptions,
          heat: heat.label,
          coldness: coldness.label,
          description,
        }
      );

      toast.success("اطلاعات اتوبوس با موفقیت ویرایش شد");
    } catch (error) {
      console.error("Error updating bus:", error);
    } finally {
      setBtnSpinner1(false);
    }
  };

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
              ویرایش اتوبوس
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش اتوبوس اطمینان دارید؟
            </Dialog.Description>

            <CiCircleQuestion className="my-2 flex justify-center items-center w-20 h-20 text-blue-900 mx-auto" />

            <div className="flex items-center justify-center">
              <button
                className="mt-4 rounded bg-blue-900 px-8 py-2 mx-2 text-white"
                onClick={sendUpdateRequest}
                disabled={btnSpinner1}
              >
                {btnSpinner1 ? "در حال ارسال..." : "تایید"}
              </button>

              <button
                className="mt-4 rounded bg-gray-300 px-8 py-2 mx-2"
                onClick={() => setIsOpen(false)}
                disabled={btnSpinner1}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {bus ? (
        <div className="flex flex-col gap-6 p-4 rtl text-right w-full">
          {/* Error summary display */}
          {(nameError || modelError || typeError || colorError || licensePlateError || 
           serviceProviderError || priceError || seatsError || capacityError || 
           optionsError || heatError || coldnessError || descriptionError) && (
            <div className="border border-red-300 bg-red-50 rounded-lg p-4 mb-4">
              <h3 className="text-red-800 font-bold mb-2">خطاهای موجود:</h3>
              <ul className="text-red-600 text-sm list-disc pr-5">
                {nameError && <li>{nameErrorMsg}</li>}
                {modelError && <li>{modelErrorMsg}</li>}
                {typeError && <li>{typeErrorMsg}</li>}
                {colorError && <li>{colorErrorMsg}</li>}
                {licensePlateError && <li>{licensePlateErrorMsg}</li>}
                {serviceProviderError && <li>{serviceProviderErrorMsg}</li>}
                {priceError && <li>{priceErrorMsg}</li>}
                {seatsError && <li>{seatsErrorMsg}</li>}
                {capacityError && <li>{capacityErrorMsg}</li>}
                {optionsError && <li>{optionsErrorMsg}</li>}
                {heatError && <li>{heatErrorMsg}</li>}
                {coldnessError && <li>{coldnessErrorMsg}</li>}
                {descriptionError && <li>{descriptionErrorMsg}</li>}
              </ul>
            </div>
          )}

          {/* First Card */}
          <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white">
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex-1 text-right">
                <h2 className="text-lg font-bold">{bus.name}</h2>
                <p className="text-sm text-gray-600 my-2">{bus.description}</p>
                <ul className="list-disc pr-5 mt-2 text-sm text-gray-700">
                  {bus.options && bus.options.map((opt, index) => (
                    <li key={index}>{opt.replace(/,/g, "، ")}</li>
                  ))}
                </ul>
              </div>
              <img
                src={bus.photo}
                alt="Bus"
                className="w-1/3 h-32 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
              {bus.photos && bus.photos.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt="Bus Gallery"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Second Card */}
          <div className="border rounded-2xl shadow-lg p-4 w-full bg-white">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              {/* update bus main photo */}
              <div className="flex flex-col gap-4 p-4">
                {/*  bus photo  */}
                <div className="flex flex-col mb-6">
                  <h4 className="font-bold text-gray-600">
                    ویرایش عکس اصلی اتوبوس
                  </h4>
                  <label
                    htmlFor="photo"
                    className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600 mt-6"
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
                              key={file.name}
                              className="flex justify-between items-center border-b py-2"
                            >
                              <div className="flex items-center">
                                <span className="text-base mx-2">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileDelete(index)}
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
                  {photoError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {photoErrorMsg}
                    </span>
                  )}
                  <div className="mt-6">
                    <img
                      className="rounded-md"
                      src={photo}
                      style={{ width: "50px", height: "50px" }}
                      alt="تصویر اصلی اتوبوس"
                    />
                  </div>
                  <button
                    className="app-btn-blue mt-4"
                    onClick={updatePhotoFunction}
                    disabled={btnSpinner2}
                  >
                    {btnSpinner2 ? (
                      <div className="px-10 py-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <span>ویرایش تصویر اصلی</span>
                    )}
                  </button>
                </div>
              </div>
              <hr className="my-4" />
              {/* update bus photos */}
              <div className="flex flex-col gap-4 p-4">
                {/* bus photos */}
                <div className="flex flex-col mb-6">
                  <h4 className="font-bold text-gray-600">
                    ویرایش تصاویر اتوبوس
                  </h4>

                  <label
                    htmlFor="photo"
                    className="mb-2 text-xs sm:text-sm text-gray-600 mt-4"
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
                        accept={acceptedFileTypesString2}
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
                              key={file.name}
                              className="flex justify-between items-center border-b py-2"
                            >
                              <div className="flex items-center">
                                <span className="text-base mx-2">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileDelete2(index)}
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
                  {photosError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {photosErrorMsg}
                    </span>
                  )}
                  <div className="mt-6 flex justify-start">
                    {photos.map((file, index) => (
                      <img
                        className="rounded-md ml-4"
                        key={index + 1}
                        src={file}
                        style={{ width: "50px", height: "50px" }}
                        alt="تصویر اتوبوس"
                      />
                    ))}
                  </div>

                  <button
                    className="app-btn-blue mt-4"
                    onClick={updatePhotosFunction}
                    disabled={btnSpinner3}
                  >
                    {btnSpinner3 ? (
                      <div className="px-10 py-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <span>ویرایش تصاویر اتوبوس</span>
                    )}
                  </button>
                </div>
              </div>
              <hr className="my-4" />
              {/* update bus */}
              <div className="flex flex-col gap-4 p-4">
                <h2 className="mt-4 font-bold text-gray-600">
                  ویرایش اطلاعات اتوبوس
                </h2>
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
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) {
                          setNameError(false);
                          setNameErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        nameError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="نام اتوبوس"
                    />
                  </div>
                  {nameError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {nameErrorMsg}
                    </span>
                  )}
                </div>

                {/* models */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="models"
                    className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >
                    مدل اتوبوس
                  </label>
                  <small className="my-2 font-sm text-gray-500">
                    مدل انتخاب شده: * {bus.model}
                  </small>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <LuBus className="w-6 h-6 text-gray-400" />
                    </div>
                    <Select
                      value={model}
                      onChange={(e) => {
                        setModel(e);
                        if (modelError) {
                          setModelError(false);
                          setModelErrorMsg("");
                        }
                      }}
                      options={modelsList}
                      placeholder="انتخاب مدل اتوبوس"
                      classNames={`placholder-gray-400 ${modelError ? "border-red-500" : ""}`}
                    />
                  </div>
                  {modelError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {modelErrorMsg}
                    </span>
                  )}
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
                      onChange={(e) => {
                        setColor(e.target.value);
                        if (colorError) {
                          setColorError(false);
                          setColorErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        colorError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="رنگ وسیله"
                    />
                  </div>
                  {colorError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {colorErrorMsg}
                    </span>
                  )}
                </div>

                {/* type */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="type"
                    className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >
                    نوع اتوبوس
                  </label>
                  <small className="my-2 font-sm text-gray-500">
                    نوع اتوبوس انتخاب شده: * {bus.type}
                  </small>

                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <LuBus className="w-6 h-6 text-gray-400" />
                    </div>
                    <Select
                      value={type}
                      onChange={(e) => {
                        setType(e);
                        if (typeError) {
                          setTypeError(false);
                          setTypeErrorMsg("");
                        }
                      }}
                      options={typesList}
                      placeholder="انتخاب نوع اتوبوس"
                      classNames={`placholder-gray-400 ${typeError ? "border-red-500" : ""}`}
                    />
                  </div>
                  {typeError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {typeErrorMsg}
                    </span>
                  )}
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
                      onChange={(e) => {
                        setLicensePlate(e.target.value);
                        if (licensePlateError) {
                          setLicensePlateError(false);
                          setLicensePlateErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        licensePlateError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="پلاک "
                    />
                  </div>
                  {licensePlateError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {licensePlateErrorMsg}
                    </span>
                  )}
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
                      onChange={(e) => {
                        setServiceProvider(e.target.value);
                        if (serviceProviderError) {
                          setServiceProviderError(false);
                          setServiceProviderErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        serviceProviderError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="نام ارائه دهنده سرویس"
                    />
                  </div>
                  {serviceProviderError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {serviceProviderErrorMsg}
                    </span>
                  )}
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
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (priceError) {
                          setPriceError(false);
                          setPriceErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        priceError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder=" قیمت به ازای هر نفر"
                    />
                  </div>
                  {priceError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {priceErrorMsg}
                    </span>
                  )}
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
                      min={1}
                      max={100}
                      onChange={(e) => {
                        setSeats(e.target.value);
                        if (seatsError) {
                          setSeatsError(false);
                          setSeatsErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        seatsError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="تعداد صندلی ها"
                    />
                  </div>
                  {seatsError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {seatsErrorMsg}
                    </span>
                  )}
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
                      min={1}
                      max={100}
                      onChange={(e) => {
                        setCapacity(e.target.value);
                        if (capacityError) {
                          setCapacityError(false);
                          setCapacityErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        capacityError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="ظرفیت اتوبوس "
                    />
                  </div>
                  {capacityError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {capacityErrorMsg}
                    </span>
                  )}
                </div>

                {/* options */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="options"
                    className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                  >
                    امکانات اضافی
                  </label>
                  {bus.options && bus.options.map((opt, index) => (
                    <small key={index} className="my-2 font-sm text-gray-500">
                      امکانات انتخاب شده: * {opt.replace(/,/g, "، ")}
                    </small>
                  ))}
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <SlCalender className="w-6 h-6 text-gray-400" />
                    </div>
                    <Select
                      value={options}
                      onChange={(e) => {
                        setOptions(e);
                        if (optionsError) {
                          setOptionsError(false);
                          setOptionsErrorMsg("");
                        }
                      }}
                      options={optionsList}
                      isMultiple={true}
                      placeholder="انتخاب امکانات اضافی"
                      classNames={`${optionsError ? "border-red-500" : ""}`}
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
                  {optionsError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {optionsErrorMsg}
                    </span>
                  )}
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
                  <small className="my-2 font-sm text-gray-500">
                    سیستم گرمایشی انتخاب شده: * {bus.heat}
                  </small>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <LuBus className="w-6 h-6 text-gray-400" />
                    </div>
                    <Select
                      value={heat}
                      onChange={(e) => {
                        setHeat(e);
                        if (heatError) {
                          setHeatError(false);
                          setHeatErrorMsg("");
                        }
                      }}
                      options={heatList}
                      placeholder="انتخاب سیستم گرمایشی"
                      classNames={`placholder-gray-400 ${heatError ? "border-red-500" : ""}`}
                    />
                  </div>
                  {heatError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {heatErrorMsg}
                    </span>
                  )}
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
                  <small className="my-2 font-sm text-gray-500">
                    سیستم سرمایشی انتخاب شده: * {bus.coldness}
                  </small>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                      <LuBus className="w-6 h-6 text-gray-400" />
                    </div>
                    <Select
                      value={coldness}
                      onChange={(e) => {
                        setColdness(e);
                        if (coldnessError) {
                          setColdnessError(false);
                          setColdnessErrorMsg("");
                        }
                      }}
                      options={coldnessList}
                      placeholder="انتخاب سیستم سرمایشی"
                      classNames={`placholder-gray-400 ${coldnessError ? "border-red-500" : ""}`}
                    />
                  </div>
                  {coldnessError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {coldnessErrorMsg}
                    </span>
                  )}
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
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (descriptionError) {
                          setDescriptionError(false);
                          setDescriptionErrorMsg("");
                        }
                      }}
                      className={`text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border w-full py-2 focus:outline-none ${
                        descriptionError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-800"
                      }`}
                      placeholder="توضیحات "
                      rows={4}
                    ></textarea>
                  </div>
                  {descriptionError && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {descriptionErrorMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 p-4">
              <button className="app-btn-blue" onClick={updateBusHandler} disabled={btnSpinner1}>
                {btnSpinner1 ? (
                  <div className="px-10 py-1 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <span> ثبت اطلاعات اتوبوس </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 p-4 rtl text-right w-full ">
          <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white h-screen flex items-center justify-center">
            <h1 className="text-gray-500">اتوبوس هنوز اضافه نشده است ...</h1>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default MyBus;