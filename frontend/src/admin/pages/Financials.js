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
import { RiTentLine,RiUser3Line, RiUser3Fill, RiSearchLine, RiCalendar2Line, RiLogoutBoxRLine, RiHeart2Line, RiBankCard2Line, RiNotificationLine, RiCustomerService2Line, RiCameraFill } from "@remixicon/react";


const TopSideButtons = () => {

    const dispatch = useDispatch()



}





const Financials = () => {
    const dispatch = useDispatch()
    const [isClicked, setIsClicked] = useState(false)


    useEffect(() => {
        dispatch(setPageTitle({ title: "بخش مالی" }))
    }, [])



    return (
        <>

            <TitleCard title="بخش مالی" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                    {isClicked ? (
                        <div className="w-full py-4 px-6 bg-white mt-0 rounded-lg mx-6 h-30">
                            <h1 className='px-8 mt-8 mb-2 text-blue-800 text-xl font-bold'>افزودن اطلاعات حساب</h1>
                            <p className='px-8 my-2'>افزودن اطلاعات حساب
                                جهت واریز مبالغ اجاره اقامتگاهتان اطلاعات مربوط به حساب بانکی خود را وارد نمایید</p>
                            <div className="flex w-full justify-center items-center">
                                <form className="bg-white ounded px-8 pt-6 pb-8 mb-4 w-full">
                                    {/* First Row */}
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label
                                                className="block uppercase tracking-wide rounded-md font-bold mb-2"
                                                htmlFor="firstName"
                                            >
                                                نام و نام خانوادگی <span className='text-red-500'>*</span>
                                            </label>
                                            <input
                                                className="block w-full border border-gray-400 rounded-md px-4 leading-tight focus:outline-none"
                                                id="first-name"
                                                type="text"
                                                style={{ borderRadius: '5px', padding: '15px', height: '60px' }}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 px-3">
                                            <label
                                                className="block uppercase tracking-wide rounded-md font-bold mb-2"
                                                htmlFor="lastName"
                                            >
                                                شماره کارت<span className='text-red-500'>*</span>
                                            </label>
                                            <input
                                                className="block w-full border border-gray-400 rounded-md px-4 leading-tight focus:outline-none"
                                                id="firstName"
                                                type="text"
                                                style={{ borderRadius: '5px', padding: '15px', height: '60px' }}

                                            />
                                        </div>
                                    </div>
                                    {/* Second Row */}


                                    <div className="w-full" dir='ltr'>
                                        <label dir='rtl'
                                            className="block uppercase tracking-wide rounded-md font-bold mb-2"
                                            htmlFor="lastName"
                                        >
                                            شماره شبا<span className='text-red-500 mr-2'>*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <span style={{ padding: '15px', height: '60px', borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} className="inline-flex items-center px-4 border border-gray-400">
                                                IR
                                            </span>
                                            <input style={{ padding: '15px', height: '60px', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} type="text" className="rounded-none border border-gray-400 block w-full focus:outline-none" />
                                        </div>

                                    </div>

                                    <div className="border-t border-blue-800 my-8" />
                                    {/* Submit Button */}
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="bg-blue-800 hover:bg-blue-900 text-white font-bold p-6 rounded focus:outline-none focus:shadow-outline"
                                            type="button"
                                        >
                                            ثبت اطلاعات
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full p-6 bg-white m-auto h-screen mx-6">
                            <div className="flex items-center justify-center h-50">
                                <div className="bg-whit p-4 text-center">
                                    <div style={{ width: '150px', height: '150px', margin: '10px auto' }} className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                                        <RiBankCard2Line className="text-gray-400 w-12 h-12 " />
                                    </div>
                                    <h2 style={{ fontSize: '20px' }} className="text-gray-500 mb-2">هنوز هیچ حساب بانکی وجود ندارد</h2>
                                    <h2 style={{ fontSize: '20px' }} className="text-gray-500">جهت دریافت وجه، اطلاعات حساب خود را اضافه کنید</h2>
                                    <button onClick={(e) => setIsClicked(true)} style={{ borderRadius: "10px", margin: '50px 0' }} className="bg-blue-800 text-white py-4 px-8 hover:bg-blue-900 font-bold transition duration-300">
                                        + افزودن اطلاعات حساب
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

            </TitleCard>
        </>
    )
}

export default Financials