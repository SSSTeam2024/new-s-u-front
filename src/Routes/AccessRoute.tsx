import React from 'react';
import { Navigate } from 'react-router-dom';

interface AccessRouteProps {
  allowedPaths: string[]; // Ensure allowedPaths is defined
  path: string;
  component: React.ComponentType<any>;
}

const AccessRoute: React.FC<AccessRouteProps> = ({ allowedPaths, path, component: Component }) => {
  console.log("AccessRoute - Allowed Paths:", allowedPaths);
  console.log("AccessRoute - Current Path:", path);

 alert("AccessRoute - Allowed Paths:"+ allowedPaths);
  alert("AccessRoute - Current Path:"+ path);
  if (!allowedPaths.includes(path)) {
    console.log(`Access denied for path: ${path}`);
    return <Navigate to="/auth-404" />;
  }

  return <Component />;
};

export default AccessRoute;