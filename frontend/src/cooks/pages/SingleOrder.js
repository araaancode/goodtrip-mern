import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TitleCard from "../components/Cards/TitleCard";

const SingleOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get token and orderId with validation
  const token = localStorage.getItem("userToken");
  const orderId = window.location.href
    .split("/orders/")[1]
    ?.split("/show-details")[0];

  const getStatusProgress = (status) => {
    switch (status) {
      case "Cancelled":
        return 0;
      case "Pending":
        return 50;
      case "Completed":
        return 100;
      default:
        console.warn(`Unexpected status: ${status}`);
        return 0;
    }
  };

  useEffect(() => {
    if (!token || !orderId) {
      setError("Missing token or order ID");
      setLoading(false);
      toast.error("خطا در بارگذاری سفارش: اطلاعات ناقص است");
      return;
    }

    setLoading(true);
    axios
      .get(`/api/cooks/foods/order-foods/${orderId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrder(res.data.order[0]);
        setSelectedStatus(res.data.order[0].orderStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to load order");
        setLoading(false);
        toast.error("خطا در بارگذاری سفارش");
      });
  }, [orderId, token]);

  const handleStatusChange = async () => {
    try {
      await axios.put(
        `/api/cooks/foods/order-foods/${orderId}/change-status`,
        { orderStatus: selectedStatus },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder({ ...order, orderStatus: selectedStatus });
      setIsModalOpen(false);
      toast.success("وضعیت سفارش با موفقیت تغییر کرد");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("خطا در تغییر وضعیت سفارش");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        {loading ? (
          <ClipLoader
            color="#1b3a54"
            loading={loading}
            size={60}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <h1 className="text-2xl font-bold text-[#1b3a54]">Content Loaded!</h1>
        )}
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-8 text-red-600">
        خطا: {error || "سفارش یافت نشد"}
      </div>
    );
  }

  const statusToPersian = (s) => {
    if (s === "Completed") {
      return "تحویل داده شده";
    } else if (s === "Cancelled") {
      return "لغو شده";
    } else {
      return "در حال آماده سازی";
    }
  };

  return (
    <>
      <TitleCard title="جزئیات سفارش" topMargin="mt-2" dir="rtl">
        <div className="min-h-screen py-8 px-4 font-vazir">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 transition-all duration-300">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">شماره سفارش:</span>{" "}
                  {order._id}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">تاریخ:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold ml-2">وضعیت:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Pending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {statusToPersian(order.orderStatus)}
                  </span>
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-900 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${getStatusProgress(order.orderStatus)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">آدرس تحویل:</span>{" "}
                  {order.address}
                </p>
                <div className="mt-4">
                  <iframe
                    className="w-full h-32 rounded-lg"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.841073143318!2d51.40999331520991!3d35.68919798019295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491d7f0b5b%3A0x4c2e4e6f5b4b1c7!2sTehran%2C%20Valiasr%20St!5e0!3m2!1sen!2s!4v1634024059877!5m2!1sen!2s"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                اقلام سفارش
              </h2>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="p-4 text-gray-700 font-semibold">تصویر</th>
                      <th className="p-4 text-gray-700 font-semibold">مورد</th>
                      <th className="p-4 text-gray-700 font-semibold">تعداد</th>
                      <th className="p-4 text-gray-700 font-semibold">
                        قیمت (ریال)
                      </th>
                      <th className="p-4 text-gray-700 font-semibold">جمع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.foodItems?.length > 0 ? (
                      order.foodItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              onError={(e) =>
                                (e.target.src = "/fallback-image.jpg")
                              }
                            />
                          </td>
                          <td className="p-4 text-gray-800">{item.name}</td>
                          <td className="p-4 text-gray-800">{item.count}</td>
                          <td className="p-4 text-gray-800">{item.price}</td>
                          <td className="p-4 text-gray-800 font-medium">
                            {item.count * item.price}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-4 text-center text-gray-600"
                        >
                          هیچ آیتمی یافت نشد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t pt-6 pb-4">
              <p className="text-xl font-semibold text-gray-900">جمع کل:</p>
              <p className="text-2xl font-bold text-blue-900">
                {order.totalPrice} ریال
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                تغییر وضعیت سفارش
              </button>
            
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-right">
                تغییر وضعیت سفارش
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-right">
                  انتخاب وضعیت
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-right focus:ring-2 focus:ring-blue-900 focus:border-blue-900 hover:border-blue-900 transition-colors duration-200 pr-10"
                  >
                    <option value="Pending">در حال آماده سازی</option>
                    <option value="Completed">تحویل داده شده</option>
                    <option value="Cancelled">لغو شده</option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  ذخیره
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </TitleCard>
    </>
  );
};

export default SingleOrder;