import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { selectToken } from "../../redux/user/userSlice";

const ProtectedRoute = () => {
  const token = useSelector(selectToken);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
