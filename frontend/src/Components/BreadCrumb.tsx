import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

interface BreadCrumbItem {
  label: string;
  linkTo?: string;
}
export interface BreadCrumbProp {
  module: BreadCrumbItem;
  sidebarOption: BreadCrumbItem;
}

const BreadCrumb = (props: BreadCrumbProp) => {
  const { module, sidebarOption } = props;
  return (
    <Breadcrumb className="mt-[55px] mr-[0px] mb-[0px] ml-[45px]">
      <Breadcrumb.Item>
        <Link to="#">Modules</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`${module.linkTo}`}>{module.label}</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/dashboard">Dashboard</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{sidebarOption.label}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
