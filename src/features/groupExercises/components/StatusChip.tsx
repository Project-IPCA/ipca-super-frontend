import { Chip } from "@material-tailwind/react";
import { ALLOW_TYPE } from "../../../constants/constants";
import { DATE_COMPARE } from "../constants";
import { isAfter, isBefore, parseISO } from "date-fns";
import CountdownTimer from "./CountdownTimer";
import DateTimeChip from "./DateTimeChip";
import { useTranslation } from "react-i18next";

interface StatusChipProps {
  type: string;
  timeEnd: string;
  timeStart: string;
}

export const StatusChip = ({ type, timeEnd, timeStart }: StatusChipProps) => {
  const { t } = useTranslation();
  const getTimeDuration = (timeEnd: string) => {
    const dateStart = new Date();
    const dateEnd = new Date(timeEnd);
    const duration = dateEnd.getTime() - dateStart.getTime();
    const durationSeconds = Math.floor(duration / 1000);
    return durationSeconds;
  };

  const compareDateRange = (startDate: string, endDate: string): string => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const today = new Date();

    if (isBefore(today, start)) {
      return DATE_COMPARE.before;
    } else if (isAfter(today, end)) {
      return DATE_COMPARE.after;
    } else {
      return DATE_COMPARE.between;
    }
  };

  if (type === ALLOW_TYPE.always) {
    return (
      <Chip
        className="w-fit"
        variant="ghost"
        color="green"
        size="sm"
        value={t("common.table.perm.always")}
      />
    );
  }

  if (
    type === ALLOW_TYPE.deny ||
    (type === ALLOW_TYPE.timer && timeEnd && getTimeDuration(timeEnd) <= 0) ||
    (type === ALLOW_TYPE.dateTime &&
      compareDateRange(timeStart, timeEnd) === DATE_COMPARE.after)
  ) {
    return (
      <Chip
        className="w-fit"
        variant="ghost"
        color="red"
        size="sm"
        value={t("common.table.perm.deny")}
      />
    );
  }

  if (type === ALLOW_TYPE.timer && getTimeDuration(timeEnd) > 0) {
    return <CountdownTimer duration={getTimeDuration(timeEnd)} />;
  }
  if (
    type === ALLOW_TYPE.dateTime &&
    compareDateRange(timeStart, timeEnd) === DATE_COMPARE.before
  ) {
    return (
      <DateTimeChip
        dateStatus={compareDateRange(timeStart, timeEnd)}
        dateTime={timeStart}
      />
    );
  }

  if (
    type === ALLOW_TYPE.dateTime &&
    compareDateRange(timeStart, timeEnd) === DATE_COMPARE.between
  ) {
    return (
      <DateTimeChip
        dateStatus={compareDateRange(timeStart, timeEnd)}
        dateTime={timeEnd}
      />
    );
  }
  return null;
};
