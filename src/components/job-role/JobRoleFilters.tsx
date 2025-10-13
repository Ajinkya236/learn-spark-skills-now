
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobRoleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const JobRoleFilters = ({
  searchTerm,
  onSearchChange
}: JobRoleFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Job Roles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job roles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};
