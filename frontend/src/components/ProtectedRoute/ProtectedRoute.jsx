import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { selectToken } from "../../redux/user/userSelectors";

const ProtectedRoute = () => {
  const token = useSelector(selectToken);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
