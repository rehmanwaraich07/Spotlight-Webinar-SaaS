import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full container mx-auto min-h-screen">{children}</div>
  );
};

export default Layout;
