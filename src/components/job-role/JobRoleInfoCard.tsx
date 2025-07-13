
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Role Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Maximum Skills</p>
            <p className="font-medium">{jobRole.maxSkills}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Skills</p>
            <p className="font-medium">{currentSkillsCount} / {jobRole.maxSkills}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
