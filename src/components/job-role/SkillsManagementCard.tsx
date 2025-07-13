
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SkillsFilters } from "./SkillsFilters";
import { SkillsTable } from "./SkillsTable";

interface JobRoleSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface SkillsManagementCardProps {
  skills: JobRoleSkill[];
  searchTerm: string;
  proficiencyFilter: string;
  criticalityFilter: string;
  clusterFilter: string;
  groupFilter: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onProficiencyFilterChange: (value: string) => void;
  onCriticalityFilterChange: (value: string) => void;
  onClusterFilterChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddSkills: () => void;
  onEditSkill: (skill: JobRoleSkill) => void;
  onDeleteSkill: (skill: JobRoleSkill) => void;
}

export const SkillsManagementCard = ({
  skills,
  searchTerm,
  proficiencyFilter,
  criticalityFilter,
  clusterFilter,
  groupFilter,
  currentPage,
  totalPages,
  onSearchChange,
  onProficiencyFilterChange,
  onCriticalityFilterChange,
  onClusterFilterChange,
  onGroupFilterChange,
  onPageChange,
  onAddSkills,
  onEditSkill,
  onDeleteSkill
}: SkillsManagementCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Skills and Proficiencies</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription>
            Manage skill requirements and proficiency levels
          </CardDescription>
          <Button onClick={onAddSkills}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skills
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SkillsFilters
          searchTerm={searchTerm}
          proficiencyFilter={proficiencyFilter}
          criticalityFilter={criticalityFilter}
          clusterFilter={clusterFilter}
          groupFilter={groupFilter}
          onSearchChange={onSearchChange}
          onProficiencyFilterChange={onProficiencyFilterChange}
          onCriticalityFilterChange={onCriticalityFilterChange}
          onClusterFilterChange={onClusterFilterChange}
          onGroupFilterChange={onGroupFilterChange}
        />

        <SkillsTable
          skills={skills}
          currentPage={currentPage}
          totalPages={totalPages}
          onEditSkill={onEditSkill}
          onDeleteSkill={onDeleteSkill}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
};
