import { Radio, Card, CardBody, Typography } from "@material-tailwind/react";
import { TABS_VALUE, TIME_RANGE } from "../constants";
import { ALLOW_TYPE } from "../../../constants/constants";
import TimerPicker from "./TimePicker";
import DateTimePicker from "./DateTimePicker";

interface Props {
  handleChangePerm: (
    tab: string | null,
    type: string,
    timeDuration: number | null,
  ) => void;
  handleChangePermDateTime: (
    tab: string | null,
    timeRange: string,
    time: Date,
  ) => void;
  permissionType: string;
  tab: string | null;
}

function SinglePermission({
  permissionType,
  handleChangePerm,
  handleChangePermDateTime,
  tab,
}: Props) {
  return (
    <div className="pb-2">
      <Typography
        variant="small"
        color="blue-gray"
        className="mb-2 text-left font-medium"
      >
        {tab === TABS_VALUE.accessExercise
          ? "Access Exercise Permission"
          : "Allow Submit Permission"}
      </Typography>
      <div className="flex flex-col gap-2">
        <Radio
          name={tab || "perm-type"}
          crossOrigin=""
          label="Always"
          defaultChecked
          onClick={() => handleChangePerm(tab, ALLOW_TYPE.always, null)}
        />
        <Radio
          name={tab || "perm-type"}
          crossOrigin=""
          label="Set timer"
          onClick={() => handleChangePerm(tab, ALLOW_TYPE.timer, null)}
        />
        {permissionType === ALLOW_TYPE.timer ? (
          <TimerPicker tab={tab} handleChangePerm={handleChangePerm} />
        ) : null}
        <Radio
          name={tab || "perm-type"}
          crossOrigin=""
          label="Set date and time"
          onClick={() => handleChangePerm(tab, ALLOW_TYPE.dateTime, null)}
        />
        {permissionType === ALLOW_TYPE.dateTime ? (
          <Card className="border-[1px] shadow-none">
            <CardBody className="flex gap-x-3">
              <DateTimePicker
                tab={tab}
                handleChangePermDateTime={handleChangePermDateTime}
                timeRange={TIME_RANGE.timeStart}
              />
              <DateTimePicker
                tab={tab}
                handleChangePermDateTime={handleChangePermDateTime}
                timeRange={TIME_RANGE.timeEnd}
              />
            </CardBody>
          </Card>
        ) : null}
        <Radio
          name={tab || "perm-type"}
          crossOrigin=""
          label="Deny"
          onClick={() => handleChangePerm(tab, ALLOW_TYPE.deny, null)}
        />
      </div>
    </div>
  );
}

export default SinglePermission;