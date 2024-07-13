import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { Layout } from "antd";

const { Content } = Layout;

const TutorialsOverview = () => {
  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Tutorials Overview" }}
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
        <p>Tutorials Overview</p>
      </Content>
    </Fragment>
  );
};

export default TutorialsOverview;
