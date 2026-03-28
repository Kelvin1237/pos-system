import { Navigate } from "react-router-dom";
import { useDashboardContext } from "./DashboardLayout";

const AdminRoute = ({ children }) => {
  const { user } = useDashboardContext();

  if (user.role !== "ADMIN") {
    return <Navigate to="dashboard" />;
  }

  return children;
};

export default AdminRoute;
