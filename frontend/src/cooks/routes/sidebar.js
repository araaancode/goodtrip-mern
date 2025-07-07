import BankIcon from '@iconscout/react-unicons/icons/uil-university'
import NewsPaperIcon from '@iconscout/react-unicons/icons/uil-newspaper'
import { BiListUl } from "react-icons/bi";
import { BiSupport } from "react-icons/bi";
import { TbNewSection } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";

const iconClasses = `h-8 w-8 text-gray-800`

const routes = [

  {
    path: '/cooks/dashboard',
    icon: <MdOutlineDashboard size="140" className={iconClasses} />,
    name: 'پنل کاربری',
  },
  {
    path: '/cooks/orders',
    icon: <BiListUl size="140" className={iconClasses} />,
    name: 'لیست سفارش ها',
  },
  // {
  //   path: '/cooks/cook-info',
  //   icon: <PiChefHat className={iconClasses} />,
  //   name: 'ثبت اطلاعات غذادار',
  // },

  // {
  //   path: '/cooks/comments',
  //   icon: <ChatIcon size="140" className={iconClasses} />,
  //   name: ' نظرات کاربران ',
  // },

  {
    path: '/cooks/create-advertisment',
    icon: <TbNewSection className={iconClasses} />,
    name: 'ایجاد آگهی',
  },

  {
    path: '/cooks/advertisments',
    icon: <NewsPaperIcon className={iconClasses} />,
    name: ' آگهی ها',
  },

  {
    path: '/cooks/add-food',
    icon: <TbNewSection className={iconClasses} />,
    name: 'افزودن غذا',
  },

  {
    path: '/cooks/foods',
    icon: <IoFastFoodOutline className={iconClasses} />,
    name: ' غذاها',
  },

  // {
  //   path: '/cooks/rates',
  //   icon: <StarIcon className={iconClasses} />,
  //   name: 'امتیاز',
  // },

  {
    path: '/cooks/create-support-ticket',
    icon: <TbNewSection className={iconClasses} />,
    name: 'ایجاد تیکت پشتیبانی',
  },

  {
    path: '/cooks/support-tickets',
    icon: <BiSupport className={iconClasses} />,
    name: 'تیکت های من',
  },


  {
    path: '/cooks/bank',
    icon: <BankIcon className={iconClasses} />,
    name: 'حساب بانکی',
  },


]

export default routes


