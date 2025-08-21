import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUser2Line, RiUser5Line, RiMailLine, RiLoader2Fill } from "@remixicon/react"
import { toast,ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAdminAuthStore } from '../stores/authStore' 

function Register() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const [errorNameMessage, setErrorNameMessage] = useState("")
    const [errorUsernameMessage, setErrorUsernameMessage] = useState("")
    const [errorEmailMessage, setErrorEmailMessage] = useState("")
    const [errorPhoneMessage, setErrorPhoneMessage] = useState("")
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("")

    const navigate = useNavigate()
    const { register, isLoading, error } = useAdminAuthStore()

    const handlePhoneChange = (e) => {
        setPhone(e.target.value)
        setErrorPhoneMessage("")
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        setErrorPasswordMessage("")
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
        setErrorNameMessage("")
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
        setErrorUsernameMessage("")
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        setErrorEmailMessage("")
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        // Basic validation
        let hasError = false
        
        if (!name) {
            setErrorNameMessage("نام و نام خانوادگی الزامی است")
            hasError = true
        }
        if (!username) {
            setErrorUsernameMessage("نام کاربری الزامی است")
            hasError = true
        }
        if (!phone) {
            setErrorPhoneMessage("شماره تلفن الزامی است")
            hasError = true
        }
        if (!email) {
            setErrorEmailMessage("ایمیل الزامی است")
            hasError = true
        }
        if (!password) {
            setErrorPasswordMessage("گذرواژه الزامی است")
            hasError = true
        }

        if (hasError) {
            return
        }

        try {
            const adminData = {
                phone,
                password,
                name,
                username,
                email
            }

            await register(adminData)
            
            // If registration is successful, navigate to login
            navigate('/admins/login')
            
        } catch (error) {
            // Error handling is already done in the store via toast notifications
            console.log('Registration error:', error)
            
            // You can also set specific error messages based on the error if needed
            if (error.response?.data?.msg?.includes('phone')) {
                setErrorPhoneMessage(error.response.data.msg)
            } else if (error.response?.data?.msg?.includes('email')) {
                setErrorEmailMessage(error.response.data.msg)
            } else if (error.response?.data?.msg?.includes('username')) {
                setErrorUsernameMessage(error.response.data.msg)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center text-right rounded">
            <div className="card mx-auto w-full max-w-6xl shadow-2xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className='w-50'>
                        <div className="hero min-h-full rounded-l-xl bg-base-200">
                            <div className="hero-content py-8">
                                <div className="max-w-md">
                                    <h1 className="mb-10 text-center font-bold text-lg"> ثبت نام در پنل مدیریت</h1>
                                    <div className="text-center mt-0 mb-35"><img width={500} height={400} src="https://img.freepik.com/premium-photo/log-cabin-mountains-with-sunset-background_865967-19459.jpg?ga=GA1.1.183878651.1734187720&semt=ais_hybrid" alt="اقامتگاه" className="w-full rounded rounded-lg inline-block shadow-md"></img></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-8 w-50 m-auto">

                        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="remixicon w-12 h-12"><path d="M22.1034 19L12.8659 3.00017C12.7782 2.84815 12.6519 2.72191 12.4999 2.63414C12.0216 2.358 11.41 2.52187 11.1339 3.00017L1.89638 19H1V21C8.33333 21 15.6667 21 23 21V19H22.1034ZM7.59991 19.0002H4.20568L11.9999 5.50017L19.7941 19.0002H16.4001L12 11L7.59991 19.0002ZM12 15.1501L14.1175 19H9.88254L12 15.1501Z"></path></svg>
                        </div>
                        <div className="relative mt-6 h-px bg-gray-300">
                            <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                                <span className="bg-white px-4 text-xs text-gray-500 uppercase"> ثبت نام در  پنل مدیریت </span>
                            </div>
                        </div>
                        <div className="mt-6 rounded-sm">
                            <form className="space-y-2 mt-4" onSubmit={handleRegister}>
                                <div className="container mx-auto p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* name */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="name" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام و نام خانوادگی</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiUser2Line />
                                                </div>
                                                <input 
                                                    style={{ borderRadius: '5px' }} 
                                                    type="text" 
                                                    value={name}
                                                    onChange={handleNameChange} 
                                                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" 
                                                    placeholder="نام و نام خانوادگی" 
                                                />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{errorNameMessage}</span>
                                        </div>
                                        {/* username */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="username" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام کاربری</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiUser5Line />
                                                </div>
                                                <input 
                                                    style={{ borderRadius: '5px' }} 
                                                    type="text" 
                                                    value={username}
                                                    onChange={handleUsernameChange} 
                                                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" 
                                                    placeholder="نام کاربری" 
                                                />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{errorUsernameMessage}</span>
                                        </div>
                                        {/* phone */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiPhoneLine />
                                                </div>
                                                <input 
                                                    style={{ borderRadius: '5px' }} 
                                                    type="text" 
                                                    value={phone}
                                                    onChange={handlePhoneChange} 
                                                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" 
                                                    placeholder="شماره تلفن" 
                                                />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{errorPhoneMessage}</span>
                                        </div>
                                        {/* email */}
                                        <div className="flex flex-col mb-4">
                                            <label htmlFor="email" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">ایمیل</label>
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                    <RiMailLine />
                                                </div>
                                                <input 
                                                    style={{ borderRadius: '5px' }} 
                                                    type="text" 
                                                    value={email}
                                                    onChange={handleEmailChange} 
                                                    className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" 
                                                    placeholder="ایمیل" 
                                                />
                                            </div>
                                            <span className='text-red-500 relative text-sm'>{errorEmailMessage}</span>
                                        </div>
                                    </div>
                                    {/* password */}
                                    <div className="flex flex-col mb-1">
                                        <div className="relative">
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
                                            <span className='text-red-500 relative text-sm'>{errorPasswordMessage}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full rounded mb-2 mt-8 p-2 text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <RiLoader2Fill className="animate-spin mr-2" />
                                                در حال ثبت نام...
                                            </div>
                                        ) : 'ثبت نام'}
                                    </button>
                                    <p className='text-sm text-gray-800'>حساب دارید؟ <Link to='/admins/login' className='hover:text-blue-900 hover:cursor-pointer'>ورود </Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register