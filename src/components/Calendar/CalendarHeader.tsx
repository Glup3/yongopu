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
        <ChevronsLeft onClick={onPrevYear} className="mr-2" />
        <ChevronLeft onClick={onPrevMonth} />
      </div>
      <div className="font-semibold text-2xl" onClick={onSelectedToday}>
        {selectedDate.format("MMMM YYYY")}
      </div>
      <div>
        <div className="flex">
          <ChevronRight onClick={onNextMonth} />
          <ChevronsRight onClick={onNextYear} className="ml-2" />
        </div>
      </div>
    </div>
  );
};
