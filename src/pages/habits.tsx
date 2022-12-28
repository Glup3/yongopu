import dayjs from "dayjs";
import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";
import { HabitSelector } from "../components/Habit/HabitSelector";

import { trpc } from "../utils/trpc";

const HabitsPage: NextPage = () => {
  const [habitId, setHabitId] = useState<string | undefined>();
  const { data } = trpc.habit.getUserHabits.useQuery(undefined, {
    onSuccess: (habitsMap) => {
      setHabitId(habitsMap.keys().next().value);
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleNextMonth = () => setSelectedDate((date) => dayjs(date).add(1, "months").toDate());
  const handlePrevMonth = () =>
    setSelectedDate((date) => dayjs(date).subtract(1, "months").toDate());
  const handleNextYear = () => setSelectedDate((date) => dayjs(date).add(1, "years").toDate());
  const handlePrevYear = () => setSelectedDate((date) => dayjs(date).subtract(1, "years").toDate());
  const handleSelectedToday = () => setSelectedDate(new Date());

  return (
    <>
      <main className="container mx-auto">
        <div className="mb-6">
          <HabitSelector
            selectedHabitId={habitId}
            setSelectedHabitId={setHabitId}
            habits={
              data
                ? Array.from(data, ([key, value]) => ({
                    id: key,
                    title: value.title,
                  }))
                : undefined
            }
          />
        </div>
        <Calendar
          selectedMonth={selectedDate.getMonth()}
          selectedYear={selectedDate.getFullYear()}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
          onNextYear={handleNextYear}
          onPrevYear={handlePrevYear}
          onSelectedToday={handleSelectedToday}
          events={data?.get(habitId || "")?.events}
        />
      </main>
    </>
  );
};

export default HabitsPage;
