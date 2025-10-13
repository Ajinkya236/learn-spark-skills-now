
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobRole {
  id: string;
  title: string;
  business: string;
  group: string;
  department: string;
  maxSkills: number;
}

interface JobRoleInfoCardProps {
  jobRole: JobRole;
  currentSkillsCount: number;
}

export const JobRoleInfoCard = ({ jobRole, currentSkillsCount }: JobRoleInfoCardProps) => {
  // Mock additional data
  const additionalInfo = {
    reportingTo: 'Engineering Manager',
    description: 'Responsible for designing, developing, and maintaining software applications using modern technologies and best practices.',
    rolesAndResponsibilities: 'Write clean, maintainable code; participate in code reviews; collaborate with cross-functional teams; mentor junior developers; contribute to technical architecture decisions.'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Role Information</CardTitle>
        <CardDescription>Overview of the job role details and current skill requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="mt-1 text-sm">{additionalInfo.description}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Roles and Responsibilities</p>
          <p className="mt-1 text-sm">{additionalInfo.rolesAndResponsibilities}</p>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Current Skills</p>
            <Badge variant="secondary">{currentSkillsCount} Skills Mapped</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
