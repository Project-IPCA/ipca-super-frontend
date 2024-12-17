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
import { Bounce, toast } from "react-toastify";
import { useState } from "react";
import { StudentPermissionForm } from "../../studentPermissionForm";

interface Props {
  studentInfo: StudentInfo | null;
}

function StudentSummary({ studentInfo }: Props) {
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
        toast.success(`Student password has been reset.`, {
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
    }
    handleResetClose();
  };

  const handleDeleteStudent = async () => {
    if (studentId) {
      const resultAction = await dispatch(deleteStudent(studentId));
      if (deleteStudent.fulfilled.match(resultAction)) {
        toast.success("Student has been deleted.", {
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
    }
    handleDeleteClose();
    navigate(-1);
  };
  return (
    <>
      <ConfirmModal
        open={openDelete}
        title="Delete Student?"
        description={
          <>
            Are you sure you want to delete student{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>
            ? This process cannot be undone.
          </>
        }
        confirmLabel="Delete"
        type="error"
        handleClose={handleDeleteClose}
        handleSubmit={handleDeleteStudent}
      />
      <ConfirmModal
        open={openReset}
        title="Reset Student Password?"
        description={
          <>
            Are you sure you want to reset student{" "}
            <b>
              {studentInfo?.f_name} {studentInfo?.l_name} (
              {studentInfo?.kmitl_id})
            </b>{" "}
            password to default ? This process cannot be undone.
          </>
        }
        confirmLabel="Reset"
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
          <CardBody className="flex md:flex-row flex-col md:gap-y-0 gap-y-5 gap-x-6 ">
            <Avatar
              src={studentInfo?.avatar || profileNone}
              alt="avatar"
              className="h-[7.7rem] w-[7.7rem]"
            />
            <div className="h-full space-y-2">
              <div className="flex justify-start flex-wrap items-center gap-x-4">
                <LabelValueText
                  label="Name"
                  value={`${studentInfo?.f_name} ${studentInfo?.l_name}`}
                />
                <LabelValueText
                  label="Student ID"
                  value={studentInfo?.kmitl_id}
                />
              </div>
              <div className="flex justify-start flex-wrap items-center gap-x-4">
                <LabelValueText
                  label="Nickname"
                  value={studentInfo?.nickname}
                />
                <LabelValueText
                  label="Gender"
                  value={capitalize(studentInfo?.gender)}
                />
              </div>
              <LabelValueText label="Date of Birth" value={studentInfo?.dob} />
              <div className="flex justify-start flex-wrap items-center gap-x-4">
                <LabelValueText label="Tel" value={studentInfo?.tel} />
                <LabelValueText
                  label="Email"
                  value={capitalize(studentInfo?.email)}
                />
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex gap-x-2 justify-end pt-0">
            <Button
              size="sm"
              variant="text"
              color="red"
              onClick={() => handleDeleteOpen()}
            >
              Delete Student
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => handleResetOpen()}
            >
              Reset Password
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-[1px]   lg:w-2/5 w-full">
          <CardBody className="min-h-36 space-y-2">
            <LabelValueText
              label="Group Name"
              value={studentInfo?.group.name}
            />
            <LabelValueText
              label="Group No"
              value={studentInfo?.group.number}
            />
            <div className="flex gap-2">
              <Typography className="font-semibold" color="blue-gray">
                Status
              </Typography>
              <Chip
                variant="ghost"
                color={studentInfo?.is_online ? "green" : "red"}
                size="sm"
                value={studentInfo?.is_online ? "Online" : "Ofline"}
                icon={
                  <span
                    className={`mx-auto mt-1 block h-2 w-2 rounded-full ${studentInfo?.is_online ? "bg-green-900 " : "bg-red-500"} content-['']`}
                  />
                }
              />
            </div>
            <div className="flex gap-2">
              <Typography className="font-semibold" color="blue-gray">
                Allow Submit
              </Typography>
              <Chip
                variant="ghost"
                color={studentInfo?.can_submit ? "green" : "red"}
                size="sm"
                value={studentInfo?.can_submit ? "Allow" : "Deny"}
              />
            </div>
          </CardBody>
          <CardFooter className="flex justify-end pt-0">
            <Button size="sm" onClick={() => handlePermFormOpen()}>
              Set Permission
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default StudentSummary;
