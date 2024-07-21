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
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mr-[80px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
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
