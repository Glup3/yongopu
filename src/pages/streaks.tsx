import dayjs from "dayjs";
import { type NextPage } from "next";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Calendar } from "../components/Calendar/Calendar";
import { StreakSelector } from "../components/Streak/StreakSelector";
import { StreakStats } from "../components/Streak/StreakStats";

import { trpc } from "../utils/trpc";

const StreaksPage: NextPage = () => {
  const utils = trpc.useContext();
  const [streakId, setStreakId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: streaks } = trpc.streak.getUserStreaks.useQuery(undefined, {
    onSuccess: (streaksMap) => {
      setStreakId(streaksMap.keys().next().value);
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { data: streakEvents } = trpc.streak.getStreakEvents.useQuery(
    { streakId: streakId || "" },
    { enabled: !!streakId, refetchOnReconnect: false, refetchOnWindowFocus: false },
  );
  const { data: streakStats } = trpc.streak.calculateStreakStats.useQuery(
    { streakId: streakId || "" },
    { enabled: !!streakId, refetchOnReconnect: false, refetchOnWindowFocus: false },
  );

  const toggleStreakEventMutation = trpc.streak.toggleStreakEvent.useMutation({
    onMutate: async (variables) => {
      await Promise.all([
        utils.streak.getStreakEvents.cancel(),
        utils.streak.calculateStreakStats.cancel(),
      ]);

      const prevStreakEvents = utils.streak.getStreakEvents.getData({
        streakId: variables.streakId,
      });

      if (prevStreakEvents) {
        utils.streak.getStreakEvents.setData({ streakId: variables.streakId }, (oldEvents) => {
          if (typeof oldEvents !== "undefined") {
            if (variables.streakEventId) {
              return oldEvents.filter((e) => e.id !== variables.streakEventId);
            }

            return [
              ...oldEvents,
              {
                id: uuidv4(),
                streakId: variables.streakId,
                date: variables.eventDate,
                eventType: "DEFEAT",
              },
            ];
          }
        });
      }

      return { prevStreakEvents };
    },
    onError: (err, variables, context) => {
      // TODO: error message popup/toast notification
      console.error(err);
      if (context?.prevStreakEvents) {
        utils.streak.getStreakEvents.setData(
          { streakId: variables.streakId },
          context.prevStreakEvents,
        );
      }
    },
    onSettled: async (_, __, variables) => {
      await Promise.all([
        utils.streak.getStreakEvents.invalidate({ streakId: variables.streakId }),
        utils.streak.calculateStreakStats.invalidate({ streakId: variables.streakId }),
      ]);
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
          events={streakEvents}
          onToggleStreakEvent={toggleStreakEvent}
        />
        {streakStats && <StreakStats {...streakStats} />}
      </main>
    </>
  );
};

export default StreaksPage;
