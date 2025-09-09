import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantSkillsFilters } from "./VariantSkillsFilters";
import { VariantSkillsTable } from "./VariantSkillsTable";

interface JobVariantSkill {
  id: string;
  no: number;
  skillName: string;
  source: 'From Job Role' | 'Variant specific';
  proficiencyLevel: string;
  proficiencyDescription: string[];
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface VariantSkillsManagementCardProps {
  skills: JobVariantSkill[];
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
  onEditSkill: (skill: JobVariantSkill) => void;
  onDeleteSkill: (skill: JobVariantSkill) => void;
}

export const VariantSkillsManagementCard = ({
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
}: VariantSkillsManagementCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Required Skills and Proficiencies</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription className="font-body">
            Manage skill requirements and proficiency levels for this job variant
          </CardDescription>
          <Button onClick={onAddSkills} className="font-body">
            <Plus className="h-4 w-4 mr-2" />
            Add Skills
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <VariantSkillsFilters
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

        <VariantSkillsTable
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