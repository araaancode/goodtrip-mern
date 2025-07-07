import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'

import { RiMailOpenLine } from "@remixicon/react"

function ForgotPasswordPage() {

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [linkSent, setLinkSent] = useState(false)
    const [email, setEmail] = useState("")

  
    const [errorEmailMessage, setErrorEmailMessage] = useState("")

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };


    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (email.trim() === "") return setErrorEmailMessage("ایمیل ضروری است!")
        else {
            setLoading(true)
            // Call API to send password reset link
            setLoading(false)
            setLinkSent(true)
        }
    }

 
    return (
        <div className="min-h-screen bg-gray-50 flex items-center text-right">
            <div className="card mx-auto max-w-xl shadow-xl">
                <div className="bg-base-100 rounded-xl">
                    <div className='py-10 px-10'>
                        <h2 className='text-2xl mb-2 text-center'>فراموشی گذرواژه</h2>

                        {
                            linkSent &&
                            <>
                                <div className='text-center mt-8'><CheckCircleIcon className='inline-block w-32 text-success' /></div>
                                <p className='my-4 text-xl font-bold text-center'> لینک فرستاده شد</p>
                                <p className='mt-4 mb-8 font-semibold text-center'>ایمیل خود را برای تغییر گذرواژه بررسی کنید</p>
                                <div className='text-center mt-4'><Link to="/login"><button className="btn btn-block bg-blue-800 text-white hover:bg-blue-900 mt-5">ورود</button></Link></div>

                            </>
                        }

                        {
                            !linkSent &&
                            <>
                                <p className='my-8 text-center'>لینک تغییر گذرواژه به ایمیل شما فرستاده خواهد شد</p>
                                <form onSubmit={(e) => submitForm(e)}>

                                    <div className="flex flex-col mb-2">
                                        <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">ایمیل</label>
                                        <div className="relative">
                                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                                <RiMailOpenLine />
                                            </div>
                                            <input style={{ borderRadius: '5px' }} type="text" value={email}
                                                onChange={handleEmailChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="ایمیل" />
                                        </div>
                                        <span className='text-red-500 relative text-sm'>{errorEmailMessage ? errorEmailMessage : ""}</span>
                                    </div>

                                    <div className="flex w-full">
                                        <button type="submit" className="btn mt-5 w-full bg-blue-800 text-white hover:bg-blue-900">فرستادن لینک تغییر</button>
                                    </div>

                                    <div className='text-center mt-4'>حساب ندارید؟ <Link to="/register">ثبت نام</Link></div>
                                </form>
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage