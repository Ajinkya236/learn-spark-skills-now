
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProficiencyLevels } from "@/hooks/useProficiencyLevels";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";

interface LocalSkillMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

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

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Convert to local mapping format
  const localMappings: LocalSkillMapping[] = skillMappings.map(mapping => ({
    id: mapping.id,
    skill: mapping.skill,
    proficiencyDescription: mapping.proficiencyDescription,
    proficiencyLevel: mapping.proficiencyLevel,
    cluster: mapping.cluster,
    group: mapping.group,
    isActive: mapping.isActive
  }));

  const filteredLevels = proficiencyLevels.filter(level =>
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLevels.length / itemsPerPage);

  const handleCreateLevel = (levelData: any) => {
    toast.success("Create level functionality would be implemented here");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateLevel = (levelData: any) => {
    if (selectedLevel) {
      updateProficiencyLevel(selectedLevel.id, levelData);
    }
    setIsEditDialogOpen(false);
    setSelectedLevel(null);
  };

  const handleDeleteLevel = (id: string) => {
    toast.success("Delete level functionality would be implemented here");
  };

  const handleEditLevel = (level: any) => {
    setSelectedLevel(level);
    setIsEditDialogOpen(true);
  };

  const handleCreateMapping = (newMapping: Omit<LocalSkillMapping, 'id'>) => {
    const success = createSkillMapping({
      skill: newMapping.skill,
      proficiencyDescription: newMapping.proficiencyDescription,
      proficiencyLevel: newMapping.proficiencyLevel,
      cluster: newMapping.cluster,
      group: newMapping.group
    });
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateMapping = (id: string, updatedMapping: LocalSkillMapping) => {
    updateSkillMapping(id, {
      skill: updatedMapping.skill,
      proficiencyDescription: updatedMapping.proficiencyDescription,
      proficiencyLevel: updatedMapping.proficiencyLevel,
      cluster: updatedMapping.cluster,
      group: updatedMapping.group
    });
  };

  const handleDeleteMapping = (id: string) => {
    inactivateSkillMapping(id);
  };

  const handleImport = (data: any) => {
    toast.success("Import functionality would be implemented here");
    setIsImportDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
                <p className="text-muted-foreground">Manage global proficiency levels and skill-specific mappings</p>
              </div>
            </div>

            <Tabs defaultValue="global-levels" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global-levels">Global Proficiency Levels</TabsTrigger>
                <TabsTrigger value="skill-mappings">Skill Proficiency Mappings</TabsTrigger>
              </TabsList>

              <TabsContent value="global-levels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Global Proficiency Levels</CardTitle>
                        <CardDescription>Define the standard proficiency levels used across all skills</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Level
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search levels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <GlobalLevelsTable
                      proficiencyLevels={filteredLevels}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      onEdit={handleEditLevel}
                      onDelete={handleDeleteLevel}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skill-mappings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Skill Proficiency Mappings</CardTitle>
                        <CardDescription>Define specific proficiency descriptions for individual skills</CardDescription>
                      </div>
                      <Button onClick={() => setShowForm(!showForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Mapping
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showForm && (
                      <SkillMappingForm
                        skills={skills}
                        clusters={clusters}
                        groups={groups}
                        proficiencyLevels={proficiencyLevels}
                        onSubmit={handleCreateMapping}
                        onCancel={() => setShowForm(false)}
                      />
                    )}

                    <SkillMappingsTable
                      skillMappings={localMappings}
                      proficiencyLevels={proficiencyLevels}
                      onUpdate={handleUpdateMapping}
                      onDelete={handleDeleteMapping}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <EditLevelDialog
              open={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              onSubmit={handleCreateLevel}
              title="Create New Proficiency Level"
            />

            <EditLevelDialog
              open={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleUpdateLevel}
              title="Edit Proficiency Level"
              initialData={selectedLevel}
            />

            <ImportDialog
              open={isImportDialogOpen}
              onClose={() => setIsImportDialogOpen(false)}
              onImport={handleImport}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
