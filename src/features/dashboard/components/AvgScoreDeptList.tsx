import {
  Card,
  CardBody,
  Progress,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { mockDeptAvgScore } from "../constants";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "../../../constants/constants";

function AvgScoreDeptList() {
  const { t, i18n } = useTranslation();
  const getProgressColor = (score: number) => {
    if (score >= 8) {
      return "green";
    } else if (score >= 6) {
      return "amber";
    } else {
      return "red";
    }
  };
  return (
    <Card className="border-[1px] h-full">
      <CardBody>
        <div className="flex items-center gap-x-1 pb-2">
          <Typography variant="h5" color="blue-gray">
            {t("feature.dashboard.list.depts")}
          </Typography>
          <Tooltip content={<div>{t("feature.dashboard.list.tooltip")}</div>}>
            <InformationCircleIcon className="w-[20px] h-[20px] mt-[2px]" />
          </Tooltip>
        </div>
        <div className=" divide-y-[1px] h-[18rem] overflow-auto">
          {mockDeptAvgScore.map((dept) => (
            <div className="grid grid-cols-8 py-5">
              <div className="col-span-4 flex items-center gap-x-2">
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                <Typography className="text-sm font-normal">
                  {i18n.language === LANGUAGE.th
                    ? dept.dept_name_th
                    : dept.dept_name_en}
                </Typography>
              </div>
              <div className="col-span-3 px-3 flex items-center">
                <Progress
                  value={dept.score * 10}
                  variant="filled"
                  size="sm"
                  color={getProgressColor(dept.score)}
                />
              </div>
              <Typography className="text-sm col-span-1">
                {dept.score}
              </Typography>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default AvgScoreDeptList;
