import { useState } from 'react'
import { Link } from 'react-router-dom'

import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUserSmileLine, RiUser2Line, RiMailLine, RiLoader2Fill, RiUser5Line } from "@remixicon/react"

import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'


function Register() {

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate()


    // error
    const [nameError, setNameError] = useState(false)
    const [nameErrorMsg, setNameErrorMsg] = useState("")

    const [usernameError, setUsernameError] = useState(false)
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("")

    const [emailError, setEmailError] = useState(false)
    const [emailErrorMsg, setEmailErrorMsg] = useState("")

    const [phoneError, setPhoneError] = useState(false)
    const [phoneErrorMsg, setPhoneErrorMsg] = useState("")

    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")



    // btn spinner
    const [btnSpinner, setBtnSpinner] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };




    const register = (e) => {

        e.preventDefault()

        // name error
        if (!name || name === "" || name === undefined || name === null) {
            setNameError(true)
            setNameErrorMsg("* نام و نام خانوادگی باید وارد شود")
        }

        // username error
        if (!username || username === "" || username === undefined || username === null) {
            setUsernameError(true)
            setUsernameErrorMsg("* نام کاربری باید وارد شود")
        }

        // email error
        if (!email || email === "" || email === undefined || email === null) {
            setEmailError(true)
            setEmailErrorMsg("*  ایمیل باید وارد شود")
        }

        // phone error
        if (!phone || phone === "" || phone === undefined || phone === null) {
            setPhoneError(true)
            setPhoneErrorMsg("*  شماره تلفن باید وارد شود")
        }

        // password error
        if (!password || password === "" || password === undefined || password === null) {
            setPasswordError(true)
            setPasswordErrorMsg("* گذرواژه باید وارد شود")
        }


        else {
            setBtnSpinner(true)

            try {
                axios.post(`/api/cooks/auth/register`, { name, username, email, phone, password }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => {
                    setBtnSpinner(false)

                    toast.success('با موفقیت ثبت نام شدید', {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })

                    navigate('/cooks/login')



                }).catch((error) => {
                    setBtnSpinner(false)
                    console.log('error', error)
                    let msg = error.response.data.msg || error.name
                    toast.error(msg, {
                        position: "top-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })



            } catch (error) {
                setBtnSpinner(false)
                console.log('error', error)
                toast.error('خطایی وجود دارد. دوباره امتحان کنید !', {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        }

    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center text-right">
                <div className="card mx-auto w-full max-w-5xl shadow-2xl">
                    <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                        <div className=''>
                            <div className="hero min-h-full rounded-l-xl bg-base-200">
                                <div className="hero-content p-2">
                                    <div className="w-50 px-6 py-4">
                                        <h1 className="mb-4 text-center font-bold text-lg"> ثبت نام در پنل غذادار</h1>
                                        <div className="my-auto"><img width={500} height={400} src="https://i.pinimg.com/736x/f2/a7/8a/f2a78a484ee31f62ed9f1ea433597d9b.jpg" style={{ borderRadius: '12px' }} alt="اقامتگاه" className="inline-block"></img></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white px-2 sm:px-2 md:px-2 lg:px-2 py-2 w-full max-w-md m-auto">
                            <div className="font-medium mt-4 self-center text-xl sm:text-2xl uppercase text-gray-800">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
                            </div>
                            <div className="relative mt-4 h-px bg-gray-300">
                                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                    <span className="bg-white px-4 text-xs text-gray-500 uppercase"> ثبت نام در  پنل غذادار </span>
                                </div>
                            </div>
                            <div className="mt-2 rounded-sm">
                                <form className="space-y-2 mt-2">
                                    <div className="container mx-auto p-4">
                                        {/* name */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="name" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام و نام خانوادگی</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiUser2Line />
                                                </div>
                                                <input style={{ borderRadius: '5px' }} type="text" value={name}
                                                    onChange={(e) => setName(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام و نام خانوادگی" />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{nameError ? nameErrorMsg : ""}</span>
                                        </div>
                                        {/* username */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="username" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام کاربری</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiUser5Line />
                                                </div>
                                                <input style={{ borderRadius: '5px' }} type="text" value={username}
                                                    onChange={(e) => setUsername(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="نام کاربری" />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{usernameError ? usernameErrorMsg : ""}</span>
                                        </div>
                                        {/* phone */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiPhoneLine />
                                                </div>
                                                <input style={{ borderRadius: '5px' }} type="text" value={phone}
                                                    onChange={(e) => setPhone(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{phoneError ? phoneErrorMsg : ""}</span>
                                        </div>

                                        {/* email */}
                                        <div className="flex flex-col mb-1">
                                            <div className="flex flex-col mb-4">
                                                <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">ایمیل</label>
                                                <div className="relative">
                                                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                        <RiMailLine />
                                                    </div>
                                                    <input style={{ borderRadius: '5px' }} type="text" value={email}
                                                        onChange={(e) => setEmail(e.target.value)} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="ایمیل" />
                                                </div>
                                                <span className='text-red-500 relative text-sm'>{emailError ? emailErrorMsg : ""}</span>
                                            </div>
                                        </div>


                                        {/* password */}
                                        <div className="relative mb-4">
                                            <label className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600" htmlFor="password">
                                                گذرواژه
                                            </label>

                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                id="password"
                                                onChange={handlePasswordChange}
                                                value={password}
                                                className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-300 w-full py-2 focus:outline-none focus:border-blue-800"
                                                placeholder="گذرواژه"
                                                style={{ borderRadius: '5px' }}
                                            />

                                            <div
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-2 left-3 flex items-center cursor-pointer top-6"
                                            >
                                                {passwordVisible ? (
                                                    <RiEye2Line className='text-gray-400' />
                                                ) : (
                                                    <RiEyeCloseLine className='text-gray-400' />
                                                )}
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{passwordError ? passwordErrorMsg : ""}</span>

                                        </div>



                                        {/* register user */}
                                        <div className="my-2 w-full">
                                            <button className="app-btn-blue w-full" onClick={register}>
                                                {btnSpinner ? (
                                                    <div className="px-10 py-1 flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                                    </div>
                                                ) : (
                                                    <span>ثبت نام</span>
                                                )}
                                            </button>
                                        </div>
                                        <p className='text-sm text-gray-800'>حساب دارید؟ <Link to='/cooks/login' className='hover:text-blue-900 hover:cursor-pointer'>ورود </Link></p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Register