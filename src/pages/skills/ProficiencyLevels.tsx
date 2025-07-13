
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProficiencyLevels, SkillProficiencyMapping, ProficiencyLevel } from "@/hooks/useProficiencyLevels";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";

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

  // Dialog states
  const [editLevelOpen, setEditLevelOpen] = useState(false);
  const [createMappingOpen, setCreateMappingOpen] = useState(false);
  const [editMappingOpen, setEditMappingOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [inactivateOpen, setInactivateOpen] = useState(false);

  // Form states
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<SkillProficiencyMapping | null>(null);
  const [editLevel, setEditLevel] = useState<{ title: string; description: string }>({ title: "", description: "" });
  const [newMapping, setNewMapping] = useState<Omit<SkillProficiencyMapping, 'id' | 'isActive'>>({
    skill: "",
    proficiencyDescription: "",
    proficiencyLevel: "",
    cluster: "",
    group: ""
  });
  const [editMapping, setEditMapping] = useState<Omit<SkillProficiencyMapping, 'id' | 'isActive'>>({
    skill: "",
    proficiencyDescription: "",
    proficiencyLevel: "",
    cluster: "",
    group: ""
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handlers
  const handleEditLevel = (level: ProficiencyLevel) => {
    setSelectedLevel(level);
    setEditLevel({ title: level.title, description: level.description });
    setEditLevelOpen(true);
  };

  const handleSaveLevel = () => {
    if (selectedLevel && editLevel.title && editLevel.description) {
      updateProficiencyLevel(selectedLevel.id, editLevel);
      setEditLevelOpen(false);
      setSelectedLevel(null);
    }
  };

  const handleCreateMapping = () => {
    if (createSkillMapping(newMapping)) {
      setCreateMappingOpen(false);
      setNewMapping({ skill: "", proficiencyDescription: "", proficiencyLevel: "", cluster: "", group: "" });
    }
  };

  const handleEditMapping = (mapping: SkillProficiencyMapping) => {
    setSelectedMapping(mapping);
    setEditMapping({
      skill: mapping.skill,
      proficiencyDescription: mapping.proficiencyDescription,
      proficiencyLevel: mapping.proficiencyLevel,
      cluster: mapping.cluster,
      group: mapping.group
    });
    setEditMappingOpen(true);
  };

  const handleSaveMapping = () => {
    if (selectedMapping && updateSkillMapping(selectedMapping.id, editMapping)) {
      setEditMappingOpen(false);
      setSelectedMapping(null);
    }
  };

  const handleInactivateMapping = (mapping: SkillProficiencyMapping) => {
    setSelectedMapping(mapping);
    setInactivateOpen(true);
  };

  const handleConfirmInactivate = () => {
    if (selectedMapping) {
      inactivateSkillMapping(selectedMapping.id);
      setInactivateOpen(false);
      setSelectedMapping(null);
    }
  };

  const exportMappings = () => {
    const csvContent = "Cluster,Skill,Group,Proficiency,Level\n" + 
      skillMappings.filter(m => m.isActive).map(m => 
        `${m.cluster},${m.skill},${m.group},${m.proficiencyDescription},${m.proficiencyLevel}`
      ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill_proficiency_mappings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const activeMappings = skillMappings.filter(m => m.isActive);
  const totalPages = Math.ceil(activeMappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMappings = activeMappings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Skill Proficiency Management</h1>
              <p className="text-muted-foreground">Manage skill proficiency mappings and global proficiency levels</p>
            </div>

            <Tabs defaultValue="mappings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="mappings">Skill Proficiency Mappings</TabsTrigger>
                <TabsTrigger value="levels">Global Proficiency Levels</TabsTrigger>
              </TabsList>

              <TabsContent value="mappings" className="space-y-6">
                <SkillMappingsTable
                  skillMappings={paginatedMappings}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onCreateMapping={() => setCreateMappingOpen(true)}
                  onImportOpen={() => setImportOpen(true)}
                  onExportMappings={exportMappings}
                  onEditMapping={handleEditMapping}
                  onInactivateMapping={handleInactivateMapping}
                />
              </TabsContent>

              <TabsContent value="levels" className="space-y-6">
                <GlobalLevelsTable
                  proficiencyLevels={proficiencyLevels}
                  onEditLevel={handleEditLevel}
                />
              </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <SkillMappingForm
              open={createMappingOpen}
              onOpenChange={setCreateMappingOpen}
              title="Add Skill Proficiency Mapping"
              mapping={newMapping}
              onMappingChange={setNewMapping}
              onSubmit={handleCreateMapping}
              skills={skills}
              clusters={clusters}
              groups={groups}
              proficiencyLevels={proficiencyLevels}
            />

            <SkillMappingForm
              open={editMappingOpen}
              onOpenChange={setEditMappingOpen}
              title="Edit Skill Proficiency Mapping"
              mapping={editMapping}
              onMappingChange={setEditMapping}
              onSubmit={handleSaveMapping}
              skills={skills}
              clusters={clusters}
              groups={groups}
              proficiencyLevels={proficiencyLevels}
            />

            <EditLevelDialog
              open={editLevelOpen}
              onOpenChange={setEditLevelOpen}
              level={editLevel}
              onLevelChange={setEditLevel}
              onSave={handleSaveLevel}
            />

            <ImportDialog
              open={importOpen}
              onOpenChange={setImportOpen}
            />

            {/* Inactivate Confirmation Dialog */}
            <AlertDialog open={inactivateOpen} onOpenChange={setInactivateOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Inactivate Proficiency Mapping</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to inactivate this skill proficiency mapping? 
                    It will be moved to the inactive bin and can be restored later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setInactivateOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmInactivate} className="bg-blue-600 hover:bg-blue-700">
                    Inactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
