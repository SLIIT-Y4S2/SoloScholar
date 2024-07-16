import { PropsWithChildren } from "react";
import Header from "../Components/Header";
import { Layout } from "antd";

const MainLayout = (props: PropsWithChildren) => {
  return (
    // <div className="font-roboto h-screen flex flex-col">
    <Layout className="h-screen">
      <Header />
      {props.children}
    </Layout>
    // </div>
  );
};

export default MainLayout;
