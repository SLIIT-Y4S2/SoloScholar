import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { Typography, Layout, Card } from "antd";

const { Content } = Layout;
const { Text } = Typography;

const MyIndicators = () => {
  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "My Indicators" }}
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
        <Card className="bg-[#F6F6F6]" title="Indicator 1">
          <Text>Lorem Ipsum</Text>
          <br />
          <Text>Lorem Ipsum</Text>
          <br />
        </Card>
      </Content>
    </Fragment>
  );
};

export default MyIndicators;
