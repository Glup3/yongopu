import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { streakRouter } from "./streak";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  streak: streakRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
