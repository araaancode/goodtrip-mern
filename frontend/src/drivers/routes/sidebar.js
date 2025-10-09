
import BankIcon from '@iconscout/react-unicons/icons/uil-university'
import NewsPaperIcon from '@iconscout/react-unicons/icons/uil-newspaper'
import { HiOutlineCalendar } from "react-icons/hi2";
import DriverIcon from '@iconscout/react-unicons/icons/uil-bus-school'
import { BiSupport } from "react-icons/bi";
import { TbNewSection } from "react-icons/tb";
import { IoBusOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";


const iconClasses = `h-8 w-8 text-gray-800`

const routes = [
  {
    path: '/drivers/dashboard',
    icon: <MdOutlineDashboard size="140" className={iconClasses} />,
    name: 'پنل کاربری',
  },
  {
    path: '/drivers/bookings',
    icon: <HiOutlineCalendar size="140" className={iconClasses} />,
    name: 'رزروها',
  },
  {
    // path: '/drivers/calendar', // url
    path: '/drivers/add-bus', // url
    icon: <DriverIcon className={iconClasses} />, // icon component
    name: 'ثبت اطلاعات اتوبوس', // name that appear in Sidebar
  },
  {
    // path: '/drivers/calendar', // url
    path: '/drivers/my-bus', // url
    icon: <IoBusOutline className={iconClasses} />, // icon component
    name: 'اتوبوس من', // name that appear in Sidebar
  },
  // {
  //   path: '/drivers/buses',
  //   icon: <BusIcon size="140" className={iconClasses} />, 
  //   name: 'تایید یا عدم اتوبوس',
  // },
  // {
  //   path: '/drivers/comments', // url
  //   // path: '/drivers/leads', // url
  //   icon: <ChatIcon size="140" className={iconClasses} />, // icon component
  //   name: ' نظرات کاربران ', // name that appear in Sidebar
  // },
  // {
  //   path: '/drivers/rates', // url
  //   // path: '/drivers/transactions', // url
  //   icon: <StarIcon className={iconClasses}/>, // icon component
  //   name: 'امتیاز',
  // },
  // {
  //   path: '/drivers/charts', // url
  //   icon: <TicketIcon className={iconClasses}/>, // icon component
  //   name: 'تیکت پشتیبانی کاربران، ملک داران، اتوبوس دارها، غذادارها', // name that appear in Sidebar
  // },
  // {
  //   path: '/drivers/financials', // url
  //   // path: '/drivers/integration', // url
  //   icon: <MoneyIcon className={iconClasses}/>, // icon component
  //   name: 'قسمت مالی', // name that appear in Sidebar
  // },

  {
    path: '/drivers/create-advertisment',
    icon: <TbNewSection className={iconClasses} />,
    name: 'ایجاد آگهی',
  },

  {
    path: '/drivers/advertisments', // url
    icon: <NewsPaperIcon className={iconClasses} />, // icon component
    name: ' آگهی ها', // name that appear in Sidebar
  },

  // {
  //   path: '/drivers/price', // url
  //   // path: '/drivers/calendar', // url
  //   icon: <CoinsIcon className={iconClasses}/>, // icon component
  //   name: 'قیمت', // name that appear in Sidebar
  // },

  // {
  //   // path: '/drivers/calendar', // url
  //   path: '/drivers/support', // url
  //   icon: <BiSupport className={iconClasses}/>, // icon component
  //   name: 'پشتیبانی', // name that appear in Sidebar
  // },

  {
    path: '/drivers/create-support-ticket',
    icon: <TbNewSection className={iconClasses} />,
    name: 'ایجاد تیکت پشتیبانی',
  },

  {
    path: '/drivers/support-tickets',
    icon: <BiSupport className={iconClasses} />,
    name: 'تیکت های من',
  },



  {
    // path: '/drivers/calendar', // url
    path: '/drivers/bank', // url
    icon: <BankIcon className={iconClasses} />, // icon component
    name: 'حساب بانکی', // name that appear in Sidebar
  },


]

export default routes


