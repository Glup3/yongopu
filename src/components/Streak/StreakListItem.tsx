import React, { useState } from "react";
import dayjs from "dayjs";
import { Edit } from "react-feather";
import { StreakDeleteButton } from "./StreakDeleteButton";
import { StreakEditableTitle } from "./StreakEditableTitle";

type Props = {
  streak: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date | null;
  };
};

export const StreakListItem: React.FC<Props> = ({ streak }) => {
  const [isEditTitleMode, setIsEditTitleMode] = useState(false);

  return (
    <div className="flex justify-between items-center mb-4">
      <StreakEditableTitle
        streakId={streak.id}
        streakTitle={streak.title}
        isEditMode={isEditTitleMode}
        onEditFinished={() => setIsEditTitleMode(false)}
      />

      <div className="flex ml-2 items-center">
        <div className="flex flex-col items-center text-xs">
          <p>{dayjs(streak.startDate).format("DD.MM.YYYY")}</p>
          <p>till</p>
          <p>{streak.endDate ? dayjs(streak.endDate).format("DD.MM.YYYY") : "today"}</p>
        </div>

        <div className="ml-4">
          <button onClick={() => setIsEditTitleMode(true)} disabled={isEditTitleMode}>
            <Edit />
          </button>
        </div>
        <div className="ml-4">
          <StreakDeleteButton streakId={streak.id} />
        </div>
      </div>
    </div>
  );
};
