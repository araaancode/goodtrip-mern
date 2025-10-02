import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { MdOutlineSupportAgent } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { PiBowlFood } from "react-icons/pi";
import { VscListUnordered } from "react-icons/vsc";
import { BsHouses } from "react-icons/bs";
import { IoBarChartOutline } from "react-icons/io5";
import { useOwnerAuthStore } from "../../stores/authStore";

// =======================
// Constants
// =======================
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const METRICS_CONFIG = [
  { label: "آگهی ها", icon: LuNewspaper, key: "ads" },
  { label: "ملک ها", icon: BsHouses, key: "foods" },
  { label: "رزرو ها", icon: VscListUnordered, key: "orders" },
  { label: "تیکت‌های پشتیبانی", icon: MdOutlineSupportAgent, key: "tickets" },
];

// =======================
// Custom Components
// =======================

// Metric card for showing summary numbers
const MetricCard = ({ label, value, Icon }) => (
  <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-4 flex flex-col items-center h-full">
    <div className="bg-blue-50 p-3 rounded-full mb-3">
      <Icon className="text-3xl text-blue-600" />
    </div>
    <h2 className="text-base font-medium text-gray-700 mb-1 text-center">{label}</h2>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Card wrapper for charts
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-xl p-4 ${className}`} dir="rtl">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{title}</h3>
    {children}
  </div>
);

// No data placeholder
const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <div className="text-5xl mb-4">
      <IoBarChartOutline />
    </div>
    <p className="text-lg">داده‌ای برای نمایش وجود ندارد</p>
    <p className="text-sm mt-2">پس از افزودن داده‌ها، نمودارها در اینجا نمایش داده می‌شوند</p>
  </div>
);

// Distribution info for pie chart
const DistributionInfo = ({ data, total }) => (
  <div className="mt-4 grid grid-cols-2 gap-2">
    {data.map((item, index) => {
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div
            className="w-3 h-3 rounded-full ml-2"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></div>
          <span className="text-sm font-medium text-gray-700">{item.name}:</span>
          <span className="mr-auto text-sm font-bold text-gray-900">{percentage}%</span>
        </div>
      );
    })}
  </div>
);

// =======================
// Main Dashboard Component
// =======================
const Dashboard = () => {
  const dispatch = useDispatch();
  const { isOwnerAuthenticated } = useOwnerAuthStore();

  const [houseCount, setHouseCount] = useState(0);
  const [adsCount, setAdsCount] = useState(0);
  const [supportTicketCount, setSupportTicketCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [data, setData] = useState({
    ads: 0,
    foods: 0,
    orders: 0,
    tickets: 0,
  });
  const [loading, setLoading] = useState(true);

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "پنل کاربری" }));
  }, [dispatch]);

  // Configure axios to send credentials
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!isOwnerAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [houseResponse, adsResponse, ticketsResponse, bookingResponse] = await Promise.all([
          axios.get("/api/owners/houses"),
          axios.get("/api/owners/ads"),
          axios.get("/api/owners/support-tickets"),
          axios.get("/api/owners/reservations"),
        ]);

        setHouseCount(houseResponse.data.count);
        setAdsCount(adsResponse.data.count);
        setSupportTicketCount(ticketsResponse.data.count);
        setBookingCount(bookingResponse.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOwnerAuthenticated]);

  // Update data state when counts change
  useEffect(() => {
    setData({
      ads: adsCount,
      foods: houseCount,
      orders: bookingCount,
      tickets: supportTicketCount,
    });
  }, [adsCount, houseCount, bookingCount, supportTicketCount]);

  // Prepare chart data
  const chartData = METRICS_CONFIG.map(({ label, key }) => ({
    name: label,
    value: data[key],
    count: data[key],
  }));
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const hasChartData = Object.values(data).some((value) => value > 0);

  // Loading spinner
  if (loading) {
    return (
      <TitleCard title="پنل مدیریت">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </TitleCard>
    );
  }

  return (
    <TitleCard title="پنل مدیریت" className="p-4 md:p-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {METRICS_CONFIG.map(({ label, icon: Icon, key }) => (
          <MetricCard key={key} label={label} value={data[key]} Icon={Icon} />
        ))}
      </div>

      {/* Charts */}
      {hasChartData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <ChartCard title="درصد توزیع" className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <DistributionInfo data={chartData} total={totalValue} />
            </ChartCard>

            {/* Bar Chart */}
            <ChartCard title="آمار کلی" className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                  <YAxis tickMargin={10} fontSize={12} />
                  <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Line Chart */}
          <ChartCard title="نمودار تغییرات" className="mb-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                <YAxis tickMargin={10} fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF8042"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      ) : (
        <NoDataMessage />
      )}
    </TitleCard>
  );
};

export default Dashboard;