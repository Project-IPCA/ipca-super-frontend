import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/store";
import { getLoginState } from "../../features/loginForm/redux/loginFormSlice";

function ProtectedRoutes() {
  const location = useLocation();
  const loginState = useAppSelector(getLoginState);

  useEffect(() => {}, [location.pathname, loginState.token]);
  return localStorage.access_token || localStorage.refresh_token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoutes;
