import dayjs from "dayjs";
import { z } from "zod";
import {
  calculateStreakDuration,
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
        startDate: true,
        endDate: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return new Map<string, typeof streaks[0]>(streaks.map((streak) => [streak.id, streak]));
  }),
  getStreakEvents: protectedProcedure
    .input(z.object({ streakId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.streakEvent.findMany({
        where: { streakId: input.streakId },
      });
    }),
  calculateStreakStats: protectedProcedure
    .input(z.object({ streakId: z.string() }))
    .query(async ({ input, ctx }) => {
      const streakWithEvents = await ctx.prisma.streak.findFirstOrThrow({
        where: { id: input.streakId },
        select: {
          startDate: true,
          endDate: true,
          events: {
            where: { eventType: "DEFEAT" },
            orderBy: { date: "asc" },
          },
        },
      });

      const streakStartDate = streakWithEvents.startDate;
      const streakEndDate = streakWithEvents.endDate || dayjs().subtract(1, "days").toDate();
      const streakDefeats = streakWithEvents.events.map((s) => s.date);
      const latestStreakEventDate = streakDefeats.at(-1) || streakStartDate;
      const currentStreak = calculateStreakDuration(latestStreakEventDate, streakEndDate);
      const longestStreak = calculateLongestStreak(streakStartDate, streakEndDate, streakDefeats);
      const shortestStreak = calculateShortestStreak(streakStartDate, streakEndDate, streakDefeats);
      const streakSuccessPercentage = streakStartDate
        ? calculateStreakSuccessPercentage(streakStartDate, streakEndDate, streakDefeats.length)
        : NaN;
      const totalDays = streakStartDate
        ? calculateStreakDuration(streakStartDate, streakEndDate).streak
        : undefined;
      const streakTotalSuccess = totalDays ? totalDays - streakDefeats.length : NaN;

      return {
        streakStartDate,
        streakEndDate: streakWithEvents.endDate,
        streakDefeats: streakDefeats.length,
        longestStreak,
        shortestStreak,
        streakSuccessPercentage,
        currentStreak,
        totalDays,
        streakTotalSuccess,
      };
    }),
  toggleStreakEvent: protectedProcedure
    .input(
      z.object({
        streakEventId: z.string().optional(),
        eventDate: z.date(),
        streakId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (typeof input.streakEventId !== "undefined") {
        await ctx.prisma.streakEvent.delete({
          where: {
            id: input.streakEventId,
          },
        });
        return;
      }

      return ctx.prisma.streakEvent.create({
        data: { streakId: input.streakId, eventType: "DEFEAT", date: input.eventDate },
      });
    }),
});
