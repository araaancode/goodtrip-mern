import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import { showNotification } from '../features/common/headerSlice'
import MomentJalali from "moment-jalaali"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { openModal } from "../features/common/modalSlice"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import { RiUser3Line, RiCloseCircleLine, RiCheckboxCircleLine } from "@remixicon/react"
import "../components/modal.css"
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUserSmileLine, RiUser2Line, RiMailLine, RiUser5Line } from "@remixicon/react"
import { IoColorPaletteOutline } from "react-icons/io5";
import { PiHouseLight } from "react-icons/pi";
import { HiOutlineMap } from "react-icons/hi2";
import { GrMap } from "react-icons/gr";
import { TfiUser } from "react-icons/tfi";
import { TbPhone } from "react-icons/tb";
import { RxRulerHorizontal } from "react-icons/rx";
import { MdOutlineWarehouse } from "react-icons/md";
import { PiHourglassSimpleLow } from "react-icons/pi";
import { VscLaw } from "react-icons/vsc";
import { FaUsers } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { PiImagesLight } from "react-icons/pi";
import { PiSignInLight } from "react-icons/pi";
import { PiWarehouseLight } from "react-icons/pi";
import { FaRegSquare } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { PiThermometerColdLight } from "react-icons/pi";
import { LuCircleParking } from "react-icons/lu";
import { PiSolarRoof } from "react-icons/pi";
import { CiImageOn } from "react-icons/ci";
import { CiViewTimeline } from "react-icons/ci";
import { RiPriceTagLine } from "react-icons/ri";
import { TbCircleDashedNumber4 } from "react-icons/tb";
import { CiCalendar } from "react-icons/ci";
import { CiBank } from "react-icons/ci";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { CiDiscount1 } from "react-icons/ci";
import { TbMoodHappy } from "react-icons/tb";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TbToolsKitchen2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// load icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'


const TopSideButtons = () => {
  return (
    <>
      <div className="inline-block">
        <h1>تیکت های پشتیبانی</h1>
      </div>

    </>

  )
}





const closeTicket = (ticketId, userId) => {
  let token = localStorage.getItem("userToken")

  // @route = /api/admins/users/:userId/support-tickets/:stId/close-ticket

  axios.put(`/api/admins/users/${userId}/support-tickets/${ticketId}/close-ticket`, {}, {
    headers: {
      'authorization': 'Bearer ' + token
    },
  })
    .then((response) => {
      Swal.fire({
        title: "<small>آیا از بستن تیکت اطمینان دارید؟</small>",
        showDenyButton: true,
        confirmButtonText: "بله",
        denyButtonText: `خیر`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("<small>تیکت بسته شد!</small>", "", "success");
        } else if (result.isDenied) {
          Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
        }
      });
    })
    .catch((error) => {
      console.log('error', error)
      Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "error");
    })

}

const UserTickets = () => {

  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [adminId, setAdminId] = useState("");

  const [userTickets, setUserTickets] = useState([])

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const openUpdateRoleModal = (adminId) => {
    setIsOpen(true);
    setAdminId(adminId)
  };

  const closeModal = () => {
    setIsOpen(false);
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "تیکت ها" }))
  }, [])


  const getPriorityComponent = (item) => {
    if (item === "High") return <div className="badge badge-primary">بالا</div>
    if (item === "Medium") return <div className="badge badge-ghost"> متوسط</div>
    if (item === "Low") return <div className="badge badge-secondary"> پایین</div>
    else return <div className="badge">{item}</div>
  }


  const getStatusComponent = (item) => {
    if (item === "Open") return <div className="badge badge-warning">باز</div>
    if (item === "In Progress") return <div className="badge badge-ghost"> در حال بررسی</div>
    if (item === "Closed") return <div className="badge badge-secondary"> بسته</div>
    else return <div className="badge">{item}</div>
  }


  useEffect(() => {
    let token = localStorage.getItem("userToken")
    const AuthStr = 'Bearer '.concat(token);

    axios.get('/api/admins/users/support-tickets', { headers: { authorization: AuthStr } })
      .then(response => {
        setUserTickets(response.data.data)
      })
      .catch((error) => {
        console.log('error ' + error);
      });



  }, [])


  const updateAdminRole = () => {
    let token = localStorage.getItem("userToken")


    axios.put(`/api/admins/${adminId}/change-role`, { role }, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token
      },
    })
      .then((response) => {
        console.log('response', response.data)
        Swal.fire({
          title: "<small>آیا از ویرایش ادمین اطمینان دارید؟</small>",
          showDenyButton: true,
          confirmButtonText: "بله",
          denyButtonText: `خیر`
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("<small>ادمین ویرایش شد!</small>", "", "success");
          } else if (result.isDenied) {
            Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
          }
        });
      })
      .catch((error) => {
        console.log('error', error)
        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "error");
      })
  }


  return (
    <>

      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div>
          {isOpen && (
            <div className="modal-overlay">
              <div className="modal-content mx-10" id="update-role-modal">
                <h1 className="my-4 font-bold text-xl"> تغییر نقش ادمین </h1>
                {/* role */}
                <div className="admin-role-select w-full mx-auto mt-1">

                  <select
                    id="adminRole"
                    value={role}
                    onChange={handleRoleChange}
                    className="block w-full items-center px-3 py-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                  >
                    <option value="">انتخاب نقش</option>
                    <option value="superadmin">مدیر اصلی</option>
                    <option value="admin">مدیر داخلی</option>
                    <option value="moderator">نویسنده</option>
                  </select>
                  {role && (
                    <p className="mt-3 text-sm text-gray-600">
                      نقش انتخاب شده <span className="font-semibold">{role}</span>
                    </p>
                  )}
                </div>

                <button onClick={updateAdminRole} className="text-white modal-btn bg-blue-800 hover:bg-blue-900">
                  ویرایش نقش ادمین
                </button>

                <button onClick={closeModal} className="text-white modal-btn bg-gray-500 hover:bg-gray-600">
                  بستن
                </button>


              </div>
            </div>
          )}
        </div>
        {userTickets.length > 0 ? (<div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>کد تیکت</th>
                <th>تاریخ ایجاد</th>
                <th>وضعیت</th>
                <th>اولویت </th>
                <th>پاسخ گویی</th>
                <th>بستن </th>
              </tr>
            </thead>
            <tbody>
              {
                userTickets.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-gray-800"><path d="M9,10a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V11A1,1,0,0,0,9,10Zm12,1a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H3A1,1,0,0,0,2,6v4a1,1,0,0,0,1,1,1,1,0,0,1,0,2,1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1,1,1,0,0,1,0-2ZM20,9.18a3,3,0,0,0,0,5.64V17H10a1,1,0,0,0-2,0H4V14.82A3,3,0,0,0,4,9.18V7H8a1,1,0,0,0,2,0H20Z"></path></svg>
                          </div>
                          <div>
                            <div className="font-bold mr-3">
                              {l._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                      <td>{getStatusComponent(l.status)}</td>
                      <td>{getPriorityComponent(l.priority)}</td>
                      {/* /admins/users/:userId/support-tickets */}
                      <td>
                        {l.status === "Closed" ? (<p>پاسخ داده شده</p>) : (<a href={`/admins/users/${l.assignedTo}/support-tickets/${l._id}`}><EditIcon /></a>)}

                      </td>
                      <td>
                        {l.status === "Closed" ? (<button className="cursor-not-allowed" disabled="true"><RiCheckboxCircleLine /></button>) : (<button onClick={() => closeTicket(l._id, l.user._id)}><RiCloseCircleLine /></button>)}

                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>) : (<h3>کاربران هنوز تیکت پشتیبانی ایجاد نکرده اند...</h3>)}

        <ToastContainer />

      </TitleCard>
    </>
  )
}

export default UserTickets