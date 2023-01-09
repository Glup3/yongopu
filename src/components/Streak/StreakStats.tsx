import React from "react";
import { type StreakFromTo } from "../../types/streak-from-to";
import { StreakStatsColumn } from "./StreakStatsColumn";
import dayjs from "dayjs";

type Props = {
  streakStartDate: Date;
  streakEndDate: Date | null;
  streakDefeats: number;
  longestStreak: StreakFromTo;
  shortestStreak: StreakFromTo;
  streakSuccessPercentage: number;
  currentStreak: StreakFromTo;
  totalDays: number | undefined;
  streakTotalSuccess: number;
};

export const StreakStats: React.FC<Props> = ({
  streakStartDate,
  streakEndDate,
  streakDefeats,
  longestStreak,
  shortestStreak,
  streakSuccessPercentage,
  currentStreak,
  totalDays,
  streakTotalSuccess,
}) => {
  return (
    <div className="flex flex-col mt-4">
      <StreakStatsColumn
        text={streakEndDate ? "Last Streak" : "Current Streak"}
        value={currentStreak.streak.toString()}
      />
      <StreakStatsColumn
        text="Success Percentage"
        value={`${streakSuccessPercentage.toFixed(2)}%`}
      />
      <StreakStatsColumn text="Total Days" value={totalDays?.toString() || "NaN"} />
      <StreakStatsColumn text="Total Success" value={streakTotalSuccess.toString()} />
      <StreakStatsColumn text="Total Defeats" value={streakDefeats.toString()} />
      <StreakStatsColumn text="Longest Streak" value={longestStreak.streak.toString()} />
      <StreakStatsColumn text="Shortest Streak" value={shortestStreak.streak.toString()} />
      <StreakStatsColumn text="Start Date" value={dayjs(streakStartDate).format("DD.MM.YYYY")} />
      {streakEndDate && (
        <StreakStatsColumn text="End Date" value={dayjs(streakEndDate).format("DD.MM.YYYY")} />
      )}
    </div>
  );
};
