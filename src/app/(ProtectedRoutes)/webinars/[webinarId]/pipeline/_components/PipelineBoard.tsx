"use client";

import React from "react";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { FaUserGroup } from "react-icons/fa6";
import { RiMenu3Line } from "react-icons/ri";
import { HomeIcon } from "lucide-react";
import PipelineLayout from "./PipelineLayout";
import { AttendedTypeEnum, CallStatusEnum } from "@prisma/client";
import { formatColumnTitle } from "./utils";

type PipelineUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  callStatus: CallStatusEnum;
};

type PipelineColumn = {
  count: number;
  users: PipelineUser[];
};

type PipelineData = {
  data: Record<string, PipelineColumn> | null;
  webinarTags: string[] | null;
};

type Props = {
  pipelineData: PipelineData;
};

const PipelineBoard = ({ pipelineData }: Props) => {
  const [query, setQuery] = React.useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredEntries = React.useMemo(() => {
    const entries = Object.entries(pipelineData.data ?? {});
    if (!normalizedQuery) return entries;

    return entries.map(([columnType, columnData]) => {
      const users = columnData.users.filter((u) => {
        const nameMatch = u.name?.toLowerCase().includes(normalizedQuery);
        const emailMatch = u.email?.toLowerCase().includes(normalizedQuery);
        return Boolean(nameMatch || emailMatch);
      });

      return [columnType, { count: users.length, users }] as const;
    });
  }, [pipelineData.data, normalizedQuery]);

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<FaUserGroup className="w-3 h-3 " />}
        mainIcon={<RiMenu3Line className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-4 h-4" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name or Email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {filteredEntries.map(([columnType, columnData]) => (
          <PipelineLayout
            key={columnType}
            title={formatColumnTitle(columnType as AttendedTypeEnum)}
            count={columnData.count}
            users={columnData.users}
            tags={pipelineData.webinarTags ?? []}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;
