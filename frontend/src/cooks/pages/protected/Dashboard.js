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

// Constants
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const METRICS_CONFIG = [
  { label: "آگهی ها", icon: LuNewspaper, key: "ads" },
  { label: "غذاها", icon: PiBowlFood, key: "foods" },
  { label: "سفارش ها", icon: VscListUnordered, key: "orders" },
  { label: "تیکت‌های پشتیبانی", icon: MdOutlineSupportAgent, key: "tickets" },
];

// Metric Card Component
const MetricCard = ({ label, value, Icon }) => (
  <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl p-6 flex flex-col items-center">
    <Icon className="text-3xl text-gray-600 mb-3" />
    <h2 className="text-lg font-semibold text-gray-600 mb-1">{label}</h2>
    <p className="text-3xl text-gray-600 font-bold">{value}</p>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6">
    <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">
      {title}
    </h3>
    {children}
  </div>
);

const Dashboard = () => {
  const token = localStorage.getItem("userToken");
  const dispatch = useDispatch();

  const [foodCount, setFoodCount] = useState(0);
  const [adsCount, setAdsCount] = useState(0);
  const [supportTicketCount, setSupportTicketCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [data, setData] = useState({
    ads: 0,
    foods: 0,
    orders: 0,
    tickets: 0,
  });

  // Set page title
  useEffect(() => {
    dispatch(setPageTitle({ title: "پنل کاربری" }));
  }, [dispatch]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodResponse = await axios.get("/api/cooks/foods", {
          headers: { authorization: `Bearer ${token}` },
        });
        setFoodCount(foodResponse.data.count);

        const adsResponse = await axios.get("/api/cooks/ads", {
          headers: { authorization: `Bearer ${token}` },
        });
        setAdsCount(adsResponse.data.count);

        const ticketsResponse = await axios.get("/api/cooks/support-tickets", {
          headers: { authorization: `Bearer ${token}` },
        });
        setSupportTicketCount(ticketsResponse.data.count);

        const ordersResponse = await axios.get("/api/cooks/foods/order-foods", {
          headers: { authorization: `Bearer ${token}` },
        });
        setOrderCount(ordersResponse.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Update data state when counts change
  useEffect(() => {
    setData({
      ads: adsCount,
      foods: foodCount,
      orders: orderCount,
      tickets: supportTicketCount,
    });
  }, [adsCount, foodCount, orderCount, supportTicketCount]);

  // Data transformation for charts
  const chartData = METRICS_CONFIG.map(({ label, key }) => ({
    name: label,
    value: data[key],
    count: data[key],
  }));

  return (
    <TitleCard title="پنل مدیریت">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {METRICS_CONFIG.map(({ label, icon: Icon, key }) => (
          <MetricCard key={key} label={label} value={data[key]} Icon={Icon} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <ChartCard title="درصد توزیع">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="آمار کلی">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickMargin={15} // Increased space between X-axis labels and axis line
              />
              <YAxis
                tickMargin={15} // Increased space between Y-axis labels and axis line
              />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Line Chart */}
      <ChartCard title="نمودار تغییرات">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickMargin={15} // Increased space between X-axis labels and axis line
            />
            <YAxis
              tickMargin={15} // Increased space between Y-axis labels and axis line
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#FF8042"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </TitleCard>
  );
};

export default Dashboard;