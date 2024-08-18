import { Layout } from "antd";
import CustomBreadcrumb from "../../../Components/CustomBreadcrumb";
import { Content } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
//TODO
const Lesson = () => {
  return (
    <Layout style={{ padding: "0 24px 24px" }} className="h-min">
      <CustomBreadcrumb />
      <Content className="bg-white py-6 px-6 rounded-2xl flex flex-col gap-4 h-min">
        Lesson
        <Link to="lecture">Go to Lecture</Link>
        <Link to="tutorial">Go to Tutorial</Link>
        <Link to="lab">Go to Lab</Link>
      </Content>
    </Layout>
  );
};

export default Lesson;
