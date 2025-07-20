"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarData } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { Triangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-18 sm:w-28 h-screen sticky top-0 py-10 px-2 sm:px-6 border bg-background border-border flex flex-col items-center justify-center gap-10">
      <div>
        <Triangle className="w-6 h-6 cursor-pointer" />
      </div>
      <div className="w-full h-full justify-between items-center flex flex-col">
        <div className="w-full h-fit flex flex-col gap-4 items-center justify-center">
          {sidebarData.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.link}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 ${
                      pathname.includes(item.link) ? "iconBackground" : ""
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 ${
                          pathname.includes(item.link) ? "" : "opacity-80"
                        }`}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="text-sm">{item.title}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;
