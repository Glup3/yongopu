import React from "react";

type Props = {
  selectedHabitId: string | undefined;
  setSelectedHabitId: (habitId: string) => void;
  habits: { id: string; title: string }[] | undefined;
};

export const HabitSelector: React.FC<Props> = ({
  selectedHabitId,
  setSelectedHabitId,
  habits,
}) => {
  const onHabitChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setSelectedHabitId(event.currentTarget.value);
  };

  return (
    <label>
      <select
        id="habitSelector"
        onChange={onHabitChange}
        value={selectedHabitId}
        disabled={!selectedHabitId}
      >
        {habits &&
          habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.title}
            </option>
          ))}
      </select>
    </label>
  );
};
