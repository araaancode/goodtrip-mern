import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiLoader2Fill, RiLoaderLine } from "@remixicon/react"
import { MdOutlineSms } from "react-icons/md";
import { useNavigate } from 'react-router-dom'



function Login() {

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [errorPhoneMessage, setErrorPhoneMessage] = useState("")
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")
    const [code, setCode] = useState('');

    const [isLogin, setIsLogin] = useState(false);


    const navigate = useNavigate()

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const submitForm = (e) => {
        // e.preventDefault()
        // setErrorMessage("")

        // if (phone.trim() === "") return setErrorPhoneMessage("* شماره تلفن ضروری است")
        // if (password.trim() === "") return setErrorPasswordMessage("* گذرواژه ضروری است")


        // else {
        //     setLoading(true)
        //     localStorage.setItem("token", "DumyTokenHere")
        //     setLoading(false)
        //     window.location.href = '/admins/welcome'
        // }

        e.preventDefault()

        if (phone && password) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }


            axios.post('/api/admins/auth/login', { phone, password }, config).then((data) => {

                if (data) {
                    console.log(data);

                    axios.post('/api/admins/auth/send-otp', { phone }, config).then((otpData) => {

                        toast.info('!کد یکبار مصرف ارسال شده را در زیر وارد کنید', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })

                        setIsLogin(true)
                    })

                }
            }).catch((errMsg) => {
                console.log(errMsg);
                toast.error(errMsg.response.data.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })


        } else {
            toast.error('!!لطفا همه فیلدها را وارد کنید', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }




    const verify = (e) => {
        e.preventDefault()
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        if (code) {
            axios.post('/api/admins/auth/verify-otp', { phone, code }, config).then((data) => {

                if (data) {
                    const token = data.data.token
                    localStorage.setItem("userToken", token)
                    navigate('/admins/welcome')

                }

            }).catch((errMsg) => {
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
        } else {
            toast.error('!!لطفا کد تایید را وارد کنید', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 flex items-center text-right">
            <div className="card mx-auto w-full max-w-5xl shadow-2xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className='w-50'>
                        <div className="hero min-h-full rounded-l-xl bg-base-200">
                            <div className="hero-content py-8">
                                <div className="w-50">
                                    <h1 className="mb-5 text-center font-bold text-lg"> ورود به پنل مدیریت</h1>
                                    <div className="text-center mt-0 mb-35"><img src="https://img.freepik.com/premium-photo/log-cabin-mountains-with-sunset-background_865967-19459.jpg?ga=GA1.1.183878651.1734187720&semt=ais_hybrid" alt="اقامتگاه" className="w-full rounded rounded-lg inline-block shadow-md"></img></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLogin ? (
                        <div className="w-full p-8 space-y-4 bg-white">
                            <h2 className="text-xl font-bold text-gray-700">تایید کد</h2>
                            <p className='text-gray-500 mt-1 mb-4'>کد ارسال شده را در زیر وارد کنید. </p>
                            <form className="space-y-4" onSubmit={verify}>
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">کد یکبار مصرف</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <MdOutlineSms className='w-6 h-6 text-gray-400' />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" name='code'
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="کد یکبار مصرف" />
                                    </div>
                                    <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded mb-10 p-2 text-white bg-blue-800 hover:bg-blue-900 "
                                >
                                    {loading ? <RiLoaderLine /> : 'تایید کد'}
                                </button>
                            </form>
                        </div>) : (
                        <div className="flex flex-col bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-8 w-full max-w-md m-auto">
                            <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
                            </div>
                            <div className="relative mt-10 h-px bg-gray-300">
                                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                    <span className="bg-white px-4 text-xs text-gray-500 uppercase"> ورود به پنل مدیریت </span>
                                </div>
                            </div>
                            <div className="mt-10">
                                <form onSubmit={submitForm}>
                                    <div className="flex flex-col mb-6">
                                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
                                        <div className="relative">
                                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                <RiPhoneLine />
                                            </div>
                                            <input style={{ borderRadius: '5px' }} type="text" value={phone}
                                                onChange={handlePhoneChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                                        </div>
                                        <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
                                    </div>
                                    <div className="flex flex-col mb-1">
                                        <div className="mb-2 relative">
                                            <label className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600" htmlFor="password">
                                                گذرواژه
                                            </label>

                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                id="password"
                                                onChange={handlePasswordChange}
                                                value={password}
                                                className="w-full px-4 py-2 border border-gray-400 placeholder-gray-400 rounded-sm focus:outline-none focus:border-blue-800"
                                                placeholder="گذرواژه"
                                                style={{ borderRadius: '5px' }}
                                            />

                                            <div
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 left-3 flex items-center cursor-pointer top-6"
                                            >
                                                {passwordVisible ? (
                                                    <RiEye2Line className='text-gray-400' />
                                                ) : (
                                                    <RiEyeCloseLine className='text-gray-400' />
                                                )}
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{errorPasswordMessage ? errorPasswordMessage : ""}</span>


                                        </div>
                                        <div className="flex items-center mb-6">
                                            <div className="flex ml-auto">
                                                <a href="/admins/forgot-password" className="inline-flex text-xs font-bold sm:text-sm text-blue-800 hover:text-blue-900">گذرواژه خود را فراموش کردید؟</a>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex w-full">
                                        <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-800 hover:bg-blue-900 rounded py-2 w-full transition duration-150 ease-in">
                                            <span className="mr-2 uppercase">ورود</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className='text-center mt-4'>حساب ندارید؟ <a href="/admins/register" className='no-underline hover:text-blue-900'><button className="inline-block hover:cursor-pointer transition duration-200"> ثبت نام </button></a></div>
                        </div>
                    )}


                </div>
            </div>
            <ToastContainer />

        </div>
    )
}

export default Login