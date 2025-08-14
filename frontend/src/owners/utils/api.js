export const handleApiError = (error, toast) => {
  console.error('API Error:', error);
  
  let message = 'خطایی وجود دارد. دوباره امتحان کنید!';
  
  if (error.response) {
    if (error.response.status === 401) {
      message = 'دسترسی غیرمجاز. لطفا دوباره وارد شوید.';
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    } else if (error.response.status === 400) {
      message = 'داده‌های ارسالی معتبر نیستند';
    } else if (error.response.status === 500) {
      message = 'خطای سرور. لطفا بعدا تلاش کنید.';
    }
  } else if (error.request) {
    message = 'ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.';
  }
  
  toast.error(message, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  
  return message;
};