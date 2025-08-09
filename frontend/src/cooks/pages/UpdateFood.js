import { useState, useRef, useEffect } from "react";
import { useCookAuthStore } from '../stores/authStore'; 
import TitleCard from "../components/Cards/TitleCard";
import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";
import axios from "axios";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { RiPriceTag3Line } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoNumber } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { TbClockHour12 } from "react-icons/tb";
import { PiChefHatLight } from "react-icons/pi";
import { PiBowlFood } from "react-icons/pi";
import { CiCircleQuestion } from "react-icons/ci";
import { Dialog } from "@headlessui/react";

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
  { value: "Appetizer", label: "پیش غذا و سوپ" },
  { value: "Main Course", label: "غذای اصلی" },
  { value: "Dessert", label: "دسر و نوشیدنی" },
];

function UpdateFood() {
  const { isCookAuthenticated, cook } = useCookAuthStore();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [cookDate, setCookDate] = useState([]);
  const [fetchCookDate, setFetchCookDate] = useState([]);
  const [cookHour, setCookHour] = useState(null);
  const [fetchCookHour, setFetchCookHour] = useState([]);
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState(null);
  const [fetchCategory, setFetchCategory] = useState(null);
  const [cookName, setCookName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);

  let foodId = window.location.href.split("/foods/")[1].split("/update")[0];

  // Photo handling variables
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  // Photos handling variables
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions2 = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString2 = acceptedFileExtensions2
    .map((ext) => `.${ext}`)
    .join(",");

  // Error states
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [countError, setCountError] = useState(false);
  const [countErrorMsg, setCountErrorMsg] = useState("");
  const [cookDateError, setCookDateError] = useState(false);
  const [cookDateErrorMsg, setCookDateErrorMsg] = useState("");
  const [cookHourError, setCookHourError] = useState(false);
  const [cookHourErrorMsg, setCookHourErrorMsg] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [priceErrorMsg, setPriceErrorMsg] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const [categoryErrorMsg, setCategoryErrorMsg] = useState("");
  const [cookNameError, setCookNameError] = useState(false);
  const [cookNameErrorMsg, setCookNameErrorMsg] = useState("");
  const [photoError, setPhotoError] = useState(false);
  const [photoErrorMsg, setPhotoErrorMsg] = useState("");
  const [photosError, setPhotosError] = useState(false);
  const [photosErrorMsg, setPhotosErrorMsg] = useState("");

  // File handling for main photo
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
        toast.error("File names must be unique");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(
          `Only ${acceptedFileExtensions.join(", ")} files are allowed`
        );
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });
    if (!hasError) setSelectedFiles(newSelectedFiles);
  };

  const handleCustomButtonClick = () => fileInputRef.current.click();
  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // File handling for additional photos
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
        toast.error("File names must be unique");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(
          `Only ${acceptedFileExtensions2.join(", ")} files are allowed`
        );
        hasError = true;
      } else {
        newSelectedFiles2.push(file);
      }
    });
    if (!hasError) setSelectedFiles2(newSelectedFiles2);
  };

  const handleCustomButtonClick2 = () => fileInputRef2.current.click();
  const handleFileDelete2 = (index) => {
    const updatedFiles = [...selectedFiles2];
    updatedFiles.splice(index, 1);
    setSelectedFiles2(updatedFiles);
  };

  // Get single food
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`/api/cooks/foods/${foodId}`, {
          withCredentials: true
        });
        setPhoto(response.data.food.photo);
        setPhotos(response.data.food.photos);
        setName(response.data.food.name);
        setCount(response.data.food.count);
        setPrice(response.data.food.price);
        setDescription(response.data.food.description);
        setCookName(response.data.food.cookName);
        setFetchCookDate(response.data.food.cookDate);
        setFetchCookHour(response.data.food.cookHour);
        setFetchCategory(response.data.food.category);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFood();
  }, [foodId]);

  // Update food
  const updateFoodHandle = (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    if (!name) {
      setNameError(true);
      setNameErrorMsg("* نام غذا باید وارد شود");
      isValid = false;
    }
    if (!count) {
      setCountError(true);
      setCountErrorMsg("* تعداد غذا باید وارد شود");
      isValid = false;
    }
    if (!price) {
      setPriceError(true);
      setPriceErrorMsg("* قیمت غذا باید وارد شود");
      isValid = false;
    }
    if (!cookDate || cookDate.length === 0) {
      setCookDateError(true);
      setCookDateErrorMsg("* تاریخ پخت غذا باید وارد شود");
      isValid = false;
    }
    if (!cookHour) {
      setCookHourError(true);
      setCookHourErrorMsg("* ساعت پخت غذا باید وارد شود");
      isValid = false;
    }
    if (!description) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* توضیحات غذا باید وارد شود");
      isValid = false;
    }
    if (!category) {
      setCategoryError(true);
      setCategoryErrorMsg("* دسته بندی غذا باید وارد شود");
      isValid = false;
    }
    if (!cookName) {
      setCookNameError(true);
      setCookNameErrorMsg("* نام سرآشپز باید وارد شود");
      isValid = false;
    }

    if (isValid) {
      setBtnSpinner(true);
      setIsOpen(true);
    }
  };

  // Update food main photo
  const updatePhotoFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setPhotoError(true);
      setPhotoErrorMsg("* تصویر اصلی غذا باید وارد شود");
      return;
    }

    setBtnSpinner(true);
    const formData = new FormData();
    formData.append("photo", selectedFiles[0]);

    try {
      const response = await axios.put(
        `/api/cooks/foods/${foodId}/update-food-photo`,
        formData,
        { withCredentials: true }
      );
      setBtnSpinner(false);
      toast.success("تصویر اصلی ویرایش شد");
      setPhoto(response.data.data.photo);
    } catch (error) {
      setBtnSpinner(false);
      toast.error("خطایی وجود دارد. دوباره امتحان کنید !");
    }
  };

  // Update food photos
  const updatePhotosFunction = async (e) => {
    e.preventDefault();

    if (!selectedFiles2 || selectedFiles2.length === 0) {
      setPhotosError(true);
      setPhotosErrorMsg("* تصاویر غذا باید وارد شوند");
      return;
    }

    setBtnSpinner(true);
    const formData = new FormData();
    selectedFiles2.forEach((img) => {
      formData.append("photos", img);
    });

    try {
      const response = await axios.put(
        `/api/cooks/foods/${foodId}/update-food-photos`,
        formData,
        { withCredentials: true }
      );
      setBtnSpinner(false);
      toast.success("تصاویر غذا ویرایش شدند");
      setPhotos(response.data.food.photos);
    } catch (error) {
      setBtnSpinner(false);
      toast.error("خطایی وجود دارد. دوباره امتحان کنید !");
    }
  };

  const givePersianFoodType = (item) => {
    if (item === "Main Course") return "غذا اصلی";
    if (item === "Appetizer") return "پیش غذا و سوپ و سالاد";
    if (item === "Dessert") return "دسر و نوشیدنی";
    return "";
  };

  // Update food
  const sendUpdateRequest = () => {
    setIsOpen(false);
    setBtnSpinner(true);

    axios
      .put(
        `/api/cooks/foods/${foodId}/update-food`,
        {
          name,
          count,
          price,
          cookDate,
          cookHour,
          description,
          category,
          cookName,
        },
        { withCredentials: true }
      )
      .then(() => {
        setBtnSpinner(false);
        toast.success("غذا ویرایش شد");
      })
      .catch((error) => {
        setBtnSpinner(false);
        toast.error("خطایی وجود دارد. دوباره امتحان کنید!");
      });
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
              ویرایش غذا
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش غذا اطمینان دارید؟
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
      <div className="p-4 sm:p-6">
        {/* food Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10 transform transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right justify-start">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {name || "ـ"}
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
                  <span className="font-bold">نام غذا: </span>
                  {name || "ـ"}
                </p>
                <p className="text-gray-700 flex items-center gap-2 ">
                  <RiPriceTag3Line className="w-5 h-5 font-bold" />
                  <span className="font-bold">قیمت غذا: </span>
                  <span className="text-indigo-500 font-bold">
                    {price || "_"}
                  </span>
                </p>

                <p className="text-gray-700 items-center text-justify gap-2">
                  <span className="font-bold ">توضیحات غذا: </span>
                  {description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {photo ? (
                  <img
                    src={photo}
                    alt="Food Photo"
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
              {photos.length > 0 ? (
                photos.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={`Ad ${index + 1}`}
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

        <TitleCard title="ویرایش غذا" topMargin="mt-2">
          {/* Update Main Photo */}
          <div className="mx-auto mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-4">
              ویرایش عکس اصلی غذا
            </h4>
            <label htmlFor="photo" className="block text-sm text-gray-600 mb-2">
              تصویر اصلی غذا
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
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
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles.length > 0 ? (
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li
                        key={file.name}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <button
                          onClick={() => handleFileDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 20 20"
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
                  <p className="text-center bg-white text-gray-500 text-sm">
                    هنوز تصویری آپلود نشده است...
                  </p>
                )}
              </div>
            </div>
            <div className="my-4">
              {photo && (
                <img
                  src={photo}
                  alt="Food Photo"
                  className="w-20 h-20 object-cover rounded-md shadow-sm"
                />
              )}
            </div>
            <button className="app-btn-gray mt-4" onClick={updatePhotoFunction}>
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>ویرایش تصویر</span>
              )}
            </button>
            {photoError && (
              <span className="text-red-500 text-sm mt-2 block">
                {photoErrorMsg}
              </span>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Update Additional Photos */}
          <div className="mx-auto mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-4">
              ویرایش تصاویر غذا
            </h4>
            <label
              htmlFor="photos"
              className="block text-sm text-gray-600 mb-2"
            >
              تصاویر غذا
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  className="app-btn-gray"
                  onClick={handleCustomButtonClick2}
                >
                  انتخاب تصاویر غذا
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
              <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
                {selectedFiles2.length > 0 ? (
                  <ul>
                    {selectedFiles2.map((file, index) => (
                      <li
                        key={file.name}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <button
                          onClick={() => handleFileDelete2(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 20 20"
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
                  <p className="text-center bg-white text-gray-500 text-sm">
                    هنوز تصویری آپلود نشده است...
                  </p>
                )}
              </div>
            </div>
            <div className="my-4 flex flex-wrap gap-2">
              {photos.map((file, index) => (
                <img
                  key={index}
                  src={file}
                  alt={`Ad ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md shadow-sm"
                />
              ))}
            </div>
            <button
              className="app-btn-gray mt-4"
              onClick={updatePhotosFunction}
            >
              {btnSpinner ? (
                <div className="px-10 py-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <span>ویرایش تصاویر </span>
              )}
            </button>
            {photosError && (
              <span className="text-red-500 text-sm mt-2 block">
                {photosErrorMsg}
              </span>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Update Food Details */}
          <div className="mx-auto">
            <h4 className="font-bold text-gray-600 mb-6">ویرایش غذا</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/*  food name  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="title"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  نام غذا
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <IoFastFoodOutline className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام غذا"
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {nameError ? nameErrorMsg : ""}
                </span>
              </div>

              {/*  food count  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="count"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  تعداد غذاها{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <GoNumber className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="تعداد غذاها "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {countError ? countErrorMsg : ""}
                </span>
              </div>

              {/*  food date  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cookDate"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  {" "}
                  تاریخ پخت{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  تاریخ پخت انتخاب شده: *{" "}
                  {String(fetchCookDate).replace(/,/g, "، ")}
                </small>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <SlCalender className="w-6 h-6 text-gray-400" />
                  </div>
                  <Select
                    value={cookDate}
                    onChange={(e) => setCookDate(e)}
                    options={weekDays}
                    isMultiple={true}
                    placeholder="انتخاب"
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
                  {cookDateError ? cookDateErrorMsg : ""}
                </span>
              </div>

              {/*  food hour  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cookHour"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  {" "}
                  ساعت پخت غذا{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  ساعت پخت غذا انتخاب شده: * {fetchCookHour}
                </small>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <TbClockHour12 className="w-6 h-6 text-gray-400" />
                  </div>
                  <Select
                    value={cookHour}
                    onChange={(e) => setCookHour(e)}
                    options={hourOptions}
                    placeholder="انتخاب"
                    classNames={`placholder-gray-400`}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {cookHourError ? cookHourErrorMsg : ""}
                </span>
              </div>

              {/*  food type  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="category"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  {" "}
                  نوع غذا{" "}
                </label>
                <small className="my-2 font-sm text-gray-500">
                  نوع غذا انتخاب شده: * {givePersianFoodType(fetchCategory)}
                </small>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <TbClockHour12 className="w-6 h-6 text-gray-400" />
                  </div>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e)}
                    options={categoryOptions}
                    placeholder="انتخاب"
                    classNames={`placholder-gray-400`}
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {categoryError ? categoryErrorMsg : ""}
                </span>
              </div>

              {/*  price  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="title"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  قیمت غذا به ازای هر نفر
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <IoPricetagOutline className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="قیمت غذا "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {priceError ? priceErrorMsg : ""}
                </span>
              </div>

              {/*  cook name  */}
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="cookName"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  {" "}
                  نام سرآشپز{" "}
                </label>
                <div className="relative">
                  <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                    <PiChefHatLight className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    style={{ borderRadius: "5px" }}
                    type="text"
                    value={cookName}
                    onChange={(e) => setCookName(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder=" نام سرآشپز  "
                  />
                </div>
                <span className="text-red-500 relative text-sm">
                  {cookNameError ? cookNameErrorMsg : ""}
                </span>
              </div>

              {/*  description */}
              <div className="flex flex-col mt-6">
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
                  {descriptionError ? descriptionErrorMsg : ""}
                </span>
              </div>

              {/* update food button */}
              <div className="mt-4">
                <button className="app-btn-blue" onClick={updateFoodHandle}>
                  {btnSpinner ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span>ویرایش غذا</span>
                  )}
                </button>
              </div>
            </div>

            <ToastContainer />
          </div>
        </TitleCard>
      </div>
    </>
  );
}

export default UpdateFood;