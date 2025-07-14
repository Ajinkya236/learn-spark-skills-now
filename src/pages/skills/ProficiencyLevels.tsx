
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Upload } from "lucide-react";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { AddProficiencyDialog } from "@/components/proficiency/AddProficiencyDialog";

// Updated interfaces to match component expectations
interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface SkillProficiencyMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

const ProficiencyLevels = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [editingLevel, setEditingLevel] = useState<ProficiencyLevel | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddLevelDialog, setShowAddLevelDialog] = useState(false);
  const [showAddProficiencyDialog, setShowAddProficiencyDialog] = useState(false);

  // Updated mock data with correct structure
  const [globalLevels, setGlobalLevels] = useState<ProficiencyLevel[]>([
    {
      id: '1',
      order: 1,
      title: 'Beginner',
      description: 'Basic understanding and limited experience'
    },
    {
      id: '2',
      order: 2,
      title: 'Intermediate',
      description: 'Good understanding with some practical experience'
    },
    {
      id: '3',
      order: 3,
      title: 'Advanced',
      description: 'Strong expertise with extensive experience'
    },
    {
      id: '4',
      order: 4,
      title: 'Expert',
      description: 'Deep expertise and thought leadership'
    }
  ]);

  // Updated mock data for skill mappings
  const [skillMappings, setSkillMappings] = useState<SkillProficiencyMapping[]>([
    {
      id: '1',
      skill: 'React',
      proficiencyDescription: 'Component development and hooks',
      proficiencyLevel: 'Intermediate',
      cluster: 'Programming',
      group: 'Frontend Development',
      isActive: true
    },
    {
      id: '2',
      skill: 'Node.js',
      proficiencyDescription: 'Server-side JavaScript development',
      proficiencyLevel: 'Advanced',
      cluster: 'Programming',
      group: 'Backend Development',
      isActive: true
    }
  ]);

  // Mock skills data
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'Vue.js', 'Angular'];

  const handleEditLevel = (level: ProficiencyLevel) => {
    setEditingLevel(level);
  };

  const handleDeleteLevel = (id: string) => {
    setGlobalLevels(prev => prev.filter(level => level.id !== id));
    toast.success("Proficiency level deleted successfully");
  };

  const handleSaveLevel = (updates: Partial<ProficiencyLevel>) => {
    if (editingLevel) {
      setGlobalLevels(prev => prev.map(level => 
        level.id === editingLevel.id 
          ? { ...level, ...updates }
          : level
      ));
      toast.success("Proficiency level updated successfully");
    } else {
      const newLevel: ProficiencyLevel = {
        id: Date.now().toString(),
        order: globalLevels.length + 1,
        title: updates.title || '',
        description: updates.description || ''
      };
      setGlobalLevels(prev => [...prev, newLevel]);
      toast.success("Proficiency level created successfully");
    }
    setEditingLevel(null);
    setShowAddLevelDialog(false);
  };

  const handleAddProficiency = (proficiencyData: { skill: string; proficiencyLevel: string; proficiencyDescription: string }) => {
    const newMapping: SkillProficiencyMapping = {
      id: Date.now().toString(),
      skill: proficiencyData.skill,
      proficiencyDescription: proficiencyData.proficiencyDescription,
      proficiencyLevel: proficiencyData.proficiencyLevel,
      cluster: 'General',
      group: 'Technical',
      isActive: true
    };
    
    setSkillMappings(prev => [...prev, newMapping]);
    toast.success("Proficiency mapping added successfully");
    setShowAddProficiencyDialog(false);
  };

  const handleEditSkillMapping = (id: string, updatedMapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => {
    setSkillMappings(prev => prev.map(mapping =>
      mapping.id === id ? { ...mapping, ...updatedMapping } : mapping
    ));
    toast.success("Skill mapping updated successfully");
  };

  const handleInactivateSkillMapping = (id: string) => {
    setSkillMappings(prev => prev.filter(mapping => mapping.id !== id));
    toast.success("Skill mapping deleted successfully");
  };

  const handleImport = (data: any) => {
    toast.success("Data imported successfully");
    setShowImportDialog(false);
  };

  const stats = {
    totalLevels: globalLevels.length,
    activeLevels: globalLevels.length,
    totalMappings: skillMappings.filter(m => m.isActive).length,
    avgLevelsPerSkill: skillMappings.length > 0 
      ? (skillMappings.length / new Set(skillMappings.map(s => s.skill)).size).toFixed(1)
      : '0'
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 md:p-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
              <p className="text-muted-foreground">
                Manage global proficiency levels and skill-specific proficiency mappings
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Levels</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats.totalLevels}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Levels</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold text-green-600">{stats.activeLevels}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Skill Mappings</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats.totalMappings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Levels/Skill</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold">{stats.avgLevelsPerSkill}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Proficiency Management</CardTitle>
                <CardDescription>
                  Configure global proficiency levels and manage skill-specific mappings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="global">Global Levels</TabsTrigger>
                    <TabsTrigger value="mappings">Skill Mappings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="global" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Global Proficiency Levels</h3>
                        <p className="text-sm text-muted-foreground">
                          Define organization-wide proficiency levels
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowImportDialog(true)}
                          className="w-full sm:w-auto"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                        <Button onClick={() => setShowAddLevelDialog(true)} className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Level
                        </Button>
                      </div>
                    </div>
                    
                    <GlobalLevelsTable
                      levels={globalLevels}
                      onEdit={handleEditLevel}
                    />
                  </TabsContent>

                  <TabsContent value="mappings" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Skill Proficiency Mappings</h3>
                        <p className="text-sm text-muted-foreground">
                          Map specific proficiency levels to individual skills
                        </p>
                      </div>
                      <Button onClick={() => setShowAddProficiencyDialog(true)} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Proficiency
                      </Button>
                    </div>
                    
                    <SkillMappingsTable
                      mappings={skillMappings}
                      onEdit={handleEditSkillMapping}
                      onInactivate={handleInactivateSkillMapping}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Edit Level Dialog */}
            <EditLevelDialog
              level={editingLevel}
              open={!!editingLevel || showAddLevelDialog}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingLevel(null);
                  setShowAddLevelDialog(false);
                }
              }}
              onSave={handleSaveLevel}
            />

            {/* Import Dialog */}
            <ImportDialog
              open={showImportDialog}
              onOpenChange={setShowImportDialog}
              onImport={handleImport}
            />

            {/* Add Proficiency Dialog */}
            <AddProficiencyDialog
              open={showAddProficiencyDialog}
              onOpenChange={setShowAddProficiencyDialog}
              onSave={handleAddProficiency}
              skills={skills}
              proficiencyLevels={globalLevels}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
