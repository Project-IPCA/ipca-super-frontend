import {
  Card,
  CardBody,
  Chip,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "../../../constants/constants";
import { getDashboardStatus, StatDeptScore } from "../redux/DashboardSlice";
import { useAppSelector } from "../../../hooks/store";

interface Props {
  statsDeptScore: StatDeptScore;
}

function AvgScoreDeptList({ statsDeptScore }: Props) {
  const { t, i18n } = useTranslation();
  const isFetching = useAppSelector(getDashboardStatus);
  const getProgressColor = (score: number) => {
    if (score >= statsDeptScore.max_range * 0.8) {
      return "green";
    } else if (score >= statsDeptScore.max_range * 0.4) {
      return "amber";
    } else {
      return "red";
    }
  };
  return (
    <Card className="border-[1px] h-full">
      <CardBody>
        <div className="flex items-center gap-x-1 pb-2">
          {isFetching ? (
            <Typography
              as="div"
              variant="h5"
              className="h-4 w-28 rounded-full bg-gray-300 mb-3"
            >
              &nbsp;
            </Typography>
          ) : (
            <>
              <Typography variant="h5" color="blue-gray">
                {t("feature.dashboard.list.depts")}
              </Typography>
              <Tooltip
                content={
                  <div>
                    {t("feature.dashboard.list.tooltip")}
                    {statsDeptScore.max_range})
                  </div>
                }
              >
                <InformationCircleIcon className="w-[20px] h-[20px] mt-[2px]" />
              </Tooltip>
            </>
          )}
        </div>
        {isFetching ? (
          <div className="divide-y-[1px] h-[18rem] ">
            {[...Array(4)].map((_, index) => (
              <div
                className="py-7 flex justify-between items-center "
                key={index}
              >
                <Typography
                  key={index}
                  as="div"
                  variant="paragraph"
                  className="h-3 w-full rounded-full bg-gray-300"
                >
                  &nbsp;
                </Typography>
              </div>
            ))}
          </div>
        ) : (
          <div className=" divide-y-[1px] h-[18rem] overflow-auto">
            {statsDeptScore.data.map((dept) => (
              <div
                className="flex justify-between items-center py-5"
                key={dept.dept_name_en}
              >
                <div className=" flex items-center gap-x-2">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  <Typography className="text-sm font-normal">
                    {i18n.language === LANGUAGE.th
                      ? dept.dept_name_th
                      : dept.dept_name_en}
                  </Typography>
                </div>
                <Chip
                  className="w-fit"
                  value={`${dept.score.toFixed(1)}/${statsDeptScore.max_range}`}
                  color={getProgressColor(dept.score)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default AvgScoreDeptList;
