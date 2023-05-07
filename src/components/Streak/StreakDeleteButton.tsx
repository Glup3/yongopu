import { Trash2 } from "react-feather";
import { useLongPress } from "use-long-press";
import { trpc } from "../../utils/trpc";

type Props = {
  streakId: string;
};

export const StreakDeleteButton: React.FC<Props> = ({ streakId }) => {
  const utils = trpc.useContext();
  const deleteStreakMutation = trpc.streak.deleteStreak.useMutation({
    onMutate: async (variables) => {
      await Promise.all([utils.streak.getUserStreaks.cancel()]);

      const prevStreaks = utils.streak.getUserStreaks.getData();
      if (prevStreaks) {
        utils.streak.getUserStreaks.setData(undefined, (oldStreaks) => {
          const newStreaks = new Map(oldStreaks);
          newStreaks.delete(variables.streakId);
          return newStreaks;
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

  const bind = useLongPress(
    () => {
      deleteStreakMutation.mutate({ streakId });
    },
    { threshold: 3000 },
  );

  return (
    <button {...bind()}>
      <Trash2 />
    </button>
  );
};
