import { Option, Select } from "@material-tailwind/react";
import { MONTHS } from "../../../constants/constants";

interface Props {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

function YearMonthSelector({ currentMonth, setCurrentMonth }: Props) {
  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: currentYear + 1 - 1900 }, (_, i) =>
    (1900 + i).toString(),
  );

  const handleYearChange = (year: string | undefined) => {
    if (year) {
      setCurrentMonth(new Date(parseInt(year), currentMonth.getMonth()));
    }
  };

  const handleMonthChange = (month: string | undefined) => {
    if (month) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), MONTHS.indexOf(month)),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Year"
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
        label="Month"
        value={MONTHS[currentMonth.getMonth()]}
        onChange={(val) => handleMonthChange(val)}
      >
        {MONTHS.map((month) => (
          <Option key={month} value={month}>
            {month}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default YearMonthSelector;
