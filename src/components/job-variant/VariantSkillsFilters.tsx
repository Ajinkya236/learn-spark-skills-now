import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface VariantSkillsFiltersProps {
  searchTerm: string;
  sourceFilter: string;
  proficiencyFilter: string;
  criticalityFilter: string;
  clusterFilter: string;
  groupFilter: string;
  onSearchChange: (value: string) => void;
  onSourceFilterChange: (value: string) => void;
  onProficiencyFilterChange: (value: string) => void;
  onCriticalityFilterChange: (value: string) => void;
  onClusterFilterChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
}

export const VariantSkillsFilters = ({
  searchTerm,
  sourceFilter,
  proficiencyFilter,
  criticalityFilter,
  clusterFilter,
  groupFilter,
  onSearchChange,
  onSourceFilterChange,
  onProficiencyFilterChange,
  onCriticalityFilterChange,
  onClusterFilterChange,
  onGroupFilterChange,
}: VariantSkillsFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 font-body"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Filter by Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="From Job Role">From Job Role</SelectItem>
            <SelectItem value="Variant specific">Variant specific</SelectItem>
          </SelectContent>
        </Select>
        <Select value={proficiencyFilter} onValueChange={onProficiencyFilterChange}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Filter by Proficiency" />
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
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Filter by Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Criticality Levels</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clusterFilter} onValueChange={onClusterFilterChange}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Filter by Cluster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clusters</SelectItem>
            <SelectItem value="Programming">Programming</SelectItem>
            <SelectItem value="Testing">Testing</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
          </SelectContent>
        </Select>

        <Select value={groupFilter} onValueChange={onGroupFilterChange}>
          <SelectTrigger className="font-body">
            <SelectValue placeholder="Filter by Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="Frontend Frameworks">Frontend Frameworks</SelectItem>
            <SelectItem value="Languages">Languages</SelectItem>
            <SelectItem value="State Management">State Management</SelectItem>
            <SelectItem value="Frontend Testing">Frontend Testing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};