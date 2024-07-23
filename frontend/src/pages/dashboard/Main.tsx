import { Card } from "antd";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const dashboardRoutes = [
  {
    name: "Lectures Overview",
    path: "/dashboard/lectures-overview",
  },
  {
    name: "Tutorials Overview",
    path: "/dashboard/tutorials-overview",
  },
  {
    name: "Labs Overview",
    path: "/dashboard/labs-overview",
  },
  {
    name: "Custom Analytical Indicator",
    path: "/dashboard/custom-analytical-indicator",
  },
  {
    name: "My Indicators",
    path: "/dashboard/my-indicators",
  },
];

const Main = () => {
  return (
    <div className="mt-[35px] mr-[80px] mb-[68px] ml-[45px]">
      {dashboardRoutes.map((dashboardRoute) => (
        <Fragment key={dashboardRoute.name}>
          <Link to={dashboardRoute.path}>
            <Card title={dashboardRoute.name} hoverable>
              {/* TODO */}
            </Card>
          </Link>
          <br />
        </Fragment>
      ))}
    </div>
  );
};

export default Main;
