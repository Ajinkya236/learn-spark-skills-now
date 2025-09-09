import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AddVariantSkillsHeaderProps {
  step: 'select' | 'configure';
  onBack: () => void;
}

export const AddVariantSkillsHeader = ({ step, onBack }: AddVariantSkillsHeaderProps) => {
  const getTitle = () => {
    switch (step) {
      case 'select':
        return 'Select Skills for Job Variant';
      case 'configure':
        return 'Configure Selected Skills';
      default:
        return 'Add Skills to Job Variant';
    }
  };

  const getDescription = () => {
    switch (step) {
      case 'select':
        return 'Choose skills from the suggested list based on job role mapping and recommendations';
      case 'configure':
        return 'Set proficiency levels and criticality for each selected skill';
      default:
        return 'Add skills to the job variant';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="font-body"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-heading text-primary">{getTitle()}</h1>
          <p className="text-muted-foreground font-body">
            {getDescription()}
          </p>
        </div>
      </div>
    </div>
  );
};