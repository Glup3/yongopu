import Link from "next/link";
import React from "react";
import { Triangle } from "react-feather";
import { LoginLogoutButton } from "./LoginLogoutButton";

export const Navbar: React.FC = () => {
  return (
    <div className="container flex items-center justify-between mx-auto ">
      <div>
        <Link href="/">
          <span className="flex items-center font-semibold text-2xl">
            <Triangle className="mr-1" size={20} />
            Yongopu
          </span>
        </Link>
      </div>
      <div className="font-medium text-lg">
        <ul className="flex flex-row items-center">
          <li className="mr-6">
            <Link href="/streaks">Streaks</Link>
          </li>
          <li className="px-2">
            <LoginLogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};
