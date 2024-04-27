import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "../utils/ProtectRoutes";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Home from "../pages/Home";

const Routes = () => {
  const { userDetails } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
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
  const routesForAuthenticatedOnly = [
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
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
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
