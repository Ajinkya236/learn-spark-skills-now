
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AddSkillsHeaderProps {
  step: 'select' | 'configure';
  onBack: () => void;
}

export const AddSkillsHeader: React.FC<AddSkillsHeaderProps> = ({ step, onBack }) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack} size="sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {step === 'select' ? 'Select Skills' : 'Configure Skills'}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {step === 'select' ? 'Choose skills to add to the job position' : 'Set proficiency levels and criticality'}
        </p>
      </div>
    </div>
  );
};
