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

// const deletefoods = async (foodId) => {
//   let token = localStorage.getItem("userToken")

//   Swal.fire({
//     title: "<small>آیا از حذف تیکت های پشتیبانی اطمینان دارید؟</small>",
//     showDenyButton: true,
//     confirmButtonText: "بله",
//     denyButtonText: `خیر`
//   }).then((result) => {
//     if (result.isConfirmed) {
//       axios.delete(`/api/drivers/foods/${foodId}`, {
//         headers: {
//           'authorization': 'Bearer ' + token
//         },
//       })
//         .then((response) => {
//           toast.success('تیکت های پشتیبانی حذف شد', {
//             position: "top-left",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           })
//         })
//         .catch((error) => {
//           console.log('error', error)
//           toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
//             position: "top-left",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           })
//         })
//     } else if (result.isDenied) {
//       toast.info('!.. تغییرات ذخیره نشد', {
//         position: "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       })
//     }
//   });



// }

const SupportTickets = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "لیست تیکت های پشتیبانی" }))
  }, [])



  const [supportTickets, setSupportTickets] = useState([])
  let token = localStorage.getItem("userToken")


  useEffect(() => {
    const AuthStr = 'Bearer '.concat(token);

    axios.get('/api/drivers/support-tickets', { headers: { authorization: AuthStr } })
      .then(response => {
        setSupportTickets(response.data.tickets)
      })
      .catch((error) => {
        console.log('error ' + error);
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


  
  console.log(supportTickets[0]);
  
  

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
                              <img src={l.images[0]} className="table-img" />
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
                        <td><a href={`/drivers/support-tickets/${l._id}`}><PiEye className="w-6 h-6" /></a></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>



          ) : (
            <h3>هنوز تیکت پشتیبانی اضافه نشده است ...!</h3>
          )}

        </div>

        <ToastContainer />
      </TitleCard>
    </>
  )
}

export default SupportTickets