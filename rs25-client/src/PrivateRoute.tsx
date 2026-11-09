import { useAuth } from "./Auth/AuthContext";
import { Navigate } from "react-router-dom";
import React, { ReactElement } from "react";

interface PrivateRouteType {
  children: ReactElement;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteType> = ({
  children,
  allowedRoles,
}) => {
  const auth = useAuth();

  if (!auth?.user || !auth.user.email) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/Account/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    console.log("User role not allowed, redirecting to login denied");
    return <Navigate to="/Account/accessdenied" replace />;
  }

  return children;
};
