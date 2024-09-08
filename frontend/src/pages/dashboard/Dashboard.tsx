import DashboardSidebar from "../../Components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { DashboardProvider } from "../../provider/DashboardContext";

const Dashboard = () => {
  return (
    <Layout className="container mx-auto">
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
