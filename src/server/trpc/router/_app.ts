import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { habitRouter } from "./habit";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  habit: habitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
