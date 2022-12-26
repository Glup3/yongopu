import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";
import { trpc } from "../utils/trpc";

const HabitsPage: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data } = trpc.habit.getHabits.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <main>
        <Calendar
          selectedMonth={selectedDate.getMonth()}
          selectedYear={selectedDate.getFullYear()}
        />
        <ul>
          {!data ? (
            <span>loading...</span>
          ) : (
            data.map((h) => (
              <li key={h.id}>
                <span>{h.title} | </span>
                <span>{h.percentage?.toFixed(2) || "NaN"}% | </span>
                <span>{h.currentStreak} days | </span>
                <span>{h.longestStreak} days</span>
              </li>
            ))
          )}
        </ul>
      </main>
    </>
  );
};

export default HabitsPage;
