import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import MainLayout from "../Layouts/Main";
import { APP_ROUTES } from "./app_routes";

export const ProtectedRouteLearner = () => {
  const { userDetails } = useAuth();

  // Check if the user is authenticated
  if (!userDetails) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  // If authenticated, render the child routes
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const ProtectedRouteInstructor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userDetails } = useAuth();

  // Check if the user is authenticated
  if (!userDetails) {
    return <Navigate to={APP_ROUTES.LOGIN} />;
  }

  if (userDetails.role !== "instructor") {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated, render the child routes
  return children;
};
