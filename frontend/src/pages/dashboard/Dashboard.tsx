import DashboardSidebar from "../../Components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const Dashboard = () => {
  return (
    <Layout>
      <DashboardSidebar />
      <Layout>
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
