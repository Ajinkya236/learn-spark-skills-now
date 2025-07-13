import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillProficiencyStats } from "@/components/skills/SkillProficiencyStats";

interface ProficiencyLevel {
  id: string;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  isActive: boolean;
}

interface LocalSkillMapping {
  id: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const ProficiencyLevels = () => {
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([
    {
      id: '1',
      name: 'Beginner',
      description: 'Basic understanding and limited experience',
      minScore: 0,
      maxScore: 25,
      isActive: true
    },
    {
      id: '2',
      name: 'Intermediate',
      description: 'Good understanding with some practical experience',
      minScore: 26,
      maxScore: 50,
      isActive: true
    },
    {
      id: '3',
      name: 'Advanced', 
      description: 'Strong expertise with extensive experience',
      minScore: 51,
      maxScore: 75,
      isActive: true
    },
    {
      id: '4',
      name: 'Expert',
      description: 'Deep expertise and thought leadership',
      minScore: 76,
      maxScore: 100,
      isActive: true
    }
  ]);

  const [skillMappings, setSkillMappings] = useState<LocalSkillMapping[]>([
    {
      id: '1',
      skillName: 'React',
      proficiencyLevelId: '3',
      minScore: 60,
      maxScore: 80,
      description: 'Advanced React development skills'
    },
    {
      id: '2',
      skillName: 'TypeScript',
      proficiencyLevelId: '2',
      minScore: 40,
      maxScore: 60,
      description: 'Intermediate TypeScript knowledge'
    }
  ]);

  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ProficiencyLevel | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleAddLevel = (levelData: Omit<ProficiencyLevel, 'id'>) => {
    const newLevel: ProficiencyLevel = {
      ...levelData,
      id: Date.now().toString()
    };
    setProficiencyLevels(prev => [...prev, newLevel]);
    toast.success("Proficiency level added successfully");
    setIsAddingLevel(false);
  };

  const handleUpdateLevel = (id: string, levelData: Omit<ProficiencyLevel, 'id'>) => {
    setProficiencyLevels(prev => prev.map(level => 
      level.id === id ? { ...levelData, id } : level
    ));
    toast.success("Proficiency level updated successfully");
    setEditingLevel(null);
  };

  const handleDeleteLevel = (id: string) => {
    setProficiencyLevels(prev => prev.filter(level => level.id !== id));
    toast.success("Proficiency level deleted successfully");
  };

  const handleAddSkillMapping = (newMapping: Omit<LocalSkillMapping, 'id'>) => {
    const mapping: LocalSkillMapping = {
      ...newMapping,
      id: Date.now().toString()
    };
    setSkillMappings(prev => [...prev, mapping]);
    toast.success("Skill mapping added successfully");
  };

  const handleUpdateSkillMapping = (id: string, updatedMapping: LocalSkillMapping) => {
    setSkillMappings(prev => prev.map(mapping => 
      mapping.id === id ? updatedMapping : mapping
    ));
    toast.success("Skill mapping updated successfully");
  };

  const handleDeleteSkillMapping = (id: string) => {
    setSkillMappings(prev => prev.filter(mapping => mapping.id !== id));
    toast.success("Skill mapping deleted successfully");
  };

  const handleImport = (data: any) => {
    // Handle import logic here
    toast.success("Data imported successfully");
    setIsImportOpen(false);
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
                <p className="text-muted-foreground">Manage skill proficiency levels and score mappings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkillProficiencyStats mappings={skillMappings} />
            </div>

            <GlobalLevelsTable
              proficiencyLevels={proficiencyLevels}
              onAdd={() => setIsAddingLevel(true)}
              onEdit={(level) => setEditingLevel(level)}
              onDelete={handleDeleteLevel}
              onImport={() => setIsImportOpen(true)}
            />

            <SkillMappingForm 
              proficiencyLevels={proficiencyLevels}
              onSubmit={handleAddSkillMapping}
            />

            <SkillMappingsTable
              skillMappings={skillMappings}
              onUpdate={handleUpdateSkillMapping}
              onDelete={handleDeleteSkillMapping}
            />

            <EditLevelDialog
              open={isAddingLevel}
              onOpenChange={setIsAddingLevel}
              onSubmit={handleAddLevel}
              title="Add Proficiency Level"
            />

            <EditLevelDialog
              open={!!editingLevel}
              onOpenChange={(open) => !open && setEditingLevel(null)}
              onSubmit={(levelData) => editingLevel && handleUpdateLevel(editingLevel.id, levelData)}
              title="Edit Proficiency Level"
              initialData={editingLevel}
            />

            <ImportDialog
              open={isImportOpen}
              onOpenChange={setIsImportOpen}
              onImport={handleImport}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
