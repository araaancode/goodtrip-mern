import MoneyIcon from "@iconscout/react-unicons/icons/uil-bill";
import BankIcon from "@iconscout/react-unicons/icons/uil-university";
import NewsPaperIcon from "@iconscout/react-unicons/icons/uil-newspaper";
import StarIcon from "@iconscout/react-unicons/icons/uil-star-half-alt";
import ChatIcon from "@iconscout/react-unicons/icons/uil-chat";
import { SlCalender } from "react-icons/sl";
import HouseUserIcon from "@iconscout/react-unicons/icons/uil-house-user";
import { BiSupport } from "react-icons/bi";
import { TbNewSection } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import { LuHousePlus } from "react-icons/lu";
import { BsHouses } from "react-icons/bs";

const routes = [
  {
    path: "/owners/dashboard",
    icon: <MdOutlineDashboard size="140" className="h-8 w-8 text-gray-800" />,
    name: "پنل کاربری",
  },

  {
    path: "/owners/add-house",
    icon: <LuHousePlus size="140" className="h-8 w-8 text-gray-800" />,
    name: "ثبت اطلاعات ملک",
  },

  {
    path: "/owners/my-houses", // url
    icon: <BsHouses className="h-8 w-8 text-gray-800" />, 
    name: "املاک من",
  },

  {
    path: "/owners/bookings",
    icon: <SlCalender size="140" className="h-8 w-8 text-gray-800" />,
    name: "لیست رزروها",
  },

  // {
  //   path: "/owners/financials", // url
  //   icon: <MoneyIcon className="h-8 w-8 text-gray-800" />, 
  //   name: "قسمت مالی",
  // },

  {
    path: "/owners/create-advertisment", // url
    icon: <TbNewSection className="h-8 w-8 text-gray-800" />, 
    name: "ایجاد آگهی",
  },
  {
    path: "/owners/advertisments", // url
    icon: <NewsPaperIcon className="h-8 w-8 text-gray-800" />, 
    name: " آگهی ها",
  },

  // {
  //   path: "/owners/comments", // url
  //   icon: <ChatIcon size="140" className="h-8 w-8 text-gray-800" />, 
  //   name: " نظرات کاربران ",
  // },

  // {
  //   path: "/owners/rates", // url
  //   icon: <StarIcon className="h-8 w-8 text-gray-800" />, 
  //   name: "امتیاز",
  // },

  {
    path: "/owners/create-support-ticket",
    icon: <TbNewSection className="h-8 w-8 text-gray-800" />,
    name: "ایجاد تیکت پشتیبانی",
  },

  {
    path: "/owners/support-tickets",
    icon: <BiSupport className="h-8 w-8 text-gray-800" />,
    name: "تیکت های من",
  },

  {
    path: "/owners/bank", // url
    icon: <BankIcon className="h-8 w-8 text-gray-800" />, 
    name: "حساب بانکی",
  },
];

export default routes;
