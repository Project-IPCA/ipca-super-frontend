import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: number;
}

function StatsCard({ icon, label, value }: Props) {
  return (
    <Card className="border-[1px] h-40">
      <CardBody className="flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <div>
            <Typography variant="h5" color="blue-gray" className="pb-[0.25rem]">
              {label}
            </Typography>
            <Typography variant="h4" color="blue-gray">
              {value.toLocaleString()}
            </Typography>
          </div>
          <div className="w-8 h-8 mb-3 text-blue-gray-900">{icon}</div>
        </div>
        <div>
          <Typography>hello</Typography>
        </div>
      </CardBody>
    </Card>
  );
}

export default StatsCard;
