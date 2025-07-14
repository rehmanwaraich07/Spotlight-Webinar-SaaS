import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  children?: React.ReactNode;
  heading: string;
  link: string;
  className?: string;
};

const FeatureSectionLayout = ({
  children,
  heading,
  link,
  className,
}: Props) => {
  return (
    <div
      className={`p-10 flex items-center justify-between flex-col gap-10 border rounded-3xl border-border bg-background/10 ${className}}`}
    >
      {children}

      <div className="w-full justify-between items-center flex flex-wrap gap-10">
        <h3 className="sm:w-[70%] font-semibold text-3xl text-primary">
          {heading}
        </h3>
        <Link
          href={link}
          className="text-primary font-semibold text-lg flex items-center justify-center rounded-md opacity-50"
        >
          <span>View</span> <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureSectionLayout;
