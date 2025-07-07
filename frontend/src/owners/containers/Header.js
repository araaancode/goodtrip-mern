import { themeChange } from 'theme-change'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'

import axios from "axios"

import { SlUser } from "react-icons/sl";
import { PiBell } from "react-icons/pi";

import { NavLink, Routes, Link, useLocation } from 'react-router-dom'


function Header() {

    const dispatch = useDispatch()
    const { noOfNotifications, pageTitle } = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    useEffect(() => {
        themeChange(false)
        if (currentTheme === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setCurrentTheme("dark")
            } else {
                setCurrentTheme("light")
            }
        }
    }, [])


    // Opening right sidebar for notification
    const openNotification = () => {
        dispatch(openRightDrawer({ header: "Notifications", bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }))
    }


    function logoutUser() {
        axios.get(`/api/owners/auth/logout`,{}).then((res) => {
            console.log("cook logout");
            localStorage.clear();
            window.location.href = '/owners/login'
        }).catch((err) => {
            console.log(err);
        })
    }

    return (

        <>
            <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">


                {/* Menu toogle for mobile view or small screen */}
                <div className="flex-1">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                        <Bars3Icon className="h-5 inline-block w-5" /></label>
                    <h1 className="text-2xl font-semibold mx-4 my-2">{pageTitle}</h1>
                </div>



                <div className="flex items-center flex-end">
                    {/* <label className="swap ">
                        <input type="checkbox" />
                        <GoSun data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "dark" ? "swap-on" : "swap-off")} />
                        <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "light" ? "swap-on" : "swap-off")} />
                    </label> */}


                    {/* Notification icon */}
                    <button className="mx-2" onClick={() => openNotification()}>
                        <div className="indicator">
                            <PiBell className="h-6 w-6" />
                            {/* {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{0}</span> : null} */}
                            <span className="indicator-item badge badge-secondary badge-sm">{0}</span> 
                        </div>
                    </button>


                    {/* Profile icon, opening menu on click */}
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="avatar">
                            <div className="mx-4 hover:cursor-pointer">
                                <SlUser className="w-6 h-6" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="justify-between">
                                <Link to={'/owners/profile'}>
                                    دیدن پروفایل
                                </Link>
                            </li>
                            <div className="divider mt-0 mb-0"></div>
                            <li><a onClick={logoutUser}>خروج</a></li>
                        </ul>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Header