import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";

const LecturesOverview = () => {
  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Lectures Overview" }} />
      <div
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mr-[80px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        <p>Lectures Overview</p>
      </div>
    </Fragment>
  );
};

export default LecturesOverview;
