import { PropsWithChildren } from "react";
import Header from "../Components/Header";
const MainLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <Header />

      {props.children}
    </div>
  );
};

export default MainLayout;
