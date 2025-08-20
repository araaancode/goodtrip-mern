import { useState, useRef } from "react"
import TitleCard from "../components/Cards/TitleCard"
import axios from "axios"
import 'react-tailwindcss-select/dist/index.css'

// icons
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineMapPin } from "react-icons/hi2";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create axios instance with default credentials
const api = axios.create({
  withCredentials: true, 
});

function CreateAds() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        title: "",
        description: "",
        price: 0
    });
    
    const [errors, setErrors] = useState({});
    const [btnSpinner, setBtnSpinner] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFiles2, setSelectedFiles2] = useState([]);

    const fileInputRef = useRef(null);
    const fileInputRef2 = useRef(null);
    
    const acceptedFileExtensions = ["jpg", "png", "jpeg"];
    const acceptedFileTypesString = acceptedFileExtensions.map(ext => `.${ext}`).join(",");

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "* نام و نام خانوادگی مشتری باید وارد شود";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "* شماره مشتری باید وارد شود";
        } else if (formData.phone.length !== 11) {
            newErrors.phone = "* شماره تلفن باید 11 رقمی باشد";
        }

        if (!formData.address.trim()) {
            newErrors.address = "* آدرس مشتری باید وارد شود";
        }

        if (!formData.title.trim()) {
            newErrors.title = "* عنوان آگهی باید وارد شود";
        }

        if (!formData.description.trim()) {
            newErrors.description = "* توضیحات آگهی باید وارد شود";
        }

        if (selectedFiles.length === 0) {
            newErrors.photo = "* تصویر اصلی آگهی باید وارد شود";
        }

        if (selectedFiles2.length === 0) {
            newErrors.photos = "* تصاویر آگهی باید وارد شوند";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (event, setFiles, currentFiles) => {
        const newFilesArray = Array.from(event.target.files);
        processFiles(newFilesArray, setFiles, currentFiles);
    };

    const processFiles = (filesArray, setFiles, currentFiles) => {
        const newSelectedFiles = [...currentFiles];
        let hasError = false;
        const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
        
        filesArray.forEach((file) => {
            if (newSelectedFiles.some(f => f.name === file.name)) {
                toast.error("نام فایل ها باید منحصر به فرد باشد");
                hasError = true;
            } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
                toast.error(`فقط فایل های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
                hasError = true;
            } else {
                newSelectedFiles.push(file);
            }
        });

        if (!hasError) {
            setFiles(newSelectedFiles);
        }
    };

    const handleFileDelete = (index, setFiles, currentFiles) => {
        const updatedFiles = [...currentFiles];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            address: "",
            title: "",
            description: "",
            price: 0
        });
        setSelectedFiles([]);
        setSelectedFiles2([]);
        setErrors({});
    };

    const CreateAdsHandle = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setBtnSpinner(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('address', formData.address);
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description);
            formDataObj.append('price', formData.price);
            formDataObj.append('photo', selectedFiles[0]);
            
            selectedFiles2.forEach(image => {
                formDataObj.append('photos', image);
            });

            const response = await api.post('/api/drivers/ads', formDataObj, {
                // withCredentials: true is already set in the axios instance
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            resetForm();
            toast.success('آگهی با موفقیت اضافه شد');
            
        } catch (error) {
            console.error('Error creating ad:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.msg || 
                               'خطایی وجود دارد. دوباره امتحان کنید!';
            toast.error(errorMessage);
        } finally {
            setBtnSpinner(false);
        }
    };

    return (
        <>
            <TitleCard title="افزودن آگهی" topMargin="mt-2">
                <div className="mx-auto">
                    {/* Name */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="name" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            نام و نام خانوادگی مشتری
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <CiUser className="w-6 h-6 text-gray-400" />
                            </div>
                            <input
                                style={{ borderRadius: '5px' }}
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="نام و نام خانوادگی مشتری"
                            />
                        </div>
                        {errors.name && <span className='text-red-500 text-sm mt-1'>{errors.name}</span>}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            شماره مشتری
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <BsTelephone className="w-6 h-6 text-gray-400" />
                            </div>
                            <input
                                style={{ borderRadius: '5px' }}
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="شماره مشتری"
                                maxLength={11}
                            />
                        </div>
                        {errors.phone && <span className='text-red-500 text-sm mt-1'>{errors.phone}</span>}
                    </div>

                    {/* Title */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="title" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            عنوان آگهی
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <TbClipboardText className="w-6 h-6 text-gray-400" />
                            </div>
                            <input
                                style={{ borderRadius: '5px' }}
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="عنوان آگهی"
                            />
                        </div>
                        {errors.title && <span className='text-red-500 text-sm mt-1'>{errors.title}</span>}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="price" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            قیمت آگهی
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <IoPricetagOutline className="w-6 h-6 text-gray-400" />
                            </div>
                            <input
                                style={{ borderRadius: '5px' }}
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="قیمت آگهی"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Main Photo */}
                    <div className="flex flex-col mb-6">
                        <label className="mb-2 text-xs sm:text-sm tracking-wide text-gray-600">
                            تصویر اصلی آگهی
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
                            <div className="flex items-center">
                                <button
                                    className="app-btn-gray"
                                    onClick={() => fileInputRef.current?.click()}
                                    type="button"
                                >
                                    انتخاب تصویر اصلی
                                </button>
                                <input
                                    type="file"
                                    accept={acceptedFileTypesString}
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setSelectedFiles, selectedFiles)}
                                    onClick={(e) => e.target.value = null}
                                />
                            </div>
                            <div className="rounded-3xl py-4 max-h-[23rem] overflow-auto">
                                {selectedFiles.length > 0 ? (
                                    <ul className="px-4">
                                        {selectedFiles.map((file, index) => (
                                            <li key={file.name} className="flex justify-between items-center border-b py-2">
                                                <span className="text-base mx-2">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFileDelete(index, setSelectedFiles, selectedFiles)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
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
                        {errors.photo && <span className='text-red-500 text-sm mt-1'>{errors.photo}</span>}
                    </div>

                    {/* Additional Photos */}
                    <div className="flex flex-col mb-6">
                        <label className="mb-2 text-xs sm:text-sm text-gray-600">
                            تصاویر آگهی
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-md py-2 focus:outline-none focus:border-blue-800">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef2.current?.click()}
                                    className="app-btn-gray"
                                >
                                    انتخاب تصاویر آگهی
                                </button>
                                <input
                                    type="file"
                                    multiple
                                    accept={acceptedFileTypesString}
                                    ref={fileInputRef2}
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setSelectedFiles2, selectedFiles2)}
                                    onClick={(e) => e.target.value = null}
                                />
                            </div>
                            <div className="rounded-3xl py-4 max-h-[23rem] overflow-auto">
                                {selectedFiles2.length > 0 ? (
                                    <ul className="px-4">
                                        {selectedFiles2.map((file, index) => (
                                            <li key={file.name} className="flex justify-between items-center border-b py-2">
                                                <span className="text-base mx-2">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFileDelete(index, setSelectedFiles2, selectedFiles2)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ✕
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
                        {errors.photos && <span className='text-red-500 text-sm mt-1'>{errors.photos}</span>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col mb-2">
                        <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            توضیحات
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
                            </div>
                            <textarea
                                style={{ borderRadius: '5px', resize: 'none' }}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="توضیحات"
                                rows={4}
                            />
                        </div>
                        {errors.description && <span className='text-red-500 text-sm mt-1'>{errors.description}</span>}
                    </div>

                    {/* Address */}
                    <div className="flex flex-col mb-2">
                        <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                            آدرس
                        </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                <HiOutlineMapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <textarea
                                style={{ borderRadius: '5px', resize: 'none' }}
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                placeholder="آدرس"
                                rows={4}
                            />
                        </div>
                        {errors.address && <span className='text-red-500 text-sm mt-1'>{errors.address}</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4">
                        <button
                            className="app-btn-blue"
                            onClick={CreateAdsHandle}
                            disabled={btnSpinner}
                        >
                            {btnSpinner ? (
                                <div className="px-10 py-1 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <span>اضافه کردن آگهی</span>
                            )}
                        </button>
                    </div>
                </div>

                <ToastContainer />
            </TitleCard>
        </>
    )
}

export default CreateAds