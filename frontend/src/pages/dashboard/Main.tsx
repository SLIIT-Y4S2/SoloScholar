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
    <div className="flex flex-col justify-evenly h-screen px-[45px]">
      {dashboardRoutes.map((dashboardRoute) => (
        <Fragment key={dashboardRoute.name}>
          <Link to={dashboardRoute.path}>
            <Card title={dashboardRoute.name} hoverable>
              {/* TODO */}
            </Card>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default Main;
