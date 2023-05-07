import React from "react";
import dayjs from "dayjs";
import { StreakStatsColumn } from "./StreakStatsColumn";
import { type RouterOutputs } from "../../utils/trpc";

type Props = {
  stats: RouterOutputs["streak"]["calculateStreakStats"];
};

export const StreakStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="flex flex-col mt-4">
      <StreakStatsColumn
        text={stats.streakEndDate ? "Last Streak" : "Current Streak"}
        value={`${stats.currentStreak.streak}`}
      />
      <StreakStatsColumn text="Total Days" value={`${stats.totalDays}`} />
      <StreakStatsColumn text="Total Success" value={`${stats.totalStreakSuccess}`} />
      <StreakStatsColumn text="Total Defeats" value={`${stats.totalStreakDefeats}`} />
      <StreakStatsColumn text="Longest Streak" value={`${stats.longestStreak.streak}`} />
      <StreakStatsColumn
        text="Success Percentage"
        value={`${stats.streakSuccessPercentage.toFixed(2)}%`}
      />
      <StreakStatsColumn
        text="Start Date"
        value={dayjs(stats.streakStartDate).format("DD.MM.YYYY")}
      />
      {stats.streakEndDate && (
        <StreakStatsColumn
          text="End Date"
          value={dayjs(stats.streakEndDate).format("DD.MM.YYYY")}
        />
      )}
    </div>
  );
};
