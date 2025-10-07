import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import Subtitle from "../components/Typography/Subtitle";
import { ToastContainer, toast } from "react-toastify";
import {
  PiBankThin,
  PiCreditCard,
  PiCheckCircle,
  PiShieldCheck,
  PiArrowRight,
} from "react-icons/pi";

const Bank = () => {
  const [sheba, setSheba] = useState("");
  const [shebaError, setShebaError] = useState(false);
  const [shebaErrorMessage, setShebaErrorMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "بانک" }));
  }, [dispatch]);

  const addAccount = () => {
    if (!sheba || sheba.trim() === "") {
      setShebaError(true);
      setShebaErrorMessage("شماره شبا باید وارد شود");
      return;
    }

    if (sheba.length < 26) {
      setShebaError(true);
      setShebaErrorMessage("شماره شبا باید 24 رقمی باشد");
      return;
    }

    toast.success("حساب بانکی با موفقیت متصل شد", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleShebaChange = (e) => {
    const inputValue = e.target.value;
    let formattedValue = inputValue;

    if (!inputValue.startsWith("IR")) {
      formattedValue = "IR" + inputValue.replace(/^IR/, "");
    }

    if (formattedValue.length <= 26) {
      setSheba(formattedValue);
    }

    if (formattedValue.length < 26) {
      setShebaError(true);
      setShebaErrorMessage("شماره شبا باید 24 رقمی باشد");
    } else {
      setShebaError(false);
      setShebaErrorMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <img
                  className="rounded-full"
                  src="https://img.freepik.com/free-vector/realistic-monochromatic-credit-card_52683-74366.jpg"
                  alt="creditcard"
                />
              </div>
            
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                اتصال امن بانکی
              </h3>
              <p className="text-gray-600 leading-relaxed">
                با اتصال حساب بانکی خود، از خدمات مالی پیشرفته بهره مند شوید
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-y-6"></div>
                  <div className="relative z-10">
                    <PiCreditCard className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" />
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">
                      اتصال حساب بانکی
                    </h1>
                    <p className="text-blue-100 mt-2">
                      اطلاعات حساب خود را وارد کنید
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <Subtitle styleClass="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <PiBankThin className="w-6 h-6 text-blue-600" />
                      اطلاعات حساب
                    </Subtitle>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    {/* Sheba Input */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="sheba"
                          className="block text-sm font-medium text-gray-700"
                        >
                          شماره شبا
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          IR + 24 رقم
                        </span>
                      </div>

                      <div className="relative group">
                        <input
                          id="sheba"
                          type="text"
                          value={sheba}
                          onChange={handleShebaChange}
                          className="block w-full pr-4 py-4 border-2 border-gray-200 rounded-xl 
                                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                                   text-lg placeholder-gray-400 transition-all duration-300
                                   group-hover:border-gray-300 font-mono"
                          placeholder="IR000000000000000000000000"
                          dir="ltr"
                        />
                        {!shebaError && sheba.length === 26 && (
                          <PiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-emerald-500" />
                        )}
                      </div>

                      {shebaError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {shebaErrorMessage}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PiShieldCheck className="w-4 h-4 text-emerald-500" />
                        امنیت بالا
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PiCheckCircle className="w-4 h-4 text-blue-500" />
                        تایید سریع
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        onClick={addAccount}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 
                                 hover:from-blue-700 hover:to-indigo-800 
                                 text-white py-4 px-6 rounded-xl font-semibold 
                                 transition-all duration-300 transform hover:scale-[1.02]
                                 focus:outline-none focus:ring-4 focus:ring-blue-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        disabled={shebaError || sheba.length < 26}
                      >
                        اتصال حساب بانکی
                        <PiArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        rtl={true}
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Bank;
