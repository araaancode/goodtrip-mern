import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import Swal from 'sweetalert2'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import "../components/modal.css"
import { PiNewspaperClipping } from "react-icons/pi"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'

// MUI Components
import { CircularProgress, Box, createTheme, ThemeProvider } from "@mui/material"
import { CssBaseline } from "@mui/material"

const theme = createTheme(
    {
        direction: "rtl", 
    },
)

// Configure axios to include credentials by default
axios.defaults.withCredentials = true

const TopSideButtons = () => {
    return (
        <div className="inline-block">
            <h6>لیست آگهی ها</h6>
        </div>
    )
}

const Advertisments = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "لیست آگهی ها" }))
    }, [dispatch])

    useEffect(() => {
        fetchAds()
    }, [])

    const fetchAds = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await axios.get('/api/drivers/ads', {
                withCredentials: true
            })
            
            setAds(response.data.ads)
        } catch (error) {
            console.error('Error fetching ads:', error)
            setError('خطا در دریافت اطلاعات آگهی ها')
            
            if (error.response?.status === 401) {
                toast.error('لطفا مجدداً وارد شوید')
            } else if (error.response?.status === 403) {
                toast.error('شما دسترسی لازم را ندارید')
            } else if (error.code === 'NETWORK_ERROR') {
                toast.error('خطا در اتصال به سرور')
            } else {
                toast.error('خطا در ارتباط با سرور')
            }
        } finally {
            setLoading(false)
        }
    }

    const deleteAds = async (adsId) => {
        try {
            const result = await Swal.fire({
                title: "<small>آیا از حذف آگهی اطمینان دارید؟</small>",
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`,
                icon: 'warning'
            })
            
            if (!result.isConfirmed) return
            
            await axios.delete(`/api/drivers/ads/${adsId}`, {
                withCredentials: true
            })
            
            toast.success("آگهی با موفقیت حذف شد")
            setAds(prevAds => prevAds.filter(ad => ad._id !== adsId))
            
        } catch (error) {
            console.error('Error deleting ad:', error)
            
            if (error.response?.status === 404) {
                toast.error('آگهی مورد نظر یافت نشد')
            } else if (error.response?.status === 403) {
                toast.error('شما اجازه حذف این آگهی را ندارید')
            } else if (error.response?.status === 401) {
                toast.error('لطفا مجدداً وارد شوید')
            } else {
                toast.error('خطا در حذف آگهی')
            }
        }
    }

    if (loading) {
        return (
            <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            </TitleCard>
        )
    }

    if (error) {
        return (
            <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <p className="text-red-500">{error}</p>
                </Box>
            </TitleCard>
        )
    }

    return (
        <>
            <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    {ads.length > 0 ? (
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>کد آگهی</th>
                                    <th>عنوان آگهی</th>
                                    <th>نام مشتری</th>
                                    <th>شماره همراه</th>
                                    <th>تاریخ ایجاد</th>
                                    <th>ویرایش</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map((ad) => (
                                    <tr key={ad._id}>
                                        <td className="flex items-center">
                                            <div className="flex items-center space-x-3">
                                                <div className="avatar">
                                                    <PiNewspaperClipping className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <div className="font-bold mr-3">{ad._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{ad.title}</td>
                                        <td>{ad.company?.name || 'نامشخص'}</td>
                                        <td>{ad.company?.phone || 'نامشخص'}</td>
                                        <td>{new Date(ad.createdAt).toLocaleDateString('fa')}</td>
                                        <td>
                                            <a 
                                                href={`/drivers/advertisments/${ad._id}/update`}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <EditIcon />
                                            </a>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => deleteAds(ad._id)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="حذف آگهی"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8">
                            <h3 className="text-gray-500">هنوز آگهی اضافه نشده است...!</h3>
                        </div>
                    )}
                </div>
                <ToastContainer 
                    position="top-left"
                    rtl={true}
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </TitleCard>
        </>
    )
}

export default Advertisments