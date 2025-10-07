import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";

import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from "react-icons/fi";
import { IoIosInformationCircleOutline } from "react-icons/io5";
import { RiUser5Line } from "react-icons/ri";
import { LiaIdCardSolid } from "react-icons/lia";
import { CiCircleQuestion } from "react-icons/ci";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import provincesData from "../components/provinces_cities.json";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Dialog } from "@headlessui/react";

const markerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/312483/location-indicator-red.svg",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const genderList = [
  { value: "female", label: "زن" },
  { value: "male", label: "مرد" },
];

function Profile() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [nationalCode, setNationalCode] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [owner, setOwner] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const markerRef = useRef(null);

  // Map handlers
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
    }
  };

  const [btnSpinner, setBtnSpinner] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    province: "",
    city: "",
    nationalCode: "",
    gender: "",
    address: ""
  });

  // Page title
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle({ title: "ویرایش پروفایل" }));
  }, []);

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

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
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // Province and city data
  useEffect(() => {
    const formattedProvinces = provincesData.map((province) => ({
      label: province.name,
      value: province.id,
      cities: province.cities.map((city) => ({
        label: city.name,
        value: city.id,
      })),
    }));
    setProvinces(formattedProvinces);
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
    if (errors.province) setErrors(prev => ({ ...prev, province: "" }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
  };

  // Fetch owner data using withCredentials
  useEffect(() => {
    const fetchCookData = async () => {
      try {
        const response = await axios.get(`/api/owners/me`, {
          withCredentials: true
        });
        
        const ownerData = response.data.owner;
        setOwner(ownerData);
        setName(ownerData.name || "");
        setAddress(ownerData.address || "");
        setNationalCode(ownerData.nationalCode || "");
        setPhone(ownerData.phone || "");
        setEmail(ownerData.email || "");
        setUsername(ownerData.username || "");
        
        if (ownerData.gender) {
          setGender({ 
            value: ownerData.gender, 
            label: ownerData.gender === "female" ? "زن" : "مرد" 
          });
        }
        
        if (ownerData.lat && ownerData.lng) {
          setPosition([ownerData.lat, ownerData.lng]);
        }

        // Set province and city if available
        if (ownerData.province) {
          const province = provinces.find(p => p.label === ownerData.province);
          if (province) {
            setSelectedProvince(province);
            setCities(province.cities || []);
            
            if (ownerData.city) {
              const city = province.cities.find(c => c.label === ownerData.city);
              if (city) {
                setSelectedCity(city);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
        toast.error("خطا در دریافت اطلاعات پروفایل");
      }
    };

    fetchCookData();
  }, [provinces]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "* نام و نام خانوادگی الزامی است";
    if (!phone.trim()) newErrors.phone = "* شماره همراه الزامی است";
    if (!email.trim()) newErrors.email = "* ایمیل الزامی است";
    if (!username.trim()) newErrors.username = "* نام کاربری الزامی است";
    if (!selectedProvince) newErrors.province = "* استان الزامی است";
    if (!selectedCity) newErrors.city = "* شهر الزامی است";
    if (!nationalCode.trim()) newErrors.nationalCode = "* کدملی الزامی است";
    if (!gender) newErrors.gender = "* جنسیت الزامی است";
    if (!address.trim()) newErrors.address = "* آدرس الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfileHandle = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsOpen(true);
  };

  // Send update request using withCredentials
  const sendUpdateRequest = async () => {
    setBtnSpinner(true);

    try {
      await axios.put(
        `/api/owners/update-profile`,
        {
          name,
          phone,
          email,
          username,
          gender: gender.value,
          province: selectedProvince?.label,
          city: selectedCity?.label,
          nationalCode,
          address,
          lat: position[0],
          lng: position[1],
        },
        {
          withCredentials: true
        }
      );

      toast.success("پروفایل با موفقیت ویرایش شد");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.msg || "خطایی وجود دارد. دوباره امتحان کنید!");
    } finally {
      setBtnSpinner(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="min-h-screen py-1 px-1">
      <div className="w-full mx-auto">
        <TitleCard 
          title={
            <div className="flex space-x-3 rtl:space-x-reverse">
              <span>ویرایش پروفایل</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                ویرایش پروفایل
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                اطلاعات پروفایل خود را به روز رسانی کنید تا همیشه اطلاعات شما در سیستم به روز باشد
              </p>
            </div>

            <form className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Name */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiUser className="ml-2 text-blue-500" />
                    نام و نام خانوادگی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.name 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="نام و نام خانوادگی"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.name && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiPhone className="ml-2 text-blue-500" />
                    شماره همراه
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FiPhone className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                      }}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.phone 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="شماره همراه"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.phone && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiMail className="ml-2 text-blue-500" />
                    ایمیل
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FiMail className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.email 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="ایمیل"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.email && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Username */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <RiUser5Line className="ml-2 text-blue-500" />
                    نام کاربری
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <RiUser5Line className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors(prev => ({ ...prev, username: "" }));
                      }}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.username 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="نام کاربری"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.username && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.username}
                    </span>
                  )}
                </div>

                {/* National Code */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <LiaIdCardSolid className="ml-2 text-blue-500" />
                    کدملی
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <LiaIdCardSolid className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <input
                      type="number"
                      value={nationalCode}
                      onChange={(e) => {
                        setNationalCode(e.target.value);
                        if (errors.nationalCode) setErrors(prev => ({ ...prev, nationalCode: "" }));
                      }}
                      className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                        errors.nationalCode 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-100 focus:border-blue-500 bg-white/50"
                      }`}
                      placeholder="کدملی"
                      style={{borderRadius: '8px'}}
                    />
                  </div>
                  {errors.nationalCode && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.nationalCode}
                    </span>
                  )}
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiUser className="ml-2 text-blue-500" />
                    جنسیت
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <Select
                      value={gender}
                      onChange={(value) => {
                        setGender(value);
                        if (errors.gender) setErrors(prev => ({ ...prev, gender: "" }));
                      }}
                      options={genderList}
                      placeholder="انتخاب جنسیت"
                      classNames={{
                        menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                          errors.gender 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`,
                        menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                        option: "px-4 py-3 hover:bg-blue-50"
                      }}
                    />
                  </div>
                  {errors.gender && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.gender}
                    </span>
                  )}
                </div>

                {/* Province */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="ml-2 text-blue-500" />
                    استان
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    options={provinces}
                    placeholder="انتخاب استان"
                    isSearchable
                    searchInputPlaceholder="جستجو استان"
                    classNames={{
                      menuButton: () => `w-full px-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                        errors.province 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                      menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                      option: "px-4 py-3 hover:bg-blue-50"
                    }}
                  />
                  {errors.province && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.province}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="ml-2 text-blue-500" />
                    شهر
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <Select
                    value={selectedCity}
                    onChange={handleCityChange}
                    options={cities}
                    placeholder="انتخاب شهر"
                    isSearchable
                    isDisabled={!selectedProvince}
                    searchInputPlaceholder="جستجو شهر"
                    classNames={{
                      menuButton: () => `w-full px-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                        errors.city 
                          ? "border-red-300 bg-red-50/50" 
                          : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                      }`,
                      menu: "rounded-2xl border-2 border-gray-200/80 shadow-lg",
                      option: "px-4 py-3 hover:bg-blue-50"
                    }}
                  />
                  {errors.city && (
                    <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                      {errors.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiMapPin className="ml-2 text-blue-500" />
                  آدرس
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 z-10">
                    <div className="p-2">
                      <FiMapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                    }}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[100px] resize-none backdrop-blur-sm ${
                      errors.address 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="آدرس کامل"
                    style={{borderRadius: '8px'}}
                  />
                </div>
                {errors.address && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    {errors.address}
                  </span>
                )}
              </div>

              {/* Map */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiMapPin className="ml-2 text-blue-500" />
                  موقعیت روی نقشه
                </label>
                <div className="rounded-2xl border-2 border-gray-200/80 overflow-hidden">
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <Marker
                      draggable={true}
                      eventHandlers={{ dragend: onDragEnd }}
                      position={position}
                      icon={markerIcon}
                      ref={markerRef}
                    />
                    <MapClickHandler />
                  </MapContainer>
                </div>
                <p className="mt-2 text-sm text-gray-600">برای تغییر موقعیت، نشانگر را بکشید یا روی نقشه کلیک کنید</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={updateProfileHandle}
                  disabled={btnSpinner}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال ویرایش پروفایل...</span>
                      </>
                    ) : (
                      <>
                        <span>ذخیره تغییرات</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </TitleCard>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[1000]"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-2xl border border-gray-200/50 bg-white/90 backdrop-blur-sm p-6 shadow-xl z-[1001]">
            <Dialog.Title className="text-lg font-semibold text-gray-800 text-center">
              ویرایش پروفایل
            </Dialog.Title>

            <Dialog.Description className="my-4 text-sm text-gray-600 text-center">
              آیا از ویرایش اطلاعات پروفایل اطمینان دارید؟
            </Dialog.Description>

            <CiCircleQuestion className="my-2 flex justify-center items-center w-16 h-16 text-blue-600 mx-auto" />

            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <button
                className="mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-white font-medium transition-all duration-200 hover:scale-105"
                onClick={sendUpdateRequest}
              >
                تایید
              </button>

              <button
                className="mt-4 rounded-2xl bg-gray-300 px-6 py-2 text-gray-700 font-medium transition-all duration-200 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                لغو
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
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
    </div>
  );
}

export default Profile;