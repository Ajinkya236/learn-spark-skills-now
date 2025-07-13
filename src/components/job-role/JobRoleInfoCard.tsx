
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Business</p>
            <p className="mt-1">{jobRole.business}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Group</p>
            <p className="mt-1">{jobRole.group}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Department</p>
            <p className="mt-1">{jobRole.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reporting To</p>
            <p className="mt-1">{additionalInfo.reportingTo}</p>
          </div>
        </div>
        
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
            <p className="text-sm font-medium text-muted-foreground">Current Skills / Max Skills</p>
            <Badge variant="secondary">{currentSkillsCount} / {jobRole.maxSkills}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
