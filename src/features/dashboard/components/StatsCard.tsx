import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ReactNode } from "react";
import { useAppSelector } from "../../../hooks/store";
import { getDashboardStatus } from "../redux/DashboardSlice";

interface Props {
  icon: ReactNode;
  label: string;
  value: number;
}

function StatsCard({ icon, label, value }: Props) {
  const isFetching = useAppSelector(getDashboardStatus);
  return (
    <Card className="border-[1px]">
      <CardBody className="flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <div>
            {isFetching ? (
              <Typography
                as="div"
                variant="h5"
                className="h-4 w-24 rounded-full bg-gray-300 mb-3"
              >
                &nbsp;
              </Typography>
            ) : (
              <Typography
                variant="h5"
                color="blue-gray"
                className="pb-[0.25rem]"
              >
                {label}
              </Typography>
            )}
            {isFetching ? (
              <Typography
                as="div"
                variant="h4"
                className="h-4 w-12 rounded-full bg-gray-300 mb-3"
              >
                &nbsp;
              </Typography>
            ) : (
              <Typography variant="h4" color="blue-gray">
                {value?.toLocaleString?.() || ""}
              </Typography>
            )}
          </div>
          {isFetching ? (
            <Typography
              as="div"
              className=" w-8 h-8 rounded-full bg-gray-300 mb-3"
            >
              &nbsp;
            </Typography>
          ) : (
            <div className="w-8 h-8 mb-3 text-blue-gray-900">{icon}</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default StatsCard;
