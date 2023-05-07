import React from "react";
import { type RouterOutputs } from "../../utils/trpc";
import { StreakListItem } from "./StreakListItem";

type Props = {
  streaks: RouterOutputs["streak"]["getUserStreaks"];
};

export const StreakList: React.FC<Props> = ({ streaks }) => {
  const allStreaks = [...streaks.values()];

  return (
    <div>
      <ul>
        {allStreaks.map((streak) => {
          return (
            <li key={streak.id}>
              <StreakListItem streak={streak} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const StreakListSkeletton = () => {
  return <div>Loading Streaks...</div>;
};
