import Link from "next/link";
import React from "react";
import { Triangle } from "react-feather";

export const Navbar: React.FC = () => {
  return (
    <div className="container flex flex-wrap items-center justify-between mx-auto px-2">
      <div>
        <Link href="/">
          <span className="flex items-center">
            <Triangle className="mr-1" size={16} />
            Yongopu
          </span>
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <Link href="/streaks">Streaks</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
