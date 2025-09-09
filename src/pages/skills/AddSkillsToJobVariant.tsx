import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AddVariantSkillsHeader } from "@/components/job-variant/AddVariantSkillsHeader";
import { VariantSkillSelectionStep } from "@/components/job-variant/VariantSkillSelectionStep";
import { VariantSkillConfigurationStep } from "@/components/job-variant/VariantSkillConfigurationStep";
import { useAddSkillsToJobVariant } from "@/hooks/useAddSkillsToJobVariant";

const AddSkillsToJobVariant = () => {
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
  } = useAddSkillsToJobVariant();

  const onBack = () => {
    const shouldNavigateBack = handleBack();
    if (shouldNavigateBack || step === 'select') {
      navigate(`/skills/job-variant-relationship/${id}`);
    }
  };

  const onSubmit = () => {
    const success = handleSubmit();
    if (success) {
      navigate(`/skills/job-variant-relationship/${id}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <AddVariantSkillsHeader step={step} onBack={onBack} />

            {step === 'select' && (
              <VariantSkillSelectionStep
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                suggestedSkills={suggestedSkills}
                onToggleSkill={toggleSkillSelection}
                onProceed={proceedToConfiguration}
              />
            )}

            {step === 'configure' && (
              <VariantSkillConfigurationStep
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

export default AddSkillsToJobVariant;