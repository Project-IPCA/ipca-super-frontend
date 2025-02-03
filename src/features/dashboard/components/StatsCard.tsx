import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
}

function StatsCard({ icon, label, value }: Props) {
  return (
    <Card className="border-[1px]">
      <CardBody>
        <div className="w-7 h-7 mb-3">{icon}</div>
        <Typography variant="h4">{value}</Typography>
        <Typography className="font-normal text-sm">{label}</Typography>
      </CardBody>
    </Card>
  );
}

export default StatsCard;
