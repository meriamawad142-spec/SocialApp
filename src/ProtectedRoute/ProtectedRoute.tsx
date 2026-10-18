import React, { type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
type ProtectedRouteProps = {
  children: ReactNode;
};
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}
