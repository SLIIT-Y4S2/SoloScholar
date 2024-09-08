import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";

const TutorialsOverview = () => {
  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Tutorials Overview" }} />
      <div
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        <p>Tutorials Overview</p>
      </div>
    </Fragment>
  );
};

export default TutorialsOverview;
