import { Link } from "react-router-dom";
import { APP_ROUTES } from "../utils/app_routes";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Space } from "antd";
import { useAuth } from "../provider/authProvider";

const Header = () => {
  const { userDetails } = useAuth();
  return (
    <div className="flex justify-between items-center text-base bg-white h-16 px-6 shadow-md">
      <Link to={APP_ROUTES.HOME}>
        <img src="/assets/soloscholar-logo.svg" alt="logo" className="h-12" />
      </Link>
      <div className="flex justify-center items-center gap-4">
        <Link to={APP_ROUTES.HOME}>Home</Link>
        {/* <Link to={APP_ROUTES.MODULES}>Modules</Link> */}
        <Dropdown
          menu={{
            items: [
              {
                key: "modules",
                label: <Link to={APP_ROUTES.ds}>Database Systems</Link>,
              },
              {
                key: "tutorial",
                label: <Link to={APP_ROUTES.tute}>Tute (TEMP....)</Link>,
              },
            ],
          }}
        >
          <div className="">Modules</div>
        </Dropdown>
        <ProfileIcon studentId={userDetails?.studentId || ""} />
      </div>
    </div>
  );
};

export default Header;

const items: MenuProps["items"] = [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: <Link to={APP_ROUTES.PROFILE}>Profile</Link>,
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: <Link to={APP_ROUTES.LOGOUT}>Logout</Link>,
  },
];

const ProfileIcon = ({ studentId }: { studentId: string }) => (
  <Dropdown menu={{ items }}>
    <Space>
      <Avatar icon={<UserOutlined />} />
      {studentId}
    </Space>
  </Dropdown>
);
