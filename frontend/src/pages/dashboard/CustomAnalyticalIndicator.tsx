import { Fragment } from "react/jsx-runtime";
import { Layout } from "antd";
import BreadCrumb from "../../Components/BreadCrumb";

const { Content } = Layout;

const CustomAnalyticalIndicator = () => {
  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Custom Analytical Indicator" }}
      />
      <Content
        style={{
          padding: "69px 54px 69px 54px",
          margin: "35px 80px 68px 45px",
          minHeight: 280,
          background: "#ffff",
          borderRadius: "15px",
        }}
      >
        <p>Hello World</p>
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicator;
