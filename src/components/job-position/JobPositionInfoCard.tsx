
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobPosition {
  id: string;
  title: string;
  jobRole: string;
  reportingTo: string;
  description: string;
  rolesAndResponsibilities: string;
}

interface JobPositionInfoCardProps {
  jobPosition: JobPosition;
  currentSkillsCount: number;
}

export const JobPositionInfoCard = ({ jobPosition, currentSkillsCount }: JobPositionInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Position Information</CardTitle>
        <CardDescription>Overview of the job position details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mapped to Job Role</p>
            <Badge variant="outline" className="mt-1">
              {jobPosition.jobRole}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reporting To</p>
            <p className="mt-1">{jobPosition.reportingTo}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="mt-1 text-sm">{jobPosition.description}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Roles and Responsibilities</p>
          <p className="mt-1 text-sm">{jobPosition.rolesAndResponsibilities}</p>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Current Skills Count</p>
            <Badge variant="secondary">{currentSkillsCount} skills</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
