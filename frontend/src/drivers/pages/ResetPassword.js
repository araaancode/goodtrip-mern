import { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'


import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RiLockPasswordLine } from "@remixicon/react"


function ResetPassword() {

    const [errorMessage, setErrorMessage] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    let token = document.URL.split("?")[1].split("&")[0].split("=")[1]
    let driverId = document.URL.split("?")[1].split("&")[1].split("=")[1]

    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")
    const [errorConfirmPasswordMessage, setErrorConfirmPasswordMessage] = useState("")

    // btn spinner
    const [btnSpinner, setBtnSpinner] = useState(false)

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const submitForm = (e) => {
        e.preventDefault()

        setBtnSpinner(true)

        if (password.trim() === "") return setErrorPasswordMessage("گذرواژه ضروری است!")
        if (confirmPassword.trim() === "") return setErrorConfirmPasswordMessage("نایید گذرواژه ضروری است!")
        else {


            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }


            axios.post('/api/drivers/auth/reset-password', { password, confirmPassword, driverId, token }, config).then((data) => {

                if (data) {
                    console.log(data);

                    toast.info('!گذرواژه تغییر کرد', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })

                    setBtnSpinner(false)

                }
            }).catch((errMsg) => {
                console.log(errMsg);
                toast.error(errMsg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })



        }
    }


    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center text-right">
                <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                    <div className="grid md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                        <div className=''>
                            <div className="hero min-h-full rounded-l-xl bg-base-200">
                                <div className="hero-content p-2">
                                    <div className="w-50 px-6 py-4">
                                        <h1 className="mb-4 text-center font-bold text-lg"> تغییر گذرواژه</h1>
                                        <div className="my-auto"><img width={500} height={400} src="https://img.freepik.com/premium-photo/technology-image_1308217-1335.jpg?uid=R156737658&ga=GA1.1.972404931.1740587830&semt=ais_hybrid" style={{ borderRadius: '12px' }} alt="اقامتگاه" className="inline-block"></img></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 py-10 w-full max-w-md m-auto'>
                            <div className="font-medium mt-2 self-center text-xl sm:text-2xl uppercase text-gray-800">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
                            </div>
                            <div className="relative mt-2 h-px bg-gray-300">
                                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">تغییر گذرواژه </span>
                                </div>
                            </div>
                            <p className='mb-10 mt-8 text-right text-gray-500'>در زیر می توانید گذرواژه خود را تغییر دهید</p>
                            <form>

                                <div className="flex flex-col mb-2">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">گذرواژه</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiLockPasswordLine />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={password}
                                            onChange={handlePasswordChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="گذرواژه" />
                                    </div>
                                    <span className='text-red-500 relative text-sm'>{errorPasswordMessage ? errorPasswordMessage : ""}</span>
                                </div>


                                <div className="flex flex-col mb-2">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">تایید گذرواژه</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiLockPasswordLine />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={confirmPassword}
                                            onChange={handleConfirmPasswordChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="تایید گذرواژه" />
                                    </div>
                                    <span className='text-red-500 relative text-sm'>{errorConfirmPasswordMessage ? errorConfirmPasswordMessage : ""}</span>
                                </div>


                                {/* change password */}
                                <div className="mb-2 mt-4 w-full" onClick={submitForm}>
                                    <button className="app-btn-blue w-full" >
                                        {btnSpinner ? (
                                            <div className="px-10 py-1 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <span>تغییر گذرواژه</span>
                                        )}
                                    </button>
                                </div>


                                {/* <div className='text-center mt-4'>حساب ندارید؟ <Link to="/drivers/register">ثبت نام</Link></div> */}
                                <p className='text-sm text-gray-800 px-2'>حساب ندارید؟ <Link to='/drivers/register' className='hover:text-blue-900 hover:cursor-pointer'>ثبت نام </Link></p>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default ResetPassword