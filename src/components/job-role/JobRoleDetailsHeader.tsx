
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface JobRole {
  id: string;
  title: string;
  business: string;
  group: string;
  department: string;
  maxSkills: number;
}

interface JobRoleDetailsHeaderProps {
  jobRole: JobRole;
  onBack: () => void;
}

export const JobRoleDetailsHeader = ({ jobRole, onBack }: JobRoleDetailsHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{jobRole.title}</h1>
        <p className="text-muted-foreground">{jobRole.business} • {jobRole.group} • {jobRole.department}</p>
      </div>
    </div>
  );
};
