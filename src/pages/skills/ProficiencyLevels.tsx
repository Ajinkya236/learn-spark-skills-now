import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { SkillProficiencyStats } from "@/components/skills/SkillProficiencyStats";
import { SkillMappingTable } from "@/components/skills/SkillMappingTable";
import { SkillMappingForm } from "@/components/skills/SkillMappingForm";
import { BulkImportDialog } from "@/components/taxonomy/BulkImportDialog";

interface Skill {
  id: string;
  name: string;
}

interface ProficiencyLevel {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  order: number;
}

interface SkillMapping {
  id?: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const ProficiencyLevels = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<SkillMapping | null>(null);
  const [mappings, setMappings] = useState<SkillMapping[]>([
    {
      id: '1',
      skillName: 'Python Programming',
      proficiencyLevelId: '1',
      minScore: 0,
      maxScore: 25,
      description: 'Basic Python syntax and concepts'
    },
    {
      id: '2',
      skillName: 'Python Programming',
      proficiencyLevelId: '2',
      minScore: 26,
      maxScore: 75,
      description: 'Intermediate Python programming skills'
    },
    {
      id: '3',
      skillName: 'Python Programming',
      proficiencyLevelId: '3',
      minScore: 76,
      maxScore: 100,
      description: 'Advanced Python development and architecture'
    }
  ]);
  const skills: Skill[] = [{ id: '1', name: 'Python Programming' }];
  const proficiencyLevels: ProficiencyLevel[] = [
    {
      id: '1',
      title: 'Beginner',
      description: 'Basic syntax',
      minScore: 0,
      maxScore: 25,
      order: 1
    },
    {
      id: '2',
      title: 'Intermediate',
      description: 'Advanced concepts',
      minScore: 26,
      maxScore: 75,
      order: 2
    },
    {
      id: '3',
      title: 'Expert',
      description: 'Architecture & mentoring',
      minScore: 76,
      maxScore: 100,
      order: 3
    }
  ];

  const handleCreateMapping = (newMapping: SkillMapping) => {
    // In a real application, you would send this data to an API
    setMappings([...mappings, { ...newMapping, id: Date.now().toString() }]);
    setCreateDialogOpen(false);
  };

  const handleEditMapping = (editedMapping: SkillMapping) => {
    // In a real application, you would send this data to an API
    setMappings(mappings.map(mapping => mapping.id === editedMapping.id ? editedMapping : mapping));
    setEditDialogOpen(false);
  };

  const handleDeleteMapping = (mappingId: string) => {
    // In a real application, you would send this data to an API
    setMappings(mappings.filter(mapping => mapping.id !== mappingId));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Proficiency Levels</h2>
                <p className="text-muted-foreground">
                  Manage skill proficiency levels and mappings
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              <SkillProficiencyStats mappings={mappings} />
            </div>

            {/* Skill Mapping Table */}
            <SkillMappingTable
              mappings={mappings}
              onEdit={(mapping) => {
                setSelectedMapping(mapping);
                setEditDialogOpen(true);
              }}
              onDelete={handleDeleteMapping}
              onCreate={() => setCreateDialogOpen(true)}
              onBulkImportClick={() => setBulkImportOpen(true)}
            />

            {/* Create Mapping Dialog */}
            <SkillMappingForm
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              title="Create Skill Proficiency Mapping"
              mapping={{
                skillName: '',
                proficiencyLevelId: '',
                minScore: 0,
                maxScore: 100,
                description: ''
              }}
              skills={skills}
              onSave={handleCreateMapping}
              proficiencyLevels={proficiencyLevels}
            />

            {/* Edit Mapping Dialog */}
            <SkillMappingForm
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              title="Edit Skill Proficiency Mapping"
              mapping={selectedMapping || {
                skillName: '',
                proficiencyLevelId: '',
                minScore: 0,
                maxScore: 100,
                description: ''
              }}
              skills={skills}
              onSave={handleEditMapping}
              proficiencyLevels={proficiencyLevels}
            />

            {/* Bulk Import Dialog */}
            <BulkImportDialog
              open={bulkImportOpen}
              onOpenChange={setBulkImportOpen}
              onImportComplete={() => {
                setBulkImportOpen(false);
                // Handle import complete logic here
              }}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
