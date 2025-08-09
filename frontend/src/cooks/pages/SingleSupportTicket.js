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

    if (!comment || comment === "" || comment === undefined || comment === null) {
      setCommentError(true);
      setCommentErrorMsg("*  پیام باید وارد شود");
      return;
    }

    setBtnSpinner(true);

    try {
      const response = await axios.put(
        `/api/cooks/support-tickets/${stId}/add-comment`,
        { comment },
        { withCredentials: true }
      );

      setComments(response.data.ticket.comments);
      setComment("");
      setBtnSpinner(false);
      
      toast.success("پیام فرستاده شد", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      setBtnSpinner(false);
      console.log("error", error);
      toast.error("خطایی وجود دارد. دوباره امتحان کنید !", {
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
    <>
      <div className="grid grid-cols-[2fr_1fr] gap-4 p-4">
        {/* ticket */}
        <div className="card w-full p-6 bg-base-100 shadow-xl mt-6">
          <div className="text-xl font-semibold text-right">
            پشتیبانی - {ticket.title}
          </div>
          <h6 className="text-gray-600 mt-2">گفتگوی شما و بخش پشتیبانی</h6>
          <div className="divider mt-2"></div>

          <div className="h-full w-full pb-6 bg-base-100">
            <div className="mx-auto">
              {/* ticket */}
              <div className="bg-blue-50 p-6 rounded-md w-full">
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold">{title}</h2>
                  <span className="text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString("fa")}
                  </span>
                </div>
                <p className="mt-2">{ticket.description}</p>
                <div className="my-4 flex flex-wrap gap-2">
                  {ticket.images && ticket.images.map((file, index) => (
                    <img
                      key={index}
                      src={file}
                      alt={`Support Ticket ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="divider mt-2"></div>

              {/* comments & add comment */}
              {comments && comments.length > 0 ? (
                comments.map((c) =>
                  c.cook ? (
                    <div className="bg-blue-50 p-6 rounded-md w-full my-4">
                      <div className="flex justify-between">
                        <h2 className="text-lg font-bold">{authCook?.name}</h2>
                        <span className="text-sm">
                          {new Date(c.createdAt).toLocaleDateString("fa")}
                        </span>
                      </div>
                      <p className="mt-2">{c.comment}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 p-6 rounded-md my-4 w-full">
                      <div className="flex justify-between">
                        <h2 className="text-lg font-bold">{c.admin}</h2>
                        <span className="text-sm">
                          {new Date(c.createdAt).toLocaleDateString("fa")}
                        </span>
                      </div>
                      <p className="mt-2">{c.comment}</p>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-700">
                  تیکت شما هنوز پاسخ داده نشده است...
                </p>
              )}

              {/* text editor */}
              <p className="mt-6 mb-2">پیام: </p>
              <div className="flex flex-col mb-2">
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400"
                    style={{ bottom: "52px" }}
                  >
                    <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
                  </div>
                  <textarea
                    style={{ borderRadius: "5px", resize: "none" }}
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                    placeholder="توضیحات تیکت پشتیبانی "
                  ></textarea>
                </div>
                <span className="text-red-500 relative text-sm">
                  {commentError ? commentErrorMsg : ""}
                </span>
              </div>

              {/* send support ticket button */}
              <div className="mt-4">
                <button className="app-btn-blue" onClick={sendSupportTicket}>
                  {btnSpinner ? (
                    <div className="px-10 py-1 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span>ارسال پیام پشتیبانی </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ticket status */}
        <div className="card w-full p-6 bg-base-100 shadow-xl mt-6">
          <div className="p-4 flex items-center">
            <GoLaw className="w-6 h-6" />
            <span className="mx-2"> سایر اطلاعات</span>
          </div>

          <div className="p-4">
            <div className="flex justify-center items-center">
              <table className="border-collapse border border-gray-300 w-full">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-4">
                      <p>
                        {" "}
                        آغاز درخواست:{" "}
                        {new Date(ticket.createdAt).toLocaleDateString("fa")}
                      </p>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-4">نوع درخواست: پشتیبانی</td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      وضعیت: {showPersianStatus(ticket.status)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4">
            <p>حاضران:</p>
            <ul className="list-disc">
              <li> {authCook?.name}</li>
              <li>پشتیبانی سایت</li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default SingleSupportTicket;