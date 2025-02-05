import { XMarkIcon } from "@heroicons/react/24/solid";
import { profileNone } from "../../../assets";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { StudentScore } from "../redux/groupDashboardSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../../hooks/usePermission";
import { useNavigate } from "react-router-dom";
import { STUDENT_ADMIN } from "../../../constants/constants";

interface Props {
  open: boolean;
  handleOpen: () => void;
  studentRanking: StudentScore[];
}

function StudentRankingModal({ open, handleOpen, studentRanking }: Props) {
  const { t } = useTranslation();
  const { permission } = usePermission();
  const navigate = useNavigate();

  return (
    <Dialog open={open} handler={handleOpen} className="p-4 !z-[500]">
      <DialogHeader className="relative m-0 block ">
        <Typography variant="h4" color="blue-gray">
          {t("feature.group_dashboard.list.ranking")}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={handleOpen}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className=" overflow-scroll lg:h-[42rem] h-[14rem]">
        <div className=" divide-y-[1px] ">
          {studentRanking.map((stu, index) => (
            <div
              className={`flex justify-between items-center ${index === 0 ? "pb-6" : "py-6"}`}
              key={stu.student.id}
            >
              <div className=" flex items-center gap-x-3">
                <Avatar
                  src={stu.student.profile || profileNone}
                  alt="avatar"
                  size="sm"
                />
                <Typography
                  className="text-sm font-bold hover:underline hover:decoration-[1px] cursor-pointer"
                  onClick={() => {
                    if (permission?.includes(STUDENT_ADMIN)) {
                      navigate(`/student/${stu.student.id}`);
                    }
                  }}
                >
                  {stu.student.kmitl_id}
                  {" - "}
                  {stu.student.firstname} {stu.student.lastname}{" "}
                  {stu.student.nickname ? " (" + stu.student.nickname + "" : ""}
                </Typography>
              </div>
              <Typography className="text-sm font-bold">{stu.score}</Typography>
            </div>
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default StudentRankingModal;
