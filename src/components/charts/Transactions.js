import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import salesAnalyticsService from "../../services/salesAnalyticsService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState({
    dailyTransactions: [],
    monthlyTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = salesAnalyticsService.getTransactions();
      setTransactionsData(data);
    } catch (err) {
      setError("Failed to load transaction data");
      console.error("Error fetching transaction data:", err);
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
        text: "Transaction Overview",     
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
          text: "Daily Transactions",
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
          text: "Monthly Transactions",
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
    return <div>Loading transaction data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (
    !transactionsData.monthlyTransactions.length ||
    !transactionsData.dailyTransactions.length
  ) {
    return <div>No transaction data available</div>;
  }

  const dualAxisData = {
    labels: transactionsData.monthlyTransactions.map((item) => item.month),
    datasets: [
      {
        label: "Daily Transactions",
        data: transactionsData.dailyTransactions
          .slice(0, transactionsData.monthlyTransactions.length)
          .map((item) => item.transactions),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Monthly Transactions",
        data: transactionsData.monthlyTransactions.map(
          (item) => item.transactions
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="p-5 shadow-md">
      <h2 className="mb-5 text-2xl font-bold uppercase">📊 Transactions</h2>
      <Line options={options} data={dualAxisData} />    
    </div>
  );
};

export default Transactions;
