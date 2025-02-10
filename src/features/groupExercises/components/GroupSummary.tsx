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
  getGroupStudentsStatus,
  getOnlineStudents,
} from "../../groupStudents/redux/GroupStudentsSlice";
import { showToast } from "../../../utils/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GROUP_ADMIN, LANGUAGE, ROLE } from "../../../constants/constants";
import RoleProtection from "../../../components/roleProtection/RoleProtection";
import usePermission from "../../../hooks/usePermission";
import {
  fetchProfile,
  getProfileStatus,
  getUserId,
} from "../../profileForm/redux/profileFormSlice";

interface Props {
  groupData: GroupData | null;
}

function GroupSummary({ groupData }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { role, permission } = usePermission();
  const userId = useAppSelector(getUserId);
  const userIdFetching = useAppSelector(getProfileStatus);
  const navigate = useNavigate();
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${parseInt(hours, 10)}:${minutes}`;
  };
  const groupStudent = useAppSelector(getGroupStudents);
  const groupStudentFetching = useAppSelector(getGroupStudentsStatus);
  const onlineStudent = useAppSelector(getOnlineStudents);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);
  const isFetching = userIdFetching || groupStudentFetching;

  useEffect(() => {
    if (!userId) {
      dispatch(fetchProfile());
    }
  }, [userId, dispatch]);

  const handleLogoutAll = async () => {
    if (groupData?.group_id) {
      const resultAction = await dispatch(
        logoutAllStudents(groupData.group_id),
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
        }),
      );
    }
  };

  const onToggleAlloUploadProfile = () => {
    if (groupData) {
      dispatch(
        updateAllowGroupUploadProfile({
          groupId: groupData?.group_id,
          allow: !groupData?.allow_upload_profile,
        }),
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
        title={t("feature.group_exercises.modal.delete.title")}
        description={
          <>
            {t("feature.group_exercises.modal.delete.msg1")}{" "}
            <b>{groupData?.name}</b>
            {i18n.language === LANGUAGE.en ? "?" : ""}{" "}
            {t("feature.group_exercises.modal.delete.msg2")}
          </>
        }
        confirmLabel={t("common.button.delete")}
        type="error"
        handleClose={handleDeleteClose}
        handleSubmit={onDeleteGroup}
      />
      <div className="flex lg:flex-row flex-col gap-x-4 lg:gap-y-0 gap-y-3 w-full">
        <Card className=" w-full border-[1px] min-h-56">
          <CardBody className={` ${isFetching ? "space-y-6" : "space-y-2"}`}>
            {isFetching ? (
              [...Array(5)].map((_, index) => (
                <Typography
                  as="div"
                  variant="paragraph"
                  className={`h-2 ${index === 4 ? "w-3/4" : "w-full"} rounded-full bg-gray-300`}
                  key={index}
                >
                  &nbsp;
                </Typography>
              ))
            ) : (
              <>
                <LabelValueText
                  label={t("feature.group_exercises.label.group_name")}
                  value={groupData?.name}
                />
                <LabelValueText
                  label={t("feature.group_exercises.label.group_no")}
                  value={groupData?.group_no.toString()}
                />
                <div className="flex justify-start flex-wrap items-center gap-x-4">
                  <LabelValueText
                    label={t("feature.group_exercises.label.year")}
                    value={groupData?.year}
                  />
                  <LabelValueText
                    label={t("feature.group_exercises.label.semester")}
                    value={groupData?.semester}
                  />
                </div>
                <LabelValueText
                  label={t("feature.group_exercises.label.class_date")}
                  value={`${capitalize(groupData?.day)}, ${formatTime(
                    groupData?.time_start || "",
                  )} - ${formatTime(groupData?.time_end || "")}  `}
                />
                <LabelValueText
                  label={t("feature.group_exercises.label.instructor")}
                  value={`${groupData?.instructor.f_name} ${groupData?.instructor.l_name}`}
                />
                {(userId === groupData?.instructor.supervisor_id ||
                  role === ROLE.beyonder) && (
                  <Button
                    variant="outlined"
                    color="red"
                    onClick={() => handleDeleteOpen()}
                    disabled={isFetching}
                    className="w-full"
                  >
                    {t("feature.group_exercises.button.delete_group")}
                  </Button>
                )}
              </>
            )}
          </CardBody>
        </Card>
        <Card className=" w-full border-[1px] min-h-56">
          <CardBody className={isFetching ? "space-y-6" : "space-y-2"}>
            {isFetching ? (
              [...Array(3)].map((_, index) => (
                <Typography
                  as="div"
                  variant="paragraph"
                  className={`h-2 ${index === 4 ? "w-3/4" : "w-full"} rounded-full bg-gray-300`}
                  key={index}
                >
                  &nbsp;
                </Typography>
              ))
            ) : (
              <>
                <LabelValueText
                  label={t("feature.group_exercises.label.dept")}
                  value={
                    i18n.language === LANGUAGE.th
                      ? groupData?.department.name_th
                      : groupData?.department.name_en
                  }
                />
                <LabelValueText
                  label={t("feature.group_exercises.label.all_stu")}
                  value={groupStudent.total_student}
                />
                <LabelValueText
                  label={t("feature.group_exercises.label.online_stu")}
                  value={onlineStudent.length}
                />
              </>
            )}
          </CardBody>
          <CardFooter className="absolute bottom-0 w-full">
            <RoleProtection acceptedPermission={[GROUP_ADMIN]}>
              {!isFetching && (
                <Button
                  fullWidth
                  className="flex justify-center items-center gap-3 w-full"
                  onClick={() => handleLogoutAll()}
                >
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                  {t("feature.group_exercises.button.logout_all")}
                </Button>
              )}
            </RoleProtection>
          </CardFooter>
        </Card>
        <Card className=" w-full border-[1px] min-h-56">
          <CardBody className="h-full">
            <div className="flex h-full ">
              <div className="w-full h-full flex flex-col justify-center items-center border-r-[1px] p-3">
                <div className="w-16 h-16 flex justify-center items-center pb-3">
                  {isFetching ? (
                    <Typography
                      as="div"
                      className={`h-14 w-14  rounded-full bg-gray-300`}
                    >
                      &nbsp;
                    </Typography>
                  ) : (
                    <LockClosedIcon className="w-14 h-14" />
                  )}
                </div>
                {isFetching ? (
                  <div className="min-h-16">
                    <Typography
                      as="div"
                      className={`h-3 w-20 rounded-full bg-gray-300`}
                    >
                      &nbsp;
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    className=" font-semibold text-center min-h-16"
                    color="blue-gray"
                  >
                    {t("feature.group_exercises.label.allow_login")}
                  </Typography>
                )}
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
                  disabled={!permission?.includes(GROUP_ADMIN) || isFetching}
                />
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center p-3">
                <div className="w-16 h-16 flex justify-center items-center pb-3">
                  {isFetching ? (
                    <Typography
                      as="div"
                      className={`h-14 w-14  rounded-full bg-gray-300`}
                    >
                      &nbsp;
                    </Typography>
                  ) : (
                    <PhotoIcon />
                  )}
                </div>
                {isFetching ? (
                  <div className="min-h-16">
                    <Typography
                      as="div"
                      className={`h-3 w-20 rounded-full bg-gray-300`}
                    >
                      &nbsp;
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    className="font-semibold text-center min-h-16"
                    color="blue-gray"
                  >
                    {t("feature.group_exercises.label.allow_profile")}
                  </Typography>
                )}
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
                  disabled={!permission?.includes(GROUP_ADMIN) || isFetching}
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
