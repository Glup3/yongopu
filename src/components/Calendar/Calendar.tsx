import React from "react";
import dayjs from "dayjs";
import { CalendarGridItem } from "./CalendarGridItem";
import { CalendarDaysHeader } from "./CalendarDaysHeader";
import { CalendarHeader } from "./CalendarHeader";

type CalendarProps = {
  selectedYear: number;
  selectedMonth: number; // 0 based index
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onNextYear: () => void;
  onPrevYear: () => void;
  onSelectedToday: () => void;
};

const gridItemSize = 35;

export const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
  onNextMonth,
  onPrevMonth,
  onNextYear,
  onPrevYear,
  onSelectedToday,
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
    <div className="max-w-[600px]">
      <CalendarHeader
        selectedDate={selectedDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onNextYear={onNextYear}
        onPrevYear={onPrevYear}
        onSelectedToday={onSelectedToday}
      />
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
    </div>
  );
};
