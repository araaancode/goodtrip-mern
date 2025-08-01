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

  const [driver, setDriver] = useState("");
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

  // url
  let token = localStorage.getItem("userToken");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: ["right"] }], // Align text
      [{ direction: "rtl" }], // RTL button
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // get bus
  useEffect(() => {
    const fetchDriverBus = async () => {
      await axios
        .get("/api/drivers/bus", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBus(response.data.bus);
          setName(response.data.bus.name);
          setColor(response.data.bus.color);
          setLicensePlate(response.data.bus.licensePlate);
          setServiceProvider(response.data.bus.serviceProvider);
          setPrice(response.data.bus.price);
          setSeats(response.data.bus.seats);
          setCapacity(response.data.bus.capacity);
          setPhoto(response.data.bus.photo);
          setPhotos(response.data.bus.photos);
          setDescription(response.data.bus.description);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchDriverBus();

    axios
      .get(`/api/drivers/me`, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setDriver(res.data.driver);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // update bus photo -> bus cover
  const updatePhotoFunction = async (e) => {
    e.preventDefault();

    if (
      !selectedFiles ||
      selectedFiles === "" ||
      selectedFiles === undefined ||
      selectedFiles === null ||
      selectedFiles.length === 0
    ) {
      setPhotoError(true);
      setPhotoErrorMsg("* تصویر اصلی اتوبوس باید وارد شود");
    } else {
      setBtnSpinner2(true);

      const formData = new FormData();
      formData.append("photo", selectedFiles[0]);

      try {
        setBtnSpinner2(true);

        await axios
          .put(`/api/drivers/bus/${bus._id}/update-photo`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBtnSpinner2(false);

            toast.success("تصویر اصلی ویرایش شد", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("Response:", res.data.bus);
            setPhoto(res.data.bus.photo);
          })
          .catch((error) => {
            setBtnSpinner2(false);
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
      } catch (error) {
        setBtnSpinner2(false);
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
      } finally {
        setBtnSpinner2(false);
      }
    }
  };

  // update bus photos
  const updatePhotosFunction = async (e) => {
    e.preventDefault();

    if (
      !selectedFiles2 ||
      selectedFiles2 === "" ||
      selectedFiles2 === undefined ||
      selectedFiles2 === null ||
      selectedFiles2.length === 0
    ) {
      setPhotosError(true);
      setPhotosErrorMsg("* تصاویر اتوبوس باید وارد شوند");
    } else {
      setBtnSpinner3(true);

      const formData = new FormData();

      selectedFiles2.forEach((img) => {
        formData.append("photos", img);
      });

      try {
        setBtnSpinner3(true);

        await axios
          .put(`/api/drivers/bus/${bus._id}/update-photos`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBtnSpinner3(false);

            toast.success("تصاویر اتوبوس ویرایش شدند", {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.log("Response:", res.data.bus);
            setPhoto(res.data.bus.photo);
          })
          .catch((error) => {
            setBtnSpinner3(false);
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
      } catch (error) {
        setBtnSpinner3(false);
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
      } finally {
        setBtnSpinner3(false);
      }
    }
  };

  // update bus handler
  const updateBusHandler = (e) => {
    e.preventDefault();

    if (!name || name === "" || name === undefined || name === null) {
      setNameError(true);
      setNameErrorMsg("* نام اتوبوس باید وارد شود");
    }

    if (!model || model === "" || model === undefined || model === null) {
      setModelError(true);
      setModelErrorMsg("* مدل اتوبوس باید وارد شود");
    }

    if (!color || color === "" || color === undefined || color === null) {
      setColorError(true);
      setColorErrorMsg("* رنگ اتوبوس باید وارد شود");
    }

    if (!type || type === "" || type === undefined || type === null) {
      setTypeError(true);
      setTypeErrorMsg("* نوع اتوبوس باید وارد شود");
    }

    if (
      !licensePlate ||
      licensePlate === "" ||
      licensePlate === undefined ||
      licensePlate === null
    ) {
      setLicensePlateError(true);
      setLicensePlateErrorMsg("* پلاک اتوبوس باید وارد شود");
    }

    if (
      !serviceProvider ||
      serviceProvider === "" ||
      serviceProvider === undefined ||
      serviceProvider === null
    ) {
      setServiceProviderError(true);
      setServiceProviderErrorMsg("* نام ارائه دهنده اتوبوس باید وارد شود");
    }

    if (!price || price === "" || price === undefined || price === null) {
      setPriceError(true);
      setPriceErrorMsg("* قیمت بلیط اتوبوس باید وارد شود");
    }

    if (!seats || seats === "" || seats === undefined || seats === null) {
      setSeatsError(true);
      setSeatsErrorMsg("* تعداد صندلی های اتوبوس باید وارد شود");
    }

    if (
      !capacity ||
      capacity === "" ||
      capacity === undefined ||
      capacity === null
    ) {
      setCapacityError(true);
      setCapacityErrorMsg("* ظرفیت اتوبوس باید وارد شود");
    }

    if (
      !options ||
      options === "" ||
      options === undefined ||
      options === null
    ) {
      setOptionsError(true);
      setOptionsErrorMsg("* امکانات اضافی اتوبوس باید وارد شود");
    }

    if (!heat || heat === "" || heat === undefined || heat === null) {
      setHeatError(true);
      setHeatErrorMsg("* سیستم سرمایشی اتوبوس باید وارد شود");
    }

    if (
      !coldness ||
      coldness === "" ||
      coldness === undefined ||
      coldness === null
    ) {
      setColdnessError(true);
      setColdnessErrorMsg("* سیستم گرمایشی اتوبوس باید وارد شود");
    }

    if (
      !description ||
      description === "" ||
      description === undefined ||
      description === null
    ) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* توضیحات اتوبوس باید وارد شود");
    }

    if (model.length === 0) {
      setModelError(true);
      setModelErrorMsg("* مدل اتوبوس باید وارد شود");
    }

    if (type.length === 0) {
      setTypeError(true);
      setTypeErrorMsg("* نوع اتوبوس باید وارد شود");
    }

    if (heat.length === 0) {
      setHeatError(true);
      setHeatErrorMsg("* امکانات گرمایشی اتوبوس باید وارد شود");
    }

    if (coldness.length === 0) {
      setColdnessError(true);
      setColdnessErrorMsg("* امکانات سرمایشی اتوبوس باید وارد شود");
    } else {
      setBtnSpinner1(true);
      setIsOpen(true);

      // toast(
      //   ({ closeToast }) => (
      //     <div style={styles.toastBox}>
      //       <p style={styles.message}>آیا از ویرایش اتوبوس اطمینان دارید؟</p>
      //       <div style={styles.buttonRow}>
      //         <button
      //           onClick={handleCancel}
      //           style={{ ...styles.button, ...styles.cancel }}
      //         >
      //           لغو
      //         </button>
      //         <button
      //           onClick={handleConfirm}
      //           style={{ ...styles.button, ...styles.confirm }}
      //         >
      //           تایید
      //         </button>
      //       </div>
      //     </div>
      //   ),
      //   {
      //     autoClose: false,
      //     closeOnClick: false,
      //     closeButton: false,
      //     position: "top-left",
      //     draggable: false,
      //     transition: Slide,
      //     style: { width: "300px" },
      //   }
      // );
    }
  };

  const sendUpdateRequest = () => {
    setIsOpen(false);

    let newOptions = [];

    options.forEach((opt) => {
      newOptions.push(opt.label);
    });

    try {
      axios
        .put(
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
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setBtnSpinner1(false);
          toast.success("اتوبوس ویرایش شد", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } catch (error) {
      setBtnSpinner1(false);
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

      {bus ? (
        <div className="flex flex-col gap-6 p-4 rtl text-right w-full">
          {/* First Card */}
          <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white">
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex-1 text-right">
                <h2 className="text-lg font-bold">{bus.name}</h2>
                <p className="text-sm text-gray-600 my-2">{bus.description}</p>
                <ul className="list-disc pr-5 mt-2 text-sm text-gray-700">
                  {/* {bus.options.map((opt) => (
                                        <li>{opt.replace(",", " ")}</li>
                                    ))} */}

                  {/* {bus.options.map((item, index) => (
                                       <li key={index}>{item.replace(","," ")}</li>
                                    ))} */}
                </ul>
              </div>
              <img
                src={bus.photo}
                alt="Bus"
                className="w-1/3 h-32 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
              {bus.photos.map((item, index) => (
                <img
                  key={index}
                  src={item[index]}
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

                  {/* <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <PiImage className="w-6 h-6 text-gray-400" />
                                </div> */}
                  {/* <input type="file" onChange={(e) => setPhoto(e.target.files[0])} name="photo" id="photo" className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" /> */}
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
                  <span className="text-red-500 relative text-sm">
                    {photoError ? photoErrorMsg : ""}
                  </span>
                  <div className="mt-6">
                    <img
                      className="rounded-md"
                      src={`../../../../uploads/cookAdsDir/${photo}`}
                      style={{ width: "50px", height: "50px" }}
                      alt="تصویر اصلی اتوبوس"
                    />
                  </div>
                  <button
                    className="app-btn-blue mt-4"
                    onClick={updatePhotoFunction}
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
                                {/* <img
                                                            src={window.location.origin + file.name}
                                                            alt="File"
                                                            className="w-10 h-10 mr-2"
                                                        /> */}
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
                  <span className="text-red-500 relative text-sm">
                    {photosError ? photosErrorMsg : ""}
                  </span>
                  <div className="mt-6 flex justify-start">
                    {photos.map((file, index) => (
                      <img
                        className="rounded-md ml-4"
                        key={index + 1}
                        src={file}
                        style={{ width: "50px", height: "50px" }}
                        alt="تصویر اصلی اتوبوس"
                      />
                    ))}
                  </div>

                  <button
                    className="app-btn-blue mt-4"
                    onClick={updatePhotosFunction}
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
                      onChange={(e) => setName(e.target.value)}
                      className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                      placeholder="نام اتوبوس"
                    />
                  </div>
                  <span className="text-red-500 relative text-sm">
                    {nameError ? nameErrorMsg : ""}
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
                  <small className="my-2 font-sm text-gray-500">
                    مدل انتخاب شده: * {bus.model}
                  </small>
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
                    {modelError ? modelErrorMsg : ""}
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
                    {colorError ? colorErrorMsg : ""}
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
                  <small className="my-2 font-sm text-gray-500">
                    نوع اتوبوس انتخاب شده: * {bus.type}
                  </small>

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
                    {typeError ? typeErrorMsg : ""}
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
                    {licensePlateError ? licensePlateErrorMsg : ""}
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
                    {serviceProviderError ? serviceProviderErrorMsg : ""}
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
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                      placeholder=" قیمت به ازای هر نفر"
                    />
                  </div>
                  <span className="text-red-500 relative text-sm">
                    {priceError ? priceErrorMsg : ""}
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
                    {seatsError ? seatsErrorMsg : ""}
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
                    {capacityError ? capacityErrorMsg : ""}
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
                  {bus.options.map((opt) => (
                    <small className="my-2 font-sm text-gray-500">
                      امکانات انتخاب شده: * {opt.replace(/,/g, "، ")}
                    </small>
                  ))}
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
                    {optionsError ? optionsErrorMsg : ""}
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
                  <small className="my-2 font-sm text-gray-500">
                    سیستم گرمایشی انتخاب شده: * {bus.heat}
                  </small>
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
                    {heatError ? heatErrorMsg : ""}
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
                  <small className="my-2 font-sm text-gray-500">
                    سیستم سرمایشی انتخاب شده: * {bus.coldness}
                  </small>
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
                    {coldnessError ? coldnessErrorMsg : ""}
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
              </div>
            </div>

            <div className="mt-2 p-4">
              <button className="app-btn-blue" onClick={updateBusHandler}>
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
          <div className="border rounded-xl shadow-lg py-4 px-8 w-full bg-white h-screen">
            <h1 className="mt-4">اتوبوس هنوز اضافه نشده است ...</h1>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default MyBus;
