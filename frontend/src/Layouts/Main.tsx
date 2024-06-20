import { PropsWithChildren } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
const MainLayout = (props: PropsWithChildren) => {
  
  //Todo: Replace with actual data
  const moduleData = {
    componentName: "Introduction to Database Management Systems",
    moduleCode: "SE3020",
  };

  return (
    <div className="font-roboto w-screen h-screen">
      <Header />
      <div className="grid grid-cols-[auto,1fr]">
        <Sidebar {...moduleData} />
        {props.children}
      </div>
    </div>
  );
};

export default MainLayout;
