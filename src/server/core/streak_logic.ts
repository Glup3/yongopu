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

  return streaks.filter((s) => s.streak !== 0);
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
): StreakFromTo => {
  const streaks = calculateStreaks(streakStart, streakEnd, streakDefeats);

  return streaks.length > 0
    ? streaks.reduce((max, streak) => (max.streak > streak.streak ? max : streak))
    : {
        from: dayjs(streakStart),
        to: dayjs(streakEnd),
        streak: 0,
      };
};

export const calculateStreakSuccessPercentage = (
  streakStart: Date,
  streakTill: Date,
  streakDefeats: number,
): number => {
  const streakLength = dayjs(streakTill).diff(streakStart, "days") || 1;
  return 100 - (streakDefeats / streakLength) * 100;
};

export const calculateStreakStats = (
  startDate: Date,
  endDate: Date | null,
  streakDefeats: Date[],
) => {
  const today = new Date();
  const lastStreakDate = endDate || today;
  const latestStreakEventDate = streakDefeats.at(-1) || startDate;
  const totalStreakDefeats = streakDefeats.length;

  const currentStreak = calculateStreakDuration(latestStreakEventDate, lastStreakDate);
  const longestStreak = calculateLongestStreak(startDate, lastStreakDate, streakDefeats);

  const streakSuccessPercentage = calculateStreakSuccessPercentage(
    startDate,
    lastStreakDate,
    totalStreakDefeats,
  );
  const totalDays = calculateStreakDuration(startDate, lastStreakDate).streak;
  const totalStreakSuccess = totalDays - totalStreakDefeats;

  return {
    streakStartDate: startDate,
    streakEndDate: endDate,
    longestStreak,
    streakSuccessPercentage,
    currentStreak,
    totalDays,
    totalStreakDefeats: totalStreakDefeats,
    totalStreakSuccess: totalStreakSuccess,
  };
};
