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
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/store";
import { updateStudentCanSubmit } from "./redux/StudentPermissionFormSlice";
import { fetchGroupStudents } from "../groupStudents/redux/GroupStudentsSlice";
import { fetchStudentInfo } from "../studentDetail/redux/studentDetailSlice";

interface Props {
  open: boolean;
  handleClose: () => void;
  studentId: string;
  kmitlId: string;
  name: string;
  page: number;
  groupId: string;
}

function StudentPermissionForm({
  open,
  handleClose,
  studentId,
  kmitlId,
  name,
  groupId,
  page,
}: Props) {
  const dispatch = useAppDispatch();
  const [submitPerm, setSubmitPerm] = useState<boolean>(true);
  const handleSubmit = async () => {
    if (studentId) {
      await dispatch(
        updateStudentCanSubmit({
          studentId: studentId,
          canSubmit: submitPerm,
        }),
      );
      toast.success("Permission has been updated.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    if (groupId) {
      await dispatch(fetchGroupStudents({ groupId: groupId, page: page }));
      await dispatch(fetchStudentInfo(studentId));
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
          {`${name} (${kmitlId})`}
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
