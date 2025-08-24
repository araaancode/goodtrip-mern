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
import { RiUser3Line } from "@remixicon/react"
import { useAdminAuthStore } from '../stores/authStore'

// load icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'

import UpdateAdmin from "../features/admins/UpdateAdmin"

const TopSideButtons = () => {
    const dispatch = useDispatch()

    const createNewUser = () => {
        dispatch(openModal({ title: "ایجاد ادمین جدید", bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN }))
    }
}

const updateOwner = async (isActiveState, ownerId) => {
    try {
        const endpoint = isActiveState 
            ? `/api/admins/owners/${ownerId}/deactive` 
            : `/api/admins/owners/${ownerId}/active`
            
        await axios.put(endpoint, {}, {
            withCredentials: true
        })
        
        Swal.fire({
            title: "<small>آیا از تغییر وضعیت مالک اطمینان دارید؟</small>",
            showDenyButton: true,
            confirmButtonText: "بله",
            denyButtonText: `خیر`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("<small>مالک ویرایش شد!</small>", "", "success");
                // Refresh the page or update state to reflect changes
                window.location.reload();
            } else if (result.isDenied) {
                Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
            }
        });
    } catch (error) {
        console.log('error', error)
        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "danger");
    }
}

const Owners = () => {
    const [owners, setOwners] = useState([])
    const { token, checkAuthAdmin } = useAdminAuthStore()

    useEffect(() => {
        fetchOwners()
    }, [])

    const fetchOwners = async () => {
        try {
            const response = await axios.get('/api/admins/owners', {
                withCredentials: true
            })
            setOwners(response.data.owners)
        } catch (error) {
            console.log('error ' + error)
            // Handle unauthorized access
            if (error.response?.status === 401) {
                // Try to refresh authentication
                await checkAuthAdmin()
                fetchOwners() // Retry the request
            }
        }
    }

    return (
        <>
            <TitleCard title="مالک ها" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                {owners.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>نام و نام خانوادگی</th>
                                    <th>شماره تلفن</th>
                                    <th>ایمیل</th>
                                    <th>تاریخ عضویت</th>
                                    <th>وضعیت</th>
                                    <th>تغییر وضعیت</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.map((l, k) => (
                                    <tr key={k}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <RiUser3Line />
                                                </div>
                                                <div>
                                                    <div className="font-bold mr-3">{l.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{l.phone}</td>
                                        <td>{l.email}</td>
                                        <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                                        <td>{l.isActive ? 'فعال' : 'غیرفعال'}</td>
                                        <td>
                                            <button onClick={() => updateOwner(l.isActive, l._id)}>
                                                <EditIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <h3>هنوز ملک داری وجود ندارد...</h3>
                )}
            </TitleCard>
        </>
    )
}

export default Owners