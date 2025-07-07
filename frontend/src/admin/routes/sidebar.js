// *** icons ***
// heroicons
import DashboardIcon from '@heroicons/react/24/outline/Squares2X2Icon'
// iconsscout
import BusIcon from '@iconscout/react-unicons/icons/uil-bus'
import FileSearchIcon from '@iconscout/react-unicons/icons/uil-file-search-alt'
import TicketIcon from '@iconscout/react-unicons/icons/uil-ticket'
import MoneyIcon from '@iconscout/react-unicons/icons/uil-bill'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'
import MoneyStackIcon from '@iconscout/react-unicons/icons/uil-money-bill-stack'
import MeIcon from '@iconscout/react-unicons/icons/uil-grin'
import AdvIcon from '@iconscout/react-unicons/icons/uil-coins'
import BuildingIcon from '@iconscout/react-unicons/icons/uil-building'
import UsersIcon from '@iconscout/react-unicons/icons/uil-users-alt'
import BankIcon from '@iconscout/react-unicons/icons/uil-university'
import DriversIcon from '@iconscout/react-unicons/icons/uil-bus-school'
import CooksIcon from '@iconscout/react-unicons/icons/uil-pizza-slice'
import RoomsIcon from '@iconscout/react-unicons/icons/uil-trees'
import HomeIcon from '@heroicons/react/24/outline/HomeModernIcon'
import AdminsIcon from '@iconscout/react-unicons/icons/uil-user-square'

import { LiaUserSecretSolid } from "react-icons/lia";
import { PiChefHat } from "react-icons/pi";
import { PiHouse } from "react-icons/pi";

const iconClasses = `h-8 w-8 text-gray-800`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/admins/dashboard',
    icon: <DashboardIcon className={iconClasses} />,
    name: 'داشبورد مدیریت',
  },
  {
    path: '/admins/all-admins',
    icon: <LiaUserSecretSolid className={iconClasses} />,
    name: 'ادمین ها',
  },
  // {
  //   path: '/admins/requests', // url
  //   // path: '/admins/leads', // url
  //   icon: <FileSearchIcon className={iconClasses} />, // icon component
  //   name: ' درخواست ها ', // name that appear in Sidebar
  // },


  // {
  //   path: '/admins/charts', // url
  //   icon: <TicketIcon className={iconClasses}/>, // icon component
  //   name: 'تیکت پشتیبانی کاربران، ملک داران،  دارها، غذادارها', // name that appear in Sidebar
  // },
  {
    path: '/admins/financials', // url
    // path: '/admins/integration', // url
    icon: <MoneyIcon className={iconClasses} />, // icon component
    name: 'بخش مالی', // name that appear in Sidebar
  },
  {
    path: '/admins/rooms', // url
    // path: '/admins/calendar', // url
    icon: <PiHouse className={iconClasses} />, // icon component
    name: 'اقامتگاه ها', // name that appear in Sidebar
  },
  {
    // path: '/admins/calendar', // url
    path: '/admins/users', // url
    icon: <UsersIcon className={iconClasses} />, // icon component
    name: ' کاربران', // name that appear in Sidebar
  },
  {
    path: '/admins/users/support-tickets', // url
    icon: <TicketIcon className={iconClasses} />, // icon component
    name: 'تیکت های کاربران',
  },
  /* /admins/users/:userId/support-tickets /:stId*/ 
  {
    // path: '/admins/calendar', // url
    path: '/admins/drivers', // url
    icon: <DriversIcon className={iconClasses} />, // icon component
    name: ' راننده ها', // name that appear in Sidebar
  },

  {
    path: '/admins/drivers/support-tickets', // url
    icon: <TicketIcon className={iconClasses} />, // icon component
    name: 'تیکت های راننده ها',
  },

  {
    path: '/admins/cooks', // url
    icon: <PiChefHat className={iconClasses} />, // icon component
    name: 'غذادارها ', // name that appear in Sidebar
  },
  {
    path: '/admins/cooks/support-tickets', // url
    icon: <TicketIcon className={iconClasses} />, // icon component
    name: 'تیکت های غذادارها',
  },



  {
    // path: '/admins/calendar', // url
    path: '/admins/owners', // url
    icon: <HomeIcon className={iconClasses} />, // icon component
    name: 'ملک دارها', // name that appear in Sidebar
  },

  {
    path: '/admins/owners/support-tickets', // url
    icon: <TicketIcon className={iconClasses} />, // icon component
    name: 'تیکت های ملک دارها',
  },
]

export default routes


