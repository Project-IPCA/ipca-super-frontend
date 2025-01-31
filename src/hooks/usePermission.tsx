import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import {
  fetchMyPermissions,
  getMyPerm,
  getMyRole,
} from "../features/adminList/redux/AdminListSlice";

function usePermission() {
  const dispatch = useAppDispatch();
  const myPerms = useAppSelector(getMyPerm);
  const myRole = useAppSelector(getMyRole);

  useEffect(() => {
    if (!myPerms || !myRole) {
      dispatch(fetchMyPermissions());
    }
  }, [myPerms, dispatch]);

  return {
    permission: myPerms,
    role: myRole,
  };
}

export default usePermission;
