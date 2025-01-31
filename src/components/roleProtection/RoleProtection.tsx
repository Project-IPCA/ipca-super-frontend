import { ReactNode } from "react";
import { Permission } from "../../constants/constants";
import { isAcceptedPermission } from "../../utils";
import usePermission from "../../hooks/usePermission";

interface Props {
  acceptedPermission: Permission[];
  children: ReactNode;
}
function RoleProtection({ acceptedPermission, children }: Props) {
  const { permission } = usePermission();

  return isAcceptedPermission(permission || [], acceptedPermission)
    ? children
    : null;
}

export default RoleProtection;
