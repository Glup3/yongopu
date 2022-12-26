import React from "react";
import dayjs from "dayjs";

type CalendarProps = {
  selectedYear: number;
  selectedMonth: number; // 0 based index
};

const gridItemSize = 35;

export const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
}) => {
  const gridItems: dayjs.Dayjs[] = [];
  const selectedDate = dayjs(new Date(selectedYear, selectedMonth, 1));
  const firstDay = dayjs(selectedDate).startOf("month");
  const fillerDaysStart = firstDay.get("day") - 1;
  const firstFillerDay = firstDay.subtract(fillerDaysStart, "days");

  for (let i = 0; i < gridItemSize; i++) {
    gridItems.push(firstFillerDay.add(i, "days"));
  }
  return (
    <div className="grid grid-cols-7 gap-4">
      <div>Mo</div>
      <div>Di</div>
      <div>Mi</div>
      <div>Do</div>
      <div>Fr</div>
      <div>Sa</div>
      <div>So</div>
      {gridItems.map((date, i) => (
        <div key={i}>{date.format("DD.MM")}</div>
      ))}
    </div>
  );
};
