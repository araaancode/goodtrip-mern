import routes from '../routes/sidebar'
import { NavLink, Routes, Link, useLocation } from 'react-router-dom'
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useDispatch } from 'react-redux';

import { RiTentLine } from "@remixicon/react";

function LeftSidebar() {
    const location = useLocation();

    const dispatch = useDispatch()


    const close = (e) => {
        document.getElementById('left-sidebar-drawer').click()
    }

    return (
        <div className="drawer-side z-30">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <RiTentLine className='w-12 h-12 my-4 mx-6' />
            <ul className="menu pt-2 w-80 min-h-full">
                {
                    routes.map((route, k) => {
                        return (
                            <li style={{ fontSize: '16px' }} className="mx-0" key={k}>
                                {
                                    route.submenu ?
                                        <SidebarSubmenu {...route} /> :
                                        (<NavLink
                                            end
                                            to={route.path}
                                            className={({ isActive }) => `${isActive ? 'font-semibold  bg-base-200 ' : 'font-normal'}`} >
                                            {route.icon} {route.name}
                                            {
                                                location.pathname === route.path ? (<span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                                                    aria-hidden="true"></span>) : null
                                            }
                                        </NavLink>)
                                }

                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
}

export default LeftSidebar