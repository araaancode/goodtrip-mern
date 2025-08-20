import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"

import Swal from 'sweetalert2'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import "../components/modal.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// load icons
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'
import { PiEye } from "react-icons/pi";


const TopSideButtons = () => {
  return (
    <>
      <div className="inline-block">
        <h6>لیست تیکت های پشتیبانی ها</h6>
      </div>
    </>

  )
}

const SupportTickets = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست تیکت های پشتیبانی" }))
  }, [])

  const [supportTickets, setSupportTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/drivers/support-tickets', { 
      withCredentials: true 
    })
      .then(response => {
        setSupportTickets(response.data.tickets)
        setLoading(false)
      })
      .catch((error) => {
        console.log('error ' + error);
        setLoading(false)
        
        if (error.response?.status === 401) {
          toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید', {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        } else {
          toast.error('خطایی در دریافت اطلاعات تیکت ها رخ داده است', {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      });
  }, [])

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

  const showPersianPriority = (c) => {
    if (c === "Low") {
      return "کم"
    }
    else if (c === "Medium") {
      return "متوسط"
    } else {
      return "زیاد"
    }
  }

  if (loading) {
    return (
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </TitleCard>
    )
  }

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="overflow-x-auto w-full">
          {supportTickets.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>وضعیت</th>
                  <th>الویت</th>
                  <th>خوانده شده/نشده</th>
                  <th>تاریخ ایجاد</th>
                  <th>دیدن تیکت </th>
                </tr>
              </thead>
              <tbody>
                {
                  supportTickets.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td className="flex items-center" >
                          <div className="flex items-center space-x-3">
                            <div className="">
                              {l.images && l.images.length > 0 ? (
                                <img src={l.images[0]} className="table-img" alt="تیکت" />
                              ) : (
                                <div className="table-img-placeholder">بدون تصویر</div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold mr-3">{l.title}</div>
                            </div>
                          </div>
                        </td>
                        <td>{showPersianStatus(l.status)}</td>
                        <td>{showPersianPriority(l.priority)}</td>
                        <td>{l.isRead ? 'خوانده شده' : 'خوانده نشده'}</td>
                        <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                        <td>
                          <a href={`/drivers/support-tickets/${l._id}`}>
                            <PiEye className="w-6 h-6" />
                          </a>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-gray-600 text-lg">هنوز تیکت پشتیبانی اضافه نشده است ...!</h3>
            </div>
          )}
        </div>

        <ToastContainer />
      </TitleCard>
    </>
  )
}

export default SupportTickets