import { useState, useEffect } from "react";
import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import axios from "axios";

// react icons
import { HiOutlineUserPlus } from "react-icons/hi2";
import { LiaBusSolid } from "react-icons/lia";
import { PiChefHat } from "react-icons/pi";
import { PiUsersFourLight } from "react-icons/pi";
import { PiCoinsLight } from "react-icons/pi";
import { LiaUserAstronautSolid } from "react-icons/lia";
import { LiaUserSecretSolid } from "react-icons/lia";
import { PiHouse } from "react-icons/pi";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import { IoRestaurantOutline } from "react-icons/io5";
import { PiNewspaperClipping } from "react-icons/pi";
import { PiPizzaLight } from "react-icons/pi";
import { MdSupportAgent } from "react-icons/md";

function Dashboard() {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState(0);
  const [ads, setAds] = useState(0);
  const [foods, setFoods] = useState(0);
  const [supportTickets, setSupportTickets] = useState(0);

  useEffect(() => {
    let token = localStorage.getItem("userToken");
    const AuthStr = "Bearer ".concat(token);

    // fetch all food orders
    axios
      .get("/api/cooks/foods/order-foods", {
        headers: { authorization: AuthStr },
      })
      .then((response) => {
        setOrders(response.data.orders.length);
      })
      .catch((error) => {
        console.log("error " + error);
      });

    // fetch all ads
    axios
      .get("/api/cooks/ads", {
        headers: { authorization: AuthStr },
      })
      .then((response) => {
        setAds(response.data.ads.length);
      })
      .catch((error) => {
        console.log("error " + error);
      });

    // fetch all foods
    axios
      .get("/api/cooks/foods", {
        headers: { authorization: AuthStr },
      })
      .then((response) => {
        setFoods(response.data.foods.length);
      })
      .catch((error) => {
        console.log("error " + error);
      });

    // fetch all support tickets
    axios
      .get("/api/cooks/support-tickets", {
        headers: { authorization: AuthStr },
      })
      .then((response) => {
        setSupportTickets(response.data.supportTickets.length);
      })
      .catch((error) => {
        console.log("error " + error);
      });
  }, []);

  const statsData = [
    {
      title: "سفارش ها",
      value: orders,
      icon: <IoRestaurantOutline className="w-8 h-8" />,
    },
    {
      title: "آگهی ها",
      value: ads,
      icon: <PiNewspaperClipping className="w-8 h-8" />,
    },
    {
      title: "غذاها",
      value: foods,
      icon: <PiPizzaLight className="w-8 h-8" />,
    },
    {
      title: "تیکت های پشتیبانی",
      value: supportTickets,
      icon: <MdSupportAgent className="w-8 h-8" />,
    },
  ];

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
  
      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart />
        <BarChart />
      </div>
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />
 

      {/** ---------------------- User source channels table  ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div>

    </>
  );
}

export default Dashboard;
