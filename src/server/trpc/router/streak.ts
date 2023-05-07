import { z } from "zod";
import { calculateStreakStats } from "../../core/streak_logic";

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

      const startDate = streakWithEvents.startDate;
      const endDate = streakWithEvents.endDate;
      const defeats = streakWithEvents.events.map((s) => s.date);
      const streakStats = calculateStreakStats(startDate, endDate, defeats);

      return streakStats;
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

  deleteStreak: protectedProcedure
    .input(z.object({ streakId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.streak.delete({
        where: {
          id: input.streakId,
        },
      });
    }),

  updateStreakTitle: protectedProcedure
    .input(z.object({ streakId: z.string(), streakTitle: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.streak.update({
        where: { id: input.streakId },
        data: {
          title: input.streakTitle,
        },
      });
    }),
});
