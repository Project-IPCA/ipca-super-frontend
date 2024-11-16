import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Switch,
  Typography,
} from "@material-tailwind/react";
import {
  GroupData,
  updateAllowGroupLogin,
  updateAllowGroupUploadProfile,
} from "../redux/groupExercisesSlice";
import InfoText from "./InfoText";
import { capitalize } from "lodash";
import {
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch } from "../../../hooks/store";

interface Props {
  groupData: GroupData | null;
}

function GroupSummary({ groupData }: Props) {
  const dispatch = useAppDispatch();
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${parseInt(hours, 10)}:${minutes}`;
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

  return (
    <div className="flex lg:flex-row flex-col gap-x-4 lg:gap-y-0 gap-y-3 w-full">
      <Card className="lg:w-1/3 w-full border-[1px] min-h-56">
        <CardBody className="space-y-2">
          <InfoText label={"Group Name"} value={groupData?.name} />
          <InfoText label={"Group No"} value={groupData?.group_no.toString()} />
          <div className="flex justify-start flex-wrap items-center gap-x-4">
            <InfoText label={"Year"} value={groupData?.year} />
            <InfoText label={"Semester"} value={groupData?.semester} />
          </div>
          <InfoText
            label={"Class Date"}
            value={`${capitalize(groupData?.day)}, ${formatTime(groupData?.time_start || "")} - ${formatTime(groupData?.time_end || "")}  `}
          />
          <InfoText
            label={"Instructor"}
            value={`${groupData?.instructor.f_name} ${groupData?.instructor.l_name}`}
          />
        </CardBody>
      </Card>
      <Card className="lg:w-1/3 w-full border-[1px] min-h-56">
        <CardBody className="space-y-2">
          <InfoText label={"Department"} value={groupData?.department} />
          <InfoText label={"All Student"} value={groupData?.student_amount} />
          <InfoText label={"Online Student"} value={20} />
        </CardBody>
        <CardFooter className="absolute bottom-0 w-full">
          <Button
            fullWidth
            className="flex justify-center items-center gap-3 w-full"
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
              <Typography className=" font-semibold text-center min-h-16">
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
              <Typography className="font-semibold text-center min-h-16">
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
  );
}

export default GroupSummary;
