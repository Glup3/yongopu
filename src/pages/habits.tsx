import dayjs from "dayjs";
import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";

const HabitsPage: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleNextMonth = () =>
    setSelectedDate((date) => dayjs(date).add(1, "months").toDate());
  const handlePrevMonth = () =>
    setSelectedDate((date) => dayjs(date).subtract(1, "months").toDate());
  const handleNextYear = () =>
    setSelectedDate((date) => dayjs(date).add(1, "years").toDate());
  const handlePrevYear = () =>
    setSelectedDate((date) => dayjs(date).subtract(1, "years").toDate());
  const handleSelectedToday = () => setSelectedDate(new Date());

  return (
    <>
      <main className="container mx-auto">
        <Calendar
          selectedMonth={selectedDate.getMonth()}
          selectedYear={selectedDate.getFullYear()}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
          onNextYear={handleNextYear}
          onPrevYear={handlePrevYear}
          onSelectedToday={handleSelectedToday}
        />
      </main>
    </>
  );
};

export default HabitsPage;
