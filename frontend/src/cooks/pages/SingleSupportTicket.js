import { useState, useEffect } from "react";
import { useCookAuthStore } from '../stores/authStore';
import axios from "axios";
import { GoLaw } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showPersianStatus = (c) => {
  if (c === "Open") {
    return "باز";
  } else if (c === "In Progress") {
    return "در حال بررسی";
  } else {
    return "بسته شده";
  }
};

function SingleSupportTicket() {
  const { isCookAuthenticated, cook: authCook } = useCookAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState([]);
  const [ticket, setTicket] = useState({});
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [commentErrorMsg, setCommentErrorMsg] = useState("");

  const stId = window.location.href.split("/support-tickets/")[1].split("/update")[0];

  useEffect(() => {
    if (!isCookAuthenticated) return;

    const fetchSupportTicket = async () => {
      try {
        const response = await axios.get(`/api/cooks/support-tickets/${stId}`, {
          withCredentials: true
        });
        setTicket(response.data.ticket);
        setTitle(response.data.ticket.title);
        setDescription(response.data.ticket.description);
        setDate(response.data.ticket.createdAt);
        setComments(response.data.ticket.comments || []);
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات تیکت");
      }
    };

    fetchSupportTicket();
  }, [isCookAuthenticated, stId]);

  const sendSupportTicket = async (e) => {
    e.preventDefault();

    if (!comment || comment.trim() === "") {
      setCommentError(true);
      setCommentErrorMsg("* پیام باید وارد شود");
      return;
    }

    setBtnSpinner(true);
    setCommentError(false);

    try {
      const response = await axios.put(
        `/api/cooks/support-tickets/${stId}/add-comment`,
        { comment: comment.trim() },
        { withCredentials: true }
      );

      setComments(response.data.ticket.comments);
      setComment("");
      setBtnSpinner(false);
      
      toast.success("پیام با موفقیت ارسال شد", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      setBtnSpinner(false);
      console.error("Error sending comment:", error);
      toast.error("خطایی در ارسال پیام رخ داد. لطفاً دوباره امتحان کنید", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Ticket Content - Takes 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-right">
                  پشتیبانی - {ticket.title || "در حال بارگذاری..."}
                </h1>
                <p className="text-gray-600 mt-2 text-right">گفتگوی شما و بخش پشتیبانی</p>
              </div>

              {/* Original Ticket */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {title || "در حال بارگذاری..."}
                  </h2>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa") : "---"}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {ticket.description || "در حال بارگذاری..."}
                </p>
                
                {/* Images Grid */}
                {ticket.images && ticket.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {ticket.images.map((file, index) => (
                      <img
                        key={index}
                        src={file}
                        alt={`تصویر تیکت ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4 mb-8">
                {comments && comments.length > 0 ? (
                  comments.map((c, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-6 transition-all duration-200 ${
                        c.cook 
                          ? 'bg-blue-50 border border-blue-100 lg:mr-8' 
                          : 'bg-amber-50 border border-amber-100 lg:ml-8'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            c.cook ? 'bg-blue-500' : 'bg-amber-500'
                          }`}></div>
                          <h3 className="font-semibold text-gray-800">
                            {c.cook ? (authCook?.name || "کاربر") : (c.admin || "پشتیبانی")}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                          {new Date(c.createdAt).toLocaleDateString("fa")}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {c.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <p className="text-gray-500">تیکت شما هنوز پاسخ داده نشده است...</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                  پیام جدید:
                </label>
                <div className="relative mb-2">
                  <IoIosInformationCircleOutline className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (e.target.value.trim()) {
                        setCommentError(false);
                      }
                    }}
                    className="w-full px-4 py-3 pr-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows="4"
                    placeholder="پیام خود را وارد کنید..."
                  />
                </div>
                {commentError && (
                  <p className="text-red-500 text-sm mt-1 text-right">{commentErrorMsg}</p>
                )}
                
                <button
                  onClick={sendSupportTicket}
                  disabled={btnSpinner}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 mt-4 disabled:cursor-not-allowed"
                >
                  {btnSpinner ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال ارسال...</span>
                    </div>
                  ) : (
                    'ارسال پیام'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <GoLaw className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">سایر اطلاعات</h2>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">آغاز درخواست:</span>
                    <span className="font-medium text-gray-800">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa") : "---"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">نوع درخواست:</span>
                    <span className="font-medium text-gray-800">پشتیبانی</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">وضعیت:</span>
                    <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                      ticket.status === 'Open' 
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {showPersianStatus(ticket.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4 text-right">حاضران:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{authCook?.name || "کاربر"}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700">پشتیبانی سایت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default SingleSupportTicket;