export const validateRequired = (value, fieldName) => {
  if (!value || value === "" || value.length === 0) {
    return `* ${fieldName} باید وارد شود`;
  }
  return "";
};

export const validateNumber = (value, fieldName) => {
  if (isNaN(value)) {
    return `* ${fieldName} باید عدد باشد`;
  }
  return "";
};

export const validateFile = (file, allowedExtensions, maxSizeMB = 5) => {
  if (!file) return "* فایل باید انتخاب شود";
  
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return `* فقط فایل‌های ${allowedExtensions.join(', ')} مجاز هستند`;
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `* حجم فایل باید کمتر از ${maxSizeMB}MB باشد`;
  }
  
  return "";
};

export const validateArrayNotEmpty = (array, fieldName) => {
  if (!array || array.length === 0) {
    return `* ${fieldName} باید انتخاب شود`;
  }
  return "";
};