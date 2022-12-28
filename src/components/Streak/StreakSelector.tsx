import React from "react";

type Props = {
  selectedStreakId: string | undefined;
  setSelectedStreakId: (streakId: string) => void;
  streaks: { id: string; title: string }[] | undefined;
};

export const StreakSelector: React.FC<Props> = ({
  selectedStreakId,
  setSelectedStreakId,
  streaks,
}) => {
  const onStreakChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedStreakId(event.currentTarget.value);
  };

  return (
    <label>
      <select
        id="streakSelector"
        onChange={onStreakChange}
        value={selectedStreakId}
        disabled={!selectedStreakId}
      >
        {streaks &&
          streaks.map((streak) => (
            <option key={streak.id} value={streak.id}>
              {streak.title}
            </option>
          ))}
      </select>
    </label>
  );
};
