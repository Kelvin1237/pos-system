import { Outlet, useNavigation } from "react-router-dom";
import Loading from "../components/Loading";

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <div className="home-layout">
      <div className="home-overlay">
        <div className="home-container">
          {isPageLoading ? <Loading /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
