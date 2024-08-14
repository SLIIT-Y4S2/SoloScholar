import { Link } from "react-router-dom";
import { APP_ROUTES } from "../utils/app_routes";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Space } from "antd";
import { useAuth } from "../provider/authProvider";

const Header = () => {
  const { userDetails } = useAuth();
  return (
    <div className="flex justify-between items-center text-base bg-white h-16 px-6 shadow-md" style={{ boxShadow: "0px 4px 50px 0px rgba(0, 0, 0, 0.10)" }}>
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
                key: "lab",
                label: <Link to={APP_ROUTES.lab}>Lab </Link>,
              },
            ],
          }}
        >
          <div className="">Modules</div>
        </Dropdown>
        <ProfileIcon
          student_id={`${userDetails?.first_name} ${userDetails?.last_name}`}
        />
      </div>
    </div>
  );
};

export default Header;

const items: MenuProps["items"] = [
  // {
  //   key: "profile",
  //   icon: <UserOutlined />,
  //   label: <Link to={APP_ROUTES.PROFILE}>Profile</Link>,
  // },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: <Link to={APP_ROUTES.LOGOUT}>Logout</Link>,
  },
];

const ProfileIcon = ({ student_id }: { student_id: string }) => (
  <Dropdown menu={{ items }}>
    <Space>
      <Avatar icon={<UserOutlined />} />
      {student_id}
    </Space>
  </Dropdown>
);
