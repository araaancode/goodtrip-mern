import { useEffect, useState } from "react"

import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"

import Swal from 'sweetalert2'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import "../components/modal.css"
import { PiNewspaperClipping, PiMoney, PiMapPinLight } from "react-icons/pi";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// load icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'

import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Box, createTheme, ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { arSA } from "@mui/x-data-grid/locales"; // Optional: Arabic localization

const theme = createTheme(
    {
        direction: "rtl", 
    },
);



const TopSideButtons = () => {

    return (
        <>
            <div className="inline-block">
                <h6>لیست آگهی ها</h6>
            </div>

        </>

    )
}





const deleteAds = (adsId) => {
    let token = localStorage.getItem("userToken")


    axios.delete(`/api/drivers/ads/${adsId}`, {
        headers: {
            'authorization': 'Bearer ' + token
        },
    })
        .then((response) => {
            Swal.fire({
                title: "<small>آیا از حذف آگهی اطمینان دارید؟</small>",
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("<small>آگهی حذف شد!</small>", "", "success");
                    window.location.reload()
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

const Advertisments = () => {

    const [orderStatus, setAdstatus] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);


    const handleOrderStatusChange = (e) => {
        setAdstatus(e.target.value);
    };

    const openChangeStatusModal = (orderId) => {
        setIsOpen(true);
        setOrderId(orderId)
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "لیست آگهی ها" }))
    }, [])




    useEffect(() => {
        let token = localStorage.getItem("userToken")
        const AuthStr = 'Bearer '.concat(token);

        axios.get('/api/drivers/ads', { headers: { authorization: AuthStr } })
            .then(response => {
                console.log(response.data);
                
                setAds(response.data.ads)
                setLoading(false);

            })
            .catch((error) => {
                console.log('error ' + error);
            });
    }, [])

 


    const changeOrderStatus = () => {
        let token = localStorage.getItem("userToken")

        axios.put(`/api/drivers/foods/order-foods/${orderId}/change-status`, { orderStatus }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)
                Swal.fire({
                    title: "<small>آیا از ویرایش آگهی اطمینان دارید؟</small>",
                    showDenyButton: true,
                    confirmButtonText: "بله",
                    denyButtonText: `خیر`
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("<small>آگهی ویرایش شد!</small>", "", "success");
                        document.location.reload()
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

                <div className="overflow-x-auto w-full">
                     {ads.length > 0 ? (
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>کد آگهی</th>
                                    <th>عنوان آگهی </th>
                                    <th>نام مشتری </th>
                                    <th> شماره همراه</th>
                                    <th>تاریخ ایجاد</th>
                                    <th>ویرایش</th>
                                    <th>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ads.map((l, k) => {
                                        return (
                                            <tr key={k}>
                                                <td className="flex items-center" >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <PiNewspaperClipping className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold mr-3">{l._id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{l.title}</td>
                                                <td>{l.company.name}</td>
                                                <td>{l.company.phone}</td>
                                                <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                                                <td><a href={`/drivers/advertisments/${l._id}/update`}><EditIcon /></a></td>
                                                <td><button onClick={() => deleteAds(l._id)}><DeleteIcon /></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    ) : (
                        <h3>هنوز آگهی اضافه نشده است...!</h3>
                    )} 
                    

                </div>
                <ToastContainer />

            </TitleCard>
        </>
    )
}

export default Advertisments