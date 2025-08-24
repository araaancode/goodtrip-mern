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

const API_BASE_URL = "/api/admins";

const TopSideButtons = () => {
    const dispatch = useDispatch()

    const createNewUser = () => {
        dispatch(openModal({ title: "ایجاد ادمین جدید", bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN }))
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => createNewUser()}>
                ایجاد راننده جدید
            </button>
        </div>
    )
}

const Drivers = () => {
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, isAdminAuthenticated } = useAdminAuthStore()

    const fetchDrivers = async () => {
        try {
            setLoading(true)
            setError(null)
            
            if (!isAdminAuthenticated) {
                setError("لطفا ابتدا وارد شوید")
                return
            }

            const response = await axios.get(`${API_BASE_URL}/drivers`, {
                withCredentials: true
            })
            
            setDrivers(response.data.drivers || [])
        } catch (error) {
            console.error('Error fetching drivers:', error)
            setError(error.response?.data?.msg || "خطا در دریافت اطلاعات رانندگان")
            
            if (error.response?.status === 401) {
                useAdminAuthStore.getState().logout()
            }
        } finally {
            setLoading(false)
        }
    }

    const updateDriverStatus = async (isActiveState, userId) => {
        try {
            const action = isActiveState ? "deactive" : "active"
            const actionText = isActiveState ? "غیر فعال کردن" : "فعال کردن"
            
            const result = await Swal.fire({
                title: `<small>آیا از ${actionText} راننده اطمینان دارید؟</small>`,
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`,
                icon: 'question'
            })

            if (!result.isConfirmed) {
                Swal.fire("<small>تغییرات لغو شد</small>", "", "info")
                return
            }

            await axios.put(`${API_BASE_URL}/drivers/${userId}/${action}`, {}, {
                withCredentials: true
            })

            // Update local state instead of refetching
            setDrivers(prevDrivers => 
                prevDrivers.map(driver => 
                    driver._id === userId 
                        ? { ...driver, isActive: !isActiveState }
                        : driver
                )
            )

            Swal.fire("<small>وضعیت راننده با موفقیت تغییر کرد!</small>", "", "success")
            
        } catch (error) {
            console.error('Error updating driver status:', error)
            Swal.fire(
                "<small>خطا در تغییر وضعیت</small>", 
                error.response?.data?.msg || "لطفا دوباره تلاش کنید", 
                "error"
            )
        }
    }

    useEffect(() => {
        fetchDrivers()
    }, [])

    if (loading) {
        return (
            <TitleCard title="راننده ها" topMargin="mt-2">
                <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="راننده ها" topMargin="mt-2">
                <div className="alert alert-error">
                    <div className="flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                             className="w-6 h-6 mx-2 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <label>{error}</label>
                    </div>
                </div>
                <button className="btn btn-primary mt-4" onClick={fetchDrivers}>
                    تلاش مجدد
                </button>
            </TitleCard>
        )
    }

    return (
        <TitleCard title="راننده ها" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
            {drivers.length > 0 ? (
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
                            {drivers.map((driver, index) => (
                                <tr key={driver._id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <RiUser3Line />
                                            </div>
                                            <div>
                                                <div className="font-bold mr-3">{driver.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{driver.phone}</td>
                                    <td>{driver.email || '-'}</td>
                                    <td>{new Date(driver.createdAt).toLocaleDateString('fa')}</td>
                                    <td>
                                        <span className={`badge ${driver.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {driver.isActive ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => updateDriverStatus(driver.isActive, driver._id)}
                                            title={driver.isActive ? "غیرفعال کردن" : "فعال کردن"}
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
                    <RiUser3Line className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">هنوز راننده ای وجود ندارد...</h3>
                </div>
            )}
        </TitleCard>
    )
}

export default Drivers