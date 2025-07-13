
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, DialogDescription as AlertDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { Plus, Edit, Trash2, Search, Upload, Download, Archive, RotateCcw } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { InactiveBin } from "@/components/taxonomy/InactiveBin";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { Progress } from "@/components/ui/progress";

export interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for demonstration
const initialProficiencyLevels: ProficiencyLevel[] = [
  {
    id: '1',
    order: 1,
    title: 'Beginner',
    description: 'Basic understanding and can perform simple tasks with guidance',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    order: 2,
    title: 'Intermediate',
    description: 'Good working knowledge and can handle most tasks independently',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    order: 3,
    title: 'Advanced',
    description: 'Expert level skills with ability to teach and mentor others',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

let globalInactiveProficiencies: any[] = [];

const ProficiencyLevels = () => {
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>(initialProficiencyLevels);
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inactiveBinOpen, setInactiveBinOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [importProgress, setImportProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const filteredLevels = proficiencyLevels.filter(level => 
    level.isActive && (
      level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreate = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const newLevel: ProficiencyLevel = {
      id: Date.now().toString(),
      order: formData.order,
      title: formData.title,
      description: formData.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProficiencyLevels(prev => [...prev, newLevel].sort((a, b) => a.order - b.order));
    toast.success(`Proficiency level "${formData.title}" created successfully`);
    
    setFormData({ title: '', description: '', order: 1 });
    setCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedLevel || !formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setProficiencyLevels(prev => prev.map(level => 
      level.id === selectedLevel.id 
        ? { ...level, title: formData.title, description: formData.description, order: formData.order, updatedAt: new Date() }
        : level
    ).sort((a, b) => a.order - b.order));

    toast.success(`Proficiency level "${formData.title}" updated successfully`);
    
    setSelectedLevel(null);
    setFormData({ title: '', description: '', order: 1 });
    setEditDialogOpen(false);
  };

  const handleInactivate = (level: ProficiencyLevel) => {
    const inactiveItem = {
      ...level,
      inactivatedAt: new Date(),
      inactivatedBy: 'Current User'
    };
    
    globalInactiveProficiencies.push(inactiveItem);

    setProficiencyLevels(prev => prev.map(l => 
      l.id === level.id ? { ...l, isActive: false, updatedAt: new Date() } : l
    ));

    toast.success(`Proficiency level "${level.title}" has been inactivated`);
  };

  const handleRestore = (restoredLevel: any) => {
    setProficiencyLevels(prev => prev.map(level => 
      level.id === restoredLevel.id 
        ? { ...level, isActive: true, updatedAt: new Date() }
        : level
    ));

    globalInactiveProficiencies = globalInactiveProficiencies.filter(item => item.id !== restoredLevel.id);
    toast.success(`Proficiency level "${restoredLevel.title}" has been restored`);
  };

  const openEditDialog = (level: ProficiencyLevel) => {
    setSelectedLevel(level);
    setFormData({
      title: level.title,
      description: level.description,
      order: level.order
    });
    setEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    const nextOrder = Math.max(...proficiencyLevels.map(l => l.order), 0) + 1;
    setFormData({ title: '', description: '', order: nextOrder });
    setCreateDialogOpen(true);
  };

  const handleBulkImport = async (file: File) => {
    setIsUploading(true);
    setImportProgress(0);

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(i);
    }

    toast.success("Proficiencies imported successfully");

    setIsUploading(false);
    setImportProgress(0);
    setImportDialogOpen(false);
  };

  const downloadTemplate = () => {
    const csvContent = "order,title,description\n1,Beginner,Basic understanding\n2,Intermediate,Good working knowledge\n3,Advanced,Expert level skills";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency-levels-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Global Proficiency Levels</h1>
                <p className="text-muted-foreground font-inter">Define and manage skill proficiency levels</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setInactiveBinOpen(true)}
                  className="font-inter"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Inactive Bin
                </Button>
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 font-inter">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Import Proficiencies</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file to import proficiency levels
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Button onClick={downloadTemplate} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleBulkImport(file);
                        }}
                      />
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Importing...</span>
                            <span>{importProgress}%</span>
                          </div>
                          <Progress value={importProgress} />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 font-inter">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Level
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">Proficiency Levels</CardTitle>
                <CardDescription className="font-inter">
                  Manage global proficiency levels that can be applied to any skill
                </CardDescription>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search proficiency levels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-inter"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inter">Order</TableHead>
                      <TableHead className="font-inter">Title</TableHead>
                      <TableHead className="font-inter">Description</TableHead>
                      <TableHead className="font-inter">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLevels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-inter">
                          No proficiency levels found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell className="font-inter">{level.order}</TableCell>
                          <TableCell className="font-medium font-inter">{level.title}</TableCell>
                          <TableCell className="font-inter">{level.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(level)}
                                className="font-inter"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleInactivate(level)}
                                className="text-orange-600 hover:text-orange-600 font-inter"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Proficiency Level</DialogTitle>
                  <DialogDescription>
                    Add a new proficiency level to the global library
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what this proficiency level represents"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    Create Level
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Proficiency Level</DialogTitle>
                  <DialogDescription>
                    Update the proficiency level details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-order">Order</Label>
                    <Input
                      id="edit-order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what this proficiency level represents"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    Update Level
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Inactive Bin */}
            <InactiveBin
              open={inactiveBinOpen}
              onOpenChange={setInactiveBinOpen}
              onRestore={handleRestore}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
