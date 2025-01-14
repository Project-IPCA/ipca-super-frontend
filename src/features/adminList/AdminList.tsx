import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { AdminForm } from "../adminForm";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { fetchStaffs, getStaffs } from "../groupForm/redux/groupFormSlice";
import { AdminTable } from "../adminTable";

function AdminList() {
  const dispatch = useAppDispatch();
  const staffs = useAppSelector(getStaffs);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const initialized = useRef(false);

  const handleFormClose = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchStaffs());
    }
  }, [dispatch, initialized]);

  return (
    <>
      <AdminForm open={formOpen} onClose={handleFormClose} />
      <Typography variant="h3" className="pb-6">
        Admins
      </Typography>
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-0 items-center pb-4">
        <Button
          className="w-full sm:w-fit"
          size="md"
          onClick={() => setFormOpen(true)}
        >
          Add Admin
        </Button>
      </div>
      <AdminTable staffs={staffs} />
    </>
  );
}

export default AdminList;
