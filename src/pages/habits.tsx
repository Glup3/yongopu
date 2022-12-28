import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";

const HabitsPage: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <main className="container mx-auto">
        <Calendar
          selectedMonth={selectedDate.getMonth()}
          selectedYear={selectedDate.getFullYear()}
        />
      </main>
    </>
  );
};

export default HabitsPage;
