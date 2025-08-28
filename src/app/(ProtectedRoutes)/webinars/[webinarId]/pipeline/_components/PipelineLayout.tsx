import UserInfoCard from "@/components/ReusableComponent/userInfoCard";
import { Badge } from "@/components/ui/badge";
import { CallStatusEnum } from "@prisma/client";
import React from "react";

type Props = {
  title: string;
  count: number;
  users: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    callStatus: CallStatusEnum;
  }[];
  tags: string[];
};

const PipelineLayout = ({ title, count, users, tags }: Props) => {
  return (
    <div className="flex flex-col w-full p-4 md:p-5 border border-border/60 bg-background/60 rounded-xl backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2
          className="text-sm md:text-base font-semibold truncate pr-3"
          title={title}
        >
          {title}
        </h2>
        <Badge variant={"secondary"}>{count}</Badge>
      </div>

      <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 md:pr-2 scrollbar-hide">
        {users.map((user, index) => (
          <UserInfoCard key={index} customer={user} tags={tags} />
        ))}
      </div>
    </div>
  );
};

export default PipelineLayout;
