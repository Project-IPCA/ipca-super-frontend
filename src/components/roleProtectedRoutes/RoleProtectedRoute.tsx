import { Navigate, Outlet } from "react-router-dom";
import SpinnerLoading from "../spinnerLoading/SpinnerLoading";
import { Permission } from "../../constants/constants";
import usePermission from "../../hooks/usePermission";

interface Props {
  acceptedPermission: Permission;
}

function RoleProtectedRoute({ acceptedPermission }: Props) {
  const { permission } = usePermission();

  if (!permission) {
    return <SpinnerLoading />;
  }

  return permission.includes(acceptedPermission) ? (
    <Outlet />
  ) : (
    <Navigate to="/403page" replace />
  );
}

export default RoleProtectedRoute;
