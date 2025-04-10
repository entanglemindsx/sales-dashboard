import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import salesAnalyticsService from '../../services/salesAnalyticsService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MonthlySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const monthlySales = salesAnalyticsService.getMonthlySales();    
      setSalesData(monthlySales);
    } catch (error) {
      console.error('Error fetching monthly sales data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const chartData = {
    labels: salesData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Sales',
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
        text: 'Monthly Sales Overview',
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
    return <div>Loading monthly sales data...</div>;
  }

  if (salesData.length === 0) {
    return <div>No sales data available</div>;
  }

  return (
    <div className='p-5 shadow-md'>
      <h2 className='mb-5 text-2xl font-bold uppercase'>📅 Monthly Sales</h2>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default MonthlySales;