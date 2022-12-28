import dayjs from "dayjs";

import { router, protectedProcedure } from "../trpc";

export const habitRouter = router({
  getUserHabits: protectedProcedure.query(async ({ ctx }) => {
    const habits = await ctx.prisma.habit.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        title: true,
        events: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return new Map<string, typeof habits[0]>(habits.map((habit) => [habit.id, habit]));
  }),
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    const habits = await ctx.prisma.habit.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { title: "asc" },
    });
    const habitDefeats = await Promise.all(
      habits.map(async (h) => ({
        id: h.id,
        count: await ctx.prisma.habitEvent.count({
          where: { habitId: h.id, eventType: "DEFEAT" },
        }),
      })),
    );
    const habitStarts = await ctx.prisma.habitEvent.findMany({
      where: { eventType: "START", habitId: { in: habits.map((h) => h.id) } },
    });
    const percentages = habitStarts.map((h) => {
      const allDays = dayjs().diff(h.date, "days");
      const defeats = habitDefeats.find((h2) => h.habitId === h2.id)?.count;
      return {
        id: h.habitId,
        percentage: defeats ? 100 - (defeats / allDays) * 100 : 100,
      };
    });
    const latestDefeats = await Promise.all(
      habits.map(async (h) => ({
        id: h.id,
        date: (
          await ctx.prisma.habitEvent.findFirst({
            where: { habitId: h.id, eventType: "DEFEAT" },
            orderBy: { date: "desc" },
          })
        )?.date,
      })),
    );
    const allEventsTillToday = await Promise.all(
      habits.map(async (h) => ({
        id: h.id,
        events: (
          await ctx.prisma.habitEvent.findMany({
            where: { habitId: h.id },
            orderBy: { date: "asc" },
          })
        ).concat({
          id: "",
          habitId: h.id,
          date: new Date(),
          eventType: "DEFEAT",
        }),
      })),
    );

    const longestStreaks = allEventsTillToday.map((h) => {
      const streaks: number[] = [];
      for (let i = 0; i < h.events.length - 1; i++) {
        streaks.push(dayjs(h.events[i + 1]?.date).diff(h.events[i]?.date, "days"));
      }

      return {
        id: h.id,
        streak: Math.max(...streaks),
      };
    });

    return habits.map((h) => {
      const latestDefeat = latestDefeats.find((h2) => h.id === h2.id)?.date;

      return {
        ...h,
        percentage: percentages.find((h2) => h.id === h2.id)?.percentage,
        currentStreak: latestDefeat
          ? dayjs().diff(latestDefeat, "days")
          : dayjs().diff(habitStarts.find((h2) => h.id === h2.habitId)?.date, "days"),
        longestStreak: longestStreaks.find((h2) => h.id === h2.id)?.streak,
      };
    });
  }),
});
