import { Chip, Typography } from "@material-tailwind/react";
import { ALLOW_TYPE } from "../../../constants/constants";
import { formatDateTime } from "../../../utils";
import { DATE_COMPARE } from "../constants";

interface Props {
  dateStatus: string;
  dateTime: string;
}

function DateTimeChip({ dateStatus, dateTime }: Props) {
  return (
    <div className="flex items-center gap-x-2">
      <Chip
        className="w-fit h-fit"
        variant="ghost"
        color={dateStatus === DATE_COMPARE.before ? "red" : "green"}
        size="sm"
        value={
          dateStatus === DATE_COMPARE.before
            ? ALLOW_TYPE.deny
            : ALLOW_TYPE.always
        }
      />
      <div>
        <Typography color="blue-gray" className="font-normal text-xs">
          {dateStatus === DATE_COMPARE.before ? "Start date" : "End date"}
        </Typography>
        <Typography color="blue-gray" className="font-normal text-xs">
          {formatDateTime(dateTime)}
        </Typography>
      </div>
    </div>
  );
}

export default DateTimeChip;
