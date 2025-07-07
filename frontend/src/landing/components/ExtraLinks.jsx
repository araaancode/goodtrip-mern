import React from 'react'
// import Logo from '/tents.svg'
import { Link } from "react-router-dom"

// icons
import HomeIcon from '@iconscout/react-unicons/icons/uil-home'
import BuildingOfficeIcon from '@iconscout/react-unicons/icons/uil-house-user'
import BuildingIcon from '@iconscout/react-unicons/icons/uil-building'
import SunIcon from '@iconscout/react-unicons/icons/uil-sun'
import SwimmerIcon from '@iconscout/react-unicons/icons/uil-swimmer'
import TreeIcon from '@iconscout/react-unicons/icons/uil-trees'
import StarIcon from '@iconscout/react-unicons/icons/uil-star'
import ClockIcon from '@iconscout/react-unicons/icons/uil-clock'



function ExtraLinks() {
    return (

        <nav className='flex m-20 px-10 py-6 shadow-md shadow-gray-300 rounded-lg justify-between'>
            <a href="#">
                <svg className='text-gray-500 w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 19H19V9.97815L12 4.53371L5 9.97815V19H11V13H13V19ZM21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z"></path></svg>
                <span className='mt-6 text-bold'>کلبه</span>
            </a>
            <a href="#">
                <svg className='text-gray-500 w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19ZM7 15H17V17H7V15Z"></path></svg>
                <span className='mt-6 text-bold'>ویلا</span>
            </a>
            <a href="#">
                <svg className='text-gray-500 w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 20H23V22H1V20H3V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V20ZM19 20V4H5V20H19ZM8 11H11V13H8V11ZM8 7H11V9H8V7ZM8 15H11V17H8V15ZM13 15H16V17H13V15ZM13 11H16V13H13V11ZM13 7H16V9H13V7Z"></path></svg>
                <span className='mt-6 text-bold'>آپارتمان</span>
            </a>
            <a href="#">
            <svg className='text-gray-500 w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 4H14.4458C14.7905 4 15.111 4.17762 15.2938 4.47L18.75 10H23.1577C23.4339 10 23.6577 10.2239 23.6577 10.5C23.6577 10.5837 23.6367 10.666 23.5967 10.7394L19.6364 18H19C18.4694 18 17.9548 17.9311 17.4648 17.8018L20.63 12H3.4L4.44833 17.824C3.9845 17.939 3.49937 18 3 18H2.45455L1.21434 11.1789C1.11555 10.6355 1.47595 10.1149 2.01933 10.0161C2.07835 10.0054 2.13822 10 2.19821 10H3V5C3 4.44772 3.44772 4 4 4H5V1H9V4ZM5 10H16.3915L13.8915 6H5V10ZM3 20C4.53671 20 5.93849 19.4223 7 18.4722C8.06151 19.4223 9.46329 20 11 20C12.5367 20 13.9385 19.4223 15 18.4722C16.0615 19.4223 17.4633 20 19 20H21V22H19C17.5429 22 16.1767 21.6104 15 20.9297C13.8233 21.6104 12.4571 22 11 22C9.54285 22 8.17669 21.6104 7 20.9297C5.82331 21.6104 4.45715 22 3 22H1V20H3Z"></path></svg>
                <span className='mt-6 text-bold'>ساحلی</span>
            </a>
            <a href="#">
                <SwimmerIcon className="h-6 w-6 text-gray-500" />
                <span className='mt-6 text-bold'>استخردار</span>
            </a>
            <a href="#">
            <svg className='text-gray-500 w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 7.26214 17.9831 7.5207 17.9504 7.77457C19.77 8.80413 21 10.7575 21 13C21 16.3137 18.3137 19 15 19H13V22H11V19H8.5C5.46243 19 3 16.5376 3 13.5C3 11.2863 4.30712 9.37966 6.19098 8.50704C6.06635 8.02551 6 7.52039 6 7ZM7.00964 10.3319C5.82176 10.8918 5 12.1008 5 13.5C5 15.433 6.567 17 8.5 17H15C17.2091 17 19 15.2091 19 13C19 11.3056 17.9461 9.85488 16.4544 9.27234L15.6129 8.94372C15.7907 8.30337 16 7.67183 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 8.30783 8.6266 9.46903 9.60019 10.2005L8.39884 11.7995C7.85767 11.3929 7.38716 10.8963 7.00964 10.3319Z"></path></svg>
                <span className='mt-6 text-bold'>بوم گردی</span>
            </a>

            <a href="#">
                <StarIcon className="text-gray-500 h-6 w-6" />
                <span className='mt-6 text-bold'>پیشنهاد ویژه</span>
            </a>
            <a href="#">
                <ClockIcon className="text-gray-500 h-6 w-6" />
                <span className='mt-6 text-bold'>تجربه</span>
            </a>
        </nav>

    )
}

export default ExtraLinks