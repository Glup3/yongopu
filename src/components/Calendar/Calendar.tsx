import React from "react";
import dayjs from "dayjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CalendarGridItem, type GridItemState } from "./CalendarGridItem";
import { CalendarDaysHeader } from "./CalendarDaysHeader";
import { CalendarHeader } from "./CalendarHeader";
import { type StreakEvent } from "@prisma/client";

const gridItemSize = 35;

const getCalendarItemState = (
  events: StreakEvent[] | undefined,
  date: dayjs.Dayjs,
  today: dayjs.Dayjs,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs | undefined,
): GridItemState => {
  if (typeof events === "undefined") {
    return "LOADING";
  }

  if (endDate && date.isSame(endDate, "days")) {
    return "ENDED";
  } else if (endDate && date.isAfter(endDate, "days")) {
    return "NORMAL";
  }

  if (date.isAfter(today.subtract(1, "days"), "days")) {
    return "NORMAL";
  }

  if (date.isBefore(startDate, "days")) {
    return "NORMAL";
  }

  if (date.isSame(startDate, "days")) {
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
  onToggleStreakEvent: (eventDate: dayjs.Dayjs, eventId?: string) => void;
  events: StreakEvent[] | undefined;
  streakStartDate: Date | undefined;
  streakEndDate: Date | null | undefined;
};

export const Calendar: React.FC<CalendarProps> = ({
  selectedMonth,
  selectedYear,
  onNextMonth,
  onPrevMonth,
  onNextYear,
  onPrevYear,
  onSelectedToday,
  onToggleStreakEvent,
  events,
  streakStartDate,
  streakEndDate,
}) => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const selectedDate = dayjs(new Date(selectedYear, selectedMonth, 1));
  const firstDay = dayjs(selectedDate).startOf("month");
  const fillerDaysStart = firstDay.get("day") - 1;
  const firstFillerDay = firstDay.subtract(fillerDaysStart, "days");
  const today = dayjs();

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
      <div ref={parent} className="grid grid-cols-7 gap-[2px] text-center bg-slate-100">
        {[...Array(gridItemSize).keys()].map((item) => {
          const itemDate = firstFillerDay.add(item, "days");
          const itemStreakEventId = events?.find((e) => itemDate.isSame(dayjs(e.date), "days"))?.id;
          const itemEventType = getCalendarItemState(
            events,
            itemDate,
            today,
            dayjs(streakStartDate),
            streakEndDate ? dayjs(streakEndDate) : undefined,
          );
          const isDateToday = itemDate.isSame(today, "day");
          const isDateFromThisMonth = itemDate.isSame(selectedDate, "month");
          const canEventBeToggled = (["DEFEATED", "SUCCEEDED"] as GridItemState[]).includes(
            itemEventType,
          );

          return (
            <CalendarGridItem
              key={itemStreakEventId || itemDate.toISOString()}
              itemId={itemStreakEventId}
              date={itemDate}
              isFaded={!isDateFromThisMonth}
              isToday={isDateToday}
              state={itemEventType}
              onToggleStreakEvent={canEventBeToggled ? onToggleStreakEvent : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
