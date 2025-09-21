import { useState, useRef } from "react";
import TitleCard from "../components/Cards/TitleCard";
import { useCookAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Icons
import { IoPricetagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { TbClipboardText } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineMapPin } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import { padding } from "@mui/system";

function CreateAds() {
  const { isCookAuthenticated } = useCookAuthStore();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    price: 0,
  });

  // Error state initialization
  const initialErrors = {
    name: { status: false, message: "" },
    phone: { status: false, message: "" },
    address: { status: false, message: "" },
    title: { status: false, message: "" },
    description: { status: false, message: "" },
    photo: { status: false, message: "" },
    photos: { status: false, message: "" },
  };

  const [errors, setErrors] = useState(initialErrors);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);

  // File upload refs
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name]?.status) {
      setErrors((prev) => ({
        ...prev,
        [name]: { status: false, message: "" },
      }));
    }
  };

  // File handling functions
  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles, "photo");
  };

  const handleFileChange2 = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray, setSelectedFiles2, "photos");
  };

  const processFiles = (filesArray, setFiles, field) => {
    const newSelectedFiles = [];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");

    filesArray.forEach((file) => {
      if (!fileTypeRegex.test(file.name.split(".").pop())) {
        toast.error(
          `فقط فایل‌های ${acceptedFileExtensions.join(", ")} قابل قبول هستند`
        );
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setFiles(newSelectedFiles);
      if (errors[field]?.status) {
        setErrors((prev) => ({
          ...prev,
          [field]: { status: false, message: "" },
        }));
      }
    }
  };

  const handleFileDelete = (index, setFiles) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...initialErrors };

    if (!formData.name.trim()) {
      newErrors.name = {
        status: true,
        message: "* نام و نام خانوادگی مشتری باید وارد شود",
      };
      isValid = false;
    }

    if (!formData.phone.trim() || formData.phone.length !== 11) {
      newErrors.phone = {
        status: true,
        message: "* شماره تماس باید 11 رقمی باشد",
      };
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = {
        status: true,
        message: "* آدرس باید وارد شود",
      };
      isValid = false;
    }

    if (!formData.title.trim()) {
      newErrors.title = {
        status: true,
        message: "* عنوان آگهی باید وارد شود",
      };
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = {
        status: true,
        message: "* توضیحات باید وارد شود",
      };
      isValid = false;
    }

    if (selectedFiles.length === 0) {
      newErrors.photo = {
        status: true,
        message: "* تصویر اصلی باید انتخاب شود",
      };
      isValid = false;
    }

    if (selectedFiles2.length === 0) {
      newErrors.photos = {
        status: true,
        message: "* حداقل یک تصویر باید انتخاب شود",
      };
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCookAuthenticated) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    setBtnSpinner(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("photo", selectedFiles[0]);
      selectedFiles2.forEach((image) => formDataToSend.append("photos", image));

      await axios.post(`/api/cooks/ads`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("آگهی با موفقیت ایجاد شد");
      resetForm();
    } catch (error) {
      console.error("Error creating ad:", error);
      toast.error(error.response?.data?.message || "خطا در ایجاد آگهی");
    } finally {
      setBtnSpinner(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      title: "",
      description: "",
      price: 0,
    });
    setSelectedFiles([]);
    setSelectedFiles2([]);
    setErrors(initialErrors);
  };

  // Input Field Component for better reusability
  const InputField = ({
    label,
    name,
    value,
    onChange,
    error,
    icon: Icon,
    type = "text",
    placeholder,
    textarea = false,
    rows = 3,
  }) => (
    <div className="flex flex-col mb-6">
      <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 
              bg-white border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400
              ${
                error?.status ? "border-red-500" : "border-gray-300"
              } outline-none`}
            placeholder={placeholder}
            rows={rows}
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 
              bg-white border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400
              ${
                error?.status ? "border-red-500" : "border-gray-300"
              } outline-none`}
            placeholder={placeholder}
            style={{ borderRadius: "8px", padding: "10px",textAlign:'right' }}
          />
        )}
      </div>
      {error?.status && (
        <span className="mt-1 text-sm text-red-600">{error.message}</span>
      )}
    </div>
  );

  // File Upload Component for better reusability
  const FileUploadArea = ({
    label,
    selectedFiles,
    fileInputRef,
    handleFileChange,
    handleFileDelete,
    error,
    multiple = false,
  }) => (
    <div className="flex flex-col mb-6">
      <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
          <div
            className="text-center"
            onClick={() => fileInputRef.current.click()}
          >
            <FiUploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">برای آپلود کلیک کنید</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, JPEG</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.png,.jpeg"
            multiple={multiple}
            onClick={(e) => (e.target.value = null)}
          />
        </div>

        <div className="md:col-span-2 rounded-lg bg-white p-4 border border-gray-200 shadow-sm max-h-60 overflow-auto">
          {selectedFiles.length > 0 ? (
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleFileDelete(
                        index,
                        multiple ? setSelectedFiles2 : setSelectedFiles
                      )
                    }
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="حذف فایل"
                  >
                    <RiDeleteBin6Line className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-sm">هنوز تصویری آپلود نشده است...</p>
            </div>
          )}
        </div>
      </div>

      {error?.status && (
        <span className="mt-1 text-sm text-red-600">{error.message}</span>
      )}
    </div>
  );

  return (
    <>
      <TitleCard title="افزودن آگهی" topMargin="mt-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="نام و نام خانوادگی مشتری"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              icon={CiUser}
              placeholder="نام و نام خانوادگی مشتری"
            />

            <InputField
              label="شماره مشتری"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              icon={BsTelephone}
              placeholder="شماره مشتری"
            />

            <InputField
              label="عنوان آگهی"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              icon={TbClipboardText}
              placeholder="عنوان آگهی"
            />

            <InputField
              label="قیمت آگهی"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={null}
              icon={IoPricetagOutline}
              placeholder="قیمت آگهی"
            />
          </div>

          <FileUploadArea
            label="تصویر اصلی آگهی"
            selectedFiles={selectedFiles}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleFileDelete={handleFileDelete}
            error={errors.photo}
            multiple={false}
          />

          <FileUploadArea
            label="تصاویر اضافی آگهی"
            selectedFiles={selectedFiles2}
            fileInputRef={fileInputRef2}
            handleFileChange={handleFileChange2}
            handleFileDelete={handleFileDelete}
            error={errors.photos}
            multiple={true}
          />

          <InputField
            label="توضیحات"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            icon={IoIosInformationCircleOutline}
            placeholder="توضیحات"
            textarea={true}
            rows={4}
          />

          <InputField
            label="آدرس"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            icon={HiOutlineMapPin}
            placeholder="آدرس"
            textarea={true}
            rows={3}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-70 disabled:cursor-not-allowed
                min-w-[150px] outline-none"
              disabled={btnSpinner}
            >
              {btnSpinner ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  در حال پردازش...
                </>
              ) : (
                "اضافه کردن آگهی"
              )}
            </button>
          </div>
        </form>
      </TitleCard>
      <ToastContainer rtl position="top-center" />
    </>
  );
}

export default CreateAds;
