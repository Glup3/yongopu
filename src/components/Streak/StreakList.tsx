import React from "react";
import { type RouterOutputs } from "../../utils/trpc";
import dayjs from "dayjs";
import { Edit, Trash2 } from "react-feather";

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
              <div className="flex justify-between items-center mb-4">
                <p>{streak.title}</p>

                <div className="flex ml-2 items-center">
                  <div className="flex flex-col items-center text-xs">
                    <p>{dayjs(streak.startDate).format("DD.MM.YYYY")}</p>
                    <p>till</p>
                    <p>{streak.endDate ? dayjs(streak.endDate).format("DD.MM.YYYY") : "today"}</p>
                  </div>

                  <Edit className="ml-4" />
                  <Trash2 className="ml-4" />
                </div>
              </div>
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
