import { useState } from 'react';
import { 
  validateRequired, 
  validateNumber,
  validateFile,
  validateArrayNotEmpty
} from '../utils/validation';

const useFormValidation = () => {
  const [errors, setErrors] = useState({});
  
  const validateField = (name, value, validations) => {
    let error = '';
    
    validations.forEach(validation => {
      switch(validation.type) {
        case 'required':
          error = validateRequired(value, validation.fieldName || name) || error;
          break;
        case 'number':
          error = validateNumber(value, validation.fieldName || name) || error;
          break;
        case 'file':
          error = validateFile(value, validation.allowedExtensions, validation.maxSizeMB) || error;
          break;
        case 'arrayNotEmpty':
          error = validateArrayNotEmpty(value, validation.fieldName || name) || error;
          break;
        default:
          break;
      }
    });
    
    setErrors(prev => ({
      ...prev,
      [name]: error ? { hasError: true, message: error } : { hasError: false, message: '' }
    }));
    
    return !error;
  };

  const validateForm = (fields) => {
    let isValid = true;
    const newErrors = {};
    
    Object.entries(fields).forEach(([name, { value, validations }]) => {
      let error = '';
      
      validations.forEach(validation => {
        switch(validation.type) {
          case 'required':
            error = validateRequired(value, validation.fieldName || name) || error;
            break;
          case 'number':
            error = validateNumber(value, validation.fieldName || name) || error;
            break;
          case 'file':
            error = validateFile(value, validation.allowedExtensions, validation.maxSizeMB) || error;
            break;
          case 'arrayNotEmpty':
            error = validateArrayNotEmpty(value, validation.fieldName || name) || error;
            break;
          default:
            break;
        }
      });
      
      if (error) {
        isValid = false;
        newErrors[name] = { hasError: true, message: error };
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  return { errors, validateField, validateForm, setErrors };
};

export default useFormValidation;