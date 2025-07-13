
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AddSkillsHeader } from "@/components/job-position/AddSkillsHeader";
import { SkillSelectionStep } from "@/components/job-position/SkillSelectionStep";
import { SkillConfigurationStep } from "@/components/job-position/SkillConfigurationStep";
import { useAddSkillsToJobPosition } from "@/hooks/useAddSkillsToJobPosition";

const AddSkillsToJobPosition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    searchTerm,
    setSearchTerm,
    step,
    selectedSkills,
    suggestedSkills,
    toggleSkillSelection,
    proceedToConfiguration,
    updateSkillConfig,
    removeSkill,
    handleSubmit,
    handleBack
  } = useAddSkillsToJobPosition();

  const onBack = () => {
    const shouldNavigateBack = handleBack();
    if (shouldNavigateBack || step === 'select') {
      navigate(`/skills/job-position-relationship/${id}`);
    }
  };

  const onSubmit = () => {
    const success = handleSubmit();
    if (success) {
      navigate(`/skills/job-position-relationship/${id}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <AddSkillsHeader step={step} onBack={onBack} />

            {step === 'select' && (
              <SkillSelectionStep
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                suggestedSkills={suggestedSkills}
                onToggleSkill={toggleSkillSelection}
                onProceed={proceedToConfiguration}
              />
            )}

            {step === 'configure' && (
              <SkillConfigurationStep
                selectedSkills={selectedSkills}
                onUpdateSkillConfig={updateSkillConfig}
                onRemoveSkill={removeSkill}
                onBackToSelection={() => handleBack()}
                onSubmit={onSubmit}
              />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AddSkillsToJobPosition;
