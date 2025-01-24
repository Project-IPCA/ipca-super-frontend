import { Option, Select } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

interface Props {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

function YearMonthSelector({ currentMonth, setCurrentMonth }: Props) {
  const { t } = useTranslation();
  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: currentYear + 1 - 1900 }, (_, i) =>
    (1900 + i).toString(),
  );
  const months = t("common.month.list", { returnObjects: true }) as string[];

  const handleYearChange = (year: string | undefined) => {
    if (year) {
      setCurrentMonth(new Date(parseInt(year), currentMonth.getMonth()));
    }
  };

  const handleMonthChange = (month: string | undefined) => {
    if (month) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), months.indexOf(month)),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        label={t("common.year")}
        value={currentYear.toString()}
        onChange={(val) => handleYearChange(val)}
      >
        {years.map((year) => (
          <Option key={year} value={year.toString()}>
            {year}
          </Option>
        ))}
      </Select>
      <Select
        label={t("common.month.title")}
        value={months[currentMonth.getMonth()]}
        onChange={(val) => handleMonthChange(val)}
      >
        {months.map((month) => (
          <Option key={month} value={month}>
            {month}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default YearMonthSelector;
