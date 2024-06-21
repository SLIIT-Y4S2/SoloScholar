import { Breadcrumb } from "antd";

export interface BreadCrumbProp {
  module: string;
  activity: string;
  subActivity?: string;
  twClassNames?: string;
}

const BreadCrumb = (props: BreadCrumbProp) => {
  const { module, activity, subActivity, twClassNames } = props;
  return (
    <Breadcrumb
      style={{ margin: "55px 0 0 45px" }}
      className={twClassNames ?? ""}
    >
      <Breadcrumb.Item>Modules</Breadcrumb.Item>
      <Breadcrumb.Item>{module}</Breadcrumb.Item>
      <Breadcrumb.Item>{activity}</Breadcrumb.Item>
      <Breadcrumb.Item>{subActivity ?? ""}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
