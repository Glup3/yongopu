import { router } from "../trpc";
import { exampleRouter } from "./example";
import { streakRouter } from "./streak";

export const appRouter = router({
  example: exampleRouter,
  streak: streakRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
