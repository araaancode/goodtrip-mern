import React, { useEffect, useState, useCallback } from "react";
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
import { IoBarChartOutline } from "react-icons/io5";

import { useCookAuthStore } from "../../stores/authStore";

// =======================
// Type Definitions
// =======================
/**
 * @typedef {Object} DashboardData
 * @property {number} ads - Number of ads
 * @property {number} foods - Number of foods
 * @property {number} orders - Number of orders
 * @property {number} tickets - Number of support tickets
 */

/**
 * @typedef {Object} MetricConfig
 * @property {string} label - Display label for the metric
 * @property {React.ComponentType} icon - Icon component
 * @property {keyof DashboardData} key - Data key for this metric
 */

// =======================
// Constants
// =======================
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const METRICS_CONFIG = [
  { label: "آگهی ها", icon: LuNewspaper, key: "ads" },
  { label: "غذاها", icon: PiBowlFood, key: "foods" },
  { label: "سفارش ها", icon: VscListUnordered, key: "orders" },
  { label: "تیکت‌های پشتیبانی", icon: MdOutlineSupportAgent, key: "tickets" },
];

// =======================
// Custom Components
// =======================

/**
 * Tooltip for charts
 * @param {Object} props
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Tooltip payload data
 * @param {string} props.label - Tooltip label
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-white p-3 shadow-md rounded-lg border border-gray-200 text-center"
        role="tooltip"
        aria-label={`${label}: ${payload[0].value} items`}
      >
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">تعداد: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/**
 * Metric card for showing summary numbers
 * @param {Object} props
 * @param {string} props.label - Card label
 * @param {number} props.value - Metric value
 * @param {React.ComponentType} props.Icon - Icon component
 */
const MetricCard = ({ label, value, Icon }) => (
  <div 
    className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-4 flex flex-col items-center h-full"
    aria-label={`${label}: ${value}`}
  >
    <div className="bg-blue-50 p-3 rounded-full mb-3">
      <Icon className="text-xl text-blue-600" aria-hidden="true" />
    </div>
    <h2 className="text-base font-medium text-gray-700 mb-1 text-center">{label}</h2>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

/**
 * Card wrapper for charts
 * @param {Object} props
 * @param {string} props.title - Chart title
 * @param {React.ReactNode} props.children - Chart content
 * @param {string} [props.className] - Additional CSS classes
 */
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-xl p-4 ${className}`} dir="rtl">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{title}</h3>
    {children}
  </div>
);

/**
 * Loading spinner component
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64" aria-label="Loading dashboard data">
    <div 
      className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      aria-hidden="true"
    ></div>
  </div>
);

/**
 * No data placeholder
 */
const NoDataMessage = () => (
  <div 
    className="flex flex-col items-center justify-center h-64 text-gray-500"
    aria-label="No data available"
  >
    <div className="text-5xl mb-4" aria-hidden="true">
      <IoBarChartOutline />
    </div>
    <p className="text-lg">داده‌ای برای نمایش وجود ندارد</p>
    <p className="text-sm mt-2">پس از افزودن داده‌ها، نمودارها در اینجا نمایش داده می‌شوند</p>
  </div>
);

/**
 * Distribution info for pie chart
 * @param {Object} props
 * @param {Array} props.data - Chart data
 * @param {number} props.total - Total value for percentage calculation
 */
const DistributionInfo = ({ data, total }) => (
  <div className="mt-4 grid grid-cols-2 gap-2">
    {data.map((item, index) => {
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
          <div
            className="w-3 h-3 rounded-full ml-2"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
            aria-hidden="true"
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
  const { cook, isCookAuthenticated } = useCookAuthStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({ ads: 0, foods: 0, orders: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "پنل کاربری" }));
  }, [dispatch]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!isCookAuthenticated) {
      navigate("/cooks/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const config = { withCredentials: true };

      const [foodRes, adsRes, ticketsRes, ordersRes] = await Promise.all([
        axios.get("/api/cooks/foods", config),
        axios.get("/api/cooks/ads", config),
        axios.get("/api/cooks/support-tickets", config),
        axios.get("/api/cooks/foods/order-foods", config),
      ]);

      setData({
        ads: adsRes.data.count || 0,
        foods: foodRes.data.count || 0,
        orders: ordersRes.data.count || 0,
        tickets: ticketsRes.data.count || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isCookAuthenticated, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Prepare chart data
  const chartData = METRICS_CONFIG.map(({ label, key }) => ({
    name: label,
    value: data[key],
    count: data[key],
  }));
  
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const hasChartData = Object.values(data).some((value) => value > 0);

  // Show error state
  if (error) {
    return (
      <TitleCard title="پنل مدیریت">
        <div className="flex flex-col items-center justify-center h-64 text-red-600">
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </TitleCard>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <TitleCard title="پنل مدیریت">
        <LoadingSpinner />
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

      {/* Charts */}
      {hasChartData ? (
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

            <DistributionInfo data={chartData} total={totalValue} />
          </ChartCard>

          {/* Bar Chart */}
          <ChartCard title="آمار کلی" className="h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                aria-label="Bar chart showing overall statistics"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                <YAxis tickMargin={10} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : (
        <NoDataMessage />
      )}
    </TitleCard>
  );
};

export default Dashboard;