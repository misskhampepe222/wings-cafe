import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    const safeParse = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    };

    const products = safeParse('products');
    const sales = safeParse('sales');
    const customers = safeParse('customers');

    const lowStockItems = products.filter(product => product.quantity < 20).length;

    setStats({
      totalProducts: products.length,
      lowStockItems,
      totalSales: sales.length,
      totalCustomers: customers.length
    });
  }, []);

  // Data for bar chart
  const barData = [
    { name: 'Products', value: stats.totalProducts },
    { name: 'Low Stock', value: stats.lowStockItems },
    { name: 'Sales', value: stats.totalSales },
    { name: 'Customers', value: stats.totalCustomers }
  ];

  // Data for pie chart
  const pieData = [
    { name: 'Products', value: stats.totalProducts },
    { name: 'Sales', value: stats.totalSales },
    { name: 'Customers', value: stats.totalCustomers }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <h1 className="module-title">Dashboard</h1>

      <div className="charts-container">
        {/* Bar Chart */}
        <div className="chart-box">
          <h2>Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-box">
          <h2>Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
