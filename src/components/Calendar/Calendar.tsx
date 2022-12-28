import React from "react";
import dayjs from "dayjs";
import { CalendarGridItem, type GridItemState } from "./CalendarGridItem";
import { CalendarDaysHeader } from "./CalendarDaysHeader";
import { CalendarHeader } from "./CalendarHeader";
import { type StreakEvent } from "@prisma/client";

const gridItemSize = 35;

const getCalendarItemState = (
  events: StreakEvent[] | undefined,
  date: dayjs.Dayjs,
  today: dayjs.Dayjs,
  started: dayjs.Dayjs,
): GridItemState => {
  if (typeof events === "undefined") {
    return "LOADING";
  }

  if (date.isAfter(today.subtract(1, "days"), "days")) {
    return "NORMAL";
  }

  if (date.isBefore(started, "days")) {
    return "NORMAL";
  }

  if (date.isSame(started, "days")) {
    return "STARTED";
  }

  if (events.find((e) => dayjs(e.date).isSame(date, "days"))?.eventType === "DEFEAT") {
    return "DEFEATED";
  }

  return "SUCCEEDED";
};

type CalendarProps = {
  selectedYear: number;
  selectedMonth: number; // 0 based index
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onNextYear: () => void;
  onPrevYear: () => void;
  onSelectedToday: () => void;
  events: StreakEvent[] | undefined;
};

export const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
  onNextMonth,
  onPrevMonth,
  onNextYear,
  onPrevYear,
  onSelectedToday,
  events,
}) => {
  const gridItems: dayjs.Dayjs[] = [];
  const selectedDate = dayjs(new Date(selectedYear, selectedMonth, 1));
  const firstDay = dayjs(selectedDate).startOf("month");
  const fillerDaysStart = firstDay.get("day") - 1;
  const firstFillerDay = firstDay.subtract(fillerDaysStart, "days");
  const today = dayjs();
  const startDate = events?.find((e) => e.eventType === "START")?.date;

  for (let i = 0; i < gridItemSize; i++) {
    gridItems.push(firstFillerDay.add(i, "days"));
  }
  return (
    <div className="max-w-[600px] m-1">
      <CalendarHeader
        selectedDate={selectedDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onNextYear={onNextYear}
        onPrevYear={onPrevYear}
        onSelectedToday={onSelectedToday}
      />
      <CalendarDaysHeader />
      <div className="grid grid-cols-7 gap-[2px] text-center bg-slate-100">
        {gridItems.map((date) => (
          <CalendarGridItem
            key={date.toISOString()}
            date={date}
            isToday={date.isSame(today, "day")}
            isFaded={!date.isSame(selectedDate, "month")}
            state={getCalendarItemState(events, date, today, dayjs(startDate))}
          />
        ))}
      </div>
    </div>
  );
};
