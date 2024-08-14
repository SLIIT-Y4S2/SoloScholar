import {
  Link,
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import {
  ProtectedRouteInstructor,
  ProtectedRouteLearner,
} from "../utils/ProtectRoutes";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Home from "../pages/Home";
import Lab from "../pages/[module]/[lesson]/lab";
import Dashboard from "../pages/dashboard/Dashboard";
import Lecture from "../pages/[module]/[lesson]/lecture";
import Lectureview from "../pages/[module]/[lesson]/lecture/lectureView";
import CustomAnalyticalIndicator from "../pages/dashboard/CustomAnalyticalIndicator";
import LecturesOverview from "../pages/dashboard/LecturesOverview";
import TutorialsOverview from "../pages/dashboard/TutorialsOverview";
import LabsOverview from "../pages/dashboard/LabsOverview";
import MyIndicators from "../pages/dashboard/MyIndicators";
import Tutorial from "../pages/[module]/[lesson]/tutorial";
import TutorialView from "../pages/[module]/[lesson]/tutorial/[tutorialID]";
import Main from "../pages/dashboard/Main";
import Module from "../pages/[module]";
import { Button } from "antd";

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
    {
      path: "/unauthorized",
      element: (
        <div>
          <h1>Unauthorized</h1>
          <p>You are not authorized to view this page.</p>
          <Link to="/">
            <Button type="primary">Go back to home</Button>
          </Link>
        </div>
      ),
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly: RouteObject[] = [
    {
      path: "/",
      element: <ProtectedRouteLearner />, // Wrap the component in ProtectedRoute
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
          path: "/:module",
          element: <Module />,
        },

        {
          path: "/lab",
          element: <Lab />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRouteInstructor>
              <Dashboard />
            </ProtectedRouteInstructor>
          ),
          children: [
            {
              path: "/dashboard",
              element: <Main />,
            },
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
        {
          path: "/:module/:lesson",
          children: [
            {
              path: "tutorial",
              element: <Tutorial />,
            },
            {
              path: "tutorial/:tutorialId",
              element: <TutorialView />,
            },
            {
              path: "lab",
              element: <Lab />,
            },
            {
              path: "lab/:labId",
              element: <div>Lab</div>,
            },
            {
              path: "lecture",
              element: <Lecture />,
            },
            {
              path: "lecture/view",
              element: <Lectureview />,
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
