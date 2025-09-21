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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { MdOutlineSupportAgent } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { PiBowlFood } from "react-icons/pi";
import { VscListUnordered } from "react-icons/vsc";
import { useCookAuthStore } from "../../stores/authStore";

import { IoBarChartOutline } from "react-icons/io5";

// Constants
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const METRICS_CONFIG = [
  { label: "آگهی ها", icon: LuNewspaper, key: "ads" },
  { label: "غذاها", icon: PiBowlFood, key: "foods" },
  { label: "سفارش ها", icon: VscListUnordered, key: "orders" },
  { label: "تیکت‌های پشتیبانی", icon: MdOutlineSupportAgent, key: "tickets" },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200 text-center">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">تعداد: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Metric Card Component
const MetricCard = ({ label, value, Icon }) => (
  <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-4 flex flex-col items-center h-full">
    <div className="bg-blue-50 p-3 rounded-full mb-3">
      <Icon className="text-xl text-blue-600" />
    </div>
    <h2 className="text-base font-medium text-gray-700 mb-1 text-center">{label}</h2>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
      {title}
    </h3>
    {children}
  </div>
);

// No Data Message Component
const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <div className="text-5xl mb-4">
      <IoBarChartOutline />
    </div>
    <p className="text-lg">داده‌ای برای نمایش وجود ندارد</p>
    <p className="text-sm mt-2">پس از افزودن داده‌ها، نمودارها در اینجا نمایش داده می‌شوند</p>
  </div>
);

const Dashboard = () => {
  const { cook, isCookAuthenticated } = useCookAuthStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    ads: 0,
    foods: 0,
    orders: 0,
    tickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setPageTitle({ title: "پنل کاربری" }));
  }, [dispatch]);

  useEffect(() => {
    if (!isCookAuthenticated) {
      navigate("/cooks/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { withCredentials: true };

        const [foodRes, adsRes, ticketsRes, ordersRes] = await Promise.all([
          axios.get("/api/cooks/foods", config),
          axios.get("/api/cooks/ads", config),
          axios.get("/api/cooks/support-tickets", config),
          axios.get("/api/cooks/foods/order-foods", config),
        ]);

        setData({
          ads: adsRes.data.count,
          foods: foodRes.data.count,
          orders: ordersRes.data.count,
          tickets: ticketsRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cook, isCookAuthenticated, navigate]);

  const chartData = METRICS_CONFIG.map(({ label, key }) => ({
    name: label,
    value: data[key],
    count: data[key],
  }));

  // Check if there's any data to display in charts
  const hasChartData = Object.values(data).some(value => value > 0);

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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {METRICS_CONFIG.map(({ label, icon: Icon, key }) => (
          <MetricCard key={key} label={label} value={data[key]} Icon={Icon} />
        ))}
      </div>

      {/* Conditional Charts Rendering */}
      {hasChartData ? (
        <>
          {/* Charts Grid */}
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Bar Chart */}
            <ChartCard title="آمار کلی" className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                  <YAxis tickMargin={10} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Line Chart */}
          <ChartCard title="نمودار تغییرات" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                <YAxis tickMargin={10} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
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