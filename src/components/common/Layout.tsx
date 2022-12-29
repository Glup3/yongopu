import React from "react";
import { Navbar } from "./Navbar";

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = {};

export const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
