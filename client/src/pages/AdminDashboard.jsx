import customFetch from "../utils/customFetch";
import { redirect, useLoaderData } from "react-router-dom";

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

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-heading">Welcome Admin 👋</h2>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <p className="stat-title">{item.title}</p>
            <h3 className="stat-value">{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
