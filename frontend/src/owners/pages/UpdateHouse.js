import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import "leaflet/dist/leaflet.css";

// Icons
import { PiHouseLight } from "react-icons/pi";
import { TfiUser } from "react-icons/tfi";
import { TbPhone, TbCircleDashedNumber4, TbHomeEdit, TbBed, TbBath } from "react-icons/tb";
import { RxRulerHorizontal } from "react-icons/rx";
import {
  PiHourglassSimpleLow,
  PiImagesLight,
  PiWarehouseLight,
  PiThermometerColdLight,
  PiSolarRoof,
  PiSignpostLight,
} from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { LuCircleParking } from "react-icons/lu";
import { RiPriceTagLine, RiPriceTag3Line } from "react-icons/ri";
import { CiCalendar, CiCircleQuestion } from "react-icons/ci";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { LiaConciergeBellSolid } from "react-icons/lia";
import { FiInfo, FiMapPin, FiUpload, FiX, FiFile, FiCheckCircle, FiImage, FiDollarSign, FiEdit2, FiUsers, FiRefreshCw } from "react-icons/fi";
import { BsHouseExclamation } from "react-icons/bs";

// Components
import TitleCard from "../components/Cards/TitleCard";

// Data and utils
import { setPageTitle } from "../features/common/headerSlice";
import provincesData from "../components/provinces_cities.json";
import {
  hobbiesList,
  enviornmentList,
  ownerTypeList,
  weekDays,
  houseTypeList,
  houseOptions,
  coolingList,
  heatingList,
  floorTypeList,
  kitchenOptionList,
  bedRoomOptionList,
} from "../data/houseData";

const markerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/312483/location-indicator-red.svg",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function UpdateHouse() {
  const dispatch = useDispatch();
  
  // Form state
  const [name, setName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [description, setDescription] = useState("");
  const [houseOwner, setHouseOwner] = useState("");
  const [price, setPrice] = useState(0);
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [housePhone, setHousePhone] = useState("");
  const [meters, setMeters] = useState(0);
  const [year, setYear] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [houseRoles, setHouseRoles] = useState([]);
  const [critrias, setCritrias] = useState([]);
  const [houseType, setHouseType] = useState(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [floor, setFloor] = useState(0);
  const [options, setOptions] = useState([]);
  const [heating, setHeating] = useState([]);
  const [cooling, setCooling] = useState([]);
  const [parking, setParking] = useState(0);
  const [bill, setBill] = useState([]);
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [enviornment, setEnviornment] = useState([]);
  const [ownerType, setOwnerType] = useState(null);
  const [rooms, setRooms] = useState(0);
  const [freeDates, setFreeDates] = useState([]);
  const [document, setDocument] = useState([]);
  const [floorType, setFloorType] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [kitchenOptions, setKitchenOptions] = useState([]);
  const [reservationRoles, setReservationRoles] = useState([]);
  const [bedRoomOptions, setBedRoomOptions] = useState([]);
  const [house, setHouse] = useState({});
  const [position, setPosition] = useState([32.4279, 53.688]);
  const [isOpen, setIsOpen] = useState(false);

  // Loading states
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [coverSpinner, setCoverSpinner] = useState(false);
  const [imagesSpinner, setImagesSpinner] = useState(false);
  const [billSpinner, setBillSpinner] = useState(false);
  const [documentSpinner, setDocumentSpinner] = useState(false);
  const [mapSpinner, setMapSpinner] = useState(false);

  // File handling states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver2, setIsDragOver2] = useState(false);
  const [isDragOverBill, setIsDragOverBill] = useState(false);
  const [isDragOverDocument, setIsDragOverDocument] = useState(false);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRefBill = useRef(null);
  const fileInputRefDocument = useRef(null);
  const markerRef = useRef(null);

  const houseId = window.location.href.split("/houses/")[1].split("/update")[0];

  // Error states
  const [errors, setErrors] = useState({});

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "ویرایش ملک" }));
  }, [dispatch]);

  // Load provinces data
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

  // Load house data
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(`/api/owners/houses/${houseId}`, {
          withCredentials: true,
        });

        const houseData = response.data.house;
        setHouse(houseData);
        setName(houseData.name || "");
        setDescription(houseData.description || "");
        setHouseOwner(houseData.houseOwner || "");
        setPrice(houseData.price || 0);
        setCover(houseData.cover || null);
        setImages(houseData.images || []);
        setPostalCode(houseData.postalCode || "");
        setMeters(houseData.meters || 0);
        setYear(houseData.year || 0);
        setCapacity(houseData.capacity || 0);
        setHouseRoles(houseData.houseRoles || []);
        setCritrias(houseData.critrias || []);
        setHouseType(
          houseData.houseType
            ? { label: houseData.houseType, value: houseData.houseType }
            : null
        );
        setFloor(houseData.floor || 0);
        setPosition([houseData.lat || 32.4279, houseData.lng || 53.688]);
        setParking(houseData.parking || 0);
        setBill(houseData.bill || []);
        setHousePhone(houseData.housePhone || "");
        setAddress(houseData.address || "");
        setHouseNumber(houseData.houseNumber || "");
        setOwnerType(
          houseData.ownerType
            ? { label: houseData.ownerType, value: houseData.ownerType }
            : null
        );
        setRooms(houseData.rooms || 0);
        setDocument(houseData.document || []);
        setDiscount(houseData.discount || 0);
        setReservationRoles(houseData.reservationRoles || []);

        if (houseData.hobbies) {
          setHobbies(
            hobbiesList.filter((item) => houseData.hobbies.includes(item.label))
          );
        }
        if (houseData.enviornment) {
          setEnviornment(
            enviornmentList.filter((item) =>
              houseData.enviornment.includes(item.label)
            )
          );
        }
        if (houseData.freeDates) {
          setFreeDates(
            weekDays.filter((item) => houseData.freeDates.includes(item.label))
          );
        }
        if (houseData.options) {
          setOptions(
            houseOptions.filter((item) =>
              houseData.options.includes(item.label)
            )
          );
        }
        if (houseData.cooling) {
          setCooling(
            coolingList.filter((item) => houseData.cooling.includes(item.label))
          );
        }
        if (houseData.heating) {
          setHeating(
            heatingList.filter((item) => houseData.heating.includes(item.label))
          );
        }
        if (houseData.floorType) {
          setFloorType(
            floorTypeList.filter((item) =>
              houseData.floorType.includes(item.label)
            )
          );
        }
        if (houseData.kitchenOptions) {
          setKitchenOptions(
            kitchenOptionList.filter((item) =>
              houseData.kitchenOptions.includes(item.label)
            )
          );
        }
        if (houseData.bedRoomOptions) {
          setBedRoomOptions(
            bedRoomOptionList.filter((item) =>
              houseData.bedRoomOptions.includes(item.label)
            )
          );
        }
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات ملک");
      }
    };

    fetchHouse();
  }, [houseId, dispatch]);

  // Map handlers
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      },
    });
    return null;
  };

  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      setLat(newPos.lat);
      setLng(newPos.lng);
    }
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    const selected = provinces.find((p) => p.value === value.value);
    setCities(selected ? selected.cities : []);
    if (errors.selectedProvince) {
      setErrors(prev => ({ ...prev, selectedProvince: "" }));
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    if (errors.selectedCity) {
      setErrors(prev => ({ ...prev, selectedCity: "" }));
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
  const processFiles = (filesArray, setFiles, field, allowedExtensions) => {
    const newSelectedFiles = [];
    let hasError = false;
    const fileTypeRegex = new RegExp(allowedExtensions.join("|"), "i");
    
    filesArray.forEach((file) => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل‌های ${allowedExtensions.join(", ")} قابل قبول هستند`);
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

  const handleFileChange = (event, setFiles, field, allowedExtensions) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setFiles, field, allowedExtensions);
  };

  const handleFileDelete = (index, files, setFiles) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Input change handlers
  const handleInputChange = (e, setter, field) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "* نام ملک الزامی است";
    if (!selectedProvince) newErrors.selectedProvince = "* استان الزامی است";
    if (!selectedCity) newErrors.selectedCity = "* شهر الزامی است";
    if (!houseOwner.trim()) newErrors.houseOwner = "* نام صاحب ملک الزامی است";
    if (!housePhone.trim()) newErrors.housePhone = "* تلفن ملک الزامی است";
    if (!meters) newErrors.meters = "* متراژ الزامی است";
    if (!year) newErrors.year = "* سال ساخت الزامی است";
    if (!capacity) newErrors.capacity = "* ظرفیت الزامی است";
    if (!postalCode.trim()) newErrors.postalCode = "* کدپستی الزامی است";
    if (!hobbies || hobbies.length === 0) newErrors.hobbies = "* امکانات تفریحی الزامی است";
    if (!enviornment || enviornment.length === 0) newErrors.enviornment = "* محیط ملک الزامی است";
    if (!ownerType) newErrors.ownerType = "* نوع مالکیت الزامی است";
    if (!freeDates || freeDates.length === 0) newErrors.freeDates = "* روزهای آزاد الزامی است";
    if (!houseType) newErrors.houseType = "* نوع ملک الزامی است";
    if (!rooms) newErrors.rooms = "* تعداد اتاق الزامی است";
    if (!floor) newErrors.floor = "* تعداد طبقه الزامی است";
    if (!options || options.length === 0) newErrors.options = "* امکانات ملک الزامی است";
    if (!cooling || cooling.length === 0) newErrors.cooling = "* سیستم سرمایش الزامی است";
    if (!heating || heating.length === 0) newErrors.heating = "* سیستم گرمایش الزامی است";
    if (!parking) newErrors.parking = "* تعداد پارکینگ الزامی است";
    if (!price) newErrors.price = "* اجاره بها الزامی است";
    if (!houseNumber.trim()) newErrors.houseNumber = "* پلاک ملک الزامی است";
    if (!floorType || floorType.length === 0) newErrors.floorType = "* نوع کف پوش الزامی است";
    if (!discount) newErrors.discount = "* تخفیف الزامی است";
    if (!kitchenOptions || kitchenOptions.length === 0) newErrors.kitchenOptions = "* امکانات آشپزخانه الزامی است";
    if (!bedRoomOptions || bedRoomOptions.length === 0) newErrors.bedRoomOptions = "* امکانات اتاق خواب الزامی است";
    if (!reservationRoles.trim()) newErrors.reservationRoles = "* قوانین رزرو الزامی است";
    if (!houseRoles.trim()) newErrors.houseRoles = "* ضوابط ملک الزامی است";
    if (!critrias.trim()) newErrors.critrias = "* محدودیت‌ها الزامی است";
    if (!description.trim()) newErrors.description = "* توضیحات الزامی است";
    if (!address.trim()) newErrors.address = "* آدرس الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handlers
  const updateHouseHandle = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setBtnSpinner(true);
      setIsOpen(true);
    }
  };

  const sendUpdateRequest = () => {
    setIsOpen(false);
    setBtnSpinner(true);

    axios
      .put(
        `/api/owners/houses/${houseId}/update-house`,
        {
          name,
          province: selectedProvince?.label || "",
          city: selectedCity?.label || "",
          description,
          price,
          postalCode,
          housePhone,
          meters,
          year,
          capacity,
          houseRoles,
          critrias,
          houseType: houseType?.label || "",
          floor,
          options: options.map((item) => item.label),
          heating: heating.map((item) => item.label),
          cooling: cooling.map((item) => item.label),
          parking,
          address,
          houseNumber,
          houseOwner,
          hobbies: hobbies.map((item) => item.label),
          enviornment: enviornment.map((item) => item.label),
          ownerType: ownerType?.label || "",
          rooms,
          discount,
          reservationRoles,
          freeDates: freeDates.map((item) => item.label),
          floorType: floorType.map((item) => item.label),
          kitchenOptions: kitchenOptions.map((item) => item.label),
          bedRoomOptions: bedRoomOptions.map((item) => item.label),
          lat: position[0],
          lng: position[1],
        },
        { withCredentials: true }
      )
      .then((response) => {
        toast.success("ملک با موفقیت ویرایش شد");
        setHouse(response.data.house);
      })
      .catch((error) => {
        toast.error("خطا در ویرایش ملک");
      })
      .finally(() => {
        setBtnSpinner(false);
      });
  };

  const UpdateHouseCover = async (e) => {
    e.preventDefault();
    setCoverSpinner(true);

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrors(prev => ({ ...prev, coverFile: "* تصویر اصلی ملک باید انتخاب شود" }));
      setCoverSpinner(false);
      return;
    }

    const formData = new FormData();
    formData.append("cover", selectedFiles[0]);

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-cover`,
        formData,
        { withCredentials: true }
      );
      setCover(response.data.house.cover);
      setSelectedFiles([]);
      toast.success("تصویر اصلی با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش تصویر اصلی");
    } finally {
      setCoverSpinner(false);
    }
  };

  const UpdateHouseImages = async (e) => {
    e.preventDefault();
    setImagesSpinner(true);

    if (!selectedFiles2 || selectedFiles2.length === 0) {
      setErrors(prev => ({ ...prev, imagesFiles: "* حداقل یک تصویر باید انتخاب شود" }));
      setImagesSpinner(false);
      return;
    }

    const formData = new FormData();
    selectedFiles2.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-images`,
        formData,
        { withCredentials: true }
      );
      setImages(response.data.house.images);
      setSelectedFiles2([]);
      toast.success("تصاویر با موفقیت ویرایش شدند");
    } catch (error) {
      toast.error("خطا در ویرایش تصاویر");
    } finally {
      setImagesSpinner(false);
    }
  };

  const UpdateHouseBill = async (e) => {
    e.preventDefault();
    setBillSpinner(true);

    if (!selectedFilesBill || selectedFilesBill.length === 0) {
      setErrors(prev => ({ ...prev, billFiles: "* حداقل یک قبض باید انتخاب شود" }));
      setBillSpinner(false);
      return;
    }

    const formData = new FormData();
    selectedFilesBill.forEach((file) => formData.append("bill", file));

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-bill`,
        formData,
        { withCredentials: true }
      );
      setBill(response.data.house.bill);
      setSelectedFilesBill([]);
      toast.success("قبوض با موفقیت ویرایش شدند");
    } catch (error) {
      toast.error("خطا در ویرایش قبوض");
    } finally {
      setBillSpinner(false);
    }
  };

  const UpdateHouseDocument = async (e) => {
    e.preventDefault();
    setDocumentSpinner(true);

    if (!selectedFilesDocument || selectedFilesDocument.length === 0) {
      setErrors(prev => ({ ...prev, documentFiles: "* حداقل یک مدرک باید انتخاب شود" }));
      setDocumentSpinner(false);
      return;
    }

    const formData = new FormData();
    selectedFilesDocument.forEach((file) => formData.append("document", file));

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-document`,
        formData,
        { withCredentials: true }
      );
      setDocument(response.data.house.document);
      setSelectedFilesDocument([]);
      toast.success("مدارک با موفقیت ویرایش شدند");
    } catch (error) {
      toast.error("خطا در ویرایش مدارک");
    } finally {
      setDocumentSpinner(false);
    }
  };

  const UpdateHouseMap = async () => {
    setMapSpinner(true);

    try {
      await axios.put(
        `/api/owners/houses/${houseId}/update-map`,
        {
          lat: position[0],
          lng: position[1],
        },
        { withCredentials: true }
      );
      toast.success("نقشه ملک با موفقیت ویرایش شد");
    } catch (error) {
      toast.error("خطا در ویرایش نقشه");
    } finally {
      setMapSpinner(false);
    }
  };

  // File upload sections component
  const FileUploadSection = ({ 
    title, 
    field, 
    selectedFiles, 
    setSelectedFiles, 
    isDragOver, 
    setIsDragOver, 
    fileInputRef, 
    handleFileChange, 
    handleFileDelete, 
    updateFunction, 
    spinner, 
    acceptedExtensions,
    existingFiles,
    multiple = false
  }) => (
    <div className="flex flex-col">
      <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
        <FiImage className="ml-2 text-blue-500" />
        {title}
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
          processFiles(files, setSelectedFiles, field, acceptedExtensions)
        )}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isDragOver 
            ? "from-blue-50 to-indigo-50" 
            : errors[field] 
              ? "from-red-50 to-red-50" 
              : "from-gray-50 to-blue-50/30"
        } backdrop-blur-sm`} />
        
        <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
          isDragOver 
            ? "border-blue-400 shadow-inner" 
            : errors[field] 
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
                {isDragOver ? "فایل را رها کنید" : `آپلود ${title}`}
              </p>
              <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                فرمت‌های مجاز: {acceptedExtensions.join(", ")}
              </p>
            </div>
          </div>
        </div>
        <input
          type="file"
          multiple={multiple}
          accept={acceptedExtensions.map(ext => `.${ext}`).join(",")}
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileChange(e, setSelectedFiles, field, acceptedExtensions)}
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
              <span>آپلود {title}</span>
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
                  onClick={() => handleFileDelete(index, selectedFiles, setSelectedFiles)}
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
      {existingFiles && existingFiles.length > 0 && (
        <div className="mt-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-200/50">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
            <FiCheckCircle className="text-blue-500 w-4 h-4" />
            <span className="text-sm font-semibold text-gray-700">
              فایل‌های موجود
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {existingFiles.map((file, index) => (
              <img
                key={index}
                src={file}
                alt={`House ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      {errors[field] && (
        <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
          <FiX className="ml-1 w-4 h-4" />
          {errors[field]}
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
              ویرایش ملک
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 text-center mb-6">
              آیا از ویرایش ملک اطمینان دارید؟
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
                <span>ویرایش ملک</span>
              </div>
            } 
            topMargin="mt-0"
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                  ویرایش ملک
                </h2>
                <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                  اطلاعات ملک را ویرایش کنید و تغییرات را ذخیره نمایید
                </p>
              </div>

              {/* Current House Preview */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 mb-8 border border-blue-100/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiEdit2 className="ml-2 text-blue-500" />
                  پیش نمایش ملک فعلی
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">نام ملک:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{name || "نام ملک"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">صاحب ملک:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">{houseOwner || "نام صاحب ملک"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">قیمت:</h4>
                      <p className="text-indigo-600 font-semibold bg-white/50 p-3 rounded-xl">
                        {price ? price.toLocaleString() + " ریال" : "تعیین نشده"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">متراژ:</h4>
                      <p className="text-gray-600 bg-white/50 p-3 rounded-xl">
                        {meters ? meters + " متر مربع" : "تعیین نشده"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {cover ? (
                      <img
                        src={cover}
                        alt="House Photo"
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 font-medium">تصویر اصلی</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {images.length > 0 ? (
                        images.map((file, index) => (
                          <img
                            key={index}
                            src={file}
                            alt={`House ${index + 1}`}
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
                {/* File Upload Sections */}
                <FileUploadSection
                  title="تصویر اصلی ملک"
                  field="coverFile"
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  isDragOver={isDragOver}
                  setIsDragOver={setIsDragOver}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleFileDelete={handleFileDelete}
                  updateFunction={UpdateHouseCover}
                  spinner={coverSpinner}
                  acceptedExtensions={["jpg", "png", "jpeg"]}
                  existingFiles={cover ? [cover] : []}
                />

                <FileUploadSection
                  title="تصاویر اضافی ملک"
                  field="imagesFiles"
                  selectedFiles={selectedFiles2}
                  setSelectedFiles={setSelectedFiles2}
                  isDragOver={isDragOver2}
                  setIsDragOver={setIsDragOver2}
                  fileInputRef={fileInputRef2}
                  handleFileChange={handleFileChange}
                  handleFileDelete={handleFileDelete}
                  updateFunction={UpdateHouseImages}
                  spinner={imagesSpinner}
                  acceptedExtensions={["jpg", "png", "jpeg"]}
                  existingFiles={images}
                  multiple={true}
                />

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* House Name */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <PiHouseLight className="ml-2 text-blue-500" />
                      نام ملک
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <PiHouseLight className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        value={name}
                        onChange={(e) => handleInputChange(e, setName, "name")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.name 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="نام ملک"
                      />
                    </div>
                    {errors.name && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.name}
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
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiMapPin className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        options={provinces}
                        classNames={{
                          menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                            errors.selectedProvince 
                              ? "border-red-300 bg-red-50/50" 
                              : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                          }`
                        }}
                        isSearchable
                        searchInputPlaceholder="جستجو استان"
                      />
                    </div>
                    {errors.selectedProvince && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.selectedProvince}
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
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiMapPin className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <Select
                        value={selectedCity}
                        onChange={handleCityChange}
                        options={cities}
                        classNames={{
                          menuButton: () => `w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 ${
                            errors.selectedCity 
                              ? "border-red-300 bg-red-50/50" 
                              : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                          }`
                        }}
                        isDisabled={!selectedProvince}
                        isSearchable
                        searchInputPlaceholder="جستجو شهر"
                      />
                    </div>
                    {errors.selectedCity && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.selectedCity}
                      </span>
                    )}
                  </div>

                  {/* House Owner */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <TfiUser className="ml-2 text-blue-500" />
                      نام صاحب ملک
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <TfiUser className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        value={houseOwner}
                        onChange={(e) => handleInputChange(e, setHouseOwner, "houseOwner")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.houseOwner 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="نام صاحب ملک"
                      />
                    </div>
                    {errors.houseOwner && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.houseOwner}
                      </span>
                    )}
                  </div>

                  {/* Add more fields following the same pattern... */}

                  {/* Price */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <RiPriceTagLine className="ml-2 text-blue-500" />
                      اجاره بها
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
                        value={price}
                        onChange={(e) => handleInputChange(e, setPrice, "price")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.price 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="اجاره بها"
                      />
                    </div>
                    {errors.price && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.price}
                      </span>
                    )}
                  </div>

                  {/* Meters */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <RxRulerHorizontal className="ml-2 text-blue-500" />
                      متراژ
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <RxRulerHorizontal className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="number"
                        value={meters}
                        onChange={(e) => handleInputChange(e, setMeters, "meters")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.meters 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="متراژ"
                      />
                    </div>
                    {errors.meters && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.meters}
                      </span>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <FaUsers className="ml-2 text-blue-500" />
                      ظرفیت
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <FiUsers className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="number"
                        value={capacity}
                        onChange={(e) => handleInputChange(e, setCapacity, "capacity")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.capacity 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="ظرفیت"
                      />
                    </div>
                    {errors.capacity && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.capacity}
                      </span>
                    )}
                  </div>

                  {/* Rooms */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <TbBed className="ml-2 text-blue-500" />
                      تعداد اتاق
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="p-2">
                          <TbBed className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <input
                        type="number"
                        value={rooms}
                        onChange={(e) => handleInputChange(e, setRooms, "rooms")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 backdrop-blur-sm ${
                          errors.rooms 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="تعداد اتاق"
                      />
                    </div>
                    {errors.rooms && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.rooms}
                      </span>
                    )}
                  </div>
                </div>

                {/* Text Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Description */}
                  <div className="flex flex-col">
                    <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                      <FiInfo className="ml-2 text-blue-500" />
                      توضیحات
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 z-10">
                        <div className="p-2">
                          <FiInfo className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => handleInputChange(e, setDescription, "description")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                          errors.description 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="توضیحات کامل درباره ملک..."
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
                        onChange={(e) => handleInputChange(e, setAddress, "address")}
                        className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                          errors.address 
                            ? "border-red-300 bg-red-50/50" 
                            : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                        }`}
                        placeholder="آدرس کامل ملک..."
                      />
                    </div>
                    {errors.address && (
                      <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                        <FiX className="ml-1 w-4 h-4" />
                        {errors.address}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional File Upload Sections */}
                <FileUploadSection
                  title="قبوض ملک"
                  field="billFiles"
                  selectedFiles={selectedFilesBill}
                  setSelectedFiles={setSelectedFilesBill}
                  isDragOver={isDragOverBill}
                  setIsDragOver={setIsDragOverBill}
                  fileInputRef={fileInputRefBill}
                  handleFileChange={handleFileChange}
                  handleFileDelete={handleFileDelete}
                  updateFunction={UpdateHouseBill}
                  spinner={billSpinner}
                  acceptedExtensions={["jpg", "png", "jpeg", "pdf", "txt", "docx"]}
                  existingFiles={bill}
                  multiple={true}
                />

                <FileUploadSection
                  title="مدارک ملک"
                  field="documentFiles"
                  selectedFiles={selectedFilesDocument}
                  setSelectedFiles={setSelectedFilesDocument}
                  isDragOver={isDragOverDocument}
                  setIsDragOver={setIsDragOverDocument}
                  fileInputRef={fileInputRefDocument}
                  handleFileChange={handleFileChange}
                  handleFileDelete={handleFileDelete}
                  updateFunction={UpdateHouseDocument}
                  spinner={documentSpinner}
                  acceptedExtensions={["jpg", "png", "jpeg", "pdf", "txt", "docx"]}
                  existingFiles={document}
                  multiple={true}
                />

                {/* Map Section */}
                <div className="flex flex-col">
                  <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                    <FiMapPin className="ml-2 text-blue-500" />
                    موقعیت مکانی روی نقشه
                  </label>
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-200/80 focus:border-blue-500 transition-all duration-300">
                    <MapContainer
                      center={position}
                      zoom={5}
                      style={{ height: "400px", width: "100%" }}
                      className="rounded-2xl"
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
                  <button
                    type="button"
                    onClick={UpdateHouseMap}
                    disabled={mapSpinner}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 rtl:space-x-reverse w-40"
                  >
                    {mapSpinner ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <FiRefreshCw className="w-5 h-5" />
                    )}
                    <span>بروزرسانی نقشه</span>
                  </button>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button
                    className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    onClick={updateHouseHandle}
                    disabled={btnSpinner}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                      {btnSpinner ? (
                        <>
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          <span>در حال ویرایش ملک...</span>
                        </>
                      ) : (
                        <>
                          <span>ویرایش ملک</span>
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

export default UpdateHouse;