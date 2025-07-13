
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings } from "lucide-react";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { useProficiencyLevels } from "@/hooks/useProficiencyLevels";
import { useState } from "react";

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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveMapping = (data) => {
    const success = createSkillMapping(data);
    if (success) {
      setIsFormOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
              <p className="text-muted-foreground">Manage global proficiency levels and skill mappings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{proficiencyLevels.length}</Badge>
                    <span className="text-sm font-medium">Global Levels</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{skillMappings.filter(m => m.isActive).length}</Badge>
                    <span className="text-sm font-medium">Active Mappings</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{skills.length}</Badge>
                    <span className="text-sm font-medium">Available Skills</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Proficiency Levels */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Global Proficiency Levels</CardTitle>
                    <CardDescription>
                      Define and manage proficiency levels used across the organization
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImportDialogOpen(true)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GlobalLevelsTable
                  levels={proficiencyLevels}
                  onEdit={setEditingLevel}
                  onUpdate={updateProficiencyLevel}
                />
              </CardContent>
            </Card>

            {/* Skill Proficiency Mappings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Skill Proficiency Mappings</CardTitle>
                    <CardDescription>
                      Map skills to specific proficiency descriptions and organize by clusters
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Mapping
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SkillMappingsTable
                  mappings={skillMappings.filter(m => m.isActive)}
                  onEdit={updateSkillMapping}
                  onInactivate={inactivateSkillMapping}
                />
              </CardContent>
            </Card>

            {/* Dialogs */}
            <EditLevelDialog
              level={editingLevel}
              open={!!editingLevel}
              onOpenChange={(open) => !open && setEditingLevel(null)}
              onSave={updateProficiencyLevel}
            />

            <ImportDialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
            />

            <SkillMappingForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              skills={skills}
              proficiencyLevels={proficiencyLevels}
              clusters={clusters}
              groups={groups}
              onSave={handleSaveMapping}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
