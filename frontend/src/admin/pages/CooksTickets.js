import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import { RiCloseCircleLine, RiCheckboxCircleLine } from "@remixicon/react"
import { useAdminAuthStore } from '../stores/authStore' 
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const TopSideButtons = () => {
  return (
    <div className="inline-block">
      <h1 className="text-xl font-bold">تیکت های پشتیبانی غذادارها</h1>
    </div>
  )
}

const CooksTickets = () => {
  const [cookTickets, setCookTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const fetchCookTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('/api/admins/cooks/support-tickets', {
        withCredentials: true
      })
      
      setCookTickets(response.data.data)
    } catch (error) {
      console.error('Error fetching cook tickets:', error)
      setError(error.response?.data?.msg || 'خطا در دریافت تیکت‌های غذادارها')
      MySwal.fire({
        title: "<small>خطا</small>",
        text: error.response?.data?.msg || 'خطا در دریافت تیکت‌های غذادارها',
        icon: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const closeTicket = async (ticketId, cookId) => {
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
        `/api/admins/cooks/${cookId}/support-tickets/${ticketId}/close-ticket`, 
        {}, 
        { withCredentials: true }
      )

      // Update local state instead of refetching
      setCookTickets(prevTickets =>
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
    dispatch(setPageTitle({ title: "تیکت های غذادارها" }))
    fetchCookTickets()
  }, [dispatch])

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
      "In Progress": { className: "badge badge-info", text: "در حال بررسی" },
      "Closed": { className: "badge badge-success", text: "بسته" }
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
          <span className="mr-2">در حال دریافت تیکت‌ها...</span>
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
            onClick={fetchCookTickets}
          >
            تلاش مجدد
          </button>
        </div>
      </TitleCard>
    )
  }

  return (
    <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
      {cookTickets.length > 0 ? (
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
              {cookTickets.map((ticket, index) => (
                <tr key={ticket._id || index} className="hover">
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
                        <div className="font-bold font-mono text-sm">
                          {ticket._id?.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(ticket.createdAt)}</td>
                  <td>{getStatusComponent(ticket.status)}</td>
                  <td>{getPriorityComponent(ticket.priority)}</td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <span className="text-sm text-success">پاسخ داده شده</span>
                    ) : (
                      <a 
                        href={`/admins/cooks/${ticket.assignedTo}/support-tickets/${ticket._id}`}
                        className="btn btn-ghost btn-sm btn-primary"
                        title="پاسخ به تیکت"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        پاسخ
                      </a>
                    )}
                  </td>
                  <td>
                    {ticket.status === "Closed" ? (
                      <button 
                        className="btn btn-ghost btn-sm cursor-not-allowed" 
                        disabled
                        title="تیکت بسته شده"
                      >
                        <RiCheckboxCircleLine className="w-5 h-5 text-success" />
                      </button>
                    ) : (
                      <button 
                        className="btn btn-ghost btn-sm btn-error"
                        onClick={() => closeTicket(ticket._id, ticket.cook)}
                        title="بستن تیکت"
                      >
                        <RiCloseCircleLine className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-gray-500 text-lg mb-2">تیکتی یافت نشد</h3>
          <p className="text-gray-400 text-sm">غذادارها هنوز تیکت پشتیبانی ایجاد نکرده اند...</p>
        </div>
      )}
    </TitleCard>
  )
}

export default CooksTickets