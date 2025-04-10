import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import salesAnalyticsService from '../../services/salesAnalyticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const dailySales = salesAnalyticsService.getDailySales();
      setSalesData(dailySales);
    } catch (error) {
      console.error('Error fetching daily sales data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Sales',
        data: salesData.map(item => item.totalSales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Sales Overview',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  if (isLoading) {
    return <div>Loading daily sales data...</div>;
  }

  if (salesData.length === 0) {
    return <div>No sales data available</div>;
  }

  return (
    <div className='p-5 shadow-md'>
      <h2 className='mb-5 text-2xl font-bold uppercase'>📅 Daily Sales</h2>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default DailySales;