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

function AdminList() {
  const dispatch = useAppDispatch();
  const staffs = useAppSelector(getStaffs);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [permFormOpen, setPermFormOpen] = useState<boolean>(false);
  const initialized = useRef(false);
  const { role } = usePermission();
  const { t } = useTranslation();

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handlePermFormOpen = () => {
    setPermFormOpen(!permFormOpen);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchStaffs());
    }
  }, [dispatch, initialized]);

  const isAccessFeat = () => {
    return role === ROLE.beyonder || role === ROLE.supervisor;
  };

  return (
    <>
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
      <AdminTable staffs={staffs} />
    </>
  );
}

export default AdminList;
