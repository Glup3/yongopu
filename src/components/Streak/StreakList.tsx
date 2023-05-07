import React from "react";
import { type RouterOutputs } from "../../utils/trpc";
import { StreakListItem } from "./StreakListItem";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  streaks: RouterOutputs["streak"]["getUserStreaks"];
};

export const StreakList: React.FC<Props> = ({ streaks }) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();
  const allStreaks = [...streaks.values()];

  return (
    <div>
      <ul ref={parent}>
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
