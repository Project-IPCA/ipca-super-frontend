import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogFooter,
  IconButton,
  DialogHeader,
} from "@material-tailwind/react";
import RolePermissionsTable from "./RolePermissionsTable";
import { useEffect, useRef, useState } from "react";
import { ROLE } from "../../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  clearAdminListError,
  fetchRolePermission,
  getRolePermission,
  getRolePermissionError,
  getUpdatePermStatus,
  RolePermission,
  updateRolePermission,
} from "../redux/AdminListSlice";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  handleOpen: () => void;
}

function ConfigurePermissionsForm({ open, handleOpen }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const error = useAppSelector(getRolePermissionError);
  const rolePermissions = useAppSelector(getRolePermission);
  const initialized = useRef(false);
  const isFetching = useAppSelector(getUpdatePermStatus);

  const [formData, setFormData] = useState<RolePermission[]>([
    {
      role: ROLE.ta,
      permission: [],
    },
    {
      role: ROLE.executive,
      permission: [],
    },
  ]);

  const [tempFormData, setTempFormData] = useState<RolePermission[]>([
    {
      role: ROLE.ta,
      permission: [],
    },
    {
      role: ROLE.executive,
      permission: [],
    },
  ]);

  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      setFormData(rolePermissions);
      setTempFormData(rolePermissions);
    }
  }, [rolePermissions, setFormData]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(tempFormData));
  }, [formData, tempFormData]);

  const handleSetRolePermissions = (role: string, perm: string) => {
    const selectedRoleIdx = formData.findIndex((r) => r.role === role);
    let permissions = formData[selectedRoleIdx].permission;
    if (permissions.includes(perm)) {
      setFormData((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[selectedRoleIdx] = {
          ...updatedFormData[selectedRoleIdx],
          permission: permissions.filter((p) => p !== perm),
        };
        return updatedFormData;
      });
    } else {
      permissions = [...permissions, perm];
      setFormData((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[selectedRoleIdx] = {
          ...updatedFormData[selectedRoleIdx],
          permission: permissions,
        };
        return updatedFormData;
      });
    }
  };

  const onSubmit = async () => {
    const resultAction = await dispatch(updateRolePermission(formData));
    if (updateRolePermission.fulfilled.match(resultAction)) {
      showToast({
        variant: "success",
        message: "Role permission has updated.",
      });
    }
    dispatch(fetchRolePermission());
  };

  useEffect(() => {
    if (error) {
      showToast({
        variant: "error",
        message: error.error,
      });
      dispatch(clearAdminListError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchRolePermission());
    }
  }, [dispatch, initialized]);

  return (
    <Dialog size="xl" open={open} handler={handleOpen} className="p-4">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          {t("feature.admin_list.modal.title")}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={() => {
            handleOpen();
          }}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>

      <DialogBody>
        <RolePermissionsTable
          handleSetRolePermissions={handleSetRolePermissions}
          rolePermissions={rolePermissions}
        />
      </DialogBody>

      <DialogFooter>
        <Button
          className="ml-auto"
          onClick={() => onSubmit()}
          disabled={!isDirty}
          loading={isFetching}
        >
          {t("common.button.submit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ConfigurePermissionsForm;
