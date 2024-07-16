import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { Layout } from "antd";

const { Content } = Layout;

const LabsOverview = () => {
  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Labs Overview" }}
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
        <p>Labs Overview</p>
      </Content>
    </Fragment>
  );
};

export default LabsOverview;