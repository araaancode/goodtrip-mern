import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import "leaflet/dist/leaflet.css";

// Icons
import { PiHouseLight } from "react-icons/pi";
import { TfiUser } from "react-icons/tfi";
import { TbPhone, TbCircleDashedNumber4, TbHomeEdit } from "react-icons/tb";
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
import { FiInfo, FiMapPin } from "react-icons/fi";
import { BsHouseExclamation } from "react-icons/bs";

// Components
import TitleCard from "../components/Cards/TitleCard";
import InputWithError from "../utils/InputWithError";
import SelectWithError from "../utils/SelectWithError";
import Spinner from "../utils/Spinner";

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
import useFormValidation from "../utils/useFormValidation";
import useLoading from "../utils/useLoading";
import { handleApiError } from "../utils/api";

const markerIcon = new L.Icon({
  iconUrl: "https://www.svgrepo.com/show/312483/location-indicator-red.svg",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function UpdateHouse() {
  const dispatch = useDispatch();
  const { errors, validateField, validateForm, setErrors } =
    useFormValidation();
  const { loading, startLoading, stopLoading } = useLoading({
    info: false,
    cover: false,
    images: false,
    bill: false,
    document: false,
    map: false,
  });

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

  // File refs and state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRefBill = useRef(null);
  const fileInputRefDocument = useRef(null);
  const markerRef = useRef(null);

  const token = localStorage.getItem("userToken");
  const houseId = window.location.href.split("/houses/")[1].split("/update")[0];

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


        console.log(response)

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
        handleApiError(error, toast);
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
    setErrors((prev) => ({
      ...prev,
      selectedProvince: { hasError: false, message: "" },
    }));
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setErrors((prev) => ({
      ...prev,
      selectedCity: { hasError: false, message: "" },
    }));
  };

  // File handling functions
  const handleFileChange = (event, setFiles, allowedExtensions) => {
    const newFilesArray = Array.from(event.target.files);
    const validFiles = newFilesArray.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    if (validFiles.length !== newFilesArray.length) {
      toast.error(`فقط فایل‌های ${allowedExtensions.join(", ")} مجاز هستند`, {
        position: "top-left",
        autoClose: 5000,
      });
    }

    setFiles(validFiles);
  };

  const handleFileDelete = (index, files, setFiles) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Form submission handlers
  const UpdateHouseFunction = async () => {
    startLoading("info");

    const validationResults = validateForm({
      name: {
        value: name,
        validations: [{ type: "required", fieldName: "نام ملک" }],
      },
      selectedProvince: {
        value: selectedProvince,
        validations: [{ type: "required", fieldName: "استان" }],
      },
      selectedCity: {
        value: selectedCity,
        validations: [{ type: "required", fieldName: "شهر" }],
      },
      houseOwner: {
        value: houseOwner,
        validations: [{ type: "required", fieldName: "نام صاحب ملک" }],
      },
      housePhone: {
        value: housePhone,
        validations: [{ type: "required", fieldName: "تلفن ملک" }],
      },
      meters: {
        value: meters,
        validations: [
          { type: "required", fieldName: "متراژ" },
          { type: "number", fieldName: "متراژ" },
        ],
      },
      year: {
        value: year,
        validations: [
          { type: "required", fieldName: "سال ساخت" },
          { type: "number", fieldName: "سال ساخت" },
        ],
      },
      capacity: {
        value: capacity,
        validations: [
          { type: "required", fieldName: "ظرفیت" },
          { type: "number", fieldName: "ظرفیت" },
        ],
      },
      postalCode: {
        value: postalCode,
        validations: [{ type: "required", fieldName: "کدپستی" }],
      },
      hobbies: {
        value: hobbies,
        validations: [{ type: "arrayNotEmpty", fieldName: "امکانات تفریحی" }],
      },
      enviornment: {
        value: enviornment,
        validations: [{ type: "arrayNotEmpty", fieldName: "محیط ملک" }],
      },
      ownerType: {
        value: ownerType,
        validations: [{ type: "required", fieldName: "نوع مالکیت" }],
      },
      freeDates: {
        value: freeDates,
        validations: [{ type: "arrayNotEmpty", fieldName: "روزهای آزاد" }],
      },
      houseType: {
        value: houseType,
        validations: [{ type: "required", fieldName: "نوع ملک" }],
      },
      rooms: {
        value: rooms,
        validations: [
          { type: "required", fieldName: "تعداد اتاق" },
          { type: "number", fieldName: "تعداد اتاق" },
        ],
      },
      floor: {
        value: floor,
        validations: [
          { type: "required", fieldName: "تعداد طبقه" },
          { type: "number", fieldName: "تعداد طبقه" },
        ],
      },
      options: {
        value: options,
        validations: [{ type: "arrayNotEmpty", fieldName: "امکانات ملک" }],
      },
      cooling: {
        value: cooling,
        validations: [{ type: "arrayNotEmpty", fieldName: "سیستم سرمایش" }],
      },
      heating: {
        value: heating,
        validations: [{ type: "arrayNotEmpty", fieldName: "سیستم گرمایش" }],
      },
      parking: {
        value: parking,
        validations: [
          { type: "required", fieldName: "تعداد پارکینگ" },
          { type: "number", fieldName: "تعداد پارکینگ" },
        ],
      },
      price: {
        value: price,
        validations: [
          { type: "required", fieldName: "اجاره بها" },
          { type: "number", fieldName: "اجاره بها" },
        ],
      },
      houseNumber: {
        value: houseNumber,
        validations: [{ type: "required", fieldName: "پلاک ملک" }],
      },
      floorType: {
        value: floorType,
        validations: [{ type: "arrayNotEmpty", fieldName: "نوع کف پوش" }],
      },
      discount: {
        value: discount,
        validations: [
          { type: "required", fieldName: "تخفیف" },
          { type: "number", fieldName: "تخفیف" },
        ],
      },
      kitchenOptions: {
        value: kitchenOptions,
        validations: [{ type: "arrayNotEmpty", fieldName: "امکانات آشپزخانه" }],
      },
      bedRoomOptions: {
        value: bedRoomOptions,
        validations: [
          { type: "arrayNotEmpty", fieldName: "امکانات اتاق خواب" },
        ],
      },
      reservationRoles: {
        value: reservationRoles,
        validations: [{ type: "required", fieldName: "قوانین رزرو" }],
      },
      houseRoles: {
        value: houseRoles,
        validations: [{ type: "required", fieldName: "ضوابط ملک" }],
      },
      critrias: {
        value: critrias,
        validations: [{ type: "required", fieldName: "محدودیت‌ها" }],
      },
      description: {
        value: description,
        validations: [{ type: "required", fieldName: "توضیحات" }],
      },
      address: {
        value: address,
        validations: [{ type: "required", fieldName: "آدرس" }],
      },
    });

    if (!validationResults) {
      stopLoading("info");
      return;
    }

    try {
      const response = await axios.put(
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
      );

      toast.success("ملک با موفقیت ویرایش شد", {
        position: "top-left",
        autoClose: 5000,
      });

      // Update house data with the response
      setHouse(response.data.house);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("info");
    }
  };

  const UpdateHouseCover = async (e) => {
    e.preventDefault();
    startLoading("cover");

    if (
      !validateField("coverFile", selectedFiles[0], [
        {
          type: "file",
          fieldName: "تصویر اصلی",
          allowedExtensions: ["jpg", "png", "jpeg"],
          maxSizeMB: 5,
        },
      ])
    ) {
      stopLoading("cover");
      return;
    }

    const formData = new FormData();
    formData.append("cover", selectedFiles[0]);

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-cover`,
        formData,
        {
          withCredentials: true, // Sends cookies automatically
          headers: {
            "Content-Type": "multipart/form-data", // Kept because it's essential for file uploads
          },
        }
      );

      toast.success("تصویر اصلی با موفقیت ویرایش شد", {
        position: "top-left",
        autoClose: 5000,
      });
      setCover(response.data.house.cover);
      setSelectedFiles([]);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("cover");
    }
  };

  const UpdateHouseImages = async (e) => {
    e.preventDefault();
    startLoading("images");

    if (
      !validateField("imagesFiles", selectedFiles2, [
        {
          type: "arrayNotEmpty",
          fieldName: "تصاویر ملک",
        },
      ])
    ) {
      stopLoading("images");
      return;
    }

    const formData = new FormData();
    selectedFiles2.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-images`,
        formData,
        {
          withCredentials: true, // Enables cookie authentication
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      toast.success("تصاویر ملک با موفقیت ویرایش شدند", {
        position: "top-left",
        autoClose: 5000,
      });
      setImages(response.data.house.images);
      setSelectedFiles2([]);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("images");
    }
  };

  const UpdateHouseBill = async (e) => {
    e.preventDefault();
    startLoading("bill");

    if (
      !validateField("billFiles", selectedFilesBill, [
        {
          type: "arrayNotEmpty",
          fieldName: "قبوض ملک",
        },
      ])
    ) {
      stopLoading("bill");
      return;
    }

    const formData = new FormData();
    selectedFilesBill.forEach((file) => {
      formData.append("bill", file);
    });

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-bill`,
        formData,
        {
          withCredentials: true, // Enables cookie authentication
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      toast.success("قبوض ملک با موفقیت ویرایش شدند", {
        position: "top-left",
        autoClose: 5000,
      });
      setBill(response.data.house.bill);
      setSelectedFilesBill([]);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("bill");
    }
  };

  const UpdateHouseDocument = async (e) => {
    e.preventDefault();
    startLoading("document");

    if (
      !validateField("documentFiles", selectedFilesDocument, [
        {
          type: "arrayNotEmpty",
          fieldName: "مدارک ملک",
        },
      ])
    ) {
      stopLoading("document");
      return;
    }

    const formData = new FormData();
    selectedFilesDocument.forEach((file) => {
      formData.append("document", file);
    });

    try {
      const response = await axios.put(
        `/api/owners/houses/${houseId}/update-document`,
        formData,
        {
          withCredentials: true, // Enables cookie authentication
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      toast.success("مدارک ملک با موفقیت ویرایش شدند", {
        position: "top-left",
        autoClose: 5000,
      });
      setDocument(response.data.house.document);
      setSelectedFilesDocument([]);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("document");
    }
  };

  const UpdateHouseMap = async () => {
    startLoading("map");

    if (
      !validateField("position", position, [
        {
          type: "required",
          fieldName: "موقعیت مکانی",
        },
      ])
    ) {
      stopLoading("map");
      return;
    }
    try {
      await axios.put(
        `/api/owners/houses/${houseId}/update-map`,
        {
          lat: position[0],
          lng: position[1],
        },
        {
          withCredentials: true, // Replaces the token header with cookie auth
        }
      );

      toast.success("نقشه ملک با موفقیت ویرایش شد", {
        position: "top-left",
        autoClose: 5000,
      });
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      stopLoading("map");
    }
  };

  const sendUpdateRequest = () => {
    setIsOpen(false);
    UpdateHouseFunction();
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
              ویرایش ملک
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش ملک اطمینان دارید؟
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
        {/* House Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10 transform transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right justify-start">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {house.name || "ـ"}
                </h2>
                <p className="text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 font-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-bold">نام ملک: </span>
                  {name || "نام ملک"}
                </p>
                <p className="text-gray-700 flex items-center gap-2 ">
                  <svg
                    className="w-5 h-5 font-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="font-bold">تلفن ملک: </span>
                  {housePhone || "_"}
                </p>

                <p className="text-gray-700 flex items-center gap-2 ">
                  <RiPriceTag3Line className="w-5 h-5 font-bold" />
                  <span className="font-bold">قیمت ملک: </span>
                  <span className="text-indigo-500 font-bold">
                    {price || "_"}
                  </span>
                </p>

                <p className="text-gray-700 items-center text-justify gap-2">
                  <span className="font-bold ">توضیحات ملک: </span>
                  {house.description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {cover ? (
                  <img
                    src={cover}
                    alt="Main House"
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
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
              {images.length > 0 ? (
                images.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={`House ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
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

        <TitleCard title="ویرایش اطلاعات ملک " topMargin="mt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white">
              {/* ********************************* update house cover and images ********************************* */}
              {/*  house cover  */}
              <h2 className="mt-6 mb-4 text-xl font-bold">
                ویرایش تصویر اصلی ملک
              </h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cover"
                  className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  تصویر اصلی خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      className="app-btn-gray bg-white"
                      onClick={() => fileInputRef.current.click()}
                    >
                      انتخاب تصویر اصلی
                    </button>

                    <input
                      type="file"
                      id="cover"
                      name="cover"
                      accept=".jpg,.png,.jpeg"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setSelectedFiles, [
                          "jpg",
                          "png",
                          "jpeg",
                        ])
                      }
                      onClick={(event) => {
                        event.target.value = null;
                      }}
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
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleFileDelete(
                                  index,
                                  selectedFiles,
                                  setSelectedFiles
                                )
                              }
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
                      <p className="text-center text-gray-500 text-sm">
                        هنوز تصویری آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>

                {errors.coverFile?.hasError && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.coverFile.message}
                  </span>
                )}
                <div className="mt-6">
                  {cover && (
                    <img
                      className="rounded-md"
                      src={cover}
                      style={{ width: "50px", height: "50px" }}
                      alt="تصویر اصلی ملک"
                    />
                  )}
                </div>
                <button
                  className="app-btn-blue mt-4"
                  onClick={UpdateHouseCover}
                  disabled={loading.cover}
                >
                  {loading.cover ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش تصویر اصلی </span>
                  )}
                </button>
              </div>

              <hr />
              {/* house images */}
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش تصاویر ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="images"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  تصاویر خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef2.current.click()}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب تصاویر خانه
                    </button>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept=".jpg,.png,.jpeg"
                      ref={fileInputRef2}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setSelectedFiles2, [
                          "jpg",
                          "png",
                          "jpeg",
                        ])
                      }
                      onClick={(event) => {
                        event.target.value = null;
                      }}
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
                            <div className="flex items-center">
                              <span className="text-base mx-2">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleFileDelete(
                                  index,
                                  selectedFiles2,
                                  setSelectedFiles2
                                )
                              }
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
                      <p className="text-center text-gray-500 text-sm">
                        هنوز تصویری آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                {errors.imagesFiles?.hasError && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.imagesFiles.message}
                  </span>
                )}
                <div className="mt-6 flex justify-start">
                  {images.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt="تصویر اصلی ملک"
                    />
                  ))}
                </div>
                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseImages}
                  disabled={loading.images}
                >
                  {loading.images ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش تصاویر خانه</span>
                  )}
                </button>
              </div>

              <hr />
              {/* ********************************* update house info ********************************* */}

              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش ملک</h2>
              {/* house name */}
              <InputWithError
                label="نام ملک"
                icon={<PiHouseLight className="w-6 h-6 text-gray-400" />}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() =>
                  validateField("name", name, [
                    { type: "required", fieldName: "نام ملک" },
                  ])
                }
                placeholder="نام ملک"
                error={errors.name}
              />

              {/* province*/}
              <SelectWithError
                label="استان"
                value={selectedProvince}
                onChange={handleProvinceChange}
                options={provinces}
                error={errors.selectedProvince}
                isSearchable
                searchInputPlaceholder="جستجو استان"
              />

              {/* city */}
              <SelectWithError
                label="شهرستان"
                value={selectedCity}
                onChange={handleCityChange}
                options={cities}
                error={errors.selectedCity}
                isDisabled={!selectedProvince}
                isSearchable
                searchInputPlaceholder="جستجو شهرستان"
              />

              {/* house owner name */}
              <InputWithError
                label="نام و نام خانوادگی صاحب ملک"
                icon={<TfiUser className="w-6 h-6 text-gray-400" />}
                type="text"
                value={houseOwner}
                onChange={(e) => setHouseOwner(e.target.value)}
                onBlur={() =>
                  validateField("houseOwner", houseOwner, [
                    { type: "required", fieldName: "نام صاحب ملک" },
                  ])
                }
                placeholder="نام و نام خانوادگی صاحب ملک"
                error={errors.houseOwner}
              />

              {/* house phone */}
              <InputWithError
                label="شماره ثابت ملک"
                icon={<TbPhone className="w-6 h-6 text-gray-400" />}
                type="text"
                value={housePhone}
                onChange={(e) => setHousePhone(e.target.value)}
                onBlur={() =>
                  validateField("housePhone", housePhone, [
                    { type: "required", fieldName: "تلفن ملک" },
                  ])
                }
                placeholder="شماره ثابت ملک"
                error={errors.housePhone}
              />

              {/* house meters */}
              <InputWithError
                label="متراژ ملک"
                icon={<RxRulerHorizontal className="w-6 h-6 text-gray-400" />}
                type="number"
                value={meters}
                onChange={(e) => setMeters(e.target.value)}
                onBlur={() =>
                  validateField("meters", meters, [
                    { type: "required", fieldName: "متراژ" },
                    { type: "number", fieldName: "متراژ" },
                  ])
                }
                placeholder="متراژ ملک"
                error={errors.meters}
              />

              {/* house year */}
              <InputWithError
                label="سال ساخت ملک"
                icon={
                  <PiHourglassSimpleLow className="w-6 h-6 text-gray-400" />
                }
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onBlur={() =>
                  validateField("year", year, [
                    { type: "required", fieldName: "سال ساخت" },
                    { type: "number", fieldName: "سال ساخت" },
                  ])
                }
                placeholder="سال ساخت ملک"
                error={errors.year}
              />

              {/* house capacity */}
              <InputWithError
                label="ظرفیت ملک"
                icon={<FaUsers className="w-6 h-6 text-gray-400" />}
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                onBlur={() =>
                  validateField("capacity", capacity, [
                    { type: "required", fieldName: "ظرفیت" },
                    { type: "number", fieldName: "ظرفیت" },
                  ])
                }
                placeholder="ظرفیت ملک"
                error={errors.capacity}
              />

              {/* house postalCode */}
              <InputWithError
                label="کدپستی"
                icon={<PiSignpostLight className="w-6 h-6 text-gray-400" />}
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                onBlur={() =>
                  validateField("postalCode", postalCode, [
                    { type: "required", fieldName: "کدپستی" },
                  ])
                }
                placeholder="کدپستی"
                error={errors.postalCode}
              />

              {/* house hobbies */}
              <SelectWithError
                label="امکانات تفریحی و سرگرمی"
                value={hobbies}
                onChange={(value) => {
                  setHobbies(value);
                  validateField("hobbies", value, [
                    { type: "arrayNotEmpty", fieldName: "امکانات تفریحی" },
                  ]);
                }}
                options={hobbiesList}
                isMultiple={true}
                error={errors.hobbies}
              />

              {/* house enviornment */}
              <SelectWithError
                label="محیط ملک"
                value={enviornment}
                onChange={(value) => {
                  setEnviornment(value);
                  validateField("enviornment", value, [
                    { type: "arrayNotEmpty", fieldName: "محیط ملک" },
                  ]);
                }}
                options={enviornmentList}
                isMultiple={true}
                error={errors.enviornment}
              />

              {/* house ownerType */}
              <SelectWithError
                label="نوع مالکیت ملک"
                value={ownerType}
                onChange={(value) => {
                  setOwnerType(value);
                  validateField("ownerType", value, [
                    { type: "required", fieldName: "نوع مالکیت" },
                  ]);
                }}
                options={ownerTypeList}
                error={errors.ownerType}
              />

              {/* house free dates */}
              <SelectWithError
                label="روزهای آزاد"
                value={freeDates}
                onChange={(value) => {
                  setFreeDates(value);
                  validateField("freeDates", value, [
                    { type: "arrayNotEmpty", fieldName: "روزهای آزاد" },
                  ]);
                }}
                options={weekDays}
                isMultiple={true}
                error={errors.freeDates}
              />

              {/* house type */}
              <SelectWithError
                label="نوع ملک"
                value={houseType}
                onChange={(value) => {
                  setHouseType(value);
                  validateField("houseType", value, [
                    { type: "required", fieldName: "نوع ملک" },
                  ]);
                }}
                options={houseTypeList}
                error={errors.houseType}
              />

              {/* house rooms */}
              <InputWithError
                label="تعداد اتاق ها"
                icon={<PiWarehouseLight className="w-6 h-6 text-gray-400" />}
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                onBlur={() =>
                  validateField("rooms", rooms, [
                    { type: "required", fieldName: "تعداد اتاق" },
                    { type: "number", fieldName: "تعداد اتاق" },
                  ])
                }
                placeholder="تعداد اتاق ها"
                error={errors.rooms}
              />

              {/* house roof */}
              <InputWithError
                label="تعداد طبقه ها"
                icon={<PiSolarRoof className="w-6 h-6 text-gray-400" />}
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                onBlur={() =>
                  validateField("floor", floor, [
                    { type: "required", fieldName: "تعداد طبقه" },
                    { type: "number", fieldName: "تعداد طبقه" },
                  ])
                }
                placeholder="تعداد طبقه ها"
                error={errors.floor}
              />

              {/* house options */}
              <SelectWithError
                label="امکانات ملک"
                value={options}
                onChange={(value) => {
                  setOptions(value);
                  validateField("options", value, [
                    { type: "arrayNotEmpty", fieldName: "امکانات ملک" },
                  ]);
                }}
                options={houseOptions}
                isMultiple={true}
                error={errors.options}
              />

              {/* house cooling */}
              <SelectWithError
                label="سیستم سرمایش"
                value={cooling}
                onChange={(value) => {
                  setCooling(value);
                  validateField("cooling", value, [
                    { type: "arrayNotEmpty", fieldName: "سیستم سرمایش" },
                  ]);
                }}
                options={coolingList}
                isMultiple={true}
                error={errors.cooling}
              />

              {/* house heating */}
              <SelectWithError
                label="سیستم گرمایش"
                value={heating}
                onChange={(value) => {
                  setHeating(value);
                  validateField("heating", value, [
                    { type: "arrayNotEmpty", fieldName: "سیستم گرمایش" },
                  ]);
                }}
                options={heatingList}
                isMultiple={true}
                error={errors.heating}
              />

              {/* house parking */}
              <InputWithError
                label="تعداد پارکینگ"
                icon={<LuCircleParking className="w-6 h-6 text-gray-400" />}
                type="number"
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                onBlur={() =>
                  validateField("parking", parking, [
                    { type: "required", fieldName: "تعداد پارکینگ" },
                    { type: "number", fieldName: "تعداد پارکینگ" },
                  ])
                }
                placeholder="تعداد پارکینگ"
                error={errors.parking}
              />

              {/* house price*/}
              <InputWithError
                label="اجاره بها"
                icon={<RiPriceTagLine className="w-6 h-6 text-gray-400" />}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() =>
                  validateField("price", price, [
                    { type: "required", fieldName: "اجاره بها" },
                    { type: "number", fieldName: "اجاره بها" },
                  ])
                }
                placeholder="اجاره بها"
                error={errors.price}
              />

              {/* house number*/}
              <InputWithError
                label="پلاک ملک"
                icon={
                  <TbCircleDashedNumber4 className="w-6 h-6 text-gray-400" />
                }
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                onBlur={() =>
                  validateField("houseNumber", houseNumber, [
                    { type: "required", fieldName: "پلاک ملک" },
                  ])
                }
                placeholder="پلاک ملک"
                error={errors.houseNumber}
              />

              {/* floorType*/}
              <SelectWithError
                label="نوع کف پوش"
                value={floorType}
                onChange={(value) => {
                  setFloorType(value);
                  validateField("floorType", value, [
                    { type: "arrayNotEmpty", fieldName: "نوع کف پوش" },
                  ]);
                }}
                options={floorTypeList}
                isMultiple={true}
                error={errors.floorType}
              />

              {/* discount*/}
              <InputWithError
                label="تخفیف ملک"
                icon={
                  <HiOutlineDocumentArrowUp className="w-6 h-6 text-gray-400" />
                }
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                onBlur={() =>
                  validateField("discount", discount, [
                    { type: "required", fieldName: "تخفیف" },
                    { type: "number", fieldName: "تخفیف" },
                  ])
                }
                placeholder="تخفیف ملک"
                error={errors.discount}
              />

              {/* kitchenOptions*/}
              <SelectWithError
                label="امکانات آشپزخانه"
                value={kitchenOptions}
                onChange={(value) => {
                  setKitchenOptions(value);
                  validateField("kitchenOptions", value, [
                    { type: "arrayNotEmpty", fieldName: "امکانات آشپزخانه" },
                  ]);
                }}
                options={kitchenOptionList}
                isMultiple={true}
                error={errors.kitchenOptions}
              />

              {/* bedRoomOptions*/}
              <SelectWithError
                label="امکانات اتاق خواب"
                value={bedRoomOptions}
                onChange={(value) => {
                  setBedRoomOptions(value);
                  validateField("bedRoomOptions", value, [
                    { type: "arrayNotEmpty", fieldName: "امکانات اتاق خواب" },
                  ]);
                }}
                options={bedRoomOptionList}
                isMultiple={true}
                error={errors.bedRoomOptions}
              />

              {/* reservationRoles*/}
              <InputWithError
                label="قوانین رزرو ملک"
                icon={
                  <LiaConciergeBellSolid className="w-6 h-6 text-gray-400" />
                }
                value={reservationRoles}
                onChange={(e) => setReservationRoles(e.target.value)}
                onBlur={() =>
                  validateField("reservationRoles", reservationRoles, [
                    { type: "required", fieldName: "قوانین رزرو" },
                  ])
                }
                placeholder="قوانین رزرو ملک"
                error={errors.reservationRoles}
                textarea={true}
              />

              {/* house roles */}
              <InputWithError
                label="ضوابط و مقررات ملک"
                icon={<TbHomeEdit className="w-6 h-6 text-gray-400" />}
                value={houseRoles}
                onChange={(e) => setHouseRoles(e.target.value)}
                onBlur={() =>
                  validateField("houseRoles", houseRoles, [
                    { type: "required", fieldName: "ضوابط ملک" },
                  ])
                }
                placeholder="ضوابط و مقررات ملک"
                error={errors.houseRoles}
                textarea={true}
              />

              {/* house critrias */}
              <InputWithError
                label="محدویت های ملک"
                icon={<BsHouseExclamation className="w-6 h-6 text-gray-400" />}
                value={critrias}
                onChange={(e) => setCritrias(e.target.value)}
                onBlur={() =>
                  validateField("critrias", critrias, [
                    { type: "required", fieldName: "محدودیت‌ها" },
                  ])
                }
                placeholder="محدویت های ملک"
                error={errors.critrias}
                textarea={true}
              />

              {/* description */}
              <InputWithError
                label="درباره ملک"
                icon={<FiInfo className="w-6 h-6 text-gray-400" />}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() =>
                  validateField("description", description, [
                    { type: "required", fieldName: "توضیحات" },
                  ])
                }
                placeholder="درباره ملک"
                error={errors.description}
                textarea={true}
              />

              {/*  address */}
              <InputWithError
                label="آدرس"
                icon={<FiMapPin className="w-6 h-6 text-gray-400" />}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() =>
                  validateField("address", address, [
                    { type: "required", fieldName: "آدرس" },
                  ])
                }
                placeholder="آدرس"
                error={errors.address}
                textarea={true}
              />

              <div className="mt-4 mb-8 w-32">
                <button
                  className="app-btn-blue w-full"
                  onClick={() => setIsOpen(true)}
                  disabled={loading.info}
                >
                  {loading.info ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش ملک</span>
                  )}
                </button>
              </div>

              {/* ********************************* update bill ********************************* */}
              {/* bill*/}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش قبوض ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="bill"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  قبوض خانه{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRefBill.current.click()}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب قبوض خانه
                    </button>
                    <input
                      type="file"
                      id="bill"
                      name="bill"
                      multiple
                      accept=".jpg,.png,.jpeg,.pdf,.txt,.docx"
                      ref={fileInputRefBill}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setSelectedFilesBill, [
                          "jpg",
                          "png",
                          "jpeg",
                          "pdf",
                          "txt",
                          "docx",
                        ])
                      }
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFilesBill.length > 0 ? (
                      <ul className="px-4">
                        {selectedFilesBill.map((file, index) => (
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
                              onClick={() =>
                                handleFileDelete(
                                  index,
                                  selectedFilesBill,
                                  setSelectedFilesBill
                                )
                              }
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
                      <p className="text-center text-gray-500 text-sm">
                        هنوز قبض آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                {errors.billFiles?.hasError && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.billFiles.message}
                  </span>
                )}

                <div className="mt-6 flex justify-start">
                  {bill.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt=" قبوض ملک"
                    />
                  ))}
                </div>
                <div className="mt-4 mb-8 w-32">
                  <button
                    className="app-btn-blue w-full"
                    onClick={UpdateHouseBill}
                    disabled={loading.bill}
                  >
                    {loading.bill ? (
                      <div className="px-10 py-1 flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      <span className="text-lg">ویرایش قبض</span>
                    )}
                  </button>
                </div>
              </div>

              {/* ********************************* update house document ********************************* */}
              {/* house document*/}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش مدارک ملک</h2>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="document"
                  className="mb-2 text-xs sm:text-sm text-gray-600"
                >
                  مدارک ملک{" "}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRefDocument.current.click()}
                      className="app-btn-gray bg-white"
                    >
                      انتخاب مدارک ملک
                    </button>
                    <input
                      type="file"
                      id="document"
                      name="document"
                      multiple
                      accept=".jpg,.png,.jpeg,.pdf,.txt,.docx"
                      ref={fileInputRefDocument}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setSelectedFilesDocument, [
                          "jpg",
                          "png",
                          "jpeg",
                          "pdf",
                          "txt",
                          "docx",
                        ])
                      }
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                    />
                  </div>

                  <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                    {selectedFilesDocument.length > 0 ? (
                      <ul className="px-4">
                        {selectedFilesDocument.map((file, index) => (
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
                              onClick={() =>
                                handleFileDelete(
                                  index,
                                  selectedFilesDocument,
                                  setSelectedFilesDocument
                                )
                              }
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
                      <p className="text-center text-gray-500 text-sm">
                        هنوز مدارک آپلود نشده است...
                      </p>
                    )}
                  </div>
                </div>
                {errors.documentFiles?.hasError && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.documentFiles.message}
                  </span>
                )}
                <div className="mt-6 flex justify-start">
                  {document.map((file, index) => (
                    <img
                      className="rounded-md ml-4"
                      key={index + 1}
                      src={file}
                      style={{ width: "50px", height: "50px" }}
                      alt=" مدارک ملک"
                    />
                  ))}
                </div>
                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseDocument}
                  disabled={loading.document}
                >
                  {loading.document ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش مدارک</span>
                  )}
                </button>
              </div>

              {/* ********************************* update map ********************************* */}
              {/* map */}
              <hr />
              <h2 className="mt-6 mb-4 text-xl font-bold">ویرایش نقشه ملک</h2>
              <div>
                <h2 className="mb-2">آدرس خود را روی نقشه انتخاب کنید</h2>
                <div>
                  <MapContainer
                    center={position}
                    zoom={5}
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

                  {errors.position?.hasError && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.position.message}
                    </span>
                  )}
                </div>

                <button
                  className="app-btn-blue w-32 mt-4"
                  onClick={UpdateHouseMap}
                  disabled={loading.map}
                >
                  {loading.map ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <span className="text-lg">ویرایش نقشه</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </TitleCard>
      </div>
      <ToastContainer />
    </>
  );
}

export default UpdateHouse;
