import { ChevronDown } from "lucide-react";
import React from "react";

type Props = {
  value: string;
  placeholder?: string;
};

const DropDownSelect = ({ value, placeholder }: Props) => {
  const displayText = value || placeholder;
  const textClass = value ? "" : "text-neutral-400";

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2">
        <span className={textClass}>{displayText}</span>
        <ChevronDown className="h-4 w-4 text-neutral-400" />
      </div>
    </div>
  );
};

export default DropDownSelect;
