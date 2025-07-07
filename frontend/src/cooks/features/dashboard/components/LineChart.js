import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import jalali from 'dayjs-jalali';

dayjs.extend(jalali);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const monthLabels = [
  "فروردین", "اردیبهشت", "خرداد", "تیر",
  "مرداد", "شهریور", "مهر", "آبان",
  "آذر", "دی", "بهمن", "اسفند"
];

function LineChart() {
  const [orderCounts, setOrderCounts] = useState([]);

  useEffect(() => {
    const fetchMonthlyOrders = async () => {
      try {
        const response = await axios.get('/api/cooks/foods/order-foods'); // Adjust the endpoint if needed
        const orders = response.data; // Example: [{ createdAt: "2024-05-12T10:34:00Z" }, ...]

        // Tally orders per Persian month
        const monthCount = {};

        orders.forEach(order => {
          const monthName = dayjs(order.createdAt).locale('fa').jMonth(); // Get month index
          const persianMonth = monthLabels[monthName];
          monthCount[persianMonth] = (monthCount[persianMonth] || 0) + 1;
        });

        const countsArray = monthLabels.map(month => monthCount[month] || 0);
        setOrderCounts(countsArray);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchMonthlyOrders();
  }, []);

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        fill: true,
        label: 'تعداد سفارش‌ها',
        data: orderCounts,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <TitleCard title="سفارش‌های فعال (ماهانه)">
      <Line data={chartData} options={options} />
    </TitleCard>
  );
}

export default LineChart;
