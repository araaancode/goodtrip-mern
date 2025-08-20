import { useState, useRef, useEffect } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import axios from "axios"
import { GoLaw } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showPersianStatus = (c) => {
    if (c === "Open") {
        return "باز"
    }
    else if (c === "In Progress") {
        return "در حال بررسی"
    } else {
        return "بسته شده"
    }
}

function SingleSupportTicket() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [comments, setComments] = useState([])
    const [driver, setDriver] = useState({})
    const [ticket, setTicket] = useState({})
    const [btnSpinner, setBtnSpinner] = useState(false)
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    // Get ticket ID from URL params
    const { stId } = useParams();

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': ['right'] }],
            [{ 'direction': 'rtl' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    // error variables
    const [commentError, setCommentError] = useState(false)
    const [commentErrorMsg, setCommentErrorMsg] = useState("")

    // get single support tickets
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ticket data
                const ticketResponse = await axios.get(`/api/drivers/support-tickets/${stId}`, {
                    withCredentials: true
                });
                
                setTicket(ticketResponse.data.ticket);
                setTitle(ticketResponse.data.ticket.title);
                setDescription(ticketResponse.data.ticket.description);
                setDate(ticketResponse.data.ticket.createdAt);
                setComments(ticketResponse.data.ticket.comments || []);

                // Fetch driver data
                const driverResponse = await axios.get(`/api/drivers/me`, {
                    withCredentials: true
                });
                
                setDriver(driverResponse.data.driver);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                
                if (error.response?.status === 401) {
                    toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error('خطایی در دریافت اطلاعات تیکت رخ داده است', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
        };

        fetchData();
    }, [stId]);

    const sendSupportTicket = async (e) => {
        e.preventDefault();

        // Reset error
        setCommentError(false);
        setCommentErrorMsg("");

        if (!comment || comment.trim() === "") {
            setCommentError(true);
            setCommentErrorMsg("* پیام باید وارد شود");
            return;
        }

        setBtnSpinner(true);

        try {
            await axios.put(`/api/drivers/support-tickets/${stId}/add-comment`, 
                { comment }, 
                { withCredentials: true }
            );

            setBtnSpinner(false);
            setComment('');

            toast.success('پیام فرستاده شد', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Refresh comments
            const response = await axios.get(`/api/drivers/support-tickets/${stId}`, {
                withCredentials: true
            });
            setComments(response.data.ticket.comments || []);

        } catch (error) {
            setBtnSpinner(false);
            console.log('error', error);
            
            if (error.response?.status === 401) {
                toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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

                    <div className='h-full w-full pb-6 bg-base-100'>
                        <div className="mx-auto">
                            {/* ticket */}
                            <div className="bg-blue-50 p-6 rounded-md w-full">
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-bold">{title}</h2>
                                    <span className="text-sm">{new Date(ticket.createdAt).toLocaleDateString('fa')}</span>
                                </div>
                                <p className="mt-2">{ticket.description}</p>
                            </div>

                            <div className="divider mt-2"></div>

                            {/* comments & add comment */}
                            {comments && comments.length > 0 ? (
                                comments.map((c, index) => (
                                    c.driver ? (
                                        <div key={index} className="bg-blue-50 p-6 rounded-md w-full my-4">
                                            <div className="flex justify-between">
                                                <h2 className="text-lg font-bold">{driver.name}</h2>
                                                <span className="text-sm">{new Date(c.createdAt).toLocaleDateString('fa')}</span>
                                            </div>
                                            <p className="mt-2">{c.comment}</p>
                                        </div>
                                    ) : (
                                        <div key={index} className="bg-yellow-100 p-6 rounded-md my-4 w-full">
                                            <div className="flex justify-between">
                                                <h2 className="text-lg font-bold">{c.admin || 'پشتیبانی'}</h2>
                                                <span className="text-sm">{new Date(c.createdAt).toLocaleDateString('fa')}</span>
                                            </div>
                                            <p className="mt-2">{c.comment}</p>
                                        </div>
                                    )
                                ))
                            ) : (
                                <p className="text-gray-700">تیکت شما هنوز پاسخ داده نشده است...</p>
                            )}

                            {/* text editor */}
                            <p className="mt-6 mb-2">پیام: </p>
                            <div className="flex flex-col mb-2">
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-400" style={{ bottom: "52px" }}>
                                        <IoIosInformationCircleOutline className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <textarea 
                                        style={{ borderRadius: '5px', resize: 'none' }} 
                                        type="text" 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)} 
                                        className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" 
                                        placeholder="پیام خود را وارد کنید"
                                        rows={4}
                                    ></textarea>
                                </div>
                                <span className='text-red-500 relative text-sm'>{commentError ? commentErrorMsg : ""}</span>
                            </div>

                            {/* send support ticket button */}
                            <div className="mt-4">
                                <button className="app-btn-blue" onClick={sendSupportTicket} disabled={btnSpinner}>
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
                                            <p> آغاز درخواست: {new Date(ticket.createdAt).toLocaleDateString('fa')}</p>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <td className="p-4">
                                            نوع درخواست: پشتیبانی
                                        </td>
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
                            <li>{driver.name || 'راننده'}</li>
                            <li>پشتیبانی سایت</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SingleSupportTicket