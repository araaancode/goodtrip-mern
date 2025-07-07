import moment from "moment"
import { useEffect, useState } from "react"
import TitleCard from "../../../components/Cards/TitleCard"

import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import Select from "react-tailwindcss-select";
import 'react-tailwindcss-select/dist/index.css'

import Swal from 'sweetalert2'
import axios from "axios"


import { FaMountainCity } from "react-icons/fa6";

import { FiPhone } from "react-icons/fi";
import { FaTreeCity } from "react-icons/fa6";

import { IoFastFoodOutline } from "react-icons/io5";
import { GoNumber } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { TbClockHour12 } from "react-icons/tb";
import { PiChefHatLight } from "react-icons/pi";
import { PiBowlFood } from "react-icons/pi";




const options = [
    {
        label: "غذاهای ایرانی",
        options: [
            { value: "kebab", label: "کباب" },
            { value: "ghormeh_sabzi", label: "قرمه سبزی" },
            { value: "fesenjan", label: "فسنجان" },
            { value: "tahchin", label: "ته چین" },
            { value: "ash_reshteh", label: "آش رشته" },
            { value: "zereshk_polo", label: "زرشک پلو" },
            { value: "bademjan", label: "بادمجان" },
            { value: "gheymeh", label: "قیمه" },
            { value: "kashke_bademjan", label: "کشک بادمجان" },
            { value: "dizi", label: "دیزی" },
            { value: "baghali_polo", label: "باقالی پلو" },
            { value: "sabzi_polo", label: "سبزی پلو" },
            { value: "shirin_polo", label: "شیرین پلو" },
            { value: "khoreshte_bamieh", label: "خورشت بامیه" },
            { value: "adas_polo", label: "عدس پلو" },
            { value: "abgoosht", label: "آبگوشت" },
            { value: "tahdig", label: "ته دیگ" },
            { value: "loobia_polo", label: "لوبیا پلو" },

        ]
    },

];

const weekDays = [
    {
        label: "روزهای هفته",
        options: [
            { value: "sat", label: "شنبه" },
            { value: "sun", label: "یکشنبه" },
            { value: "mon", label: "دوشنبه" },
            { value: "thu", label: "سه شنبه" },
            { value: "wed", label: "چهارشنبه" },
            { value: "thur", label: "پنج شنبه" },
            { value: "fri", label: "جمعه" },
        ]
    },

];


const hourOptions = [
    { value: "morning", label: "صبح تا ظهر (7 تا 12)" },
    { value: "noon", label: "صبح تا شب (7 تا 0)" },
    { value: "night", label: "ظهر تا شب (12 تا 0)" },
    { value: "none", label: "هیچکدام" }
];


function CookSettings() {

    const [errorMessage, setErrorMessage] = useState("")

    const [errorPhoneMessage, setErrorPhoneMessage] = useState("")
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")

    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [address, setAddress] = useState("")
    const [foodItems, setFoodItems] = useState(null)
    const [count, setCount] = useState(0)
    const [cookDate, setCookDate] = useState(null)
    const [cookHour, setCookHour] = useState(null)
    const [housePhone, setHousePhone] = useState("")
    const [foodImage, setFoodImage] = useState()

    const [animal, setAnimal] = useState(null);

    const handleChange = value => {
        console.log("value:", value);
        setAnimal(value);
    };

    let token = localStorage.getItem("userToken")

    const updateFormValue = ({ updateType, value }) => {
        console.log(updateType)
    }

    const handleHousePhoneChange = (e) => {
        setHousePhone(e.target.value)
    }

    const handleProvinceChange = (e) => {
        setProvince(e.target.value)
    }

    const handleCityChange = (e) => {
        setCity(e.target.value)
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }


    const handleFoodItemsChange = value => {
        console.log(value);
        
        setFoodItems(value)
    }

    const handleCountChange = (e) => {
        setCount(e.target.value)
    }

    const handleCookDateChange = (value) => {
        setCookDate(value)
    }

    const handleCookHourChange = (value) => {
        setCookHour(value)
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }


    const handleFoodImageChange = (e) => {
        setFoodImage(e.target.files[0])
    }



    // get cook info
    // axios.get('/api/cooks/me', {
    //     headers: {
    //         authorization: `Bearer ${token}`, // Include token in the Authorization header
    //     },
    // })
    //     .then((response) => {
    //         setHousePhone(response.data.cook.housePhone)
    //         setCity(response.data.cook.city)
    //         setProvince(response.data.cook.province)
    //         setProvince(response.data.cook.address)
    //         setProvince(response.data.cook.count)
    //         setProvince(response.data.cook.cookDate)
    //         setProvince(response.data.cook.cookHour)
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error.response ? error.response.data : error.message);
    //     });


    // Call API to update profile settings changes
    const updateCookInfo = () => {

        // change cook info
        axios.put(`/api/cooks/update-profile`, { name, housePhone, province, city, address, foodItems, count, cookDate, cookHour, foodImage }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
        })
            .then((response) => {
                Swal.fire({
                    title: "<small>آیا از ویرایش پروفایل اطمینان دارید؟</small>",
                    showDenyButton: true,
                    confirmButtonText: "بله",
                    denyButtonText: `خیر`
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("<small>پروفایل ویرایش شد!</small>", "", "success");
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

            <TitleCard title="ثبت اطلاعات غذادار" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <InputText labelTitle="تلفن ثابت" placeholder="تلفن ثابت" updateFormValue={updateFormValue} />
                    <InputText labelTitle="استان-شهر" placeholder="استان-شهر" updateFormValue={updateFormValue} />
                    <InputText labelTitle="آدرس" placeholder="آدرس" updateFormValue={updateFormValue} />
                    <InputText labelTitle="توانایی پخت چند پرس غذا در روز" placeholder="توانایی پخت چند پرس غذا در روز" updateFormValue={updateFormValue} />
                    <InputText labelTitle="چه غذاهایی می توانید درست کنید" placeholder="چه غذاهایی می توانید درست کنید" updateFormValue={updateFormValue} />
                    <InputText labelTitle="تعداد" placeholder="تعداد" updateFormValue={updateFormValue} />
                    <InputText labelTitle="تاریخ روزهایی که می توانید غذا درست کنید" placeholder="تاریخ روزهایی که می توانید غذا درست کنید" updateFormValue={updateFormValue} />
                    <InputText labelTitle="ساعت هایی روزهایی که می توانید غذا درست کنید" placeholder="تاریخ روزهایی که می توانید غذا درست کنید" updateFormValue={updateFormValue} />
                    <InputText labelTitle="نام سرآشپز" placeholder="نام سرآشپز" updateFormValue={updateFormValue} />
                    <InputText labelTitle="نام آشپز" placeholder="نام سرآشپز" updateFormValue={updateFormValue} />
                    <InputText labelTitle="عکس غذا" placeholder="عکس غذا" updateFormValue={updateFormValue} /> */}

                    {/* housePhone */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="housePhone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">تلفن ثابت</label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FiPhone className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={housePhone}
                                onChange={handleHousePhoneChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="تلفن ثابت" />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>

                    {/* province */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">استان </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FaMountainCity className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={province}
                                onChange={handleProvinceChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="استان " />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>

                    {/* city */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شهر </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <FaTreeCity className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={city}
                                onChange={handleCityChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شهر " />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>


                    {/*  food count  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">تعداد غذاها  </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <GoNumber className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={count}
                                onChange={handleCountChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="تعداد غذاها " />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>

                    {/*  food date  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"> تاریخ پخت  </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <SlCalender className="w-6 h-6 text-gray-400" />
                            </div>
                            {/* <input style={{ borderRadius: '5px' }} type="datepicker" value={cookDate}
                                onChange={handleCookDateChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder=" تاریخ پخت " /> */}

                            <Select
                                value={cookDate}
                                onChange={handleCookDateChange}
                                options={weekDays}
                                isMultiple={true}
                                formatGroupLabel={data => (
                                    <div className={`py-2 text-xs flex items-center justify-between`}>
                                        <span className="font-bold">{data.label}</span>
                                        <span className="bg-gray-200 h-5 h-5 p-1.5 flex items-center justify-center rounded-full">
                                            {data.options.length}
                                        </span>
                                    </div>
                                )}
                            />

                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>


                    {/*  food hour  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"> ساعت پخت  </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <TbClockHour12 className="w-6 h-6 text-gray-400" />
                            </div>
                            {/* <input style={{ borderRadius: '5px' }} type="datepicker" value={cookHour}
                                onChange={handleCookHourChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder=" ساعت پخت " /> */}

                            <Select
                                value={cookHour}
                                onChange={handleCookHourChange}
                                options={hourOptions}
                            />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>

                    {/*  cook name  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"> نام آشپز   </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <PiChefHatLight className="w-6 h-6 text-gray-400" />
                            </div>
                            <input style={{ borderRadius: '5px' }} type="text" value={name}
                                onChange={handleNameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder=" نام آشپز  " />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>


                    {/*  food image  */}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">عکس غذا </label>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                <PiBowlFood className="w-6 h-6 text-gray-400" />
                            </div>
                            {/* <input style={{ borderRadius: '5px' }} type="file" value={foodImage} accept="image/*"
                                onChange={() => handleFoodImageChange()} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="عکس غذا" /> */}

                            <input type="file" onChange={handleFoodImageChange} name="foodImage" id="foodImage" className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" />
                        </div>
                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                    </div>


                </div>

                {/*  food type */}
                <div className="flex flex-col mb-6">
                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام غذاها  </label>
                    <div className="relative">
                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                            <IoFastFoodOutline className="w-6 h-6 text-gray-400" />
                        </div>
                        {/* <input style={{ borderRadius: '5px' }} type="text" value={foodItems}
                                onChange={handleFoodItemsChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام غذاها " /> */}
                        <Select
                            value={foodItems}
                            onChange={handleFoodItemsChange}
                            options={options}
                            isMultiple={true}
                            formatGroupLabel={data => (
                                <div className={`py-2 text-xs flex items-center justify-between`}>
                                    <span className="font-bold">{data.label}</span>
                                    <span className="bg-gray-200 h-5 h-5 p-1.5 flex items-center justify-center rounded-full">
                                        {data.options.length}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                    <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                </div>

                {/*  address */}
                <div className="flex flex-col mb-6">
                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">آدرس </label>
                    <div className="relative">
                        <textarea style={{ borderRadius: '5px', resize: 'none' }} type="text" value={address}
                            onChange={handleAddressChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="آدرس "></textarea>
                    </div>
                    <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                </div>


                <div className="mt-4"><button className="btn btn-primary float-right" onClick={() => updateCookInfo()}>ثبت اطلاعات غذادار</button></div>
            </TitleCard>
        </>
    )
}


export default CookSettings