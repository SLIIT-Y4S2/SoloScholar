import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";

const LabsOverview = () => {
  return (
    <Fragment>
      <BreadCrumb sidebarOption={{ label: "Labs Overview" }} />
      <div
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        <p>Labs Overview</p>
      </div>
    </Fragment>
  );
};

export default LabsOverview;
