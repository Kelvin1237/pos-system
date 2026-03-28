import { Navigate, useLoaderData } from "react-router-dom";
import { useDashboardContext } from "./DashboardLayout";

const DashboardIndex = () => {
  const { user } = useDashboardContext();

  if (!user) return <Navigate to="/" />;

  if (user.role === "ADMIN") {
    return <Navigate to="admin" replace />;
  }

  return <Navigate to="pos" replace />;
};

export default DashboardIndex;
