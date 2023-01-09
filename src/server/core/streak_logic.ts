import dayjs from "dayjs";
import { type StreakFromTo } from "../../types/streak-from-to";

const compareDateDay = (date1: Date, date2: Date): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  if (d1.isSame(d2, "day")) {
    return 0;
  }

  if (d1.isBefore(d2, "days")) {
    return -1;
  }

  return 1;
};

const calculateStreaks = (streakStart: Date, streakEnd: Date, streakDefeats: Date[]) => {
  const streaks: StreakFromTo[] = [];
  const allEvents: Date[] = [streakStart, ...streakDefeats, streakEnd];

  allEvents.sort(compareDateDay);
  for (let i = 0; i < allEvents.length - 1; i++) {
    const from = dayjs(allEvents[i]);
    const to = dayjs(allEvents[i + 1]);
    streaks.push({
      from: from,
      to: to,
      streak: dayjs(to).diff(from, "days"),
    });
  }

  return streaks;
};

export const calculateStreakDuration = (streakFrom: Date, streakTill: Date): StreakFromTo => {
  const from = dayjs(streakFrom);
  const to = dayjs(streakTill);
  return {
    from: from,
    to: to,
    streak: to.diff(from, "days"),
  };
};

export const calculateLongestStreak = (
  streakStart: Date,
  streakEnd: Date,
  streakDefeats: Date[],
) => {
  return calculateStreaks(streakStart, streakEnd, streakDefeats).reduce((max, streak) =>
    max.streak > streak.streak ? max : streak,
  );
};

export const calculateShortestStreak = (
  streakStart: Date,
  streakEnd: Date,
  streakDefeats: Date[],
) => {
  return calculateStreaks(streakStart, streakEnd, streakDefeats).reduce((min, streak) =>
    min.streak < streak.streak ? min : streak,
  );
};

export const calculateStreakSuccessPercentage = (
  streakStart: Date,
  streakTill: Date,
  streakDefeats: number,
): number => {
  const streakLength = dayjs(streakTill).diff(streakStart, "days");
  return 100 - (streakDefeats / streakLength) * 100;
};
