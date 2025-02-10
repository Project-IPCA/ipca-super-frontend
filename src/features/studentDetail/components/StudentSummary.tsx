import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Typography,
} from "@material-tailwind/react";
import {
  deleteStudent,
  resetStudentPasword,
  StudentInfo,
} from "../redux/studentDetailSlice";
import { profileNone } from "../../../assets";
import { ConfirmModal, LabelValueText } from "../../../components";
import { capitalize } from "lodash";
import { useAppDispatch } from "../../../hooks/store";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { StudentPermissionForm } from "../../studentPermissionForm";
import { format } from "date-fns";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";

interface Props {
  studentInfo: StudentInfo | null;
  isFetching: boolean;
}

function StudentSummary({ studentInfo, isFetching }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReset, setOpenReset] = useState<boolean>(false);
  const [openPermForm, setOpenPermForm] = useState<boolean>(false);
  const { studentId } = useParams();

  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);
  const handleResetOpen = () => setOpenReset(true);
  const handleResetClose = () => setOpenReset(false);
  const handlePermFormOpen = () => setOpenPermForm(true);
  const handlePermFormClose = () => setOpenPermForm(false);

  const handleResetStudentPassword = async () => {
    if (studentId) {
      const resultAction = await dispatch(resetStudentPasword(studentId));
      if (resetStudentPasword.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: `Student password has been reset.`,
        });
      }
    }
    handleResetClose();
  };

  const handleDeleteStudent = async () => {
    if (studentId) {
      const resultAction = await dispatch(deleteStudent(studentId));
      if (deleteStudent.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Student has been deleted.",
        });
      }
    }
    handleDeleteClose();
    navigate(-1);
  };
  return (
    <>
      <ConfirmModal
        open={openDelete}
        title={t("feature.student_detail.modal.delete.title")}
        description={
          <>
            {t("feature.student_detail.modal.delete.msg1")}{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>
            {t("feature.student_detail.modal.delete.msg2")}
          </>
        }
        confirmLabel={t("feature.student_detail.modal.delete.confirm")}
        type="error"
        handleClose={handleDeleteClose}
        handleSubmit={handleDeleteStudent}
      />
      <ConfirmModal
        open={openReset}
        title={t("feature.student_detail.modal.reset_password.title")}
        description={
          <>
            {t("feature.student_detail.modal.reset_password.msg1")}{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>{" "}
            {t("feature.student_detail.modal.reset_password.msg2")}
          </>
        }
        confirmLabel={t("feature.student_detail.modal.reset_password.confirm")}
        type="error"
        handleClose={handleResetClose}
        handleSubmit={handleResetStudentPassword}
      />
      <StudentPermissionForm
        open={openPermForm}
        handleClose={handlePermFormClose}
        studentId={String(studentId)}
        kmitlId={studentInfo?.kmitl_id || ""}
        name={`${studentInfo?.f_name} ${studentInfo?.l_name}`}
        page={1}
        groupId={studentInfo?.group.group_id || ""}
      />
      <div className="flex lg:flex-row flex-col gap-x-4 lg:gap-y-0 gap-y-3 w-full">
        <Card className="border-[1px] lg:w-3/5 w-full relative">
          <CardBody className="flex md:flex-row flex-col items-center md:gap-y-0 gap-y-5 gap-x-6 ">
            {isFetching ? (
              <Typography
                as="div"
                className="w-[7.7rem] h-[7.7rem] rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
            ) : (
              <Avatar
                src={studentInfo?.avatar || profileNone}
                alt="avatar"
                className="h-[7.7rem] w-[7.7rem]"
              />
            )}

            <div
              className={` h-full ${isFetching ? "space-y-6" : "space-y-2"}`}
            >
              {isFetching ? (
                [...Array(4)].map((_, index) => (
                  <Typography
                    as="div"
                    variant="paragraph"
                    className={`h-2 ${index === 3 ? "w-72" : "w-80"} rounded-full bg-gray-300`}
                    key={index}
                  >
                    &nbsp;
                  </Typography>
                ))
              ) : (
                <>
                  <div className="flex justify-start flex-wrap items-center gap-x-4">
                    <LabelValueText
                      label={t("feature.student_detail.label.name")}
                      value={`${studentInfo?.f_name} ${studentInfo?.l_name}`}
                    />
                    <LabelValueText
                      label={t("feature.student_detail.label.stu_id")}
                      value={studentInfo?.kmitl_id}
                    />
                  </div>
                  <div className="flex justify-start flex-wrap items-center gap-x-4">
                    <LabelValueText
                      label={t("feature.student_detail.label.nickname")}
                      value={studentInfo?.nickname}
                    />
                    <LabelValueText
                      label={t("feature.student_detail.label.gender")}
                      value={capitalize(studentInfo?.gender)}
                    />
                  </div>
                  <LabelValueText
                    label={t("feature.student_detail.label.dob")}
                    value={
                      studentInfo?.dob
                        ? format(studentInfo.dob, "yyyy-MM-dd")
                        : ""
                    }
                  />
                  <div className="flex justify-start flex-wrap items-center gap-x-4">
                    <LabelValueText
                      label={t("feature.student_detail.label.tel")}
                      value={studentInfo?.tel}
                    />
                    <LabelValueText
                      label={t("feature.student_detail.label.email")}
                      value={capitalize(studentInfo?.email)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row gap-x-2 justify-evenly md:justify-end pt-0">
            <Button
              size="sm"
              variant="text"
              disabled={isFetching}
              color="red"
              onClick={() => handleDeleteOpen()}
            >
              {t("feature.student_detail.button.delete")}
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => handleResetOpen()}
              disabled={isFetching}
            >
              {t("feature.student_detail.button.reset_password")}
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-[1px]   lg:w-2/5 w-full">
          <CardBody
            className={`min-h-36 ${isFetching ? "space-y-6" : "space-y-2"}`}
          >
            {isFetching ? (
              [...Array(4)].map((_, index) => (
                <Typography
                  as="div"
                  variant="paragraph"
                  className={`h-2 ${index === 3 ? "w-3/4" : "w-full"} rounded-full bg-gray-300`}
                  key={index}
                >
                  &nbsp;
                </Typography>
              ))
            ) : (
              <>
                <LabelValueText
                  label={t("feature.student_detail.label.group_name")}
                  value={studentInfo?.group.name}
                />
                <LabelValueText
                  label={t("feature.student_detail.label.group_no")}
                  value={studentInfo?.group.number}
                />
                <div className="flex gap-2">
                  <Typography className="font-semibold" color="blue-gray">
                    {t("feature.student_detail.label.status")}
                  </Typography>
                  <Chip
                    variant="ghost"
                    color={studentInfo?.is_online ? "green" : "red"}
                    size="sm"
                    value={
                      studentInfo?.is_online
                        ? t("feature.student_detail.online")
                        : t("feature.student_detail.offline")
                    }
                    icon={
                      <span
                        className={`mx-auto mt-1 block h-2 w-2 rounded-full ${
                          studentInfo?.is_online
                            ? "bg-green-900 "
                            : "bg-red-500"
                        } content-['']`}
                      />
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Typography className="font-semibold" color="blue-gray">
                    {t("feature.student_detail.label.allow_submit")}
                  </Typography>
                  <Chip
                    variant="ghost"
                    color={studentInfo?.can_submit ? "green" : "red"}
                    size="sm"
                    value={
                      studentInfo?.can_submit
                        ? t("common.table.perm.allow")
                        : t("common.table.perm.deny")
                    }
                  />
                </div>
              </>
            )}
          </CardBody>
          <CardFooter
            className={`flex justify-center sm:justify-end pt-0 ${isFetching ? "mt-5" : ""}`}
          >
            <Button
              className="w-full sm:w-fit"
              size="sm"
              onClick={() => handlePermFormOpen()}
              disabled={isFetching}
            >
              {t("feature.student_detail.button.set_perm")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default StudentSummary;
