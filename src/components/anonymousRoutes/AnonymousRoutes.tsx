import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/store";
import { getLoginState } from "../../features/loginForm/redux/loginFormSlice";

function AnonymousRoutes() {
  const loginState = useAppSelector(getLoginState);
  return loginState.token || localStorage.access_token ? (
    <Navigate to="/my-groups" replace />
  ) : (
    <Outlet />
  );
}
export default AnonymousRoutes;
