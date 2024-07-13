import {
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "../utils/ProtectRoutes";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Home from "../pages/Home";
import Lab from "../pages/Lab";
import Dashboard from "../pages/dashboard/Dashboard";
import CustomAnalyticalIndicator from "../pages/dashboard/CustomAnalyticalIndicator";
import LecturesOverview from "../pages/dashboard/LecturesOverview";
import TutorialsOverview from "../pages/dashboard/TutorialsOverview";
import LabsOverview from "../pages/dashboard/LabsOverview";
import MyIndicators from "../pages/dashboard/MyIndicators";

const Routes = () => {
  const { userDetails } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic: RouteObject[] = [
    {
      path: "/logout",

      element: <Logout />,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly: RouteObject[] = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/login",
          element: <Navigate to="/" />,
        },
        {
          path: "/lab",
          element: <Lab />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
          children: [
            {
              path: "/dashboard/lectures-overview",
              element: <LecturesOverview />,
            },
            {
              path: "/dashboard/tutorials-overview",
              element: <TutorialsOverview />,
            },
            {
              path: "/dashboard/labs-overview",
              element: <LabsOverview />,
            },
            {
              path: "/dashboard/custom-analytical-indicator",
              element: <CustomAnalyticalIndicator />,
            },
            {
              path: "/dashboard/my-indicators",
              element: <MyIndicators />,
            },
          ],
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly: RouteObject[] = [
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // Define a route for handling errors
  const errorRoute = {
    path: "*",
    element: <div>404 Not Found</div>,
  };

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!userDetails ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    errorRoute,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
