import {
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Radio,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StudentData } from "../GroupStudents";
import { useState } from "react";
import { useAppDispatch } from "../../../hooks/store";
import {
  fetchGroupStudents,
  updateStudentCanSubmit,
} from "../redux/GroupStudentsSlice";
import { showToast } from "../../../utils/toast";

interface Props {
  open: boolean;
  handleClose: () => void;
  studentSelected: StudentData | null;
  page: number;
  groupId: string;
}

function StudentPermissionForm({
  open,
  studentSelected,
  handleClose,
  groupId,
  page,
}: Props) {
  const dispatch = useAppDispatch();
  const [submitPerm, setSubmitPerm] = useState<boolean>(true);
  const handleSubmit = async () => {
    if (studentSelected?.studentId) {
      await dispatch(
        updateStudentCanSubmit({
          studentId: studentSelected?.studentId,
          canSubmit: submitPerm,
        }),
      );
      showToast({
        variant: "success",
        message: "Permission has been updated.",
      });
    }
    if (groupId) {
      await dispatch(fetchGroupStudents({ groupId: groupId, page: page }));
    }
    handleClose();
  };
  return (
    <Dialog size="sm" open={open} handler={handleClose} className="p-4 ">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          Edit Permission
        </Typography>
        <Typography className="mt-1 font-normal text-gray-600">
          {`${studentSelected?.name} (${studentSelected?.kmitlId})`}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleClose}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6 max-h-[42rem] overflow-scroll">
        <Typography
          variant="small"
          color="blue-gray"
          className="mb-2 text-left font-medium"
        >
          Allow Submit Permission
        </Typography>
        <div className="flex flex-col">
          <Radio
            name="allow-submit-perm"
            crossOrigin=""
            label="Allow"
            defaultChecked
            onClick={() => setSubmitPerm(true)}
          />
          <Radio
            name="allow-submit-perm"
            crossOrigin=""
            label="Deny"
            onClick={() => setSubmitPerm(false)}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="ml-auto" onClick={() => handleSubmit()}>
          submit
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default StudentPermissionForm;
