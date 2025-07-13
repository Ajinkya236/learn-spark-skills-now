
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { useProficiencyLevels } from "@/hooks/useProficiencyLevels";

const ProficiencyLevels = () => {
  const [activeTab, setActiveTab] = useState("global-levels");
  const [showMappingForm, setShowMappingForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

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

  const handleEditLevel = (level: any) => {
    setEditingLevel(level);
  };

  const handleSaveLevel = (updates: any) => {
    if (editingLevel) {
      updateProficiencyLevel(editingLevel.id, updates);
      setEditingLevel(null);
    }
  };

  const handleCreateMapping = (newMapping: any) => {
    const success = createSkillMapping(newMapping);
    if (success) {
      setShowMappingForm(false);
    }
  };

  const handleUpdateMapping = (id: string, updatedMapping: any) => {
    updateSkillMapping(id, updatedMapping);
  };

  const handleInactivateMapping = (id: string) => {
    inactivateSkillMapping(id);
  };

  const handleImport = (data: any) => {
    // Handle import logic here
    toast.success("Data imported successfully");
    setShowImportDialog(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
                <p className="text-muted-foreground">
                  Manage global proficiency levels and skill-specific proficiency mappings
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global-levels">Global Levels</TabsTrigger>
                <TabsTrigger value="skill-mappings">Skill Mappings</TabsTrigger>
              </TabsList>

              {/* Global Levels Tab */}
              <TabsContent value="global-levels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Proficiency Levels</CardTitle>
                    <CardDescription>
                      Define the standard proficiency levels used across all skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GlobalLevelsTable
                      levels={proficiencyLevels}
                      onEdit={handleEditLevel}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skill Mappings Tab */}
              <TabsContent value="skill-mappings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Skill Proficiency Mappings</CardTitle>
                        <CardDescription>
                          Define specific proficiency descriptions for each skill and level
                        </CardDescription>
                      </div>
                      <Button onClick={() => setShowMappingForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Mapping
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SkillMappingsTable
                      mappings={skillMappings.filter(m => m.isActive)}
                      onEdit={handleUpdateMapping}
                      onInactivate={handleInactivateMapping}
                    />
                  </CardContent>
                </Card>

                {/* Mapping Form */}
                {showMappingForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Skill Proficiency Mapping</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SkillMappingForm
                        skills={skills}
                        proficiencyLevels={proficiencyLevels}
                        clusters={clusters}
                        groups={groups}
                        onSubmit={handleCreateMapping}
                        onCancel={() => setShowMappingForm(false)}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Edit Level Dialog */}
            <EditLevelDialog
              level={editingLevel}
              open={!!editingLevel}
              onOpenChange={(open) => !open && setEditingLevel(null)}
              onSave={handleSaveLevel}
            />

            {/* Import Dialog */}
            <ImportDialog
              open={showImportDialog}
              onOpenChange={setShowImportDialog}
              onImport={handleImport}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
