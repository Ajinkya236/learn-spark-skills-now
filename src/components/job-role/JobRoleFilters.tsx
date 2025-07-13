
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building, Users, Briefcase } from "lucide-react";

interface JobRoleFiltersProps {
  searchTerm: string;
  businessFilter: string;
  groupFilter: string;
  departmentFilter: string;
  businesses: string[];
  groups: string[];
  departments: string[];
  onSearchChange: (value: string) => void;
  onBusinessFilterChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
  onDepartmentFilterChange: (value: string) => void;
}

export const JobRoleFilters = ({
  searchTerm,
  businessFilter,
  groupFilter,
  departmentFilter,
  businesses,
  groups,
  departments,
  onSearchChange,
  onBusinessFilterChange,
  onGroupFilterChange,
  onDepartmentFilterChange
}: JobRoleFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Job Roles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search job roles..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={businessFilter} onValueChange={onBusinessFilterChange}>
            <SelectTrigger>
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {businesses.map(business => (
                <SelectItem key={business} value={business}>{business}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={onGroupFilterChange}>
            <SelectTrigger>
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
            <SelectTrigger>
              <Briefcase className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(department => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
