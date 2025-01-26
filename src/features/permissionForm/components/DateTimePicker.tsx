import { useEffect, useRef, useState } from "react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Calendar from "./Calendar";
import YearMonthSelector from "./YearMonthSelector";
import { TIME_RANGE } from "../constants";
import { useTranslation } from "react-i18next";

interface Props {
  tab: string | null;
  handleChangePermDateTime: (
    tab: string | null,
    timeRange: string,
    time: Date,
  ) => void;
  timeRange: string;
}

const DateTimePicker = ({
  handleChangePermDateTime,
  timeRange,
  tab,
}: Props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isYearMonthView, setIsYearMonthView] = useState(false);
  const hourButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const minuteButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const hourContainRef = useRef<HTMLDivElement>(null);
  const minuteContainRef = useRef<HTMLDivElement>(null);
  const secondContainRef = useRef<HTMLDivElement>(null);

  const months = Array.isArray(t("common.month.list", { returnObjects: true }))
    ? (t("common.month.list", { returnObjects: true }) as string[])
    : [];

  const days = Array.isArray(t("common.day", { returnObjects: true }))
    ? (t("common.day", { returnObjects: true }) as string[])
    : [];

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1),
    );
  };

  const toggleView = () => {
    setIsYearMonthView(!isYearMonthView);
  };

  const handleHourSelect = (hour: number, index: number) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hour);
      setDate(newDate);
      if (hourContainRef.current && hourButtonRef.current[index]) {
        hourContainRef.current.scrollTo({
          top: Number(hourButtonRef.current[index].offsetTop) - 20,
          behavior: "smooth",
        });
      }
    } else {
      const newDate = new Date();
      newDate.setHours(hour);
      setDate(newDate);
    }
  };

  const handleMinuteSelect = (minute: number, index: number) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setMinutes(minute);
      setDate(newDate);
      if (minuteContainRef.current && minuteButtonRef.current[index]) {
        minuteContainRef.current.scrollTo({
          top: minuteButtonRef.current[index].offsetTop - 20,
          behavior: "smooth",
        });
      }
    } else {
      const newDate = new Date();
      newDate.setMinutes(minute);
      setDate(newDate);
    }
  };

  const handleSecondSelect = (second: number, index: number) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setSeconds(second);
      setDate(newDate);
      if (secondContainRef.current && secondButtonRef.current[index]) {
        secondContainRef.current.scrollTo({
          top: secondButtonRef.current[index].offsetTop - 20,
          behavior: "smooth",
        });
      }
    } else {
      const newDate = new Date();
      newDate.setSeconds(second);
      setDate(newDate);
    }
  };

  useEffect(() => {
    if (date) {
      handleChangePermDateTime(tab, timeRange, date);
    }
  }, [date]);

  return (
    <Popover placement="top">
      <PopoverHandler>
        <Input
          crossOrigin=""
          label={
            timeRange === TIME_RANGE.timeStart
              ? t("feature.perm_form.date_time.start")
              : t("feature.perm_form.date_time.end")
          }
          onChange={() => {}}
          size="lg"
          value={
            date
              ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(4, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
              : ""
          }
        />
      </PopoverHandler>
      <PopoverContent className="p-4 z-[9999] h-[21rem]">
        <div className="flex justify-center gap-x-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <IconButton variant="text" onClick={handlePrevMonth}>
                <ChevronLeftIcon className="h-4 w-4" />
              </IconButton>
              <Button variant="text" onClick={toggleView}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Button>
              <IconButton variant="text" onClick={handleNextMonth}>
                <ChevronRightIcon className="h-4 w-4" />
              </IconButton>
            </div>
            {isYearMonthView ? (
              <YearMonthSelector
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
              />
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2 z-[9999]">
                  {days.map((day) => (
                    <div key={day} className="text-center text-sm font-bold">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Calendar({
                    currentMonth: currentMonth,
                    date: date,
                    setDate: setDate,
                  })}
                </div>
              </>
            )}
          </div>
          <div className="flex">
            <div
              ref={hourContainRef}
              className="overflow-scroll h-[19rem] px-2 border-l-[1px] space-y-2 overscroll-contain"
            >
              <div className="pb-[17rem]">
                {[
                  12,
                  ...Array.from({ length: 12 }, (_, i) => i),
                  ...Array.from({ length: 11 }, (_, i) => i + 13),
                ].map((hour, index) => (
                  <div
                    key={hour}
                    ref={(el) => (hourButtonRef.current[index] = el)}
                  >
                    <Button
                      size="sm"
                      variant={hour === date?.getHours() ? "filled" : "text"}
                      onClick={() => handleHourSelect(hour, index)}
                    >
                      {hour.toString().padStart(2, "0")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div
              ref={minuteContainRef}
              className="overflow-scroll h-[19rem] px-2 border-l-[1px] space-y-2"
            >
              <div className="pb-[17rem]">
                {Array.from({ length: 60 }, (_, index) => index).map(
                  (minute, index) => (
                    <div
                      key={minute}
                      ref={(el) => (minuteButtonRef.current[index] = el)}
                    >
                      <Button
                        size="sm"
                        variant={
                          minute === date?.getMinutes() ? "filled" : "text"
                        }
                        onClick={() => handleMinuteSelect(minute, index)}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div
              ref={secondContainRef}
              className="overflow-scroll h-[19rem] px-2 border-l-[1px] space-y-2"
            >
              <div className="pb-[17rem]">
                {Array.from({ length: 60 }, (_, index) => index).map(
                  (second, index) => (
                    <div
                      key={second}
                      ref={(el) => (secondButtonRef.current[index] = el)}
                    >
                      <Button
                        size="sm"
                        variant={
                          second === date?.getSeconds() ? "filled" : "text"
                        }
                        onClick={() => handleSecondSelect(second, index)}
                      >
                        {second.toString().padStart(2, "0")}
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
