
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Pencil, Trash2, Download, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

const ProficiencyLevels = () => {
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: "1", order: 1, title: "Beginner", description: "Basic understanding" },
    { id: "2", order: 2, title: "Intermediate", description: "Some experience" },
    { id: "3", order: 3, title: "Advanced", description: "Solid understanding" },
    { id: "4", order: 4, title: "Expert", description: "Deep expertise" },
  ]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [newProficiency, setNewProficiency] = useState<Omit<ProficiencyLevel, 'id'>>({ 
    order: 1, 
    title: "", 
    description: "" 
  });
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel | null>(null);
  const [editProficiency, setEditProficiency] = useState<Omit<ProficiencyLevel, 'id'>>({ 
    order: 1, 
    title: "", 
    description: "" 
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleCreate = () => {
    if (newProficiency.title && newProficiency.description) {
      setProficiencyLevels([...proficiencyLevels, { 
        ...newProficiency, 
        id: String(Date.now()) 
      }]);
      setOpen(false);
      setNewProficiency({ order: 1, title: "", description: "" });
      toast.success("Proficiency level created successfully.");
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const handleEdit = () => {
    if (selectedProficiency) {
      setEditOpen(true);
      setEditProficiency({ 
        order: selectedProficiency.order, 
        title: selectedProficiency.title, 
        description: selectedProficiency.description 
      });
    }
  };

  const handleSaveEdit = () => {
    if (selectedProficiency) {
      const updatedProficiencyLevels = proficiencyLevels.map(level =>
        level.id === selectedProficiency.id ? { ...level, ...editProficiency } : level
      );
      setProficiencyLevels(updatedProficiencyLevels);
      setEditOpen(false);
      setSelectedProficiency(null);
      toast.success("Proficiency level updated successfully.");
    }
  };

  const handleDelete = () => {
    if (selectedProficiency) {
      setDeleteOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedProficiency) {
      const updatedProficiencyLevels = proficiencyLevels.filter(level => level.id !== selectedProficiency.id);
      setProficiencyLevels(updatedProficiencyLevels);
      setDeleteOpen(false);
      setSelectedProficiency(null);
      toast.success("Proficiency level deleted successfully.");
    }
  };

  const handleImport = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setImportOpen(false);
          toast.success("Proficiencies imported successfully.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "Order,Title,Description\n1,Beginner,Basic understanding\n2,Intermediate,Some experience";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_levels_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Global Proficiency Levels</h1>
              <p className="text-muted-foreground">Manage skill proficiency levels</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Proficiency Levels</CardTitle>
                <CardDescription>
                  Define and manage proficiency levels for skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Button variant="default" onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Proficiency Level
                  </Button>
                  <Button variant="default" onClick={() => setImportOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Proficiencies
                  </Button>
                </div>
                
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proficiencyLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell>{level.order}</TableCell>
                          <TableCell>{level.title}</TableCell>
                          <TableCell>{level.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedProficiency(level); handleEdit(); }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedProficiency(level); handleDelete(); }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Add Proficiency Level Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Proficiency Level</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order" className="text-right">
                      Order
                    </Label>
                    <Select value={String(newProficiency.order)} onValueChange={(value) => setNewProficiency({ ...newProficiency, order: Number(value) })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input 
                      id="title" 
                      value={newProficiency.title} 
                      onChange={(e) => setNewProficiency({ ...newProficiency, title: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea 
                      id="description" 
                      value={newProficiency.description} 
                      onChange={(e) => setNewProficiency({ ...newProficiency, description: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                  Create Proficiency Level
                </Button>
              </DialogContent>
            </Dialog>

            {/* Edit Proficiency Level Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Proficiency Level</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-order" className="text-right">
                      Order
                    </Label>
                    <Select value={String(editProficiency.order)} onValueChange={(value) => setEditProficiency({ ...editProficiency, order: Number(value) })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">
                      Title
                    </Label>
                    <Input 
                      id="edit-title" 
                      value={editProficiency.title} 
                      onChange={(e) => setEditProficiency({ ...editProficiency, title: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Textarea 
                      id="edit-description" 
                      value={editProficiency.description} 
                      onChange={(e) => setEditProficiency({ ...editProficiency, description: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>

            {/* Import Proficiencies Dialog */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Import Proficiencies</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file with proficiency levels
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadTemplate}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      id="csv-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImport(file);
                      }}
                    />
                    <Button 
                      onClick={() => document.getElementById('csv-upload')?.click()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Choose File
                    </Button>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the proficiency level from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
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
