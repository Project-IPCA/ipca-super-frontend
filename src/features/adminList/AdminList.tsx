import { Button, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

function AdminList() {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  return (
    <>
      <Typography variant="h3" className="pb-6">
        Admins
      </Typography>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 items-center pb-4">
        <Button
          className="w-full sm:w-fit"
          size="md"
          onClick={() => setFormOpen(true)}
        >
          Add Admin
        </Button>
      </div>
    </>
  );
}

export default AdminList;
