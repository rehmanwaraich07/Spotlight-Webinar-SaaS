import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
  label: string;
  showInfo?: boolean;
  children: ReactNode;
};

const ConfigField = ({ label, showInfo, children }: Props) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <Label className="font-medium">{label}</Label>
        {showInfo && <Info className="h-4 w-4 text-neutral-500 ml-2" />}
      </div>
      {children}
    </div>
  );
};

export default ConfigField;
