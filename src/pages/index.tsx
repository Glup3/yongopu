import { type NextPage } from "next";
import Head from "next/head";

import { trpc } from "../utils/trpc";
import { StreakList, StreakListSkeletton } from "../components/Streak/StreakList";

const disableAutoRefetch = { refetchOnReconnect: false, refetchOnWindowFocus: false };

const Home: NextPage = () => {
  const { data: streaks } = trpc.streak.getUserStreaks.useQuery(undefined, {
    ...disableAutoRefetch,
  });

  return (
    <>
      <Head>
        <title>Yongopu</title>
        <meta name="description" content="Yongopu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-7">
        <h1 className="text-3xl font-semibold">Streaks</h1>
        {streaks ? <StreakList streaks={streaks} /> : <StreakListSkeletton />}
      </main>
    </>
  );
};

export default Home;
