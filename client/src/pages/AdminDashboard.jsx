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
      products: productsRes.data.products || [],
      totalProducts: productsRes.data.totalProducts || 0,
      sales: salesRes.data || {},
      users: usersRes.data || {},
    };
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    return {
      products: [],
      sales: {},
      users: {},
      totalProducts: 0,
    };
  }
};

const AdminDashboard = () => {
  const {
    products = [],
    sales = {},
    users = {},
    totalProducts = 0,
  } = useLoaderData();

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
    },
    {
      title: "Total Sales",
      value: sales.totalSales ?? 0,
    },
    {
      title: "Users",
      value: users.totalUsers ?? 0,
    },
    {
      title: "Revenue",
      value: sales.totalRevenue
        ? `₵ ${parseFloat(sales.totalRevenue).toFixed(2)}`
        : "₵ 0.00",
    },
  ];

  /* =========================
     LOW STOCK ALERT
  ========================= */
  const lowStockProducts =
    Array.isArray(products) && products.length
      ? products.filter((p) => p.quantity <= 5)
      : [];

  /* =========================
     FORMAT SALES DATA FOR CHART
  ========================= */
  const chartData =
    Array.isArray(sales.sales) && sales.sales.length
      ? sales.sales.map((sale) => ({
          date: new Date(sale.createdAt).toLocaleDateString(),
          revenue: sale.totalAmount ?? 0,
        }))
      : [];

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
         LOW STOCK ALERT
      ========================= */}
      {lowStockProducts.length > 0 && (
        <div className="low-stock-alert">
          <h3 className="low-stock-heading">⚠️ Low Stock Alert</h3>
          <ul className="low-stock-list">
            {lowStockProducts.map((product) => (
              <li key={product.id || product._id} className="low-stock-item">
                <span className="product-name">
                  {product.name ?? "Unknown"}
                </span>
                <span className="product-qty">
                  {product.quantity ?? 0} left
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* =========================
         AREA CHART
      ========================= */}
      {chartData.length > 0 ? (
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
      ) : (
        <p>No sales data available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
