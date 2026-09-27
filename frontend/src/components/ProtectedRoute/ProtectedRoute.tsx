import { useAppSelector } from "../../redux/hooks";
import { Navigate, Outlet } from "react-router-dom";

import { selectToken } from "../../redux/user/userSlice";

const ProtectedRoute = () => {
  const token = useAppSelector(selectToken);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
