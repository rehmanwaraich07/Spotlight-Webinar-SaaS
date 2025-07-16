import React from "react";

type Props = {
  heading?: string;
  leftIcon: React.ReactNode;
  mainIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  children: React.ReactNode;
  placeholder?: string;
};

const PageHeader = ({
  heading,
  children,
  leftIcon,
  mainIcon,
  rightIcon,
}: Props) => {
  return <div className="flex flex-col w-full gap-8"></div>;
};

export default PageHeader;
