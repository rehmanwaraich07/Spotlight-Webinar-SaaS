import { cn } from "@/lib/utils";
import { Attendee } from "@prisma/client";
import React from "react";

type Props = {
  customer: Attendee;
  tags: string[];
  className?: string;
};

const UserInfoCard = ({ customer, tags, className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col w-fit text-primary p-3 pr-10 gap-3 rounded-lg border-[0.5px] border-border bg-background/10 backdrop-blur-[20px]",
        className
      )}
    >
      <h3 className="font-semibold text-xs">{customer.name}</h3>
      <p className="text-sm">{customer.email}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-foreground px-3 py-1 rounded-md border border-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserInfoCard;
