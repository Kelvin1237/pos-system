import customFetch from "../utils/customFetch";
import { redirect, useLoaderData } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const loader = async () => {
  try {
    const [productsRes, salesRes, usersRes] = await Promise.all([
      customFetch.get("/products"),
      customFetch.get("/sales"),
      customFetch.get("/users"),
    ]);
    return {
      products: productsRes.data,
      sales: salesRes.data,
      users: usersRes.data,
    };
  } catch (error) {
    throw redirect("/");
  }
};

const AdminDashboard = () => {
  const { products, sales, users } = useLoaderData();

  const stats = [
    {
      title: "Total Products",
      value: products.totalProducts,
    },
    {
      title: "Total Sales",
      value: sales.totalSales,
    },
    {
      title: "Users",
      value: users.totalUsers,
    },
    {
      title: "Revenue",
      value: `$ ${parseFloat(sales.totalRevenue).toFixed(2)}`,
    },
  ];

  /* =========================
     FORMAT SALES DATA FOR CHART
  ========================= */

  const chartData = sales.sales.map((sale) => ({
    date: new Date(sale.createdAt).toLocaleDateString(), // X-axis
    revenue: sale.totalAmount, // Y-axis
  }));

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-heading">Welcome Admin 👋</h2>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <p className="stat-title">{item.title}</p>
            <h3 className="stat-value">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* =========================
         AREA CHART
      ========================= */}
      <div className="chart-container">
        <h3 className="chart-title">Revenue Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />
            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8570fe"
              fill="#8570fe"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
