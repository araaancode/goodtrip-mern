import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../components/Cards/TitleCard";
import { setPageTitle } from '../features/common/headerSlice';
import Swal from 'sweetalert2';
import axios from "axios";
import { useAdminAuthStore } from '../stores/authStore'; 
import { RiCloseCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const TopSideButtons = () => {
  return (
    <div className="inline-block">
      <h1 className="text-xl font-bold">تیکت های پشتیبانی</h1>
    </div>
  );
};

const OwnersTickets = () => {
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout, isAdminAuthenticated } = useAdminAuthStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle({ title: "تیکت ها" }));
    
    // Check if admin is authenticated before fetching tickets
    if (isAdminAuthenticated) {
      fetchTickets();
    } else {
      setError("لطفا ابتدا وارد سیستم شوید");
      setLoading(false);
    }
  }, [isAdminAuthenticated]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/admins/owners/support-tickets', {
        withCredentials: true, // Use cookies for authentication
        timeout: 10000
      });
      
      if (response.data && response.data.data) {
        setUserTickets(response.data.data);
      } else {
        throw new Error('فرمت پاسخ سرور نامعتبر است');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      
      let errorMessage = 'خطا در دریافت اطلاعات تیکت‌ها';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'اتصال به سرور timeout خورد';
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'لطفا مجدداً وارد شوید';
          logout();
          navigate('/admins/login'); // Redirect to login on unauthorized
        } else if (err.response.status === 403) {
          errorMessage = 'شما دسترسی لازم را ندارید';
        } else if (err.response.status === 404) {
          errorMessage = 'آدرس API یافت نشد';
        } else if (err.response.status >= 500) {
          errorMessage = 'مشکلی در سرور رخ داده است';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'پاسخی از سرور دریافت نشد. لطفا اتصال اینترنت را بررسی کنید';
      }
      
      setError(errorMessage);
      
      if (!err.response || err.response.status !== 401) {
        Swal.fire({
          title: "<small>خطا</small>",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "متوجه شدم"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async (ticketId, ownerId) => {
    try {
      const result = await Swal.fire({
        title: "<small>آیا از بستن تیکت اطمینان دارید؟</small>",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`,
        icon: "question"
      });
      
      if (!result.isConfirmed) {
        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
        return;
      }
      
      await axios.put(`/api/admins/owners/${ownerId}/support-tickets/${ticketId}/close-ticket`, {}, {
        withCredentials: true, // Use cookies for authentication
        timeout: 10000
      });
      
      // Update local state
      setUserTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: "Closed" } 
            : ticket
        )
      );
      
      Swal.fire("<small>تیکت با موفقیت بسته شد!</small>", "", "success");
    } catch (err) {
      console.error('Error closing ticket:', err);
      
      let errorMessage = "خطا در بستن تیکت";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'لطفا مجدداً وارد شوید';
          logout();
          navigate('/admins/login'); // Redirect to login on unauthorized
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      Swal.fire({
        title: "<small>خطا</small>",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "متوجه شدم"
      });
    }
  };

  const getPriorityComponent = (priority) => {
    const priorityMap = {
      "High": { className: "badge badge-primary", text: "بالا" },
      "Medium": { className: "badge badge-ghost", text: "متوسط" },
      "Low": { className: "badge badge-secondary", text: "پایین" }
    };
    
    const priorityInfo = priorityMap[priority] || { className: "badge", text: priority };
    return <div className={priorityInfo.className}>{priorityInfo.text}</div>;
  };

  const getStatusComponent = (status) => {
    const statusMap = {
      "Open": { className: "badge badge-warning", text: "باز" },
      "In Progress": { className: "badge badge-info", text: "در حال بررسی" },
      "Closed": { className: "badge badge-secondary", text: "بسته" }
    };
    
    const statusInfo = statusMap[status] || { className: "badge", text: status };
    return <div className={statusInfo.className}>{statusInfo.text}</div>;
  };

  const handleTicketClick = (ticket) => {
    if (ticket.status !== "Closed") {
      navigate(`/admins/owners/${ticket.assignedTo}/support-tickets/${ticket._id}`);
    }
  };

  if (loading) {
    return (
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="mr-2">در حال دریافت تیکت‌ها...</span>
        </div>
      </TitleCard>
    );
  }

  if (error) {
    return (
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm btn-ghost" onClick={fetchTickets}>
              تلاش مجدد
            </button>
          </div>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
      {userTickets.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>کد تیکت</th>
                <th>تاریخ ایجاد</th>
                <th>وضعیت</th>
                <th>اولویت</th>
                <th>پاسخ گویی</th>
                <th>بستن</th>
              </tr>
            </thead>
            <tbody>
              {userTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="h-8 w-8 text-gray-800"
                        >
                          <path d="M9,10a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V11A1,1,0,0,0,9,10Zm12,1a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H3A1,1,0,0,0,2,6v4a1,1,0,0,0,1,1,1,1,0,0,1,0,2,1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1,1,1,0,0,1,0-2ZM20,9.18a3,3,0,0,0,0,5.64V17H10a1,1,0,0,0-2,0H4V14.82A3,3,0,0,0,4,9.18V7H8a1,1,0,0,0,2,0H20Z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold mr-3">
                          {ticket._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString('fa')}</td>
                  <td>{getStatusComponent(ticket.status)}</td>
                  <td>{getPriorityComponent(ticket.priority)}</td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <span className="text-sm text-gray-500">پاسخ داده شده</span>
                    ) : (
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleTicketClick(ticket)}
                        title="پاسخ به تیکت"
                      >
                        <EditIcon />
                      </button>
                    )}
                  </td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <button className="btn btn-disabled btn-xs" disabled>
                        <RiCheckboxCircleLine className="text-green-500" />
                      </button>
                    ) : (
                      <button 
                        className="btn btn-ghost btn-xs hover:text-error"
                        onClick={() => closeTicket(ticket._id, ticket.owner)}
                        title="بستن تیکت"
                      >
                        <RiCloseCircleLine />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500 mt-4">
            ملک دارها هنوز تیکت پشتیبانی ایجاد نکرده اند...
          </h3>
        </div>
      )}

      <ToastContainer />
    </TitleCard>
  );
};

export default OwnersTickets;