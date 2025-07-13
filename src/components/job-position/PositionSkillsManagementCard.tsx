
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PositionSkillsFilters } from "./PositionSkillsFilters";
import { PositionSkillsTable } from "./PositionSkillsTable";

interface JobPositionSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  type: 'Job Role specific' | 'Position specific';
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface PositionSkillsManagementCardProps {
  skills: JobPositionSkill[];
  searchTerm: string;
  proficiencyFilter: string;
  criticalityFilter: string;
  clusterFilter: string;
  groupFilter: string;
  typeFilter: string;
  currentPage: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onProficiencyFilterChange: (value: string) => void;
  onCriticalityFilterChange: (value: string) => void;
  onClusterFilterChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddSkills: () => void;
  onEditSkill: (skill: JobPositionSkill) => void;
  onDeleteSkill: (skill: JobPositionSkill) => void;
}

export const PositionSkillsManagementCard = ({
  skills,
  searchTerm,
  proficiencyFilter,
  criticalityFilter,
  clusterFilter,
  groupFilter,
  typeFilter,
  currentPage,
  totalPages,
  onSearchChange,
  onProficiencyFilterChange,
  onCriticalityFilterChange,
  onClusterFilterChange,
  onGroupFilterChange,
  onTypeFilterChange,
  onPageChange,
  onAddSkills,
  onEditSkill,
  onDeleteSkill
}: PositionSkillsManagementCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Skills and Proficiencies</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription>
            Manage skill requirements and proficiency levels for this job position
          </CardDescription>
          <Button onClick={onAddSkills}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skills
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PositionSkillsFilters
          searchTerm={searchTerm}
          proficiencyFilter={proficiencyFilter}
          criticalityFilter={criticalityFilter}
          clusterFilter={clusterFilter}
          groupFilter={groupFilter}
          typeFilter={typeFilter}
          onSearchChange={onSearchChange}
          onProficiencyFilterChange={onProficiencyFilterChange}
          onCriticalityFilterChange={onCriticalityFilterChange}
          onClusterFilterChange={onClusterFilterChange}
          onGroupFilterChange={onGroupFilterChange}
          onTypeFilterChange={onTypeFilterChange}
        />

        <PositionSkillsTable
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
