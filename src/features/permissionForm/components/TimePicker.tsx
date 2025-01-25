import {
  Typography,
  Option,
  Card,
  CardBody,
  Select,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { ALLOW_TYPE } from "../../../constants/constants";
import { parseInt } from "lodash";
import { useTranslation } from "react-i18next";

interface Timer {
  hour: string;
  minute: string;
  second: string;
}

interface Props {
  tab: string | null;
  handleChangePerm: (
    tab: string | null,
    type: string,
    timeDuration: number | null,
  ) => void;
}

function TimerPicker({ tab, handleChangePerm }: Props) {
  const { t } = useTranslation();
  const [timer, setTimer] = useState<Timer>({
    hour: "00",
    minute: "00",
    second: "00",
  });

  useEffect(() => {
    const durations =
      parseInt(timer.hour) * 3600 +
      parseInt(timer.minute) * 60 +
      parseInt(timer.second);
    handleChangePerm(tab, ALLOW_TYPE.timer, durations);
  }, [timer]);
  return (
    <Card className="border-[1px] shadow-none">
      <CardBody className="flex justify-evenly">
        <div className="flex  items-center gap-x-2">
          <div className="w-16">
            <Select
              variant="outlined"
              color="gray"
              label={t("feature.perm_form.set_timer.hour")}
              size="lg"
              value={timer.hour}
              onChange={(val) => {
                if (val) {
                  setTimer((prevTimer) => ({
                    ...prevTimer,
                    hour: val,
                  }));
                }
              }}
              containerProps={{
                className: "!min-w-16 ",
              }}
              arrow={false}
              menuProps={{
                className: "h-32",
              }}
            >
              {Array.from({ length: 24 }, (_, index) =>
                index.toString().padStart(2, "0"),
              ).map((hour) => (
                <Option key={hour} value={hour}>
                  {hour}
                </Option>
              ))}
            </Select>
          </div>
          <Typography>:</Typography>
          <div className="w-16">
            <Select
              variant="outlined"
              color="gray"
              label={t("feature.perm_form.set_timer.min")}
              size="lg"
              value={timer.minute}
              containerProps={{
                className: "!min-w-16 ",
              }}
              onChange={(val) => {
                if (val) {
                  setTimer((prevTimer) => ({
                    ...prevTimer,
                    minute: val,
                  }));
                }
              }}
              arrow={false}
              menuProps={{
                className: "h-32",
              }}
            >
              {Array.from({ length: 60 }, (_, index) =>
                index.toString().padStart(2, "0"),
              ).map((min) => (
                <Option key={min} value={min}>
                  {min}
                </Option>
              ))}
            </Select>
          </div>
          <Typography>:</Typography>
          <div className="w-16">
            <Select
              variant="outlined"
              color="gray"
              label={t("feature.perm_form.set_timer.min")}
              size="lg"
              value={timer.second}
              containerProps={{
                className: "!min-w-16 ",
              }}
              onChange={(val) => {
                if (val) {
                  setTimer((prevTimer) => ({
                    ...prevTimer,
                    second: val,
                  }));
                }
              }}
              arrow={false}
              menuProps={{
                className: "h-32",
              }}
            >
              {Array.from({ length: 60 }, (_, index) =>
                index.toString().padStart(2, "0"),
              ).map((sec) => (
                <Option key={sec} value={sec}>
                  {sec}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setTimer({
                hour: "00",
                minute: "05",
                second: "00",
              })
            }
          >
            {t("feature.perm_form.set_timer.button.add")} 5{" "}
            {t("feature.perm_form.set_timer.button.min")}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setTimer({
                hour: "00",
                minute: "30",
                second: "00",
              })
            }
          >
            {t("feature.perm_form.set_timer.button.add")} 30{" "}
            {t("feature.perm_form.set_timer.button.min")}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() =>
              setTimer({
                hour: "03",
                minute: "00",
                second: "00",
              })
            }
          >
            {t("feature.perm_form.set_timer.button.add")} 3{" "}
            {t("feature.perm_form.set_timer.button.hour")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default TimerPicker;
