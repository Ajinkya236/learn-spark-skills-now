import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Plus, Edit, Trash2, Settings, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProficiencyLevels } from "@/hooks/useProficiencyLevels";
import { GlobalLevelsTable } from "@/components/proficiency/GlobalLevelsTable";
import { EditLevelDialog } from "@/components/proficiency/EditLevelDialog";
import { ImportDialog } from "@/components/proficiency/ImportDialog";
import { SkillMappingsTable } from "@/components/proficiency/SkillMappingsTable";
import { SkillMappingForm } from "@/components/proficiency/SkillMappingForm";

// Local SkillMapping interface to avoid conflicts
interface LocalSkillMapping {
  id?: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

const ProficiencyLevels = () => {
  const {
    levels,
    createLevel,
    updateLevel,
    deleteLevel,
    reorderLevels
  } = useProficiencyLevels();

  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [skillMappings, setSkillMappings] = useState<LocalSkillMapping[]>([
    {
      id: '1',
      skillName: 'React',
      proficiencyLevelId: '1',
      minScore: 80,
      maxScore: 100,
      description: 'Advanced React development skills'
    }
  ]);

  const handleCreateMapping = (mapping: Omit<LocalSkillMapping, 'id'>) => {
    const newMapping: LocalSkillMapping = {
      ...mapping,
      id: Date.now().toString()
    };
    setSkillMappings(prev => [...prev, newMapping]);
    toast.success("Skill mapping created successfully");
  };

  const handleUpdateMapping = (id: string, updatedMapping: LocalSkillMapping) => {
    setSkillMappings(prev => prev.map(mapping => 
      mapping.id === id ? { ...updatedMapping, id } : mapping
    ));
    toast.success("Skill mapping updated successfully");
  };

  const handleDeleteMapping = (id: string) => {
    setSkillMappings(prev => prev.filter(mapping => mapping.id !== id));
    toast.success("Skill mapping deleted successfully");
  };

  const filteredLevels = levels.filter(level => 
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLevels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLevels = filteredLevels.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateLevel = (levelData: any) => {
    createLevel(levelData);
    setIsCreateDialogOpen(false);
    toast.success("Proficiency level created successfully");
  };

  const handleEditLevel = (level: any) => {
    setSelectedLevel(level);
    setIsEditDialogOpen(true);
  };

  const handleUpdateLevel = (levelData: any) => {
    if (selectedLevel) {
      updateLevel(selectedLevel.id, levelData);
      setIsEditDialogOpen(false);
      setSelectedLevel(null);
      toast.success("Proficiency level updated successfully");
    }
  };

  const handleDeleteLevel = (id: string) => {
    deleteLevel(id);
    toast.success("Proficiency level deleted successfully");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
                <p className="text-muted-foreground">Manage global proficiency levels and skill mappings</p>
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

            {/* Global Proficiency Levels */}
            <GlobalLevelsTable
              levels={paginatedLevels}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={handleEditLevel}
              onDelete={handleDeleteLevel}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            {/* Skill Mappings */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency Mappings</CardTitle>
                <CardDescription>
                  Map skills to proficiency levels with score ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SkillMappingForm
                  levels={levels}
                  onSubmit={handleCreateMapping}
                />
                
                <SkillMappingsTable
                  mappings={skillMappings}
                  levels={levels}
                  onUpdate={handleUpdateMapping}
                  onDelete={handleDeleteMapping}
                />
              </CardContent>
            </Card>

            {/* Dialogs */}
            <EditLevelDialog
              isOpen={isCreateDialogOpen}
              onClose={() => setIsCreateDialogOpen(false)}
              onSubmit={handleCreateLevel}
              title="Create Proficiency Level"
            />

            <EditLevelDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleUpdateLevel}
              title="Edit Proficiency Level"
              initialData={selectedLevel}
            />

            <ImportDialog
              isOpen={isImportDialogOpen}
              onClose={() => setIsImportDialogOpen(false)}
              onImport={(data) => {
                // Handle import logic
                toast.success("Levels imported successfully");
              }}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
