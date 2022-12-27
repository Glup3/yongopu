import React from "react";
import { NavBar } from "./NavBar";

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = {};

export const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};
