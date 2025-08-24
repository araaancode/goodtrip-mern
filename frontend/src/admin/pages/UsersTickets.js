import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import { RiCloseCircleLine, RiCheckboxCircleLine } from "@remixicon/react"
import "../components/modal.css"
import { useAdminAuthStore } from '../stores/authStore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const TopSideButtons = () => {
  return (
    <div className="inline-block">
      <h1>تیکت های پشتیبانی</h1>
    </div>
  )
}

const UserTickets = () => {
  const [userTickets, setUserTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, isAdminAuthenticated } = useAdminAuthStore()
  const dispatch = useDispatch()

  const fetchUserTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('/api/admins/users/support-tickets', {
        withCredentials: true
      })
      
      setUserTickets(response.data.data)
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      setError(error.response?.data?.msg || 'خطا در دریافت تیکت‌های کاربران')
      MySwal.fire({
        title: "<small>خطا</small>",
        text: error.response?.data?.msg || 'خطا در دریافت تیکت‌های کاربران',
        icon: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const closeTicket = async (ticketId, userId) => {
    try {
      const confirmationResult = await MySwal.fire({
        title: "<small>آیا از بستن تیکت اطمینان دارید؟</small>",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`,
        icon: "question"
      })

      if (!confirmationResult.isConfirmed) {
        MySwal.fire("<small>تغییرات لغو شد</small>", "", "info")
        return
      }

      await axios.put(
        `/api/admins/users/${userId}/support-tickets/${ticketId}/close-ticket`, 
        {}, 
        { withCredentials: true }
      )

      // Update local state instead of refetching
      setUserTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket._id === ticketId
            ? { ...ticket, status: "Closed" }
            : ticket
        )
      )

      MySwal.fire({
        title: "<small>موفقیت آمیز</small>",
        text: "تیکت با موفقیت بسته شد",
        icon: "success"
      })

    } catch (error) {
      console.error('Error closing ticket:', error)
      MySwal.fire({
        title: "<small>خطا</small>",
        text: error.response?.data?.msg || 'خطا در بستن تیکت',
        icon: "error"
      })
    }
  }

  useEffect(() => {
    dispatch(setPageTitle({ title: "تیکت ها" }))
    fetchUserTickets()
  }, [])

  const getPriorityComponent = (priority) => {
    const priorityMap = {
      "High": { className: "badge badge-primary", text: "بالا" },
      "Medium": { className: "badge badge-ghost", text: "متوسط" },
      "Low": { className: "badge badge-secondary", text: "پایین" }
    }
    
    const priorityConfig = priorityMap[priority] || { className: "badge", text: priority }
    return <div className={priorityConfig.className}>{priorityConfig.text}</div>
  }

  const getStatusComponent = (status) => {
    const statusMap = {
      "Open": { className: "badge badge-warning", text: "باز" },
      "In Progress": { className: "badge badge-ghost", text: "در حال بررسی" },
      "Closed": { className: "badge badge-secondary", text: "بسته" }
    }
    
    const statusConfig = statusMap[status] || { className: "badge", text: status }
    return <div className={statusConfig.className}>{statusConfig.text}</div>
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fa-IR')
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="flex justify-center items-center h-32">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </TitleCard>
    )
  }

  if (error) {
    return (
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="alert alert-error">
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={fetchUserTickets}
          >
            تلاش مجدد
          </button>
        </div>
      </TitleCard>
    )
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
              {userTickets.map((ticket, index) => (
                <tr key={ticket._id || index}>
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
                  <td>{formatDate(ticket.createdAt)}</td>
                  <td>{getStatusComponent(ticket.status)}</td>
                  <td>{getPriorityComponent(ticket.priority)}</td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <p>پاسخ داده شده</p>
                    ) : (
                      <a 
                        href={`/admins/users/${ticket.assignedTo}/support-tickets/${ticket._id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    )}
                  </td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <button 
                        className="btn btn-ghost btn-sm cursor-not-allowed" 
                        disabled
                      >
                        <RiCheckboxCircleLine className="text-success" />
                      </button>
                    ) : (
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => closeTicket(ticket._id, ticket.user?._id)}
                      >
                        <RiCloseCircleLine className="text-error" />
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
          <h3 className="text-gray-500">کاربران هنوز تیکت پشتیبانی ایجاد نکرده اند...</h3>
        </div>
      )}
    </TitleCard>
  )
}

export default UserTickets