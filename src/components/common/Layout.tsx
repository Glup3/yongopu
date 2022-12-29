import React from "react";
import { Navbar } from "./Navbar";

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = {};

export const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <div className="max-w-[600px] mx-auto px-2">
      <Navbar />
      {children}
    </div>
  );
};
