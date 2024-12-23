import { Button } from "@material-tailwind/react";

interface Props {
  currentMonth: Date;
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

function Calendar({ currentMonth, date, setDate }: Props) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setDate(newDate);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isSelected =
      date?.getDate() === i &&
      date?.getMonth() === month &&
      date?.getFullYear() === year;
    days.push(
      <Button
        key={i}
        variant={isSelected ? "filled" : "text"}
        className="p-2 w-8 h-8 rounded-full"
        onClick={() => handleDateClick(i)}
      >
        {i}
      </Button>,
    );
  }

  return days;
}

export default Calendar;
