import { useState } from 'react'
import { Link } from 'react-router-dom'

import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RiMailLine } from "@remixicon/react"


function ForgotPassword() {

    const [linkSent, setLinkSent] = useState(false)

    const [email, setEmail] = useState("")

    // btn spinner
    const [btnSpinner, setBtnSpinner] = useState(false)

    // error
    const [emailError, setEmailError] = useState(false)
    const [emailErrorMsg, setEmailErrorMsg] = useState("")

    const sendEmail = (e) => {
        e.preventDefault()

        setBtnSpinner(true)

        // email error
        if (!email || email === "" || email === undefined || email === null) {
            setEmailError(true)
            setEmailErrorMsg("*ایمیل باید وارد شود")
        }


        else {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }


            axios.post('/api/cooks/auth/forgot-password', { email }, config).then((data) => {

                if (data) {
                    console.log(data);

                    toast.info('ایمیل بازنشانی فرستاده شد. لطفا ایمیل خود را بررسی کنید.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setLinkSent(true)
                    setBtnSpinner(false)
                }
            }).catch((error) => {
                console.log(error);
                toast.error(error.response.data.msg || error, {
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
                <div className="card mx-auto w-full max-w-5xl shadow-xl">
                    <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                        <div className=''>
                            <div className="hero min-h-full rounded-l-xl bg-base-200">
                                <div className="hero-content p-2">
                                    <div className="w-50 px-6 py-4">
                                        <h1 className="mb-4 text-center font-bold text-lg"> تغییر گذرواژه</h1>
                                        <div className="my-auto"><img width={500} height={400} src="https://img.freepik.com/free-photo/3d-illustration-wrong-password-screen-red-lock_107791-16604.jpg?t=st=1741644062~exp=1741647662~hmac=aeae6fc4127b0c5d814f2d89f7f969634068bff47fbf3040b621efe9f214699d&w=996" style={{ borderRadius: '12px' }} alt="اقامتگاه" className="inline-block"></img></div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className='flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 py-2 w-full max-w-md mx-auto my-2'>
                            <div className="font-medium my-4 self-center text-xl sm:text-2xl uppercase text-gray-800">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
                            </div>
                            <div className="relative h-px bg-gray-300 mb-6">
                                <div className="absolute left-0 top-0 flex justify-center w-full">
                                    <span className="bg-white px-4 text-xs text-gray-500 uppercase">تغییر گذرواژه </span>
                                </div>
                            </div>

                            <p className='mb-6 mt-4 text-right text-gray-500'>برای تغییر گذرواژه ایمیل خود را در زیر وارد کنید</p>
                            <form className='my-auto '>
                                <div className="flex flex-col mb-2 sm:px-2">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">ایمیل</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiMailLine />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={email}
                                            onChange={(e) => setEmail(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="ایمیل" />
                                    </div>
                                    <span className='text-red-500 relative text-sm'>{emailError ? emailErrorMsg : ""}</span>
                                </div>



                                {/* send email forgot password */}
                                <div className="mt-4 w-full sm:px-2">
                                    <button className="app-btn-blue w-full" onClick={sendEmail}>
                                        {btnSpinner ? (
                                            <div className="px-10 py-1 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <span>فرستادن ایمیل</span>
                                        )}
                                    </button>
                                </div>

                                <p className='text-sm text-gray-800 mt-2 px-2'>حساب ندارید؟ <Link to='/cooks/register' className='hover:text-blue-900 hover:cursor-pointer'>ثبت نام </Link></p>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default ForgotPassword