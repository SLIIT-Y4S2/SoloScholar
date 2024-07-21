import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { Layout } from "antd";

const { Content } = Layout;

const LecturesOverview = () => {
  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Lectures Overview" }}
      />
      <Content
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mr-[80px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        <p>Lectures Overview</p>
      </Content>
    </Fragment>
  );
};

export default LecturesOverview;
