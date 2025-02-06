import {
  Avatar,
  Button,
  Card,
  CardBody,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { StudentScore } from "../redux/groupDashboardSlice";
import { profileNone } from "../../../assets";
import { useState } from "react";
import StudentRankingModal from "./StudentRankingModal";
import usePermission from "../../../hooks/usePermission";
import { STUDENT_ADMIN } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";

interface Props {
  studentRanking: StudentScore[];
}

function StudentRankingList({ studentRanking }: Props) {
  const { t } = useTranslation();
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const { permission } = usePermission();
  const navigate = useNavigate();

  const handleToggleSeeAll = () => setSeeAll(!seeAll);

  return (
    <>
      <StudentRankingModal
        open={seeAll}
        handleOpen={handleToggleSeeAll}
        studentRanking={studentRanking}
      />
      <Card className="border-[1px] h-full">
        <CardBody>
          <div className="flex justify-between items-center">
            <Typography variant="h5" color="blue-gray">
              {t("feature.group_dashboard.list.ranking")}
            </Typography>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handleToggleSeeAll()}
            >
              {t("feature.group_dashboard.list.see_all")}
            </Button>
          </div>
          {studentRanking.length > 0 ? (
            <div className=" divide-y-[1px] h-[18rem] overflow-auto">
              {studentRanking.slice(0, 10).map((stu, index) => (
                <div
                  className="flex justify-between items-center py-5"
                  key={stu.student.id}
                >
                  <div className=" flex items-center gap-x-3">
                    <Typography className=" font-bold">{index + 1}</Typography>
                    <Avatar
                      src={stu.student.profile || profileNone}
                      alt="avatar"
                      size="sm"
                    />
                    <Tooltip
                      content={`${stu.student.firstname} ${stu.student.lastname} ${stu.student.nickname ? " (" + stu.student.nickname + "" : ""}`}
                    >
                      <Typography
                        className={`text-sm font-bold ${permission?.includes(STUDENT_ADMIN) ? "hover:underline hover:decoration-[1px] cursor-pointer" : ""}`}
                        onClick={() => {
                          if (permission?.includes(STUDENT_ADMIN)) {
                            navigate(`/student/${stu.student.id}`);
                          }
                        }}
                      >
                        {stu.student.kmitl_id}
                      </Typography>
                    </Tooltip>
                  </div>
                  <Typography className="text-sm font-bold">
                    {stu.score}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[18rem] flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-y-3">
                <ArchiveBoxIcon className="w-10 h-10" />
                <div className="space-y-1">
                  <Typography className="text-center font-bold">
                    {t("feature.group_dashboard.list.no_student_msg1")}
                  </Typography>
                  <Typography className="text-center text-xs font-normal">
                    {t("feature.group_dashboard.list.no_student_msg2")}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default StudentRankingList;
