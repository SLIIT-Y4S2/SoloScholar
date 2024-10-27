import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

interface SidebarItem {
  label: string;
  linkTo: string;
}

const sidebarItems: SidebarItem[] = [
  // { label: "Lectures Overview", linkTo: "lectures-overview" },
  { label: "Tutorials Overview", linkTo: "tutorials-overview" },
  { label: "Labs Overview", linkTo: "labs-overview" },
  {
    label: "Custom Analytical Indicator",
    linkTo: "custom-analytical-indicator",
  },
  { label: "My Indicators", linkTo: "my-indicators" },
];
const items = sidebarItems.map((activity: SidebarItem) => {
  return {
    key: activity.label,
    label: <Link to={activity.linkTo}>{activity.label}</Link>,
  };
});

const DashboardSidebar = () => {
  return (
    <Sider width={344}>
      <Menu mode="inline" className="h-full" items={items} />
    </Sider>
  );
};

export default DashboardSidebar;
