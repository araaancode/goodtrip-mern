import { useState, useRef } from "react";
import { useCookAuthStore } from '../stores/authStore';
import TitleCard from "../components/Cards/TitleCard";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircleOutline, IoIosCreate } from "react-icons/io";
import { PiSubtitlesLight } from "react-icons/pi";
import { FiUpload, FiX, FiFile, FiCheckCircle, FiMessageSquare, FiImage } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";

function CreateSupportTicket() {
  const { isCookAuthenticated, cook } = useCookAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Accepted file types
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];
  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  // Error states
  const [titleError, setTitleError] = useState(false);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMsg, setDescriptionErrorMsg] = useState("");
  const [photosError, setPhotosError] = useState(false);
  const [photosErrorMsg, setPhotosErrorMsg] = useState("");

  // Handle file selection
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
        toast.error("نام فایل ها باید منحصر به فرد باشد");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(`فقط فایل های ${acceptedFileExtensions.join(", ")} مجاز هستند`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) setSelectedFiles(newSelectedFiles);
  };

  const handleCustomButtonClick = () => fileInputRef.current?.click();

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  // Drag and drop functionality
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Create support ticket
  const addSupportTicketHandler = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setTitleError(false);
    setDescriptionError(false);
    setPhotosError(false);
    
    // Validate inputs
    let isValid = true;
    if (!title.trim()) {
      setTitleError(true);
      setTitleErrorMsg("* عنوان تیکت پشتیبانی باید وارد شود");
      isValid = false;
    }
    if (!description.trim()) {
      setDescriptionError(true);
      setDescriptionErrorMsg("* توضیحات تیکت پشتیبانی باید وارد شود");
      isValid = false;
    }
    if (selectedFiles.length === 0) {
      setPhotosError(true);
      setPhotosErrorMsg("* تصویر یا فایل مربوط به تیکت پشتیبانی باید وارد شود");
      isValid = false;
    }

    if (!isValid) return;

    setBtnSpinner(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      selectedFiles.forEach((file) => formData.append("images", file));

      await axios.post(`/api/cooks/support-tickets`, formData, {
        withCredentials: true
      });

      // Reset form on success
      setTitle("");
      setDescription("");
      setSelectedFiles([]);
      
      toast.success("تیکت پشتیبانی با موفقیت ایجاد شد");
    } catch (error) {
      console.error("Error creating support ticket:", error);
      toast.error("خطایی در ایجاد تیکت پشتیبانی رخ داد");
    } finally {
      setBtnSpinner(false);
    }
  };

  return (
    <div className="min-h-screen py-1 px-1">
      <div className="w-full mx-auto">
        <TitleCard 
          title={
            <div className="flex space-x-3 rtl:space-x-reverse">
              <span>ایجاد تیکت پشتیبانی جدید</span>
            </div>
          } 
          topMargin="mt-0"
          className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
            
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
                تیکت پشتیبانی جدید
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                مشکل یا درخواست خود را با جزئیات کامل شرح دهید تا تیم پشتیبانی بتواند به بهترین شکل به شما کمک کند
              </p>
            </div>

            <form className="space-y-6 md:space-y-8">
              {/* Title input - FIXED SPACING */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <PiSubtitlesLight className="ml-2 text-blue-500" />
                  عنوان تیکت
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="p-2 ">
                      <PiSubtitlesLight className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none  focus:ring-blue-100/50 backdrop-blur-sm ${
                      titleError 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="مثال: مشکل در ثبت سفارش جدید..."
                    style={{borderRadius:'8px'}}
                  />
                </div>
                {titleError && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {titleErrorMsg}
                  </span>
                )}
              </div>

              {/* Description input - FIXED SPACING */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiMessageSquare className="ml-2 text-blue-500" />
                  توضیحات کامل
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 z-10">
                    <div className="p-2 ">
                      <IoIosInformationCircleOutline className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full pl-14 pr-4 py-4 text-base rounded-2xl border-2 transition-all duration-300 focus:outline-none  focus:ring-blue-100/50 min-h-[140px] resize-none backdrop-blur-sm ${
                      descriptionError 
                        ? "border-red-300 bg-red-50/50" 
                        : "border-gray-200/80 focus:border-blue-500 bg-white/50"
                    }`}
                    placeholder="شرح کامل مشکل، خطاهای مشاهده شده، و اقداماتی که تاکنون انجام داده‌اید..."
                    style={{borderRadius:'8px'}}

                  />
                </div>
                {descriptionError && (
                  <span className="mt-2 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {descriptionErrorMsg}
                  </span>
                )}
              </div>

              {/* File upload section */}
              <div className="flex flex-col">
                <label className="mb-3 text-base font-semibold text-gray-800 flex items-center">
                  <FiImage className="ml-2 text-blue-500" />
                  پیوست‌ها (تصاویر)
                  <span className="text-red-500 mr-1">*</span>
                </label>
                
                {/* Upload Area */}
                <div 
                  className={`relative group rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isDragOver 
                      ? "scale-[1.02] shadow-lg" 
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={handleCustomButtonClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    isDragOver 
                      ? "from-blue-50 to-indigo-50" 
                      : photosError 
                        ? "from-red-50 to-red-50" 
                        : "from-gray-50 to-blue-50/30"
                  } backdrop-blur-sm`} />
                  
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? "border-blue-400 shadow-inner" 
                      : photosError 
                        ? "border-red-300" 
                        : "border-gray-300 group-hover:border-blue-400"
                  }`}>
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4 py-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        isDragOver ? "scale-110 bg-blue-100" : "bg-white/80 shadow-sm"
                      }`}>
                        <FiUpload className={`w-8 h-8 transition-colors ${
                          isDragOver ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div className="space-y-2">
                        <p className={`text-lg font-semibold transition-colors ${
                          isDragOver ? "text-blue-700" : "text-gray-700"
                        }`}>
                          {isDragOver ? "فایل‌ها را رها کنید" : "آپلود فایل‌ها"}
                        </p>
                        <p className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          فرمت‌های مجاز: {acceptedFileExtensions.join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                      >
                        انتخاب فایل‌ها
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept={acceptedFileTypesString}
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    onClick={(e) => (e.target.value = null)}
                  />
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FiCheckCircle className="text-green-500 w-5 h-5" />
                        <span className="text-sm font-semibold text-gray-700">
                          فایل‌های انتخاب شده ({selectedFiles.length})
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        آماده آپلود
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <FiFile className="text-blue-500 w-4 h-4 flex-shrink-0" />
                            </div>
                            <span className="text-sm font-medium truncate text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileDelete(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                            aria-label="حذف فایل"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {photosError && (
                  <span className="mt-3 text-sm text-red-600 flex items-center bg-red-50/50 px-3 py-2 rounded-lg">
                    <FiX className="ml-1 w-4 h-4" />
                    {photosErrorMsg}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-6">
                <button
                  className="w-50 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:outline-none  focus:ring-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  onClick={addSupportTicketHandler}
                  disabled={btnSpinner}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    {btnSpinner ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>در حال ایجاد تیکت...</span>
                      </>
                    ) : (
                      <>
                        <MdOutlineSupportAgent className="w-5 h-5" />
                        <span>ایجاد تیکت پشتیبانی</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </TitleCard>
      </div>
      
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl shadow-lg border border-gray-200/50"
        progressClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
      />
    </div>
  );
}

export default CreateSupportTicket;