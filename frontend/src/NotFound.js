import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#1b3a54] to-[#0f172a] flex flex-col justify-center items-center text-white px-4 text-center">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">صفحه پیدا نشد</h2>
      <p className="text-lg mb-6">متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.</p>
      <div className="mt-2 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        <img
          src="./images/404.jpeg"
          alt="404 illustration"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-8 bg-white text-[#1b3a54] font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition"
      >
        بازگشت به صفحه اصلی
      </button>
    </div>
  );
};

export default NotFoundPage;
