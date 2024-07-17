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
      pt-[69px] pr-[54px] pb-[69px] pl-[54px]
      mt-[35px] mr-[80px] mb-[68px] ml-[45px]
      min-h-[280px] bg-[#ffff] rounded-[15px]
      "
      >
        <p>Lectures Overview</p>
      </Content>
    </Fragment>
  );
};

export default LecturesOverview;
