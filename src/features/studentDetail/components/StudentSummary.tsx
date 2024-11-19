import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { StudentInfo } from "../redux/studentDetailSlice";
import { profileNone } from "../../../assets";
import { LabelValueText } from "../../../components";
import { capitalize } from "lodash";

interface Props {
  studentInfo: StudentInfo | null;
}

function StudentSummary({ studentInfo }: Props) {
  return (
    <div className="flex lg:flex-row flex-col gap-x-4 lg:gap-y-0 gap-y-3 w-full">
      <Card className="border-[1px] w-3/5 relative">
        <CardBody className="flex gap-x-6 ">
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
              <LabelValueText label="Nickname" value={studentInfo?.nickname} />
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
          <Button size="sm" variant="text" color="red">
            Delete Student
          </Button>
          <Button size="sm" variant="outlined" color="orange">
            Reset Password
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-[1px]   w-2/5">
        <CardBody className="min-h-36 space-y-2">
          <LabelValueText label="Group Name" value={studentInfo?.group.name} />
          <LabelValueText label="Group No" value={studentInfo?.group.number} />
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
          <Button size="sm">Set Permission</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default StudentSummary;
