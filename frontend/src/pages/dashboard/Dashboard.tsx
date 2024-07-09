import DashboardSidebar from "../../Components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { DashboardProvider } from "../../provider/DashboardContext";

const Dashboard = () => {
  return (
    <Layout>
      <DashboardSidebar />
      <Layout>
        <DashboardProvider>
          <Outlet />
        </DashboardProvider>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
