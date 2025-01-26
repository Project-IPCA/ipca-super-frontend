import { useEffect, useState } from "react";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { UseFormSetValue } from "react-hook-form";
import { ProfileInfo } from "../ProfileForm";
import { ProfileData } from "../redux/profileFormSlice";
import { formatDate } from "date-fns";
import Calendar from "./Calendar";
import YearMonthSelector from "./YearMonthSelector";
import { useTranslation } from "react-i18next";

interface Props {
  setValue: UseFormSetValue<ProfileInfo>;
  formData: ProfileData;
}

const DatePicker = ({ setValue, formData }: Props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isYearMonthView, setIsYearMonthView] = useState(false);

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

  useEffect(() => {
    setValue("dob", date ? formatDate(date, "yyyy-MM-dd") : "");
  }, [date]);

  useEffect(() => {
    if (!date && formData.profile.dob) {
      setDate(new Date(formData.profile.dob));
    }
  }, [formData]);

  return (
    <Popover placement="bottom">
      <PopoverHandler>
        <Input
          crossOrigin=""
          label="Birth Date"
          onChange={() => {}}
          size="lg"
          value={
            date
              ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear().toString().padStart(4, "0")}`
              : ""
          }
        />
      </PopoverHandler>
      <PopoverContent className="p-4">
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
            <div className="grid grid-cols-7 gap-1 mb-2">
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
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
