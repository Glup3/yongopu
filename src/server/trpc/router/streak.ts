import dayjs from "dayjs";
import { z } from "zod";
import {
  calculateLongestStreak,
  calculateShortestStreak,
  calculateStreakSuccessPercentage,
} from "../../core/streak_logic";

import { router, protectedProcedure } from "../trpc";

export const streakRouter = router({
  getUserStreaks: protectedProcedure.query(async ({ ctx }) => {
    const streaks = await ctx.prisma.streak.findMany({
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

    return new Map<string, typeof streaks[0]>(streaks.map((streak) => [streak.id, streak]));
  }),
  calculateStreakStats: protectedProcedure
    .input(z.object({ streakId: z.string() }))
    .query(async ({ input, ctx }) => {
      const allStreakEvents = await ctx.prisma.streakEvent.findMany({
        where: { streakId: input.streakId },
        orderBy: { date: "asc" },
      });
      const streakStart = allStreakEvents.find((streak) => streak.eventType === "START");
      const streakDefeats = allStreakEvents.filter((streak) => streak.eventType === "DEFEAT");
      const longestStreak = calculateLongestStreak(allStreakEvents);
      const shortestStreak = calculateShortestStreak(allStreakEvents);
      const streakSuccessPercentage = streakStart
        ? calculateStreakSuccessPercentage(streakStart, new Date(), streakDefeats.length)
        : NaN;

      return {
        streakStart,
        streakDefeats: streakDefeats.length,
        longestStreak,
        shortestStreak,
        streakSuccessPercentage,
      };
    }),
  getStreaks: protectedProcedure.query(async ({ ctx }) => {
    const streaks = await ctx.prisma.streak.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { title: "asc" },
    });
    const streakDefeats = await Promise.all(
      streaks.map(async (s) => ({
        id: s.id,
        count: await ctx.prisma.streakEvent.count({
          where: { streakId: s.id, eventType: "DEFEAT" },
        }),
      })),
    );
    const streakStarts = await ctx.prisma.streakEvent.findMany({
      where: { eventType: "START", streakId: { in: streaks.map((s) => s.id) } },
    });
    const percentages = streakStarts.map((s) => {
      const allDays = dayjs().diff(s.date, "days");
      const defeats = streakDefeats.find((s2) => s.streakId === s2.id)?.count;
      return {
        id: s.streakId,
        percentage: defeats ? 100 - (defeats / allDays) * 100 : 100,
      };
    });
    const latestDefeats = await Promise.all(
      streaks.map(async (s) => ({
        id: s.id,
        date: (
          await ctx.prisma.streakEvent.findFirst({
            where: { streakId: s.id, eventType: "DEFEAT" },
            orderBy: { date: "desc" },
          })
        )?.date,
      })),
    );
    const allEventsTillToday = await Promise.all(
      streaks.map(async (s) => ({
        id: s.id,
        events: (
          await ctx.prisma.streakEvent.findMany({
            where: { streakId: s.id },
            orderBy: { date: "asc" },
          })
        ).concat({
          id: "",
          streakId: s.id,
          date: new Date(),
          eventType: "DEFEAT",
        }),
      })),
    );

    const longestStreaks = allEventsTillToday.map((s) => {
      const streaks: number[] = [];
      for (let i = 0; i < s.events.length - 1; i++) {
        streaks.push(dayjs(s.events[i + 1]?.date).diff(s.events[i]?.date, "days"));
      }

      return {
        id: s.id,
        streak: Math.max(...streaks),
      };
    });

    return streaks.map((s) => {
      const latestDefeat = latestDefeats.find((s2) => s.id === s2.id)?.date;

      return {
        ...s,
        percentage: percentages.find((s2) => s.id === s2.id)?.percentage,
        currentStreak: latestDefeat
          ? dayjs().diff(latestDefeat, "days")
          : dayjs().diff(streakStarts.find((s2) => s.id === s2.streakId)?.date, "days"),
        longestStreak: longestStreaks.find((s2) => s.id === s2.id)?.streak,
      };
    });
  }),
});
