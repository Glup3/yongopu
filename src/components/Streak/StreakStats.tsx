import React from "react";
import { type StreakEvent } from "@prisma/client";
import { type StreakFromTo } from "../../types/streak-from-to";

type Props = {
  streakStart: StreakEvent | undefined;
  streakDefeats: number;
  longestStreak: StreakFromTo;
  shortestStreak: StreakFromTo;
  streakSuccessPercentage: number;
};

export const StreakStats: React.FC<Props> = ({
  streakStart,
  streakDefeats,
  longestStreak,
  shortestStreak,
  streakSuccessPercentage,
}) => {
  return (
    <div className="flex flex-col">
      <div>Start: {streakStart?.date.toISOString()}</div>
      <div>Defeats: {streakDefeats}</div>
      <div>Success: {streakSuccessPercentage}%</div>
      <div>Longest: {longestStreak.streak}</div>
      <div>Shortest: {shortestStreak.streak}</div>
    </div>
  );
};
