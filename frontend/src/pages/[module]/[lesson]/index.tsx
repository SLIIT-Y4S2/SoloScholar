import { Button, Layout } from "antd";
import CustomBreadcrumb from "../../../Components/CustomBreadcrumb";
import { Content } from "antd/es/layout/layout";
import { Link, useParams } from "react-router-dom";
//TODO
const Lesson = () => {
  const { lesson } = useParams<{ lesson: string }>();
  return (
    <Layout
      style={{ padding: "0 24px 24px" }}
      className="h-min container mx-auto"
    >
      <CustomBreadcrumb />
      <Content className="bg-white py-6 px-6 rounded-2xl flex flex-col gap-4 h-min">
        <h1 className="text-3xl font-bold">{toProperString(lesson ?? "")}</h1>
        <Link to="lecture">
          <Button type="primary" className="w-full">
            Lecture
          </Button>
        </Link>
        <Link to="tutorial">
          <Button type="primary" className="w-full">
            Tutorial
          </Button>
        </Link>
        <Link to="lab">
          <Button type="primary" className="w-full">
            Lab
          </Button>
        </Link>
      </Content>
    </Layout>
  );
};

export default Lesson;

function toProperString(input: string): string {
  const words = input.split("-");
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}
