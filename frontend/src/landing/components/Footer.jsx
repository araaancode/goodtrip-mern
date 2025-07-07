import React from 'react'

import TwitterIcon from '@iconscout/react-unicons/icons/uil-twitter'
import InstagramIcon from '@iconscout/react-unicons/icons/uil-instagram'
import LinkedinIcon from '@iconscout/react-unicons/icons/uil-linkedin'
import { RiTentLine, RiUser3Fill } from "@remixicon/react";

const Footer = () => {
    return (
        <footer dir='ltr' style={{ marginBottom: '0' }} className="text-right bg-gray-200 bottom-0 w-full"> <hr className="my-2 sm:mx-auto lg:my-2" /> <div className="mx-auto w-full max-w-screen-xl px-8 p-6"> <div className="md:flex md:justify-between"> <div className="mb-2 md:mb-0"> <a href="/" className="flex items-center"> <RiTentLine className="w-12 h-12" /> </a> <p className='text-gray-800 mt-2 mb-4'>ما را در شبکه های اجتماعی دنبال کنید</p> <div className='flex flex-row mt-2'> <div className='bg-white p-2 rounded-full shadow-md mr-2'> <TwitterIcon /> </div> <div className='bg-white p-2 rounded-full shadow-md mr-2'> <InstagramIcon /> </div> <div className='bg-white p-2 rounded-full shadow-md mr-2'> <LinkedinIcon /> </div> </div> </div> <div className="grid grid-cols-3 gap-8 sm:gap-6 sm:grid-cols-3">

            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">لینک های دیگر</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                        <a href="/owners/login" className="hover:underline text-gray-800 ">ورود ملک دارها</a>
                    </li>
                    <li className="mb-4">
                        <a href="/drivers/login" className="hover:underline text-gray-800 ">ورود رانندگان</a>
                    </li>
                    <li className="mb-4">
                        <a href="/cooks/login" className="hover:underline text-gray-800 ">ورود غذادارها</a>
                    </li>
                </ul>
            </div>



            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">راه های ارتباطی</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                        <a href="#" className="hover:underline text-gray-800">درباره ما</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline text-gray-800">تماس با ما</a>
                    </li>
                    <li className='mt-2'>
                        <a href="#" className="hover:underline text-gray-800">قوانین و مقررات</a>
                    </li>
                </ul>
            </div>

            <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">خدمات مشتریان</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                    <li className="mb-4">
                        <a href="#" className="hover:underline text-gray-800 ">پرسش های متداول مهمان</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline text-gray-800 ">پرسش های متداول میزبان</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:underline text-gray-800 ">چطور اقامتگاه ثبت کنم؟</a>
                    </li>

                </ul>
            </div>


        </div>
        </div>

        </div>
        </footer>

    )

}

export default Footer
