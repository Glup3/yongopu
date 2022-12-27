import { type NextApiRequest, type NextApiResponse } from "next";
import dayjs from "dayjs";

import { env } from "../../env/server.mjs";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

const seed = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: "Not Authenticated." });
  }

  if (env.NODE_ENV !== "development") {
    return res
      .status(500)
      .json({ error: "Seeding function is only available in development." });
  }

  if (typeof session.user?.id === "undefined") {
    return res.status(500).json({ error: "User undefined" });
  }

  await prisma.habit.deleteMany({ where: { userId: session.user.id } });
  await prisma.habit.createMany({
    data: [
      {
        id: `${session.user.id}-habit1`,
        title: "Exercising",
        userId: session.user.id,
      },
      {
        id: `${session.user.id}-habit2`,
        title: "Sleeping",
        userId: session.user.id,
      },
      {
        id: `${session.user.id}-habit3`,
        title: "Anime",
        userId: session.user.id,
      },
    ],
  });
  await prisma.habitEvent.createMany({
    data: [
      {
        id: `${session.user.id}-habit1-e1`,
        habitId: `${session.user.id}-habit1`,
        date: dayjs().subtract(30, "days").toDate(),
        eventType: "START",
      },
      {
        id: `${session.user.id}-habit1-e2`,
        habitId: `${session.user.id}-habit1`,
        date: dayjs().subtract(20, "days").toDate(),
        eventType: "DEFEAT",
      },
      {
        id: `${session.user.id}-habit1-e3`,
        habitId: `${session.user.id}-habit1`,
        date: dayjs().subtract(10, "days").toDate(),
        eventType: "DEFEAT",
      },
      {
        id: `${session.user.id}-habit2-e1`,
        habitId: `${session.user.id}-habit2`,
        date: dayjs().subtract(46, "days").toDate(),
        eventType: "START",
      },
      {
        id: `${session.user.id}-habit2-e2`,
        habitId: `${session.user.id}-habit2`,
        date: dayjs().subtract(12, "days").toDate(),
        eventType: "DEFEAT",
      },
      {
        id: `${session.user.id}-habit3-e1`,
        habitId: `${session.user.id}-habit3`,
        date: dayjs().subtract(231, "days").toDate(),
        eventType: "START",
      },
    ],
  });
  res.status(200).json({});
};

export default seed;