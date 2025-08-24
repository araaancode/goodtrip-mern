import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import { openModal } from "../features/common/modalSlice"
import Swal from 'sweetalert2'
import axios from "axios"
import { RiUser3Line } from "@remixicon/react"
import { useAdminAuthStore } from '../stores/authStore'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'

// load icons
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'

const API_BASE_URL = "/api/admins";

const TopSideButtons = () => {
    const dispatch = useDispatch()

    const createNewCook = () => {
        dispatch(openModal({ title: "ایجاد آشپز جدید", bodyType: MODAL_BODY_TYPES.ADD_NEW_COOK }))
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => createNewCook()}>
                ایجاد آشپز جدید
            </button>
        </div>
    )
}

const Cooks = () => {
    const [cooks, setCooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { isAdminAuthenticated, logout } = useAdminAuthStore()
    const dispatch = useDispatch()

    const fetchCooks = async () => {
        try {
            setLoading(true)
            setError(null)
            
            if (!isAdminAuthenticated) {
                setError("لطفا ابتدا وارد شوید")
                return
            }

            const response = await axios.get(`${API_BASE_URL}/cooks`, {
                withCredentials: true
            })
            
            setCooks(response.data.cooks || [])
        } catch (error) {
            console.error('Error fetching cooks:', error)
            setError(error.response?.data?.msg || "خطا در دریافت اطلاعات آشپزها")
            
            if (error.response?.status === 401) {
                logout()
            }
        } finally {
            setLoading(false)
        }
    }

    const updateCookStatus = async (isActiveState, userId, cookName) => {
        try {
            const action = isActiveState ? "deactive" : "active"
            const actionText = isActiveState ? "غیر فعال کردن" : "فعال کردن"
            
            const result = await Swal.fire({
                title: `<small>آیا از ${actionText} آشپز "${cookName}" اطمینان دارید؟</small>`,
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`,
                icon: 'question',
                customClass: {
                    popup: 'text-right'
                }
            })

            if (!result.isConfirmed) {
                Swal.fire("<small>تغییرات لغو شد</small>", "", "info")
                return
            }

            await axios.put(`${API_BASE_URL}/cooks/${userId}/${action}`, {}, {
                withCredentials: true
            })

            // Update local state optimistically
            setCooks(prevCooks => 
                prevCooks.map(cook => 
                    cook._id === userId 
                        ? { ...cook, isActive: !isActiveState }
                        : cook
                )
            )

            Swal.fire({
                title: "<small>وضعیت آشپز با موفقیت تغییر کرد!</small>",
                icon: "success",
                customClass: {
                    popup: 'text-right'
                }
            })
            
        } catch (error) {
            console.error('Error updating cook status:', error)
            Swal.fire({
                title: "<small>خطا در تغییر وضعیت</small>",
                text: error.response?.data?.msg || "لطفا دوباره تلاش کنید",
                icon: "error",
                customClass: {
                    popup: 'text-right'
                }
            })
            
            // Refetch to ensure state is correct
            fetchCooks()
        }
    }

    const renderCookAvatar = (cook) => {
        if (cook.avatar && cook.avatar !== 'default.jpg') {
            return (
                <div className="mask mask-circle w-12 h-12">
                    <img 
                        src={`../../../uploads/cookAvatarDir/${cook.avatar}`} 
                        alt="آواتار آشپز" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        }
        return <RiUser3Line className="w-8 h-8 text-gray-400" />
    }

    useEffect(() => {
        fetchCooks()
    }, [])

    if (loading) {
        return (
            <TitleCard title="آشپز ها" topMargin="mt-2">
                <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg"></div>
                    <span className="mr-2">در حال بارگذاری...</span>
                </div>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="آشپز ها" topMargin="mt-2">
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
                <button className="btn btn-primary mt-4" onClick={fetchCooks}>
                    تلاش مجدد
                </button>
            </TitleCard>
        )
    }

    return (
        <TitleCard title="آشپز ها" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
            {cooks.length > 0 ? (
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
                            {cooks.map((cook, index) => (
                                <tr key={cook._id || index}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                {renderCookAvatar(cook)}
                                            </div>
                                            <div>
                                                <div className="font-bold mr-3">{cook.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{cook.phone}</td>
                                    <td>{cook.email || '-'}</td>
                                    <td>{new Date(cook.createdAt).toLocaleDateString('fa-IR')}</td>
                                    <td>
                                        <span className={`badge ${cook.isActive ? 'badge-success' : 'badge-error'}`}>
                                            {cook.isActive ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => updateCookStatus(cook.isActive, cook._id, cook.name)}
                                            title={cook.isActive ? "غیرفعال کردن" : "فعال کردن"}
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
                    <RiUser3Line className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">هنوز آشپزی وجود ندارد...</h3>
                    <p className="text-sm text-gray-500 mt-2">برای شروع، یک آشپز جدید ایجاد کنید</p>
                </div>
            )}
        </TitleCard>
    )
}

export default Cooks