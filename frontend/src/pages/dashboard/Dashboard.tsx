import DashboardSidebar from "../../Components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { DashboardProvider } from "../../provider/DashboardContext";
import { DashboardAnalyticsProvider } from "../../provider/DashboardAnalyticsContext";

const Dashboard = () => {
  return (
    <Layout className="container mx-auto">
      <DashboardSidebar />
      <Layout>
        <DashboardProvider>
          <DashboardAnalyticsProvider>
            <Outlet />
          </DashboardAnalyticsProvider>
        </DashboardProvider>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
