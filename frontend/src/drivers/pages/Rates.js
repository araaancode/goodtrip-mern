import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification, setPageTitle } from "../features/common/headerSlice"
import moment from "moment"
import TitleCard from "../components/Cards/TitleCard"
import MomentJalali from "moment-jalaali"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { openModal } from "../features/common/modalSlice"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


// load icons
import AnswerIcon from '@iconscout/react-unicons/icons/uil-chat'
import StarIcon from '@iconscout/react-unicons/icons/uil-star'



import UpdateAdmin from "../features/admins/UpdateAdmin"


const TopSideButtons = () => {

  const dispatch = useDispatch()

  const createNewUser = () => {
    // dispatch(showNotification({ message: "Add New Member clicked", status: 1 }))
    dispatch(openModal({ title: "ایجاد ادمین جدید", bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN }))
  }



  // return (
  //     <div className="inline-block float-right">
  //         <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => createNewUser()}>ایجاد کاربر جدید</button>
  //     </div>
  // )
}


const TEAM_MEMBERS = [
  { name: "کاربر یک", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت یک", status: "دیده شده" },
  { name: "کاربر دو", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت دو", status: "دیده نشده" },
  { name: "کاربر سه", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت سه", status: "دیده شده" },
  { name: "کاربر چهار", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت چهار", status: "دیده شده" },
  { name: "کاربر پنج", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت پنج", status: "دیده نشده" },
  { name: "کاربر شش", avatar: "https://cdn-icons-png.flaticon.com/128/15735/15735364.png", ticket: "تیکت شش", status: "دیده نشده" },

]

const updateUser = () => {
  alert("پاسخ گویی به تیکت")
}



const deleteUser = () => {
  Swal.fire({
    title: "آیا از حذف ادمین اطمینان دارید؟",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "بله",
    denyButtonText: `خیر`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("ادمین حذف شد!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("تغییرات ذخیره نشد", "", "info");
    }
  });
}

const Rates = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPageTitle({ title: "امتیازها" }))
  }, [])


  const [members, setMembers] = useState(TEAM_MEMBERS)

  return (
    <>

      <TitleCard title="امتیازها" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>نام کاربر</th>
                <th>امتیاز</th>
              </tr>
            </thead>
            <tbody>
              {
                members.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-circle w-12 h-12">
                              <img className="w-6 h-6" src={l.avatar} alt="Avatar" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold mr-3">{l.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="flex">
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      <StarIcon />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  )
}

export default Rates