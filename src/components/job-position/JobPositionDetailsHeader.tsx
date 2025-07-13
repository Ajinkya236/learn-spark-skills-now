
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface JobPosition {
  id: string;
  title: string;
  jobRole: string;
  reportingTo: string;
  description: string;
  rolesAndResponsibilities: string;
}

interface JobPositionDetailsHeaderProps {
  jobPosition: JobPosition;
  onBack: () => void;
}

export const JobPositionDetailsHeader = ({ jobPosition, onBack }: JobPositionDetailsHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {jobPosition.title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Job Position Details and Skill Requirements
        </p>
      </div>
    </div>
  );
};
