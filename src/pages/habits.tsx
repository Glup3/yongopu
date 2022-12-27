import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";
import { trpc } from "../utils/trpc";

const HabitsPage: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <main>
        <Calendar
          selectedMonth={selectedDate.getMonth()}
          selectedYear={selectedDate.getFullYear()}
        />
      </main>
    </>
  );
};

export default HabitsPage;
