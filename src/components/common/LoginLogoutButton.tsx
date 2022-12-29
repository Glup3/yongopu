import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Key, LogOut } from "react-feather";

const size = 20;

export const LoginLogoutButton = () => {
  const { data: sessionData } = useSession();

  return (
    <button className="pt-1" onClick={sessionData ? () => signOut() : () => signIn("spotify")}>
      {sessionData ? <LogOut size={size} /> : <Key size={size} color="#f59e0b" />}
    </button>
  );
};
