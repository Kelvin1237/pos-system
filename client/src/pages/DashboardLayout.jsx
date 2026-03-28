import {
  Outlet,
  NavLink,
  useNavigate,
  useNavigation,
  useLoaderData,
} from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useState, useContext, createContext } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users/me");
    return data;
  } catch (error) {
    return redirect("/");
  }
};

const DashboardContext = createContext();

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useLoaderData();

  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  const navigate = useNavigate();

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };

  return (
    <DashboardContext.Provider value={{ user }}>
      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <h2>POS</h2>
          </div>

          <nav className="sidebar-links">
            <NavLink
              to={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/pos"}
              className="sidebar-link"
              onClick={() => setIsSidebarOpen(false)}
            >
              Dashboard
            </NavLink>
            {user.role === "ADMIN" ? (
              <>
                <NavLink
                  to="/dashboard/products"
                  className="sidebar-link"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/dashboard/sales"
                  className="sidebar-link"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sales
                </NavLink>
                <NavLink
                  to="/dashboard/users"
                  className="sidebar-link"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Users
                </NavLink>
              </>
            ) : (
              <NavLink
                to="/dashboard/my-sales"
                className="sidebar-link"
                onClick={() => setIsSidebarOpen(false)}
              >
                Sales
              </NavLink>
            )}
          </nav>
        </aside>

        {/* OVERLAY (mobile) */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* MAIN CONTENT */}
        <div className="dashboard-content">
          {/* TOPBAR */}
          <div className="topbar">
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
              ☰
            </button>

            <h3 className="topbar-title">
              {user.role === "CASHIER" ? "Cashier" : "Admin"} Panel
            </h3>

            {/* RIGHT SECTION */}
            <div className="topbar-right">
              <div
                className="profile-box"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <div className="avatar">
                  {user.role === "CASHIER" ? "C" : <ShieldCheck />}
                </div>
                <span className="profile-name">{user.username}</span>
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={logoutUser}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="page-content">
            {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
