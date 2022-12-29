import { z } from "zod";
import { type StreakEvent } from "@prisma/client";
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
      const allStreakEvents = await ctx.prisma.streakEvent.findMany({
        where: { streakId: input.streakId },
        orderBy: { date: "asc" },
      });
      const latestStreakEvent: StreakEvent = allStreakEvents.at(-1) || {
        id: "",
        streakId: "",
        date: new Date(),
        eventType: "DEFEAT",
      };
      const streakStart = allStreakEvents.find((streak) => streak.eventType === "START");
      const streakDefeats = allStreakEvents.filter((streak) => streak.eventType === "DEFEAT");
      const currentStreak = calculateStreakDuration(latestStreakEvent, new Date());
      const longestStreak = calculateLongestStreak(allStreakEvents);
      const shortestStreak = calculateShortestStreak(allStreakEvents);
      const streakSuccessPercentage = streakStart
        ? calculateStreakSuccessPercentage(streakStart, new Date(), streakDefeats.length)
        : NaN;
      const totalDays = streakStart
        ? calculateStreakDuration(streakStart, new Date()).streak
        : undefined;
      const streakTotalSuccess = totalDays ? totalDays - streakDefeats.length : NaN;

      return {
        streakStart,
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
