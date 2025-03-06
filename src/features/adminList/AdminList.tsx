import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { AdminForm } from "../adminForm";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchStaffs, getStaffs } from "../groupForm/redux/groupFormSlice";
import { AdminTable } from "../adminTable";
import { useTranslation } from "react-i18next";
import ConfigurePermissionsForm from "./components/ConfigurePermissionsForm";
import usePermission from "../../hooks/usePermission";
import { ROLE } from "../../constants/constants";
import { ConfirmModal } from "../../components";
import {
  deleteAdmin,
  getSelectAdmin,
  restoreAdmin,
} from "./redux/AdminListSlice";
import { showToast } from "../../utils/toast";

function AdminList() {
  const dispatch = useAppDispatch();
  const staffs = useAppSelector(getStaffs);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [permFormOpen, setPermFormOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const selectAdmin = useAppSelector(getSelectAdmin);
  const isAdmin = selectAdmin?.isAdmin;
  const initialized = useRef(false);
  const { role } = usePermission();
  const { t } = useTranslation();

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handlePermFormOpen = () => {
    setPermFormOpen(!permFormOpen);
  };

  const handleAdminOpen = () => {
    setAdminOpen(!adminOpen);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchStaffs(role == ROLE.beyonder ? null : "1"));
    }
  }, [dispatch, initialized]);

  const isAccessFeat = () => {
    return role === ROLE.beyonder || role === ROLE.supervisor;
  };

  const isBeyonder = () => {
    return role === ROLE.beyonder;
  };

  const handleDeleteAdmin = async () => {
    if (selectAdmin.admin) {
      const resultAction = await dispatch(
        deleteAdmin(selectAdmin.admin.staff_id)
      );
      if (deleteAdmin.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Admin has been deleted.",
        });
      }
    }
    if (!isAdmin) {
      handleAdminOpen();
      dispatch(fetchStaffs(role == ROLE.beyonder ? null : "1"));
    }
  };

  const handleRestoreAdmin = async () => {
    if (selectAdmin.admin) {
      const resultAction = await dispatch(
        restoreAdmin(selectAdmin.admin.staff_id)
      );
      if (restoreAdmin.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Admin has been restored.",
        });
      }
    }
    if (!isAdmin) {
      handleAdminOpen();
      dispatch(fetchStaffs(role == ROLE.beyonder ? null : "1"));
    }
  };

  return (
    <>
      <ConfirmModal
        open={adminOpen}
        title={t(
          `feature.admin_list.action_modal.${
            selectAdmin.admin?.active == true ? "delete" : "restore"
          }.title`
        )}
        description={
          <>
            {t(
              `feature.admin_list.action_modal.${
                selectAdmin.admin?.active == true ? "delete" : "restore"
              }.msg1`
            )}{" "}
            <b>
              {selectAdmin.admin?.f_name} {selectAdmin.admin?.l_name}
            </b>
          </>
        }
        confirmLabel={t(
          `feature.admin_list.action_modal.${
            selectAdmin.admin?.active == true ? "delete" : "restore"
          }.confirm`
        )}
        type={selectAdmin.admin?.active ? "error" : "default"}
        handleClose={handleAdminOpen}
        handleSubmit={
          selectAdmin.admin?.active ? handleDeleteAdmin : handleRestoreAdmin
        }
        isFetching={isAdmin}
      />
      {isAccessFeat() && (
        <>
          <ConfigurePermissionsForm
            open={permFormOpen}
            handleOpen={handlePermFormOpen}
          />
          <AdminForm open={formOpen} onClose={handleFormClose} />
        </>
      )}
      <Typography variant="h3" className="pb-6">
        {t("feature.admin_list.title")}
      </Typography>
      {isAccessFeat() && (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-x-4 sm:gap-0 items-center pb-4">
            <div className="flex gap-x-2">
              <Button
                variant="outlined"
                size="md"
                onClick={() => handlePermFormOpen()}
              >
                {t("feature.admin_list.button.conf_perm")}
              </Button>
              <Button
                className="w-full sm:w-fit"
                size="md"
                onClick={() => setFormOpen(true)}
              >
                {t("feature.admin_list.button.add_admin")}
              </Button>
            </div>
          </div>
        </>
      )}
      <AdminTable
        staffs={staffs}
        showDeleteBtn={isBeyonder()}
        handleOpenAdmin={handleAdminOpen}
      />
    </>
  );
}

export default AdminList;
