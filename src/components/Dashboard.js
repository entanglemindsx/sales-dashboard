import React from "react";
import DailySales from "./charts/DailySales";
import MonthlySales from "./charts/MonthlySales";
import Transactions from "./charts/Transactions";
import RevenueTrends from "./charts/Revenue";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
        <DailySales />
        </div>
        <div className="cols-12 md:col-span-6 lg:col-span-6 ">
        <MonthlySales />
      </div>
      <div className="cols-12 md:col-span-6 lg:col-span-6 ">
        <Transactions />
        </div>
        <div className="cols-12 md:col-span-6 lg:col-span-6 ">
        <RevenueTrends />
      </div>
    </div>
  );
};

export default Dashboard;
