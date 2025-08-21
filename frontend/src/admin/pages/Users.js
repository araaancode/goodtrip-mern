import { useEffect, useState } from "react"
import TitleCard from "../components/Cards/TitleCard"
import { showNotification } from '../features/common/headerSlice'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { openModal } from "../features/common/modalSlice"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import { RiUser3Line } from "@remixicon/react"
import { useAdminAuthStore } from '../stores/authStore' 
import {useDispatch} from "react-redux"

// load icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'
import UpdateAdmin from "../features/admins/UpdateAdmin"

const MySwal = withReactContent(Swal)

const TopSideButtons = () => {
    const dispatch = useDispatch()

    const createNewUser = () => {
        dispatch(openModal({ 
            title: "ایجاد ادمین جدید", 
            bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN 
        }))
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={createNewUser}>
                ایجاد کاربر جدید
            </button>
        </div>
    )
}

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, isAdminAuthenticated, admin } = useAdminAuthStore()

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await axios.get('/api/admins/users', {
                withCredentials: true
            })
            
            setUsers(response.data.data)
        } catch (error) {
            console.error('Error fetching users:', error)
            setError(error.response?.data?.msg || 'خطا در دریافت اطلاعات کاربران')
            MySwal.fire({
                title: "<small>خطا</small>",
                text: error.response?.data?.msg || 'خطا در دریافت اطلاعات کاربران',
                icon: "error"
            })
        } finally {
            setLoading(false)
        }
    }

    const updateUserStatus = async (isActiveState, userId) => {
        try {
            const confirmationResult = await MySwal.fire({
                title: "<small>آیا از تغییر وضعیت کاربر اطمینان دارید؟</small>",
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`,
                icon: "question"
            })

            if (!confirmationResult.isConfirmed) {
                MySwal.fire("<small>تغییرات لغو شد</small>", "", "info")
                return
            }

            const endpoint = `/api/admins/users/${userId}/${isActiveState ? 'deactive' : 'active'}`
            
            await axios.put(endpoint, {}, {
                withCredentials: true
            })

            // Update local state instead of refetching all users
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId 
                        ? { ...user, isActive: !isActiveState }
                        : user
                )
            )

            MySwal.fire({
                title: "<small>موفقیت آمیز</small>",
                text: "وضعیت کاربر با موفقیت تغییر کرد",
                icon: "success"
            })

        } catch (error) {
            console.error('Error updating user status:', error)
            MySwal.fire({
                title: "<small>خطا</small>",
                text: error.response?.data?.msg || 'خطا در تغییر وضعیت کاربر',
                icon: "error"
            })
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('fa-IR')
        } catch (error) {
            return dateString
        }
    }

    if (loading) {
        return (
            <TitleCard title="کاربران" topMargin="mt-2">
                <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="کاربران" topMargin="mt-2">
                <div className="alert alert-error">
                    <span>{error}</span>
                    <button 
                        className="btn btn-sm btn-ghost"
                        onClick={fetchUsers}
                    >
                        تلاش مجدد
                    </button>
                </div>
            </TitleCard>
        )
    }

    return (
        <>
            <TitleCard 
                title="کاربران" 
                topMargin="mt-2" 
                TopSideButtons={<TopSideButtons />}
            >
                {users.length > 0 ? (
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
                                {users.map((user, index) => (
                                    <tr key={user._id || index}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <RiUser3Line />
                                                </div>
                                                <div>
                                                    <div className="font-bold mr-3">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.phone}</td>
                                        <td>{user.email}</td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td>
                                            <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                                                {user.isActive ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => updateUserStatus(user.isActive, user._id)}
                                                disabled={loading}
                                            >
                                                <EditIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <h3 className="text-gray-500">هنوز کاربری وجود ندارد...</h3>
                    </div>
                )}
            </TitleCard>
        </>
    )
}

export default Users