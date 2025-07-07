import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from "../features/common/headerSlice";
import axios from "axios";

import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import { FiPhone, FiUser, FiMail, FiMapPin } from "react-icons/fi";
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
  //   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  //   shadowSize: [55, 55],
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
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [cook, setCook] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [position, setPosition] = useState([35.6892, 51.389]);
  const markerRef = useRef(null);

  let token = localStorage.getItem("userToken");

  // وقتی روی نقشه کلیک می‌کنیم
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  // وقتی مارکر کشیده و رها می‌شود
  const onDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
    }
  };

  // btn spinner
  const [btnSpinner, setBtnSpinner] = useState(false);

  // errors
  const [provinceError, setProvinceError] = useState(false);
  const [provinceErrorMsg, setProvinceErrorMsg] = useState("");

  const [cityError, setCityError] = useState(false);
  const [cityErrorMsg, setCityErrorMsg] = useState("");

  const [addressError, setAddressError] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");

  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [nationalCodeError, setNationalCodeError] = useState(false);
  const [nationalCodeErrorMsg, setNationalCodeErrorMsg] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [genderErrorMsg, setGenderErrorMsg] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");

  // page main Title
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle({ title: "ویرایش پروفایل" }));
  }, []);

  // photo vars
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray);
  };

  const processFiles = (filesArray) => {
    const newSelectedFiles = [...selectedFiles];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    filesArray.forEach((file) => {
      console.log(file);

      if (newSelectedFiles.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensions.join(", ")} files are allowed`,
          "error"
        );
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

  // photos vars
  const [selectedFiles2, setSelectedFiles2] = useState([]);

  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions2 = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString2 = acceptedFileExtensions2
    .map((ext) => `.${ext}`)
    .join(",");

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
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensions2.join(", ")} files are allowed`,
          "error"
        );
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

  // bill vars
  const [selectedFilesBill, setSelectedFilesBill] = useState([]);

  const fileInputRefBill = useRef(null);
  const acceptedFileExtensionsBill = [
    "jpg",
    "png",
    "jpeg",
    "pdf",
    "txt",
    "docx",
  ];

  const acceptedFileTypesStringBill = acceptedFileExtensionsBill
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChangeBill = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFilesBill(newFilesArray);
  };

  const processFilesBill = (filesArray) => {
    const newSelectedFilesBill = [...selectedFilesBill];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensionsBill.join("|"), "i");
    filesArray.forEach((file) => {
      if (newSelectedFilesBill.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensionsBill.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFilesBill.push(file);
      }
    });

    if (!hasError) {
      setSelectedFilesBill(newSelectedFilesBill);
    }
  };

  const handleCustomButtonClickBill = () => {
    fileInputRefBill.current.click();
  };

  const handleFileDeleteBill = (index) => {
    const updatedFiles = [...selectedFilesBill];
    updatedFiles.splice(index, 1);
    setSelectedFilesBill(updatedFiles);
  };

  // document vars
  const [selectedFilesDocument, setSelectedFilesDocument] = useState([]);

  const fileInputRefDocument = useRef(null);
  const acceptedFileExtensionsDocument = [
    "jpg",
    "png",
    "jpeg",
    "pdf",
    "txt",
    "docx",
  ];

  const acceptedFileTypesStringDocument = acceptedFileExtensionsDocument
    .map((ext) => `.${ext}`)
    .join(",");

  const handleFileChangeDocument = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFilesDocument(newFilesArray);
  };

  const processFilesDocument = (filesArray) => {
    const newSelectedFilesDocument = [...selectedFilesDocument];
    let hasError = false;
    const fileTypeRegex = new RegExp(
      acceptedFileExtensionsDocument.join("|"),
      "i"
    );
    filesArray.forEach((file) => {
      if (newSelectedFilesDocument.some((f) => f.name === file.name)) {
        alert("File names must be unique", "error");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        alert(
          `Only ${acceptedFileExtensionsDocument.join(", ")} files are allowed`,
          "error"
        );
        hasError = true;
      } else {
        newSelectedFilesDocument.push(file);
      }
    });

    if (!hasError) {
      setSelectedFilesDocument(newSelectedFilesDocument);
    }
  };

  const handleCustomButtonClickDocument = () => {
    fileInputRefDocument.current.click();
  };

  const handleFileDeleteDocument = (index) => {
    const updatedFiles = [...selectedFilesDocument];
    updatedFiles.splice(index, 1);
    setSelectedFilesDocument(updatedFiles);
  };

  // province and city data
  useEffect(() => {
    // تبدیل داده‌ها به فرمتی که کامپوننت Select نیاز دارد
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
  };

  // fetch cook
  useEffect(() => {
    axios
      .get(`/api/cooks/me`, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setCook(res.data.cook);
        setName(res.data.cook.name);
        setAddress(res.data.cook.address);
        setNationalCode(res.data.cook.nationalCode);
        setPhone(res.data.cook.phone);
        setEmail(res.data.cook.email);
        setUsername(res.data.cook.username);
        if (res.data.cook.lat && res.data.cook.lng) {
          setPosition([res.data.cook.lat, res.data.cook.lng]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  // Call API add house
  const updateProfileHandle = (e) => {
    e.preventDefault();

    setBtnSpinner(true);

    // // name error
    if (!name || name === "" || name === undefined || name === null) {
      setNameError(true);
      setBtnSpinner(false);
      setNameErrorMsg("* نام باید وارد شود");
    }

    if (!phone || phone === "" || phone === undefined || phone === null) {
      setPhoneError(true);
      setBtnSpinner(false);
      setPhoneErrorMsg("* شماره همراه باید وارد شود");
    }

    if (!email || email === "" || email === undefined || email === null) {
      setEmailError(true);
      setBtnSpinner(false);
      setEmailErrorMsg("* ایمیل باید وارد شود");
    }

    if (
      !username ||
      username === "" ||
      username === undefined ||
      username === null
    ) {
      setUsernameError(true);
      setBtnSpinner(false);
      setUsernameErrorMsg("* نام کاربری باید وارد شود");
    }

    if (
      !selectedProvince ||
      selectedProvince === "" ||
      selectedProvince === undefined ||
      selectedProvince === null ||
      selectedProvince.length === 0
    ) {
      setProvinceError(true);
      setBtnSpinner(false);
      setProvinceErrorMsg("* نام استان باید وارد شود");
    }

    if (
      !selectedCity ||
      selectedCity === "" ||
      selectedCity === undefined ||
      selectedCity === null ||
      selectedCity.length === 0
    ) {
      setCityError(true);
      setBtnSpinner(false);
      setCityErrorMsg("* نام شهر باید وارد شود");
    }

    if (
      !nationalCode ||
      nationalCode === "" ||
      nationalCode === undefined ||
      nationalCode === null
    ) {
      setNationalCodeError(true);
      setBtnSpinner(false);
      setNationalCodeErrorMsg("* کدملی باید وارد شود");
    }

    if (!gender || gender === "" || gender === undefined || gender === null) {
      setGenderError(true);
      setBtnSpinner(false);
      setGenderErrorMsg("* جنسیت باید وارد شود");
    }

    if (
      !address ||
      address === "" ||
      address === undefined ||
      address === null
    ) {
      setAddressError(true);
      setBtnSpinner(false);
      setAddressErrorMsg("* آدرس باید وارد شود");
    } else {
      setBtnSpinner(false);
      setIsOpen(true);
    }
  };

  // send update request
  const sendUpdateRequest = async () => {
    setIsOpen(true);
    setBtnSpinner(true);

    await axios
      .put(
        `/api/cooks/update-profile`,
        {
          name,
          phone,
          email,
          username,
          gender,
          province: selectedProvince.label,
          city: selectedCity.label,
          nationalCode,
          address,
          lat: position[0],
          lng: position[1],
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        if(data){
          setBtnSpinner(false);
          setIsOpen(false)
          toast.success("آگهی ویرایش شد", {
            position: "top-left",
            autoClose: 5000,
          });
        }else{
          setBtnSpinner(false);
          setIsOpen(false)
          toast.info("تغییرات ذخیره نشد", {
            position: "top-left",
            autoClose: 5000,
          });
        }
      })
      .catch((error) => {
        setBtnSpinner(false);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید!", {
          position: "top-left",
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[1000]" // Increased z-index to ensure Dialog is above the map
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 " // Added semi-transparent backdrop
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-xl z-[1001]">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              ویرایش پروفایل
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش پروفایل اطمینان دارید؟
            </Dialog.Description>

            <CiCircleQuestion className="my-2 flex justify-center items-center w-20 h-20 text-blue-900 mx-auto" />

            <div className="flex items-center justify-center">
              <button
                className="mt-4 rounded bg-blue-900 px-8 py-2 mx-2 text-white"
                onClick={() => sendUpdateRequest()}
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
      <TitleCard title="ثبت اطلاعات غذادار " topMargin="mt-2">
        {/* name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* name */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="name"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نام و نام خانوادگی{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <FiUser className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام و نام خانوادگی"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {nameError ? nameErrorMsg : ""}
            </span>
          </div>

          {/* phone */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="phone"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              شماره همراه{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <FiPhone className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="شماره همراه"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {phoneError ? phoneErrorMsg : ""}
            </span>
          </div>

          {/* email */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="email"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              ایمیل{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <FiMail className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="ایمیل"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {emailError ? emailErrorMsg : ""}
            </span>
          </div>

          {/* username */}
          <div className="flex flex-col mb-2">
            <label
              htmlFor="username"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نام کاربری{" "}
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <RiUser5Line className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام کاربری"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {usernameError ? usernameErrorMsg : ""}
            </span>
          </div>
        </div>
        {/* nationalCode */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="nationalCode"
            className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
          >
            {" "}
            کدملی{" "}
          </label>
          <div className="relative">
            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <LiaIdCardSolid className="w-6 h-6 text-gray-400" />
            </div>
            <input
              style={{ borderRadius: "5px" }}
              type="number"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
              placeholder="کدملی"
            />
          </div>
          <span className="text-red-500 relative text-sm">
            {nationalCodeError ? nationalCodeErrorMsg : ""}
          </span>
        </div>

        {/* gender */}
        <div className="flex flex-col mb-4">
          <label
            htmlFor="gender"
            className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600 inline"
          >
            جنیست
          </label>
          {cook.gender ? (
            <small className="font-sm text-gray-500">
              جنیست انتخاب شده: * {cook.gender}
            </small>
          ) : (
            ""
          )}
          <div className="relative">
            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <FiPhone className="w-6 h-6 text-gray-400" />
            </div>
            <Select
              value={gender}
              onChange={(e) => setGender(e)}
              options={genderList}
              placeholder="انتخاب"
              classNames={`placholder-gray-400`}
            />
          </div>
          <span className="text-red-500 relative text-sm">
            {genderError ? genderErrorMsg : ""}
          </span>
        </div>

        {/* province*/}
        <div className="mb-6 mt-4">
          <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
            استان
          </label>
          {cook.province ? (
            <small className="my-2 font-sm text-gray-500 block">
              استان انتخاب شده: * {cook.province}
            </small>
          ) : (
            ""
          )}
          <Select
            value={selectedProvince}
            onChange={handleProvinceChange}
            options={provinces}
            primaryColor={"blue"}
            placeholder="انتخاب استان"
            isSearchable
            searchInputPlaceholder="جستجو استان"
            classNames={{
              searchIcon: "hidden", // This hides the search icon
            }}
          />
          <span className="text-red-500 relative text-sm">
            {provinceError ? provinceErrorMsg : ""}
          </span>
        </div>

        {/* city */}
        <div className="my-6">
          <label className="text-xs sm:text-sm tracking-wide text-gray-600 block">
            شهرستان
          </label>
          {cook.city ? (
            <small className="my-2 font-sm text-gray-500">
              استان انتخاب شده: * {cook.city}
            </small>
          ) : (
            ""
          )}

          <Select
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities}
            primaryColor={"blue"}
            placeholder="انتخاب شهرستان"
            isSearchable
            isDisabled={!selectedProvince}
            searchInputPlaceholder="جستجو شهرستان"
            classNames={{
              searchIcon: "hidden", // This hides the search icon
            }}
          />

          <span className="text-red-500 relative text-sm">
            {cityError ? cityErrorMsg : ""}
          </span>
        </div>

        {/*  address */}
        <div className="flex flex-col mt-8 mb-10">
          <label
            htmlFor="address"
            className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
          >
            آدرس{" "}
          </label>
          <div className="relative">
            <div
              className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
              style={{ bottom: "52px" }}
            >
              <FiMapPin className="w-6 h-6 text-gray-400" />
            </div>
            <textarea
              style={{ borderRadius: "5px", resize: "none" }}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
              placeholder="آدرس "
            ></textarea>
          </div>
          <span className="text-red-500 relative text-sm">
            {addressError ? addressErrorMsg : ""}
          </span>
        </div>

        {/* map */}
        <div>
          <h2 className="mb-2 mt-20">آدرس خود را روی نقشه انتخاب کنید</h2>
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
          </div>
        </div>

        {/* button */}
        <div className="mb-2 mt-8 w-50">
          <button className="app-btn-blue" onClick={updateProfileHandle}>
            {btnSpinner ? (
              <div className="px-10 py-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span className="text-lg">ویرایش پروفایل</span>
            )}
          </button>
        </div>
      </TitleCard>
      <ToastContainer />
    </>
  );
}

export default Profile;
