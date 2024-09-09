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
import Dashboard from "../pages/dashboard/Dashboard";
import CustomAnalyticalIndicator from "../pages/dashboard/CustomAnalyticalIndicator";
import LecturesOverview from "../pages/dashboard/LecturesOverview";
import TutorialsOverview from "../pages/dashboard/TutorialsOverview";
import LabsOverview from "../pages/dashboard/LabsOverview";
import MyIndicators from "../pages/dashboard/MyIndicators";
import Tutorial from "../pages/[module]/[lesson]/tutorial";
import TutorialView from "../pages/[module]/[lesson]/tutorial/[tutorialID]";
import Main from "../pages/dashboard/Main";
import { LabSessionLayout } from "../pages/[module]/[lesson]/lab/LabSessionLayout";
import { LabLayout } from "../pages/[module]/[lesson]/lab/LabLayout";
import { SupportMaterialsForLab } from "../Components/lab/SupportMaterialsForLab";
import LabOverview from "../pages/[module]/[lesson]/lab";
import LabSession from "../pages/[module]/[lesson]/lab/[labID]";
import Module from "../pages/[module]";
import { Button, Result } from "antd";
import Lesson from "../pages/[module]/[lesson]";
import DiscussionForum from "../pages/[module]/[lesson]/discussionForum";
import { DiscussionForumProvider } from "../provider/DiscussionForumContext";
import { WebSocketProvider } from "../provider/WebSocketContext";
import Discussion from "../pages/[module]/[lesson]/discussionForum/[discussionId]";

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
          // element: <Home />,
          element: <Navigate to="database-systems" />,
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
          path: "/:module/dashboard",
          element: (
            <ProtectedRouteInstructor>
              <Dashboard />
            </ProtectedRouteInstructor>
          ),
          children: [
            {
              path: "",
              element: <Main />,
            },
            {
              path: "lectures-overview",
              element: <LecturesOverview />,
            },
            {
              path: "tutorials-overview",
              element: <TutorialsOverview />,
            },
            {
              path: "labs-overview",
              element: <LabsOverview />,
            },
            {
              path: "custom-analytical-indicator",
              element: <CustomAnalyticalIndicator />,
            },
            {
              path: "my-indicators",
              element: <MyIndicators />,
            },
          ],
        },
        {
          path: "/:module/discussion-forum",
          children: [
            {
              path: "",
              element: <WebSocketProvider><DiscussionForumProvider><DiscussionForum /></DiscussionForumProvider></WebSocketProvider>
            },
            {
              path: ":discussionId",
              element: <WebSocketProvider><DiscussionForumProvider><Discussion /></DiscussionForumProvider></WebSocketProvider>
            }
          ],
        },
        {
          path: "/:module/:lesson",
          children: [
            {
              path: "",
              element: <Lesson />,
            },
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
              element: <LabLayout />,
              children: [
                {
                  path: "",
                  element: <LabOverview />,
                },
                {
                  path: "session",
                  element: <LabSessionLayout />,
                  children: [
                    {
                      path: ":labSheetId",
                      element: <LabSession />,
                    },
                    {
                      path: ":labSheetId/support-material",
                      element: (
                        <SupportMaterialsForLab
                          isNewTab={true}
                          labSheetId={undefined}
                        />
                      ),
                    },
                  ],
                },
              ],
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
    element: (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    ),
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
