import { useState, useRef } from "react";
import { useCookAuthStore } from '../stores/authStore';
import TitleCard from "../components/Cards/TitleCard";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiSubtitlesLight } from "react-icons/pi";

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
    <TitleCard title="افزودن تیکت پشتیبانی" topMargin="mt-2">
      <div className="mx-auto px-4 sm:px-6">
        {/* Title input */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-sm font-medium text-gray-700">
            عنوان
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PiSubtitlesLight className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="عنوان تیکت پشتیبانی"
            />
          </div>
          {titleError && (
            <span className="mt-1 text-sm text-red-600">{titleErrorMsg}</span>
          )}
        </div>

        {/* Description input */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-sm font-medium text-gray-700">
            توضیحات
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3">
              <IoIosInformationCircleOutline className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[120px]"
              placeholder="توضیحات تیکت پشتیبانی"
            />
          </div>
          {descriptionError && (
            <span className="mt-1 text-sm text-red-600">{descriptionErrorMsg}</span>
          )}
        </div>

        {/* File upload */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-sm font-medium text-gray-700">
            انتخاب تصویر/فایل
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center md:justify-start">
              <button
                type="button"
                onClick={handleCustomButtonClick}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                انتخاب فایل
              </button>
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

            <div className="md:col-span-2 rounded-lg overflow-hidden bg-white p-4 shadow-sm border border-gray-200">
              {selectedFiles.length > 0 ? (
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="py-3 px-2 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm truncate flex-1 mr-2">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="حذف فایل"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">
                  هنوز فایلی انتخاب نشده است...
                </p>
              )}
            </div>
          </div>
          {photosError && (
            <span className="mt-1 text-sm text-red-600">{photosErrorMsg}</span>
          )}
        </div>

        {/* Submit button */}
        <div className="mt-8 flex justify-center">
          <button
            className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            onClick={addSupportTicketHandler}
            disabled={btnSpinner}
          >
            {btnSpinner ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                در حال پردازش...
              </div>
            ) : (
              <span>ایجاد تیکت پشتیبانی</span>
            )}
          </button>
        </div>
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
      />
    </TitleCard>
  );
}

export default CreateSupportTicket;