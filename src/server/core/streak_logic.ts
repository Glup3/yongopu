import dayjs from "dayjs";
import { type StreakEvent } from "@prisma/client";
import { type StreakFromTo } from "../../types/streak-from-to";

const compareStreakEventDate = (s1: StreakEvent, s2: StreakEvent): number => {
  const d1 = dayjs(s1.date);
  const d2 = dayjs(s2.date);

  if (d1.isSame(d2, "day")) {
    return 0;
  }

  if (d1.isBefore(d2, "days")) {
    return -1;
  }

  return 1;
};

const calculateStreaks = (allStreakEvents: StreakEvent[]) => {
  const streaks: StreakFromTo[] = [];
  const eventsTillToday = allStreakEvents.concat({
    id: "",
    streakId: "",
    date: new Date(),
    eventType: "DEFEAT",
  });

  eventsTillToday.sort(compareStreakEventDate);
  for (let i = 0; i < eventsTillToday.length - 1; i++) {
    const from = dayjs(eventsTillToday[i]?.date);
    const to = dayjs(eventsTillToday[i + 1]?.date);
    streaks.push({
      from: from,
      to: to,
      streak: dayjs(to).diff(from, "days"),
    });
  }

  return streaks;
};

export const calculateStreakDuration = (
  streakFrom: StreakEvent,
  streakTill: Date,
): StreakFromTo => {
  const from = dayjs(streakFrom.date);
  const to = dayjs(streakTill);
  return {
    from: from,
    to: to,
    streak: to.diff(from, "days"),
  };
};

export const calculateLongestStreak = (allStreakEvents: StreakEvent[]) => {
  return calculateStreaks(allStreakEvents).reduce((max, streak) =>
    max.streak > streak.streak ? max : streak,
  );
};

export const calculateShortestStreak = (allStreakEvents: StreakEvent[]) => {
  return calculateStreaks(allStreakEvents).reduce((min, streak) =>
    min.streak < streak.streak ? min : streak,
  );
};

export const calculateStreakSuccessPercentage = (
  streakStart: StreakEvent,
  streakTill: Date,
  streakDefeats: number,
): number => {
  const streakLength = dayjs(streakTill).diff(streakStart.date, "days");
  return 100 - (streakDefeats / streakLength) * 100;
};
