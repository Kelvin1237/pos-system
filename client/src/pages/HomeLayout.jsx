import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="home-layout">
      <div className="home-overlay">
        <div className="home-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
