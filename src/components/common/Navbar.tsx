import Link from "next/link";
import React from "react";
import { Triangle } from "react-feather";

export const Navbar: React.FC = () => {
  return (
    <div className="container flex flex-wrap items-center justify-between mx-auto px-2">
      <div>
        <Link href="/">
          <span className="flex items-center font-semibold text-2xl">
            <Triangle className="mr-1" size={20} />
            Yongopu
          </span>
        </Link>
      </div>
      <div className="font-medium text-lg">
        <ul>
          <li>
            <Link href="/streaks">Streaks</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
