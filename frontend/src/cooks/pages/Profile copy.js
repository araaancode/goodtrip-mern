import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";

import TitleCard from "../components/Cards/TitleCard";

import Swal from "sweetalert2";
import axios from "axios";

import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// icons
import { FiPhone, FiUser, FiMail, FiMapPin } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { PiMapPinLight, PiCityThin } from "react-icons/pi";
import { RiUser5Line } from "react-icons/ri";
import { LiaIdCardSolid } from "react-icons/lia";
import provincesData from "../components/provinces_cities.json";

const genderList = [
  { value: "female", label: "زن" },
  { value: "male", label: "مرد" },
];

const Profile = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "پروفایل" }));
  }, []);

  const [cook, setCook] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [nationalCode, setNationalCode] = useState("");
  const [gender, setGender] = useState("");
  const [housePhone, setHousePhone] = useState("");
  const [address, setAddress] = useState("");

  const [btnSpinner, setBtnSpinner] = useState(false);

  // error variables
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [provinceError, setProvinceError] = useState(false);
  const [provinceErrorMsg, setProvinceErrorMsg] = useState("");
  const [cityError, setCityError] = useState(false);
  const [cityErrorMsg, setCityErrorMsg] = useState("");
  const [nationalCodeError, setNationalCodeError] = useState(false);
  const [nationalCodeErrorMsg, setNationalCodeErrorMsg] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [genderErrorMsg, setGenderErrorMsg] = useState("");
  const [housePhoneError, setHousePhoneError] = useState(false);
  const [housePhoneErrorMsg, setHousePhoneErrorMsg] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");

  // province and city data
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
  };

  useEffect(() => {
    let token = localStorage.getItem("userToken");

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
        setUsername(res.data.cook.username);
        setPhone(res.data.cook.phone);
        setEmail(res.data.cook.email);
        setProvinces(res.data.cook.province);
        setCities(res.data.cook.city);
        setGender(res.data.cook.gender);
        setNationalCode(res.data.cook.nationalCode);
        setAddress(res.data.cook.address);
        setHousePhone(res.data.cook.housePhone);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Call API to update profile settings changes
  const updateProfile = (e) => {
    e.preventDefault();

    let token = localStorage.getItem("userToken");
    setBtnSpinner(true);

    // // name error
    if (!name || name === "" || name === undefined || name === null) {
      setNameError(true);
      setNameErrorMsg("* نام باید وارد شود");
    }

    if (!phone || phone === "" || phone === undefined || phone === null) {
      setPhoneError(true);
      setPhoneErrorMsg("* شماره همراه باید وارد شود");
    }

    if (!email || email === "" || email === undefined || email === null) {
      setEmailError(true);
      setEmailErrorMsg("* ایمیل باید وارد شود");
    }

    if (
      !username ||
      username === "" ||
      username === undefined ||
      username === null
    ) {
      setUsernameError(true);
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
      setCityErrorMsg("* نام شهر باید وارد شود");
    }

    if (
      !nationalCode ||
      nationalCode === "" ||
      nationalCode === undefined ||
      nationalCode === null
    ) {
      setNationalCodeError(true);
      setNationalCodeErrorMsg("* کدملی باید وارد شود");
    }

    if (!gender || gender === "" || gender === undefined || gender === null) {
      setGenderError(true);
      setGenderErrorMsg("* جنسیت باید وارد شود");
    }

    if (
      !housePhone ||
      housePhone === "" ||
      housePhone === undefined ||
      housePhone === null
    ) {
      setHousePhoneError(true);
      setHousePhoneErrorMsg("* شماره اقامتگاه باید وارد شود");
    }

    if (
      !address ||
      address === "" ||
      address === undefined ||
      address === null
    ) {
      setAddressError(true);
      setAddressErrorMsg("* آدرس باید وارد شود");
    } else {
      axios
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
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          Swal.fire({
            title: "<small>آیا از ویرایش پروفایل اطمینان دارید؟</small>",
            showDenyButton: true,
            confirmButtonText: "بله",
            denyButtonText: `خیر`,
          }).then((result) => {
            if (result.isConfirmed) {
              setBtnSpinner(false);

              toast.success("پروفایل ویرایش شد", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else if (result.isDenied) {
              setBtnSpinner(false);
              toast.info("تغییرات ذخیره نشد", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          });
        })
        .catch((error) => {
          setBtnSpinner(false);
          console.log("error", error);
          toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  return (
    <>
      <TitleCard title="ثبت اطلاعات غذادار" topMargin="mt-2">
        <form onSubmit={updateProfile}>
          <div className="">
            {/* name */}
            <div className="flex flex-col mb-6">
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
            <div className="flex flex-col mb-6">
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
            <div className="flex flex-col mb-6">
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
            <div className="flex flex-col mb-6">
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

            {/* province*/}
            <div className="mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                استان
              </label>
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
            <div>
              <label className="text-xs sm:text-sm tracking-wide text-gray-600">
                شهرستان
              </label>
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

            {/* nationalCode */}
            <div className="flex flex-col my-6">
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
            <div className="flex flex-col mb-6">
              <label
                htmlFor="gender"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                جنیست
              </label>
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

            {/*  address */}
            <div className="flex flex-col mb-4">
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
          </div>
          <button className="app-btn-blue">
            {btnSpinner ? (
              <div className="px-10 py-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span> ثبت یا تغییر اطلاعات</span>
            )}
          </button>
        </form>
        <ToastContainer />
      </TitleCard>
    </>
  );
};

export default Profile;
