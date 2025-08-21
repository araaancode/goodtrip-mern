import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import {
  setPageTitle,
  showNotification,
} from "../../features/common/headerSlice";
import DashboardStats from "../../features/dashboard/components/DashboardStats";
import AmountStats from "../../features/dashboard/components/AmountStats";
import PageStats from "../../features/dashboard/components/PageStats";
import UserChannels from "../../features/dashboard/components/UserChannels";
import LineChart from "../../features/dashboard/components/LineChart";
import BarChart from "../../features/dashboard/components/BarChart";
import DashboardTopBar from "../../features/dashboard/components/DashboardTopBar";
import DoughnutChart from "../../features/dashboard/components/DoughnutChart";

// Import your auth store
import { useAdminAuthStore } from "../../stores/authStore";

// react icons
import { HiOutlineUserPlus } from "react-icons/hi2";
import { LiaBusSolid } from "react-icons/lia";
import { PiChefHat } from "react-icons/pi";
import { PiUsersFourLight } from "react-icons/pi";
import { PiCoinsLight } from "react-icons/pi";
import { LiaUserAstronautSolid } from "react-icons/lia";
import { LiaUserSecretSolid } from "react-icons/lia";
import { PiHouse } from "react-icons/pi";

function Dashboard() {
  const dispatch = useDispatch();

  // Use the auth store - only subscribe to isAdminAuthenticated
  const { isAdminAuthenticated } = useAdminAuthStore();



  useEffect(() => {
    dispatch(setPageTitle({ title: "پنل مدیریت" }));
  }, [dispatch]);

  const [income, setIncome] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [users, setUsers] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [drivers, setDrivers] = useState(0);
  const [owners, setOwners] = useState(0);
  const [cooks, setCooks] = useState(0);
  const [buses, setBuses] = useState(0);

  useEffect(() => {
    if (isAdminAuthenticated) {

      // fetch all drivers
      axios
        .get("/api/admins/drivers", { withCredentials: true })
        .then((response) => {
          setDrivers(response.data.drivers.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });

      // fetch all users
      axios
        .get("/api/admins/users", { withCredentials: true })
        .then((response) => {
          setUsers(response.data.data.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });

      // fetch all owners
      axios
        .get("/api/admins/owners", { withCredentials: true })
        .then((response) => {
          setOwners(response.data.owners.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });

      // fetch all admins
      axios
        .get("/api/admins", { withCredentials: true })
        .then((response) => {
          setAdmins(response.data.admins.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });

      // fetch all cooks
      axios
        .get("/api/admins/cooks", { withCredentials: true })
        .then((response) => {
          setCooks(response.data.cooks.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });

      // fetch all buses
      axios
        .get("/api/admins/buses", { withCredentials: true })
        .then((response) => {
          setBuses(response.data.buses.length);
        })
        .catch((error) => {
          console.log("error " + error);
        });
    }
  }, [isAdminAuthenticated]);

  const statsData = [
    {
      title: "کل فروش",
      value: income,
      icon: <PiCoinsLight className="w-8 h-8" />,
    },
    {
      title: "تیکت ها",
      value: tickets,
      icon: <PiUsersFourLight className="w-8 h-8" />,
    },
    {
      title: "کاربران",
      value: users,
      icon: <HiOutlineUserPlus className="w-8 h-8" />,
    },
    {
      title: "ادمین ها",
      value: admins,
      icon: <LiaUserSecretSolid className="w-8 h-8" />,
    },
    {
      title: "راننده ها",
      value: drivers,
      icon: <LiaUserAstronautSolid className="w-8 h-8" />,
    },
    {
      title: "ملک دارها",
      value: owners,
      icon: <PiHouse className="w-8 h-8" />,
    },
    {
      title: "غذا دارها",
      value: cooks,
      icon: <PiChefHat className="w-8 h-8" />,
    },
    {
      title: "اتوبوس ها",
      value: buses,
      icon: <LiaBusSolid className="w-8 h-8" />,
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
      {/** ---------------------- Select Period Content ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart />
        <BarChart />
      </div>

      {/** ---------------------- Different stats content 2 ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <AmountStats />
        <PageStats />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div>
    </>
  );
}

export default Dashboard;
