import { useState, useRef, useEffect } from "react"
import TitleCard from "../components/Cards/TitleCard"

import Select from "react-tailwindcss-select";
import 'react-tailwindcss-select/dist/index.css'

import Swal from 'sweetalert2'
import axios from "axios"

// icons
import { IoPricetagOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { HiOutlineMapPin } from "react-icons/hi2";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function UpdateAds() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [photo, setPhoto] = useState(null)
    const [photos, setPhotos] = useState([])
    const [ads, setAds] = useState({})

    const [btnSpinner, setBtnSpinner] = useState(false)

    let token = localStorage.getItem("userToken")
    let adsId = window.location.href.split('/advertisments/')[1].split('/update')[0]

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
                alert(`Only ${acceptedFileExtensions.join(", ")} files are allowed`, "error");
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
                alert(`Only ${acceptedFileExtensions2.join(", ")} files are allowed`, "error");
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
    const [nameError, setNameError] = useState(false)
    const [nameErrorMsg, setNameErrorMsg] = useState("")

    const [phoneError, setPhoneError] = useState(false)
    const [phoneErrorMsg, setPhoneErrorMsg] = useState("")

    const [addressError, setAddressError] = useState(false)
    const [addressErrorMsg, setAddressErrorMsg] = useState("")

    const [titleError, setTitleError] = useState(false)
    const [titleErrorMsg, setTitleErrorMsg] = useState("")

    const [priceError, setPriceError] = useState(false)
    const [priceErrorMsg, setPriceErrorMsg] = useState("")

    const [descriptionError, setDescriptionError] = useState(false)
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("")


    const [photoError, setPhotoError] = useState(false)
    const [photoErrorMsg, setPhotoErrorMsg] = useState("")

    const [photosError, setPhotosError] = useState(false)
    const [photosErrorMsg, setPhotosErrorMsg] = useState("")




    // get single ads
    useEffect(() => {
        axios.get(`/api/drivers/ads/${adsId}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setName(res.data.ads.company.name)
                setPhone(res.data.ads.company.phone)
                setAddress(res.data.ads.company.address)
                setTitle(res.data.ads.title)
                setDescription(res.data.ads.description)
                setPrice(res.data.ads.price)
                setPhoto(res.data.ads.photo)
                setPhotos(res.data.ads.photos)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [])


    // update ads
    const updateAdsHandle = (e) => {
        e.preventDefault();

        // name error
        if (!name || name === "" || name === undefined || name === null) {
            setNameError(true)
            setNameErrorMsg("* نام و نام خانوادگی مشتری باید وارد شود")
        }

        if (!phone || phone === "" || phone === undefined || phone === null) {
            setPhoneError(true)
            setPhoneErrorMsg("*  شماره مشتری باید وارد شود")
        }

        if (!address || address === "" || address === undefined || address === null) {
            setAddressError(true)
            setAddressErrorMsg("*  آدرس مشتری باید وارد شود")
        }

        if (!title || title === "" || title === undefined || title === null) {
            setTitleError(true)
            setTitleErrorMsg("*  عنوان أگهی باید وارد شود")
        }


        if (!description || description === "" || description === undefined || description === null) {
            setDescriptionError(true)
            setDescriptionErrorMsg("* توضیحات أگهی باید وارد شود")
        }


        // if (!selectedFiles || selectedFiles === "" || selectedFiles === undefined || selectedFiles === null || selectedFiles.length === 0) {
        //     setPhotoError(true)
        //     setPhotoErrorMsg("* تصویر اصلی أگهی باید وارد شود")
        // }
        // if (!selectedFiles2 || selectedFiles2 === "" || selectedFiles2 === undefined || selectedFiles2 === null || selectedFiles2.length === 0) {
        //     setPhotosError(true)
        //     setPhotosErrorMsg("* تصاویر أگهی باید وارد شوند")
        // }


        else {
            setBtnSpinner(true)

            Swal.fire({
                title: "<small>آیا از ویرایش آگهی اطمینان دارید؟</small>",
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`
            }).then((result) => {
                if (result.isConfirmed) {

                    try {
                        axios.put(`/api/drivers/ads/${adsId}/update-ads`, { name, phone, address, title, description, price }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer ' + token
                            },
                        }).then((res) => {

                            setBtnSpinner(false)

                            toast.success('آگهی ویرایش شد', {
                                position: "top-left",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        })

                    } catch (error) {
                        setBtnSpinner(false)
                        console.log('error', error)
                        toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                            position: "top-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    }
                } else if (result.isDenied) {
                    setBtnSpinner(false)
                    toast.info('تغییرات ذخیره نشد..!', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            });

        }
    }



    const updatePhotoFunction = async (e) => {
        e.preventDefault();

        if (!selectedFiles || selectedFiles === "" || selectedFiles === undefined || selectedFiles === null || selectedFiles.length === 0) {
            setPhotoError(true)
            setPhotoErrorMsg("* تصویر اصلی آگهی باید وارد شود")
        } else {
            setBtnSpinner(true)

            const formData = new FormData();
            formData.append('photo', selectedFiles[0]);


            console.log(formData);


            try {
                setBtnSpinner(true);

                await axios.put(
                    `/api/drivers/ads/${adsId}/update-photo`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`,
                        },
                    }
                ).then((res) => {

                    setBtnSpinner(false)

                    toast.success('تصویر اصلی ویرایش شد', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    console.log('Response:', res.data.ads);
                    setPhoto(res.data.ads.photo)
                }).catch((error) => {
                    setBtnSpinner(false)
                    console.log('error', error)
                    toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })

            } catch (error) {
                setBtnSpinner(false)
                console.log('error', error)
                toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } finally {
                setBtnSpinner(false);
            }
        }
    }


    const updatePhotosFunction = async (e) => {
        e.preventDefault();

        if (!selectedFiles2 || selectedFiles2 === "" || selectedFiles2 === undefined || selectedFiles2 === null || selectedFiles2.length === 0) {
            setPhotosError(true)
            setPhotosErrorMsg("* تصاویر آگهی باید وارد شوند")
        } else {
            setBtnSpinner(true)

            const formData = new FormData();


            selectedFiles2.forEach((img) => {
                formData.append('photos', img);
            })

            try {
                setBtnSpinner(true);

                await axios.put(
                    `/api/drivers/ads/${adsId}/update-photos`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`,
                        },
                    }
                ).then((res) => {

                    setBtnSpinner(false)

                    toast.success('تصاویر أگهی ویرایش شدند', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    console.log('Response:', res.data.ads);
                    setPhoto(res.data.ads.photo)
                }).catch((error) => {
                    setBtnSpinner(false)
                    console.log('error', error)
                    toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })

            } catch (error) {
                setBtnSpinner(false)
                console.log('error', error)
                toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } finally {
                setBtnSpinner(false);
            }
        }
    }





    return (
        <>
            <TitleCard title="ویرایش آگهی" topMargin="mt-2">
                {/* update ads main photo */}
                <div className="mx-auto">
                    {/*  ads photo  */}
                    <div className="flex flex-col mb-6">
                        <h4 className="font-bold text-gray-600">ویرایش عکس اصلی آگهی</h4>
                        <label htmlFor="photo" className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600 mt-6">تصویر اصلی آگهی </label>

                        {/* <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                    <PiImage className="w-6 h-6 text-gray-400" />
                                </div> */}
                        {/* <input type="file" onChange={(e) => setPhoto(e.target.files[0])} name="photo" id="photo" className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" /> */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
                            <div className="flex items-center">

                                <button className="app-btn-gray" onClick={handleCustomButtonClick}>
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

                                                    <span className="text-base mx-2">{file.name}</span>
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
                        <div className="mt-6">
                            <img className="rounded-md" src={`../../../../uploads/cookAdsDir/${photo}`} style={{ width: '50px', height: '50px' }} alt="تصویر اصلی آگهی" />
                        </div>
                        <button className="app-btn-blue mt-4" onClick={updatePhotoFunction}>
                            {btnSpinner ? (
                                <div className="px-10 py-1 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <span>ویرایش تصویر اصلی</span>
                            )}
                        </button>
                        <span className='text-red-500 relative text-sm'>{photoError ? photoErrorMsg : ""}</span>
                    </div>
                </div>
                <hr className="my-4" />
                {/* update ads photos */}
                <div className="mx-auto">
                    {/* ads photos */}
                    <div className="flex flex-col mb-6">
                        <h4 className="font-bold text-gray-600">ویرایش تصاویر آگهی</h4>

                        <label htmlFor="photo" className="mb-2 text-xs sm:text-sm text-gray-600 mt-4">تصاویر آگهی </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={handleCustomButtonClick2}
                                    className="app-btn-gray"
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
                                                    <span className="text-base mx-2">{file.name}</span>
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
                        <div className="mt-6 flex justify-start">
                            {photos.map((file, index) => (
                                <img className="rounded-md ml-4" key={index + 1} src={file} style={{ width: '50px', height: '50px' }} alt="تصویر اصلی آگهی" />
                            ))}
                        </div>
                        <button className="app-btn-blue mt-4" onClick={updatePhotosFunction}>ویرایش تصاویر آگهی</button>
                        <span className='text-red-500 relative text-sm'>{photosError ? photosErrorMsg : ""}</span>
                    </div>
                </div>
                <hr className="my-4" />

                {/* update ads */}
                <div className="mx-auto">
                    {/*  company name  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="name" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام و نام خانوادگی مشتری</label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <CiUser className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={name}
                                onChange={(e) => setName(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام و  نام خانوادگی مشتری" />
                        </div>
                        <span className='text-red-500 relative text-sm'>{nameError ? nameErrorMsg : ""}</span>
                    </div>

                    {/*  phone  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره مشتری</label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <BsTelephone className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="number" min={11} max={11} value={phone}
                                onChange={(e) => setPhone(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره مشتری" />
                        </div>
                        <span className='text-red-500 relative text-sm'>{phoneError ? phoneErrorMsg : ""}</span>
                    </div>


                    {/*  title  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="title" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">عنوان آگهی</label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <TbClipboardText className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={title}
                                onChange={(e) => setTitle(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="عنوان آگهی " />
                        </div>
                        <span className='text-red-500 relative text-sm'>{titleError ? titleErrorMsg : ""}</span>
                    </div>


                    {/*  price  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="price" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">قیمت أگهی </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <IoPricetagOutline className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="number" value={price}
                                onChange={(e) => setPrice(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="قیمت آگهی " />
                        </div>
                        {/* <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span> */}
                        <span className='text-red-500 relative text-sm'>{priceError ? priceErrorMsg : ""}</span>

                    </div>



                    {/*  description */}
                    <div className="flex flex-col mb-2">
                        <label htmlFor="description" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">توضیحات </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
                            </div>
                            <textarea style={{ borderRadius: '5px', resize: 'none' }} type="text" value={description}
                                onChange={(e) => setDescription(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="توضیحات "></textarea>
                        </div>
                        <span className='text-red-500 relative text-sm'>{descriptionError ? descriptionErrorMsg : ""}</span>
                    </div>


                    {/*  address */}
                    <div className="flex flex-col mb-2">
                        <label htmlFor="address" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">آدرس </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                <HiOutlineMapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <textarea style={{ borderRadius: '5px', resize: 'none' }} type="text" value={address}
                                onChange={(e) => setAddress(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="آدرس "></textarea>
                        </div>
                        <span className='text-red-500 relative text-sm'>{addressError ? addressErrorMsg : ""}</span>
                    </div>

                    {/* add button */}
                    <div className="mt-4">
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
        </>
    )
}


export default UpdateAds