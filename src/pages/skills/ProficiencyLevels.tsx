
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Plus, Upload, Edit, Trash2 } from "lucide-react";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";

interface ProficiencyLevel {
  id: string;
  name: string;
  description: string;
  level: number;
  isActive: boolean;
}

interface SkillMapping {
  id: string;
  skillName: string;
  cluster: string;
  group: string;
  proficiencyLevels: string[];
}

const ProficiencyLevels = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [editingLevel, setEditingLevel] = useState<ProficiencyLevel | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAddLevelDialog, setShowAddLevelDialog] = useState(false);
  const [showSkillMappingForm, setShowSkillMappingForm] = useState(false);

  // Mock data for global proficiency levels
  const [globalLevels, setGlobalLevels] = useState<ProficiencyLevel[]>([
    {
      id: '1',
      name: 'Beginner',
      description: 'Basic understanding and limited experience',
      level: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'Intermediate',
      description: 'Good understanding with some practical experience',
      level: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'Advanced',
      description: 'Strong expertise with extensive experience',
      level: 3,
      isActive: true
    },
    {
      id: '4',
      name: 'Expert',
      description: 'Deep expertise and thought leadership',
      level: 4,
      isActive: true
    }
  ]);

  // Mock data for skill mappings
  const [skillMappings, setSkillMappings] = useState<SkillMapping[]>([
    {
      id: '1',
      skillName: 'React',
      cluster: 'Programming',
      group: 'Frontend Development',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: '2',
      skillName: 'Node.js',
      cluster: 'Programming',
      group: 'Backend Development',
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced']
    }
  ]);

  const handleEditLevel = (level: ProficiencyLevel) => {
    setEditingLevel(level);
  };

  const handleDeleteLevel = (id: string) => {
    setGlobalLevels(prev => prev.filter(level => level.id !== id));
    toast.success("Proficiency level deleted successfully");
  };

  const handleSaveLevel = (levelData: Omit<ProficiencyLevel, 'id'>) => {
    if (editingLevel) {
      setGlobalLevels(prev => prev.map(level => 
        level.id === editingLevel.id 
          ? { ...level, ...levelData }
          : level
      ));
      toast.success("Proficiency level updated successfully");
    } else {
      const newLevel: ProficiencyLevel = {
        ...levelData,
        id: Date.now().toString()
      };
      setGlobalLevels(prev => [...prev, newLevel]);
      toast.success("Proficiency level created successfully");
    }
    setEditingLevel(null);
    setShowAddLevelDialog(false);
  };

  const handleAddSkillMapping = (mapping: Omit<SkillMapping, 'id'>) => {
    const newMapping: SkillMapping = {
      ...mapping,
      id: Date.now().toString()
    };
    setSkillMappings(prev => [...prev, newMapping]);
    toast.success("Skill mapping added successfully");
    setShowSkillMappingForm(false);
  };

  const handleDeleteSkillMapping = (id: string) => {
    setSkillMappings(prev => prev.filter(mapping => mapping.id !== id));
    toast.success("Skill mapping deleted successfully");
  };

  const stats = {
    totalLevels: globalLevels.length,
    activeLevels: globalLevels.filter(l => l.isActive).length,
    totalMappings: skillMappings.length,
    avgLevelsPerSkill: skillMappings.length > 0 
      ? (skillMappings.reduce((sum, s) => sum + s.proficiencyLevels.length, 0) / skillMappings.length).toFixed(1)
      : '0'
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
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
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Global Proficiency Levels</h3>
                        <p className="text-sm text-muted-foreground">
                          Define organization-wide proficiency levels
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowImportDialog(true)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                        <Button onClick={() => setShowAddLevelDialog(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Level
                        </Button>
                      </div>
                    </div>
                    
                    <GlobalLevelsTable
                      levels={globalLevels}
                      onEdit={handleEditLevel}
                      onDelete={handleDeleteLevel}
                    />
                  </TabsContent>

                  <TabsContent value="mappings" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Skill Proficiency Mappings</h3>
                        <p className="text-sm text-muted-foreground">
                          Map specific proficiency levels to individual skills
                        </p>
                      </div>
                      <Button onClick={() => setShowSkillMappingForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Mapping
                      </Button>
                    </div>
                    
                    <SkillMappingsTable
                      mappings={skillMappings}
                      onDelete={handleDeleteSkillMapping}
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
            />

            {/* Skill Mapping Form */}
            <SkillMappingForm
              open={showSkillMappingForm}
              onOpenChange={setShowSkillMappingForm}
              onSave={handleAddSkillMapping}
              availableLevels={globalLevels}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
