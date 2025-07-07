import { useState, useRef } from "react"
import TitleCard from "../components/Cards/TitleCard"
import 'react-tailwindcss-select/dist/index.css'
import axios from "axios"
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiSubtitlesLight } from "react-icons/pi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateSupportTicket() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState(null)
    const [photos, setPhotos] = useState([])

    const [btnSpinner, setBtnSpinner] = useState(false)

    let token = localStorage.getItem("userToken")


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
    const [titleError, setTitleError] = useState(false)
    const [titleErrorMsg, setTitleErrorMsg] = useState("")
    const [descriptionError, setDescriptionError] = useState(false)
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("")
    const [photosError, setPhotosError] = useState(false)
    const [photosErrorMsg, setPhotosErrorMsg] = useState("")



    const addSupportTicketHandler = (e) => {
        e.preventDefault();
        // title error
        if (!title || title === "" || title === undefined || title === null) {
            setTitleError(true)
            setTitleErrorMsg("* عنوان تیکت پشتیبانی باید وارد شود")
        }

        if (!description || description === "" || description === undefined || description === null) {
            setDescriptionError(true)
            setDescriptionErrorMsg("* توضیحات تیکت پشتیبانی باید وارد شود")
        }

        if (!selectedFiles2 || selectedFiles2 === "" || selectedFiles2 === undefined || selectedFiles2 === null || selectedFiles2.length === 0) {
            setPhotosError(true)
            setPhotosErrorMsg("* تصویر یا فایل مربوط به تیکت پشتیبانی باید وارد شود")
        }

        else {
            setBtnSpinner(true)


            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            selectedFiles2.forEach(image => formData.append('images', image));

            axios.post(`/api/drivers/support-tickets`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'Bearer ' + token
                },
            })
                .then((response) => {
                    setBtnSpinner(false)

                    setTitle("")
                    setDescription("")
                    setPhotos([])
                    setSelectedFiles2([])

                    toast.success('تیکت پشتیبانی اضافه شد', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
                .catch((error) => {
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
        }
    }





    return (
        <>
            <TitleCard title="افزودن تیکت پشتیبانی" topMargin="mt-2">
                <div className="mx-auto">
                    {/*  title */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="title" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">عنوان</label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <PiSubtitlesLight className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={title}
                                onChange={(e) => setTitle(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="عنوان تیکت پشتیبانی" />
                        </div>
                        <span className='text-red-500 relative text-sm'>{titleError ? titleErrorMsg : ""}</span>
                    </div>


                    {/*  description */}
                    <div className="flex flex-col mb-2">
                        <label htmlFor="description" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">توضیحات </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
                            </div>
                            <textarea style={{ borderRadius: '5px', resize: 'none' }} type="text" value={description}
                                onChange={(e) => setDescription(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="توضیحات تیکت پشتیبانی "></textarea>
                        </div>
                        <span className='text-red-500 relative text-sm'>{descriptionError ? descriptionErrorMsg : ""}</span>
                    </div>

                    {/* food photos */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="photo" className="mb-2 text-xs sm:text-sm text-gray-600"> انتخاب تصویر  </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={handleCustomButtonClick2}
                                    className="app-btn-gray"
                                >

                                    انتخاب
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
                                            هنوز آیتمی آپلود نشده است...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className='text-red-500 relative text-sm'>{photosError ? photosErrorMsg : ""}</span>
                    </div>

                    {/* create support ticket button */}
                    <div className="mt-4">

                        <button className="app-btn-blue" onClick={addSupportTicketHandler}>
                            {btnSpinner ? (
                                <div className="px-10 py-1 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <span> ایجاد تیکت پشتیبانی</span>
                            )}
                        </button>

                    </div>
                </div>

                <ToastContainer />

            </TitleCard>
        </>
    )
}


export default CreateSupportTicket