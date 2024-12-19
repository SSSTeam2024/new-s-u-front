import React from "react";
import { Navigate } from "react-router-dom";

interface AccessRouteProps {
  allowedPaths: string[]; // Ensure allowedPaths is defined
  path: string;
  component: React.ComponentType<any>;
}

const AccessRoute: React.FC<AccessRouteProps> = ({
  allowedPaths,
  path,
  component: Component,
}) => {
  if (!allowedPaths.includes(path)) {
    return <Navigate to="/auth-404" />;
  }

  return <Component />;
};

export default AccessRoute;
