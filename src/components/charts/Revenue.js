import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import salesAnalyticsService from "../../services/salesAnalyticsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueTrends = () => {
  const [revenueData, setRevenueData] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = salesAnalyticsService.getRevenueTrends();
      setRevenueData(data);
    } catch (err) {
      setError("Failed to load revenue data");
      console.error("Error fetching revenue data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Revenue Overview",      
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString();
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Daily Revenue",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Monthly Revenue",
          font: {
            weight: "bold",
          },
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading revenue data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!revenueData.dailyRevenue.length || !revenueData.monthlyRevenue.length) {
    return <div>No revenue data available</div>;
  }

  const dualAxisData = {
    labels: revenueData.monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "Daily Revenue",
        data: revenueData.dailyRevenue.map((item) => item.revenue),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        xAxisID: "x",
      },
      {
        label: "Monthly Revenue",
        data: revenueData.monthlyRevenue.map((item) => item.revenue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        xAxisID: "x",
      },
    ],
  };

  return (
    <div className="p-5 shadow-md">
      <h2 className='mb-5 text-2xl font-bold uppercase'>📊 Revenue</h2>
        <Bar options={options} data={dualAxisData} />
    </div>
  );
};

export default RevenueTrends;
