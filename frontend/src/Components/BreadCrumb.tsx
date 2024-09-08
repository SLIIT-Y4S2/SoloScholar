import { Link, useParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import { APP_ROUTES } from "../utils/app_routes";
import { BreadCrumbProp } from "../types/dashboard.types";

const convertToTitleCase = (str: string) =>
  str
    .split("-")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

const BreadCrumb = (props: BreadCrumbProp) => {
  const { sidebarOption } = props;
  const { module } = useParams();

  return (
    <Breadcrumb className="mt-[55px] mr-[0px] mb-[0px] ml-[45px]">
      <Breadcrumb.Item>
        <Link to={`/${module}`}>Modules</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/${module}`}>{convertToTitleCase(module ?? "")}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`/${APP_ROUTES.ds}/${APP_ROUTES.DASHBOARD}`}>Dashboard</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{sidebarOption.label}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
