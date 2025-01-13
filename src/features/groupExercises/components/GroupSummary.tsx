import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Switch,
  Typography,
} from "@material-tailwind/react";
import {
  deleteGroup,
  GroupData,
  logoutAllStudents,
  updateAllowGroupLogin,
  updateAllowGroupUploadProfile,
} from "../redux/groupExercisesSlice";
import { capitalize } from "lodash";
import {
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { ConfirmModal, LabelValueText } from "../../../components";
import {
  getGroupStudents,
  getOnlineStudents,
} from "../../groupStudents/redux/GroupStudentsSlice";
import { showToast } from "../../../utils/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  groupData: GroupData | null;
}

function GroupSummary({ groupData }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${parseInt(hours, 10)}:${minutes}`;
  };
  const groupStudent = useAppSelector(getGroupStudents);
  const onlineStudent = useAppSelector(getOnlineStudents);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);

  const handleLogoutAll = async () => {
    if (groupData?.group_id) {
      const resultAction = await dispatch(
        logoutAllStudents(groupData.group_id)
      );
      if (logoutAllStudents.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Successfully logout all students.",
        });
      }
    }
  };

  const onToggleAllowLogin = () => {
    if (groupData) {
      dispatch(
        updateAllowGroupLogin({
          groupId: groupData?.group_id,
          allow: !groupData?.allow_login,
        })
      );
    }
  };

  const onToggleAlloUploadProfile = () => {
    if (groupData) {
      dispatch(
        updateAllowGroupUploadProfile({
          groupId: groupData?.group_id,
          allow: !groupData?.allow_upload_profile,
        })
      );
    }
  };

  const onDeleteGroup = async () => {
    if (groupData) {
      const resultAction = await dispatch(deleteGroup(groupData.group_id));
      if (deleteGroup.fulfilled.match(resultAction)) {
        showToast({
          variant: "success",
          message: "Group has been deleted.",
        });
      }
      handleDeleteClose();
      navigate("/my-groups");
    }
  };

  return (
    <>
      <ConfirmModal
        open={openDelete}
        title="Delete Group?"
        description={
          <>
            Are you sure you want to delete group <b>{groupData?.name}</b>? This
            process cannot be undone.
          </>
        }
        confirmLabel="Delete"
        type="error"
        handleClose={handleDeleteClose}
        handleSubmit={onDeleteGroup}
      />
      <div className="flex lg:flex-row flex-col gap-x-4 lg:gap-y-0 gap-y-3 w-full">
        <Card className="lg:w-1/3 w-full border-[1px] min-h-56">
          <CardBody className="space-y-2">
            <LabelValueText label={"Group Name"} value={groupData?.name} />
            <LabelValueText
              label={"Group No"}
              value={groupData?.group_no.toString()}
            />
            <div className="flex justify-start flex-wrap items-center gap-x-4">
              <LabelValueText label={"Year"} value={groupData?.year} />
              <LabelValueText label={"Semester"} value={groupData?.semester} />
            </div>
            <LabelValueText
              label={"Class Date"}
              value={`${capitalize(groupData?.day)}, ${formatTime(
                groupData?.time_start || ""
              )} - ${formatTime(groupData?.time_end || "")}  `}
            />
            <LabelValueText
              label={"Instructor"}
              value={`${groupData?.instructor.f_name} ${groupData?.instructor.l_name}`}
            />
            <Button
              variant="outlined"
              color="red"
              onClick={() => handleDeleteOpen()}
              className="w-full"
            >
              delete group
            </Button>
          </CardBody>
        </Card>
        <Card className="lg:w-1/3 w-full border-[1px] min-h-56">
          <CardBody className="space-y-2">
            <LabelValueText
              label={"Department"}
              value={groupData?.department}
            />
            <LabelValueText
              label={"All Student"}
              value={groupStudent.total_student}
            />
            <LabelValueText
              label={"Online Student"}
              value={onlineStudent.length}
            />
          </CardBody>
          <CardFooter className="absolute bottom-0 w-full">
            <Button
              fullWidth
              className="flex justify-center items-center gap-3 w-full"
              onClick={() => handleLogoutAll()}
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              Log out all
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:w-1/3 w-full border-[1px] min-h-56">
          <CardBody className="h-full">
            <div className="flex h-full ">
              <div className="w-full h-full flex flex-col justify-center items-center border-r-[1px] p-3">
                <div className="w-16 h-16 flex justify-center items-center pb-3">
                  <LockClosedIcon className="w-14 h-14" />
                </div>
                <Typography
                  className=" font-semibold text-center min-h-16"
                  color="blue-gray"
                >
                  Allow login
                </Typography>
                <Switch
                  crossOrigin=""
                  color="green"
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  containerProps={{
                    className: "w-11 h-6",
                  }}
                  onClick={() => onToggleAllowLogin()}
                  circleProps={{
                    className: "before:hidden left-0.5 border-none",
                  }}
                  defaultChecked={groupData?.allow_login}
                />
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center p-3">
                <div className="w-16 h-16 flex justify-center items-center pb-3">
                  <PhotoIcon />
                </div>
                <Typography
                  className="font-semibold text-center min-h-16"
                  color="blue-gray"
                >
                  Allow upload profile picture
                </Typography>
                <Switch
                  crossOrigin=""
                  color="green"
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  onClick={() => onToggleAlloUploadProfile()}
                  containerProps={{
                    className: "w-11 h-6",
                  }}
                  circleProps={{
                    className: "before:hidden left-0.5 border-none",
                  }}
                  defaultChecked={groupData?.allow_upload_profile}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default GroupSummary;
