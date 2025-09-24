import { ScrollArea } from "@/components/ui/scroll-area";
import { IoSettings } from "react-icons/io5";
import ModelConfiguration from "./ModelConfiguration";

type Props = {};

const ModalSection = (props: Props) => {
  return (
    <div className="p-8 flex-1 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-5 w-5 rounded-full flex items-center justify-center text-xs">
          <IoSettings />
        </span>
        <span className="uppercase text-sm font-medium">MODEL</span>
      </div>

      <ScrollArea>
        <ModelConfiguration />
      </ScrollArea>
    </div>
  );
};

export default ModalSection;
