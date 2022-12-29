import dayjs from "dayjs";
import { type NextPage } from "next";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Calendar } from "../components/Calendar/Calendar";
import { StreakSelector } from "../components/Streak/StreakSelector";
import { StreakStats } from "../components/Streak/StreakStats";

import { trpc } from "../utils/trpc";

const StreaksPage: NextPage = () => {
  const queryClient = useQueryClient();
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
  const toggleStreakEventMutation = trpc.streak.toggleStreakEvent.useMutation({
    onMutate: (variables) => {
      const streak = streaks?.get(variables.streakId);
      if (typeof streak === "undefined") {
        return { prevStreakEvents: [] };
      }

      const prevStreakEvents = streak.events;
      if (variables.streakEventId) {
        streak.events = streak.events.filter((e) => e.id !== variables.streakEventId);
      } else {
        streak.events.push({
          id: "tempStreakEvent",
          streakId: variables.streakId,
          date: variables.eventDate,
          eventType: "DEFEAT",
        });
      }

      return { prevStreakEvents };
    },
    onError: (err, variables, context) => {
      const streak = streaks?.get(variables.streakId);
      if (typeof streak !== "undefined" && typeof context !== "undefined") {
        streak.events = context.prevStreakEvents;
      }
      console.error(err); // TODO: error message popup/toast notification
    },
    onSettled: (streakEvent) => {
      queryClient.invalidateQueries({
        queryKey: trpc.streak.getUserStreaks.getQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.streak.calculateStreakStats.getQueryKey({
          streakId: streakEvent?.streakId || "",
        }),
      });
    },
  });

  const handleNextMonth = () => setSelectedDate((date) => dayjs(date).add(1, "months").toDate());
  const handlePrevMonth = () =>
    setSelectedDate((date) => dayjs(date).subtract(1, "months").toDate());
  const handleNextYear = () => setSelectedDate((date) => dayjs(date).add(1, "years").toDate());
  const handlePrevYear = () => setSelectedDate((date) => dayjs(date).subtract(1, "years").toDate());
  const handleSelectedToday = () => setSelectedDate(new Date());

  const toggleStreakEvent = (eventDate: dayjs.Dayjs, eventId?: string) => {
    if (streakId) {
      const dateUTC = new Date(Date.UTC(eventDate.year(), eventDate.month(), eventDate.date()));
      toggleStreakEventMutation.mutate({
        streakId: streakId,
        eventDate: dateUTC,
        streakEventId: eventId,
      });
    }
  };

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
          onToggleStreakEvent={toggleStreakEvent}
        />
        {streakStats && <StreakStats {...streakStats} />}
      </main>
    </>
  );
};

export default StreaksPage;
