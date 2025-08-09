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
import { RiHome2Line, RiUser3Line } from "@remixicon/react"

// load icons
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'

import UpdateAdmin from "../features/admins/UpdateAdmin"


const TopSideButtons = () => {

    const dispatch = useDispatch()

    const createNewUser = () => {
        // dispatch(showNotification({ message: "Add New Member clicked", status: 1 }))
        dispatch(openModal({ title: "ایجاد ادمین جدید", bodyType: MODAL_BODY_TYPES.ADD_NEW_ADMIN }))
    }



    // return (
    //     <div className="inline-block float-right">
    //         <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => createNewUser()}>ایجاد اقامتگاه جدید</button>
    //     </div>
    // )
}

const convertCityEnglishToPersian = (city) => {

    switch (city) {
        case "arak":
            return "اراک"
            break;

        case "ardebil":
            return "اردبیل"
            break;


        case "oromieh":
            return "ارومیه"
            break;


        case "isfahan":
            return "اصفهان"
            break;

        case "ahvaz":
            return "اهواز"
            break;

        case "elam":
            return "ایلام"
            break;

        case "bognord":
            return "بجنورد"
            break;

        case "bandar_abbas":
            return "بندرعباس"
            break;

        case "boshehr":
            return "بوشهر"
            break;

        case "birgand":
            return "بیرجند"
            break;

        case "tabriz":
            return "تبریز"
            break;

        case "tehran":
            return "تهران"
            break;

        case "khoram_abad":
            return "خرم آباد "
            break;

        case "rasht":
            return "رشت"
            break;

        case "zahedan":
            return "زاهدان"
            break;

        case "zanjan":
            return "زنجان"
            break;

        case "sari":
            return "ساری"
            break;

        case "semnan":
            return "سمنان"
            break;

        case "sanandaj":
            return "سنندج"
            break;

        case "sharekord":
            return "شهرکرد"
            break;


        case "shiraz":
            return "شیراز"
            break;


        case "ghazvin":
            return "قزوین"
            break;

        case "ghom":
            return "قم"
            break;

        case "karaj":
            return "کرج"
            break;

        case "kerman":
            return "کرمان"
            break;

        case "kermanshah":
            return "کرمانشاه"
            break;


        case "gorgan":
            return "گرگان"
            break;

        case "mashhad":
            return "مشهد"
            break;

        case "hamedan":
            return "همدان"
            break;

        case "yasoj":
            return "یاسوج"
            break;

        case "yazd":
            return "یزد"
            break;

        default:
            break;
    }
}

const updateHouse = (isActiveState, houseId) => {
    let token = localStorage.getItem("userToken")

    if (isActiveState) {
        axios.put(`/api/admins/houses/${houseId}/deactive`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)
                Swal.fire({
                    title: "<small>آیا از غیر فعال کردن اقامتگاه اطمینان دارید؟</small>",
                    showDenyButton: true,
                    confirmButtonText: "بله",
                    denyButtonText: `خیر`
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("<small>اقامتگاه ویرایش شد!</small>", "", "success");
                    } else if (result.isDenied) {
                        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
                    }
                });
            })
            .catch((error) => {
                console.log('error', error)
                Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "danger");
            })
    } else {
        axios.put(`/api/admins/houses/${houseId}/active`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                console.log('response', response.data)
                Swal.fire({
                    title: "<small>آیا از فعال کردن اقامتگاه اطمینان دارید؟</small>",
                    showDenyButton: true,
                    confirmButtonText: "بله",
                    denyButtonText: `خیر`
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("<small>اقامتگاه ویرایش شد!</small>", "", "success");
                    } else if (result.isDenied) {
                        Swal.fire("<small>تغییرات ذخیره نشد</small>", "", "info");
                    }
                });
            })
            .catch((error) => {
                console.log('error', error)
                Swal.fire("تغییرات ذخیره نشد", "", "danger");
            })
    }

}



const Rooms = () => {
    const [houses, setHouses] = useState([])

    useEffect(() => {
        let token = localStorage.getItem("userToken")
        const AuthStr = 'Bearer '.concat(token);



        axios.get('/api/admins/houses', { headers: { authorization: AuthStr } })
            .then(response => {
                console.log(response.data.houses);

                setHouses(response.data.houses)
            })
            .catch((error) => {
                console.log('error ' + error);
            });
    }, [])


    return (
        <>

            <TitleCard title="اقامتگاه ها" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                <div className="overflow-x-auto w-full">
                    {houses.length > 0 ? (   <table className="table w-full">
                        <thead>
                            <tr>
                                <th>نام خانه  </th>
                                <th>استان(شهرستان) </th>
                                <th>نام مالک </th>
                                <th>شماره تلفن مالک</th>
                                <th>تاریخ ایجاد</th>
                                <th>وضعیت</th>
                                <th>تغییر وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                houses.map((l, k) => {
                                    return (
                                        <tr key={k}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" className="h-8 w-8 text-gray-800" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold mr-3">{l.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{convertCityEnglishToPersian(l.province)}</td>
                                            <td>{l.owner.name}</td>
                                            <td>{l.owner.phone}</td>
                                            <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                                            <td>{l.isActive ? 'فعال' : 'غیرفعال'}</td>
                                            <td><button onClick={() => updateHouse(l.isActive, l._id)}><EditIcon /></button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>):(<h3>هیچ اقامتگاهی هنوز اضافه نشده است...!</h3>)}
                 
                </div>
            </TitleCard>
        </>
    )
}

export default Rooms