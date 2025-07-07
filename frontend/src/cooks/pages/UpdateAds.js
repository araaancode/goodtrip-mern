import { useState, useRef, useEffect } from "react";
import TitleCard from "../components/Cards/TitleCard";
import Select from "react-tailwindcss-select";
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

function UpdateAds() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [ads, setAds] = useState({});

  const [isOpen, setIsOpen] = useState(false);

  let token = localStorage.getItem("userToken");
  let adsId = window.location.href
    .split("/advertisments/")[1]
    .split("/update")[0];

  // Photo vars
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  // Photos vars
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions2 = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString2 = acceptedFileExtensions2
    .map((ext) => `.${ext}`)
    .join(",");

  // Error variables
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [priceErrorMsg, setPriceErrorMsg] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");
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

  // Fetch ad data
  useEffect(() => {
    axios
      .get(`/api/cooks/ads/${adsId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.ads.company.name);
        setPhone(res.data.ads.company.phone);
        setAddress(res.data.ads.company.address);
        setTitle(res.data.ads.title);
        setDescription(res.data.ads.description);
        setPrice(res.data.ads.price);
        setPhoto(res.data.ads.photo);
        setPhotos(res.data.ads.photos);
        setAds(res.data.ads);
      })
      .catch((error) => console.error(error));
  }, [adsId, token]);

  // Update ad details
  const updateAdsHandle = (e) => {
    e.preventDefault();
    if (!name) {
      setNameError(true);
      setNameErrorMsg("* نام و نام خانوادگی مشتری باید وارد شود");
      return;
    }
    if (!phone) {
      setPhoneError(true);
      setPhoneErrorMsg("* شماره مشتری باید وارد شود");
      return;
    }
    if (!address) {
      setAddressError(true);
      setAddressErrorMsg("* آدرس مشتری باید وارد شود");
      return;
    }
    if (!title) {
      setTitleError(true);
      setTitleErrorMsg("* عنوان آگهی باید وارد شود");
      return;
    }
    if (!description) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* توضیحات آگهی باید وارد شود");
      return;
    }

    setBtnSpinner(true);
    setIsOpen(true);

  };

  // Update main photo
  const updatePhotoFunction = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      setPhotoError(true);
      setPhotoErrorMsg("* تصویر اصلی آگهی باید وارد شود");
      return;
    }
    setBtnSpinner(true);
    const formData = new FormData();
    formData.append("photo", selectedFiles[0]);
    try {
      const res = await axios.put(
        `/api/cooks/ads/${adsId}/update-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      setBtnSpinner(false);
      toast.success("تصویر اصلی ویرایش شد", {
        position: "top-left",
        autoClose: 5000,
      });
      setPhoto(res.data.ads.photo);
    } catch (error) {
      setBtnSpinner(false);
      toast.error("خطایی وجود دارد. دوباره امتحان کنید!", {
        position: "top-left",
        autoClose: 5000,
      });
    }
  };

  // Update additional photos
  const updatePhotosFunction = async (e) => {
    e.preventDefault();
    if (!selectedFiles2.length) {
      setPhotosError(true);
      setPhotosErrorMsg("* تصاویر آگهی باید وارد شوند");
      return;
    }
    setBtnSpinner(true);
    const formData = new FormData();
    selectedFiles2.forEach((img) => formData.append("photos", img));
    try {
      const res = await axios.put(
        `/api/cooks/ads/${adsId}/update-photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      setBtnSpinner(false);
      toast.success("تصاویر آگهی ویرایش شدند", {
        position: "top-left",
        autoClose: 5000,
      });
      setPhotos(res.data.ads.photos);
    } catch (error) {
      setBtnSpinner(false);
      toast.error("خطایی وجود دارد. دوباره امتحان کنید!", {
        position: "top-left",
        autoClose: 5000,
      });
    }
  };

  // update ads 
  const sendUpdateRequest = async() => {
    setIsOpen(false);
    setBtnSpinner(false);

    await axios
    .put(
      `/api/cooks/ads/${adsId}/update-ads`,
      { name, phone, address, title, description, price },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      setBtnSpinner(false);
      toast.success("آگهی ویرایش شد", {
        position: "top-left",
        autoClose: 5000,
      });
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
        className="relative z-50"
      >
        <div className="fixed inset-0" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              ویرایش آگهی
            </Dialog.Title>

            <Dialog.Description className="my-2 text-sm text-gray-500">
              آیا از ویرایش آگهی اطمینان دارید؟
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
        {/* Advertisement Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-10 transform transition-all duration-500">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-4 text-right justify-start">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {ads.title || "ـ"}
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
                  <span className="font-bold">نام مشتری: </span>
                  {name || "نام و نام خانوادگی مشتری"}
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
                  <span className="font-bold">تلفن مشتری: </span>
                  {phone || "_"}
                </p>

                <p className="text-gray-700 flex items-center gap-2 ">
                  <RiPriceTag3Line className="w-5 h-5 font-bold" />
                  <span className="font-bold">قیمت آگهی: </span>
                  <span className="text-indigo-500 font-bold">
                    {price || "_"}
                  </span>
                </p>

                <p className="text-gray-700 items-center text-justify gap-2">
                  <span className="font-bold ">توضیحات آگهی: </span>
                  {ads.description || "_"}
                </p>
              </div>
              <div className="flex-1">
                {photo ? (
                  <img
                    src={photo}
                    alt="Main Ad"
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

        <TitleCard title="ویرایش آگهی" topMargin="mt-2">
          {/* Update Main Photo */}
          <div className="mx-auto mb-8">
            <h4 className="font-semibold text-lg text-gray-700 mb-4">
              ویرایش عکس اصلی آگهی
            </h4>
            <label htmlFor="photo" className="block text-sm text-gray-600 mb-2">
              تصویر اصلی آگهی
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
                  src={ads.photo}
                  alt="Main Ad"
                  className="w-20 h-20 object-cover rounded-md shadow-sm"
                />
              )}
            </div>
            <button className="app-btn-blue mt-4" onClick={updatePhotoFunction}>
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
              ویرایش تصاویر آگهی
            </h4>
            <label
              htmlFor="photos"
              className="block text-sm text-gray-600 mb-2"
            >
              تصاویر آگهی
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center">
                <button
                  className="app-btn-gray"
                  onClick={handleCustomButtonClick2}
                >
                  انتخاب تصاویر آگهی
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
              className="app-btn-blue mt-4"
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

          {/* Update Ad Details */}
          <div className="mx-auto">
            <h4 className="font-semibold text-lg text-gray-700 mb-6">
              ویرایش آگهی
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm text-gray-600 mb-1">
                  نام و نام خانوادگی مشتری
                </label>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="نام و نام خانوادگی مشتری"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
                {nameError && (
                  <span className="text-red-500 text-sm mt-1">
                    {nameErrorMsg}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-sm text-gray-600 mb-1">
                  شماره مشتری
                </label>
                <div className="relative">
                  <BsTelephone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="number"
                    min={11}
                    max={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="شماره مشتری"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
                {phoneError && (
                  <span className="text-red-500 text-sm mt-1">
                    {phoneErrorMsg}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <label htmlFor="title" className="text-sm text-gray-600 mb-1">
                  عنوان آگهی
                </label>
                <div className="relative">
                  <TbClipboardText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="عنوان آگهی"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
                {titleError && (
                  <span className="text-red-500 text-sm mt-1">
                    {titleErrorMsg}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm text-gray-600 mb-1">
                  قیمت آگهی
                </label>
                <div className="relative">
                  <IoPricetagOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="قیمت آگهی"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
                {priceError && (
                  <span className="text-red-500 text-sm mt-1">
                    {priceErrorMsg}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="توضیحات"
                  style={{ borderRadius: "5px", resize: "none" }}
                />
              </div>
              {descriptionError && (
                <span className="text-red-500 text-sm mt-1">
                  {descriptionErrorMsg}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col mt-6">
              <label htmlFor="address" className="text-sm text-gray-600 mb-1">
                آدرس
              </label>
              <div className="relative">
                <HiOutlineMapPin className="absolute left-3 top-4 text-gray-400 w-6 h-6" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                  placeholder="آدرس"
                  style={{ borderRadius: "5px", resize: "none" }}
                />
              </div>
              {addressError && (
                <span className="text-red-500 text-sm mt-1">
                  {addressErrorMsg}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button className="app-btn-blue" onClick={updateAdsHandle}>
                {btnSpinner ? (
                  <div className="px-10 py-1 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <span>ویرایش آگهی</span>
                )}
              </button>
            </div>
          </div>

          <ToastContainer />
        </TitleCard>
      </div>
    </>
  );
}

export default UpdateAds;
