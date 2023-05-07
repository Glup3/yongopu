import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

type Props = {
  streakId: string;
  streakTitle: string;
  isEditMode: boolean;
  onEditFinished: () => void;
};

export const StreakEditableTitle: React.FC<Props> = ({
  streakId,
  isEditMode,
  streakTitle,
  onEditFinished,
}) => {
  const utils = trpc.useContext();
  const [title, setTitle] = useState(streakTitle);
  const { mutate: updateTitle } = trpc.streak.updateStreakTitle.useMutation({
    onMutate: async (variables) => {
      await Promise.all([utils.streak.getUserStreaks.cancel()]);

      const prevStreaks = utils.streak.getUserStreaks.getData();
      if (prevStreaks) {
        utils.streak.getUserStreaks.setData(undefined, (oldStreaks) => {
          if (typeof oldStreaks !== "undefined") {
            const newStreaks = new Map(oldStreaks);

            const oldStreak = newStreaks.get(variables.streakId);
            if (oldStreak) {
              oldStreak.title = variables.streakTitle;
              newStreaks.set(variables.streakId, oldStreak);
              return newStreaks;
            }
          }
        });
      }

      return { prevStreaks };
    },

    onError: (err, _, context) => {
      // TODO: use toast
      console.error(err);
      if (context?.prevStreaks) {
        utils.streak.getUserStreaks.setData(undefined, context.prevStreaks);
      }
    },

    onSettled: async () => {
      await Promise.all([utils.streak.getUserStreaks.invalidate()]);
    },
  });

  const onUpdateStreakTitle = () => {
    updateTitle({ streakId, streakTitle: title });
    onEditFinished();
  };

  return isEditMode ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onUpdateStreakTitle();
      }}
    >
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-300 focus:border-blue-300 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        autoFocus
        placeholder="Streak name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();

          onUpdateStreakTitle();
        }}
      />
    </form>
  ) : (
    <p>{streakTitle}</p>
  );
};
