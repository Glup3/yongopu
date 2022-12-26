import { type NextPage } from "next";

import { trpc } from "../utils/trpc";

const HabitsPage: NextPage = () => {
  const { data } = trpc.habit.getHabits.useQuery(undefined);

  return (
    <>
      <main>
        <ul>
          {!data ? (
            <span>loading...</span>
          ) : (
            data.map((h) => (
              <li key={h.id}>
                <span>{h.title} | </span>
                <span>{h.percentage?.toFixed(2) || "NaN"}% | </span>
                <span>{h.currentStreak} days | </span>
                <span>{h.longestStreak} days</span>
              </li>
            ))
          )}
        </ul>
      </main>
    </>
  );
};

export default HabitsPage;
