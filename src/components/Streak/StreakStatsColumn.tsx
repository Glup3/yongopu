import React from "react";

type Props = {
  text: string;
  value: string;
};

export const StreakStatsColumn: React.FC<Props> = ({ text, value }) => {
  return (
    <div className="flex justify-between m-1 px-4">
      <span className="font-light text-lg">{text}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};
