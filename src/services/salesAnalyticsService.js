import salesData from "../data/international_sale_minify.json";

const isValidDate = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  const regex = /^\d{2}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return false;
  
  const [month, day] = str.split('-').map(num => parseInt(num, 10));
  
  // Basic validation for day/month ranges
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  return true;
};

const formatDate = (dateStr) => {
  if (!isValidDate(dateStr)) return null;
  
  const [mm, dd, yy] = dateStr.split("-");
  return `20${yy}-${mm}-${dd}`;
};

const groupBy = (data, key) => {
  if (!Array.isArray(data) || data.length === 0) return {};
  
  return data.reduce((acc, curr) => {
    if (!curr || typeof curr !== 'object') return acc;
    
    const groupKey = curr[key];
    if (groupKey === undefined || groupKey === null) return acc;
    
    if (key === "DATE" && !isValidDate(groupKey)) return acc;
    
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(curr);
    return acc;
  }, {});
};

const getDailySales = () => {
  if (!Array.isArray(salesData) || salesData.length === 0) return [];
  
  // Filter data to only include items with valid dates
  const validData = salesData.filter(item => isValidDate(item.DATE));
  const grouped = groupBy(validData, "DATE");
  
  return Object.entries(grouped).map(([date, items]) => ({
    date: formatDate(date),
    totalSales: items.reduce((sum, item) => sum + (parseFloat(item["GROSS AMT"]) || 0), 0),
  }));
};

const getMonthlySales = () => {
  if (!Array.isArray(salesData) || salesData.length === 0) return [];
  
  // Filter data to only include items with valid dates
  const validData = salesData.filter(item => isValidDate(item.DATE));
  const grouped = groupBy(validData, "Months");
  
  return Object.entries(grouped).map(([month, items]) => ({
    month,
    totalSales: items.reduce((sum, item) => sum + (parseFloat(item["GROSS AMT"]) || 0), 0),
  }));
};

const getTransactions = () => {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    return { dailyTransactions: [], monthlyTransactions: [] };
  }
  
  // Filter data to only include items with valid dates
  const validData = salesData.filter(item => isValidDate(item.DATE));
  const daily = groupBy(validData, "DATE");
  const monthly = groupBy(validData, "Months");

  return {
    dailyTransactions: Object.entries(daily).map(([date, items]) => ({
      date: formatDate(date),
      transactions: items.length,
    })),
    monthlyTransactions: Object.entries(monthly).map(([month, items]) => ({
      month,
      transactions: items.length,
    })),
  };
};

const getRevenueTrends = () => {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    return { dailyRevenue: [], monthlyRevenue: [] };
  }
  
  // Filter data to only include items with valid dates
  const validData = salesData.filter(item => isValidDate(item.DATE));
  const daily = groupBy(validData, "DATE");
  const monthly = groupBy(validData, "Months");

  return {
    dailyRevenue: Object.entries(daily).map(([date, items]) => ({
      date: formatDate(date),
      revenue: items.reduce((sum, item) => sum + (parseFloat(item["GROSS AMT"]) || 0), 0),
    })),
    monthlyRevenue: Object.entries(monthly).map(([month, items]) => ({
      month,
      revenue: items.reduce((sum, item) => sum + (parseFloat(item["GROSS AMT"]) || 0), 0),
    })),
  };
};

const salesAnalyticsService = {
  getDailySales,
  getMonthlySales,
  getTransactions,
  getRevenueTrends,
};

export default salesAnalyticsService;