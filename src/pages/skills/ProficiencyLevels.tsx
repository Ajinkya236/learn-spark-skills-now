
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Upload } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { useProficiencyLevels } from "@/hooks/useProficiencyLevels";

const ProficiencyLevels = () => {
  const {
    proficiencyLevels,
    skillMappings,
    skills,
    clusters,
    groups,
    updateProficiencyLevel,
    createSkillMapping,
    updateSkillMapping,
    inactivateSkillMapping
  } = useProficiencyLevels();

  const [editingLevel, setEditingLevel] = useState(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showMappingForm, setShowMappingForm] = useState(false);

  const activeSkillMappings = skillMappings.filter(mapping => mapping.isActive);

  const statsData = [
    {
      title: "Global Proficiency Levels",
      value: proficiencyLevels.length,
      description: "Total levels defined",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Active Skill Mappings", 
      value: activeSkillMappings.length,
      description: "Skills with proficiency descriptions",
      icon: Plus,
      color: "bg-green-500"
    }
  ];

  const handleImport = (file: File) => {
    // Mock import functionality
    console.log('Importing file:', file.name);
    setShowImportDialog(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Proficiency Levels
                  </h1>
                  <p className="text-muted-foreground">
                    Manage global proficiency levels and skill-specific proficiency descriptions
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Global Proficiency Levels */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Global Proficiency Levels</CardTitle>
                  <CardDescription>
                    Define organization-wide proficiency levels with descriptions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowImportDialog(true)} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </CardHeader>
              <CardContent>
                <GlobalLevelsTable
                  levels={proficiencyLevels}
                  onEdit={setEditingLevel}
                />
              </CardContent>
            </Card>

            {/* Skill Proficiency Mappings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Skill Proficiency Mappings</CardTitle>
                  <CardDescription>
                    Define skill-specific proficiency descriptions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowMappingForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill Mapping
                </Button>
              </CardHeader>
              <CardContent>
                <SkillMappingsTable
                  mappings={activeSkillMappings}
                  onEdit={(mapping) => {
                    // Handle edit logic here
                  }}
                  onInactivate={inactivateSkillMapping}
                />
              </CardContent>
            </Card>

            {/* Dialogs */}
            <EditLevelDialog
              level={editingLevel}
              open={!!editingLevel}
              onOpenChange={(open) => !open && setEditingLevel(null)}
              onSave={(updates) => {
                if (editingLevel) {
                  updateProficiencyLevel(editingLevel.id, updates);
                  setEditingLevel(null);
                }
              }}
            />

            <ImportDialog
              open={showImportDialog}
              onOpenChange={setShowImportDialog}
              onImport={handleImport}
            />

            <SkillMappingForm
              open={showMappingForm}
              onOpenChange={setShowMappingForm}
              skills={skills}
              proficiencyLevels={proficiencyLevels}
              onSave={(data) => {
                const success = createSkillMapping(data);
                if (success) {
                  setShowMappingForm(false);
                }
              }}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
