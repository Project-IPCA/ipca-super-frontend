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
import { useAppDispatch } from "../../hooks/store";
import { updateStudentCanSubmit } from "./redux/StudentPermissionFormSlice";
import { fetchGroupStudents } from "../groupStudents/redux/GroupStudentsSlice";
import { fetchStudentInfo } from "../studentDetail/redux/studentDetailSlice";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      showToast({
        variant: "success",
        message: "Permission has been updated.",
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
          {t("feature.stu_perm_form.title")}
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
          {t("feature.stu_perm_form.label")}
        </Typography>
        <div className="flex flex-col">
          <Radio
            name="allow-submit-perm"
            crossOrigin=""
            label={t("common.table.perm.allow")}
            defaultChecked
            onClick={() => setSubmitPerm(true)}
          />
          <Radio
            name="allow-submit-perm"
            crossOrigin=""
            label={t("common.table.perm.deny")}
            onClick={() => setSubmitPerm(false)}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="ml-auto" onClick={() => handleSubmit()}>
          {t("common.button.submit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default StudentPermissionForm;
