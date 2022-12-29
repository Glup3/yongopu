import dayjs from "dayjs";
import { type NextPage } from "next";
import { useState } from "react";

import { Calendar } from "../components/Calendar/Calendar";
import { StreakSelector } from "../components/Streak/StreakSelector";
import { StreakStats } from "../components/Streak/StreakStats";

import { trpc } from "../utils/trpc";

const StreaksPage: NextPage = () => {
  const [streakId, setStreakId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: streaks } = trpc.streak.getUserStreaks.useQuery(undefined, {
    onSuccess: (streaksMap) => {
      setStreakId(streaksMap.keys().next().value);
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { data: streakStats } = trpc.streak.calculateStreakStats.useQuery(
    { streakId: streakId || "" },
    { enabled: !!streakId, refetchOnReconnect: false, refetchOnWindowFocus: false },
  );

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
          <StreakSelector
            selectedStreakId={streakId}
            setSelectedStreakId={setStreakId}
            streaks={
              streaks
                ? Array.from(streaks, ([key, value]) => ({
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
          events={streaks?.get(streakId || "")?.events}
        />
        {streakStats && <StreakStats {...streakStats} />}
      </main>
    </>
  );
};

export default StreaksPage;
