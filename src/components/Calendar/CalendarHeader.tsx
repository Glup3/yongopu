import React from "react";
import { type Dayjs } from "dayjs";
import { ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight } from "react-feather";

type Props = {
  selectedDate: Dayjs;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNextYear: () => void;
  onPrevYear: () => void;
  onSelectedToday: () => void;
};

export const CalendarHeader: React.FC<Props> = ({
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onNextYear,
  onPrevYear,
  onSelectedToday,
}) => {
  return (
    <div className="flex justify-between mb-2 px-4 items-center">
      <div className="flex">
        <button onClick={onPrevYear} className="mr-2">
          <ChevronsLeft />
        </button>
        <button onClick={onPrevMonth}>
          <ChevronLeft />
        </button>
      </div>
      <div className="font-semibold text-2xl" onClick={onSelectedToday}>
        {selectedDate.format("MMMM YYYY")}
      </div>
      <div>
        <div className="flex">
          <button onClick={onNextMonth}>
            <ChevronRight />
          </button>
          <button onClick={onNextYear} className="ml-2">
            <ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};
