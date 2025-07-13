
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface PositionSkillsFiltersProps {
  searchTerm: string;
  proficiencyFilter: string;
  criticalityFilter: string;
  clusterFilter: string;
  groupFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onProficiencyFilterChange: (value: string) => void;
  onCriticalityFilterChange: (value: string) => void;
  onClusterFilterChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const PositionSkillsFilters = ({
  searchTerm,
  proficiencyFilter,
  criticalityFilter,
  clusterFilter,
  groupFilter,
  typeFilter,
  onSearchChange,
  onProficiencyFilterChange,
  onCriticalityFilterChange,
  onClusterFilterChange,
  onGroupFilterChange,
  onTypeFilterChange
}: PositionSkillsFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={proficiencyFilter} onValueChange={onProficiencyFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Proficiency Levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Proficiency Levels</SelectItem>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
          <SelectItem value="Expert">Expert</SelectItem>
        </SelectContent>
      </Select>
      <Select value={criticalityFilter} onValueChange={onCriticalityFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Criticality" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Criticality</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={clusterFilter} onValueChange={onClusterFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Clusters" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clusters</SelectItem>
          <SelectItem value="Programming">Programming</SelectItem>
          <SelectItem value="Soft Skills">Soft Skills</SelectItem>
        </SelectContent>
      </Select>
      <Select value={groupFilter} onValueChange={onGroupFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Groups" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Groups</SelectItem>
          <SelectItem value="Frontend Development">Frontend Development</SelectItem>
          <SelectItem value="Backend Development">Backend Development</SelectItem>
          <SelectItem value="Leadership">Leadership</SelectItem>
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Job Role specific">Job Role specific</SelectItem>
          <SelectItem value="Position specific">Position specific</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
