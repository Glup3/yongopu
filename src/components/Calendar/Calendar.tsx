import React from "react";
import dayjs from "dayjs";
import { CalendarGridItem } from "./CalendarGridItem";
import { CalendarDaysHeader } from "./CalendarDaysHeader";

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
  const today = dayjs();

  for (let i = 0; i < gridItemSize; i++) {
    gridItems.push(firstFillerDay.add(i, "days"));
  }
  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      <CalendarDaysHeader />
      {gridItems.map((date) => (
        <CalendarGridItem
          key={date.toISOString()}
          date={date}
          // isToday={date.isSame(today, "day")}
          isToday={true}
          state={"NORMAL"}
        />
      ))}
    </div>
  );
};
