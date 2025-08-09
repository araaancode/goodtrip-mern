import { useState, useRef } from "react";
import { useCookAuthStore } from '../stores/authStore';
import TitleCard from "../components/Cards/TitleCard";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
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

  const handleCustomButtonClick = () => fileInputRef.current.click();

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
    if (!title) {
      setTitleError(true);
      setTitleErrorMsg("* عنوان تیکت پشتیبانی باید وارد شود");
      isValid = false;
    }
    if (!description) {
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
      <div className="mx-auto">
        {/* Title input */}
        <div className="flex flex-col mb-6">
          <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
            عنوان
          </label>
          <div className="relative">
            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <PiSubtitlesLight className="w-6 h-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
              placeholder="عنوان تیکت پشتیبانی"
              style={{ borderRadius: "5px" }}
            />
          </div>
          {titleError && (
            <span className="text-red-500 text-sm">{titleErrorMsg}</span>
          )}
        </div>

        {/* Description input */}
        <div className="flex flex-col mb-6">
          <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
            توضیحات
          </label>
          <div className="relative">
            <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400">
              <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
              placeholder="توضیحات تیکت پشتیبانی"
              style={{ borderRadius: "5px", resize: "none", minHeight: "120px" }}
            />
          </div>
          {descriptionError && (
            <span className="text-red-500 text-sm">{descriptionErrorMsg}</span>
          )}
        </div>

        {/* File upload */}
        <div className="flex flex-col mb-6">
          <label className="mb-2 text-xs sm:text-sm text-gray-600">
            انتخاب تصویر/فایل
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleCustomButtonClick}
                className="app-btn-gray bg-white"
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

            <div className="rounded-xl max-h-96 overflow-auto bg-white p-4 shadow-sm">
              {selectedFiles.length > 0 ? (
                <ul className="px-4">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <span className="text-base mx-2 truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        type="button"
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
                  هنوز فایلی انتخاب نشده است...
                </p>
              )}
            </div>
          </div>
          {photosError && (
            <span className="text-red-500 text-sm">{photosErrorMsg}</span>
          )}
        </div>

        {/* Submit button */}
        <div className="mt-4">
          <button
            className="app-btn-blue"
            onClick={addSupportTicketHandler}
            disabled={btnSpinner}
          >
            {btnSpinner ? (
              <div className="px-10 py-1 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <span>ایجاد تیکت پشتیبانی</span>
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </TitleCard>
  );
}

export default CreateSupportTicket;