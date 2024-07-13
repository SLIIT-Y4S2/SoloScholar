import { PropsWithChildren } from "react";
import Header from "../Components/Header";

const MainLayout = (props: PropsWithChildren) => {
  return (
    <div className="font-roboto h-screen flex flex-col">
      <Header />
      {props.children}
    </div>
  );
};

export default MainLayout;
