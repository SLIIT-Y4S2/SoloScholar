import { PropsWithChildren } from "react";
import Header from "../Components/Header";
import { Layout } from "antd";

const MainLayout = (props: PropsWithChildren) => {
  return (
    <Layout className="h-full min-h-screen">
      <Header />
      {props.children}
    </Layout>
  );
};

export default MainLayout;
