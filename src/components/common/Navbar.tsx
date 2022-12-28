import Link from "next/link";
import React from "react";

export const NavBar: React.FC = () => {
  return (
    <div className="container flex flex-wrap items-center justify-between mx-auto">
      <div>
        <Link href="/">Yongopu</Link>
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
