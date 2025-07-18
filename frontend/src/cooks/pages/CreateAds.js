import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";

import Select from "react-tailwindcss-select";
import "react-tailwindcss-select/dist/index.css";

import Swal from "sweetalert2";
import axios from "axios";

// icons
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineMapPin } from "react-icons/hi2";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateAds() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [btnSpinner, setBtnSpinner] = useState(false);

  let token = localStorage.getItem("userToken");

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

  // error variables
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

  const CreateAdsHandle = (e) => {
    e.preventDefault();

    // name error
    if (!name || name === "" || name === undefined || name === null) {
      setNameError(true);
      setNameErrorMsg("* نام و نام خانوادگی مشتری باید وارد شود");
    }

    if (!phone || phone === "" || phone === undefined || phone === null) {
      setPhoneError(true);
      setPhoneErrorMsg("*  شماره مشتری باید وارد شود");
    }

    if (
      !address ||
      address === "" ||
      address === undefined ||
      address === null
    ) {
      setAddressError(true);
      setAddressErrorMsg("*  آدرس مشتری باید وارد شود");
    }

    if (!title || title === "" || title === undefined || title === null) {
      setTitleError(true);
      setTitleErrorMsg("*  عنوان أگهی باید وارد شود");
    }

    if (
      !description ||
      description === "" ||
      description === undefined ||
      description === null
    ) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* توضیحات أگهی باید وارد شود");
    }

    if (
      !selectedFiles ||
      selectedFiles === "" ||
      selectedFiles === undefined ||
      selectedFiles === null ||
      selectedFiles.length === 0
    ) {
      setPhotoError(true);
      setPhotoErrorMsg("* تصویر اصلی أگهی باید وارد شود");
    }
    if (
      !selectedFiles2 ||
      selectedFiles2 === "" ||
      selectedFiles2 === undefined ||
      selectedFiles2 === null ||
      selectedFiles2.length === 0
    ) {
      setPhotosError(true);
      setPhotosErrorMsg("* تصاویر أگهی باید وارد شوند");
    } else {
      setBtnSpinner(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("photo", selectedFiles[0]);
      selectedFiles2.forEach((image) => formData.append("photos", image));

      axios
        .post(`/api/cooks/ads`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setBtnSpinner(false);
          setName("");
          setPhone("");
          setAddress("");
          setTitle("");
          setDescription("");
          setPrice("");
          setPhoto(null);
          setPhotos([]);

          toast.success("أگهی اضافه شد", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
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
      <TitleCard title="افزودن آگهی" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/*  company name  */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="name"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              نام و نام خانوادگی مشتری
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <CiUser className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="نام و  نام خانوادگی مشتری"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {nameError ? nameErrorMsg : ""}
            </span>
          </div>

          {/*  phone  */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="phone"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              شماره مشتری
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <BsTelephone className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="number"
                min={11}
                max={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="شماره مشتری"
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {phoneError ? phoneErrorMsg : ""}
            </span>
          </div>

          {/*  title  */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="title"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              عنوان آگهی
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <TbClipboardText className="w-6 h-6 text-gray-400" />
              </div>
              <input
                style={{ borderRadius: "5px" }}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                placeholder="عنوان آگهی "
              />
            </div>
            <span className="text-red-500 relative text-sm">
              {titleError ? titleErrorMsg : ""}
            </span>
          </div>

          {/*  price  */}
          <div className="flex flex-col mb-6">
            <label
              htmlFor="price"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              قیمت أگهی{" "}
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
                placeholder="قیمت آگهی "
              />
            </div>
            {/* <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span> */}
            <span className="text-red-500 relative text-sm">
              {priceError ? priceErrorMsg : ""}
            </span>
          </div>
        </div>

        {/*  ads photo  */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="photo"
            className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600"
          >
            تصویر اصلی آگهی{" "}
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
                      <span className="text-sm text-gray-700">{file.name}</span>
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
                <p className="text-center text-gray-500 text-sm">
                  هنوز تصویری آپلود نشده است...
                </p>
              )}
            </div>
          </div>

          <span className="text-red-500 relative text-sm">
            {photoError ? photoErrorMsg : ""}
          </span>
        </div>

        {/* ads photos */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="photos"
            className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600"
          >
            تصاویر اصلی آگهی{" "}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <button
                className="app-btn-gray"
                onClick={handleCustomButtonClick2}
              >
                انتخاب تصاویر اصلی
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
                      <span className="text-sm text-gray-700">{file.name}</span>
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
                <p className="text-center text-gray-500 text-sm">
                  هنوز تصویری آپلود نشده است...
                </p>
              )}
            </div>
          </div>

          <span className="text-red-500 relative text-sm">
            {photosError ? photosErrorMsg : ""}
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
            {descriptionError ? descriptionErrorMsg : ""}
          </span>
        </div>

        {/*  address */}
        <div className="flex flex-col mb-2">
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
              <HiOutlineMapPin className="w-6 h-6 text-gray-400" />
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

        {/* add button */}
        <div className="mt-4">
          <button className="app-btn-blue" onClick={CreateAdsHandle}>
            {btnSpinner ? (
              <div className="px-10 py-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span>اضافه کردن أگهی</span>
            )}
          </button>
        </div>

        <ToastContainer />
      </TitleCard>
    </>
  );
}

export default CreateAds;
