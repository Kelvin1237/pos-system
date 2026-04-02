import { createBrowserRouter, RouterProvider } from "react-router-dom";

// layouts
import HomeLayout from "./pages/HomeLayout";
import DashboardLayout from "./pages/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import POS from "./pages/POS";
import CashierSales from "./pages/CashierSales";

// pages
import Login from "./pages/Login";
import Error from "./pages/Error";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import Receipt from "./pages/Receipt";
import DashboardIndex from "./pages/DashboardIndex";
import AdminRoute from "./pages/AdminRoute";

import { action as loginAction } from "./pages/Login";
import { action as createProductAction } from "./pages/Products";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as adminDashboardLoader } from "./pages/AdminDashboard";
import { loader as CashierSalesLoader } from "./pages/CashierSales";
import { loader as salesLoader } from "./pages/Sales";
import { loader as productsLoader } from "./pages/Products";
import { loader as usersLoader } from "./pages/Users";
import { loader as posLoader } from "./pages/POS";
import { loader as customersLoader } from "./pages/Customers";
import Customers from "./pages/Customers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Login />,
        action: loginAction,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <DashboardIndex />, // cashier screen
          },
          {
            path: "pos",
            element: <POS />,
            loader: posLoader,
          },
          {
            path: "receipt",
            element: <Receipt />,
          },
          {
            path: "admin",
            element: (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ),
            loader: adminDashboardLoader,
          },
          {
            path: "products",
            element: <Products />,
            loader: productsLoader,
            action: createProductAction,
          },
          {
            path: "sales",
            element: <Sales />,
            loader: salesLoader,
          },
          {
            path: "customers",
            element: <Customers />,
            loader: customersLoader,
          },
          {
            path: "my-sales",
            element: <CashierSales />,
            loader: CashierSalesLoader,
          },
          {
            path: "users",
            element: <Users />,
            loader: usersLoader,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
