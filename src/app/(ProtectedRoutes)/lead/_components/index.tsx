"use client";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HomeIcon } from "lucide-react";
import React, { useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { leadData } from "../__tests__/data";

const LeadsPage = () => {
  const [search, setSearch] = useState("");

  const filteredLeads = leadData.filter((lead) => {
    const searchLower = search.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.toLowerCase().includes(searchLower) ||
      (lead.tags &&
        lead.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<FaUserGroup className="w-3 h-3 " />}
        mainIcon={<FaUser className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-4 h-4" />}
        heading="The Home to all your customers"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-sm text-muted-foreground">
              Phone
            </TableHead>
            <TableHead className="text-right text-sm text-muted-foreground">
              Tags
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead, idx) => (
            <TableRow key={idx} className="border-0">
              <TableCell className="font-medium">{lead?.name}</TableCell>
              <TableCell className="font-medium">{lead?.email}</TableCell>
              <TableCell className="font-medium">{lead?.phone}</TableCell>
              <TableCell className="text-right">
                {lead?.tags?.map((tag, idx) => (
                  <Badge key={idx} variant={"outline"}>
                    {tag}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsPage;
