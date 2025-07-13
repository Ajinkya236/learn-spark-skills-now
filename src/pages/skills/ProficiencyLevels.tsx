
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
import { Upload, Plus, Pencil, Trash2, Download, MoreHorizontal, FileSpreadsheet, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // Global Proficiency Levels state
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: "1", order: 1, title: "Beginner", description: "Basic understanding" },
    { id: "2", order: 2, title: "Intermediate", description: "Some experience" },
    { id: "3", order: 3, title: "Advanced", description: "Solid understanding" },
    { id: "4", order: 4, title: "Expert", description: "Deep expertise" },
  ]);

  // Skill Proficiency Mappings state
  const [skillMappings, setSkillMappings] = useState<SkillProficiencyMapping[]>([
    { id: "1", skill: "JavaScript", proficiencyDescription: "Basic syntax and concepts", proficiencyLevel: "Beginner", cluster: "Frontend", group: "Programming", isActive: true },
    { id: "2", skill: "React", proficiencyDescription: "Component development", proficiencyLevel: "Intermediate", cluster: "Frontend", group: "Framework", isActive: true },
  ]);

  // Dialog states
  const [editLevelOpen, setEditLevelOpen] = useState(false);
  const [createMappingOpen, setCreateMappingOpen] = useState(false);
  const [editMappingOpen, setEditMappingOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [inactivateOpen, setInactivateOpen] = useState(false);

  // Form states
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<SkillProficiencyMapping | null>(null);
  const [editLevel, setEditLevel] = useState<Omit<ProficiencyLevel, 'id' | 'order'>>({ title: "", description: "" });
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

  // Import states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for dropdowns
  const skills = ["JavaScript", "React", "Python", "Node.js", "TypeScript"];
  const clusters = ["Frontend", "Backend", "Full Stack", "Data Science"];
  const groups = ["Programming", "Framework", "Database", "Cloud"];

  // Helper functions
  const validateMapping = (mapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => {
    const errors: string[] = [];
    
    if (!mapping.skill) errors.push("Skill is required");
    if (!mapping.proficiencyDescription) errors.push("Proficiency Description is required");
    if (!mapping.proficiencyLevel) errors.push("Proficiency Level is required");
    
    // Check for duplicate proficiency description under same skill
    const duplicate = skillMappings.find(m => 
      m.skill === mapping.skill && 
      m.proficiencyDescription === mapping.proficiencyDescription &&
      m.id !== selectedMapping?.id
    );
    if (duplicate) {
      errors.push("Duplicate proficiency description under same skill is not allowed");
    }
    
    return errors;
  };

  // Global Level handlers
  const handleEditLevel = (level: ProficiencyLevel) => {
    setSelectedLevel(level);
    setEditLevel({ title: level.title, description: level.description });
    setEditLevelOpen(true);
  };

  const handleSaveLevel = () => {
    if (selectedLevel && editLevel.title && editLevel.description) {
      const updatedLevels = proficiencyLevels.map(level =>
        level.id === selectedLevel.id ? { ...level, ...editLevel } : level
      );
      setProficiencyLevels(updatedLevels);
      setEditLevelOpen(false);
      setSelectedLevel(null);
      toast.success("Proficiency level updated successfully.");
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // Skill Mapping handlers
  const handleCreateMapping = () => {
    const errors = validateMapping(newMapping);
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    const newMappingRecord: SkillProficiencyMapping = {
      ...newMapping,
      id: String(Date.now()),
      isActive: true
    };
    
    setSkillMappings([...skillMappings, newMappingRecord]);
    setCreateMappingOpen(false);
    setNewMapping({ skill: "", proficiencyDescription: "", proficiencyLevel: "", cluster: "", group: "" });
    toast.success("Skill proficiency mapping created successfully.");
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
    const errors = validateMapping(editMapping);
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    if (selectedMapping) {
      const updatedMappings = skillMappings.map(mapping =>
        mapping.id === selectedMapping.id ? { ...mapping, ...editMapping } : mapping
      );
      setSkillMappings(updatedMappings);
      setEditMappingOpen(false);
      setSelectedMapping(null);
      toast.success("Skill proficiency mapping updated successfully.");
    }
  };

  const handleInactivateMapping = (mapping: SkillProficiencyMapping) => {
    setSelectedMapping(mapping);
    setInactivateOpen(true);
  };

  const handleConfirmInactivate = () => {
    if (selectedMapping) {
      const updatedMappings = skillMappings.map(mapping =>
        mapping.id === selectedMapping.id ? { ...mapping, isActive: false } : mapping
      );
      setSkillMappings(updatedMappings);
      setInactivateOpen(false);
      setSelectedMapping(null);
      toast.success("Skill proficiency mapping inactivated successfully.");
    }
  };

  // Import/Export handlers
  const handleImport = async (file: File) => {
    setImportErrors([]);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setImportOpen(false);
          
          // Mock validation results
          const mockErrors = Math.random() > 0.7 ? [
            "Row 3: Duplicate proficiency description under same skill",
            "Row 5: Invalid proficiency level"
          ] : [];
          
          if (mockErrors.length > 0) {
            setImportErrors(mockErrors);
            toast.error("Import failed. Please check the errors and try again.");
          } else {
            toast.success("Proficiencies imported successfully.");
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    const csvContent = "Skill,Proficiency Description,Proficiency Level,Cluster,Group\nJavaScript,Basic syntax and concepts,Beginner,Frontend,Programming\nReact,Component development,Intermediate,Frontend,Framework";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill_proficiencies_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Proficiency Mappings</CardTitle>
                    <CardDescription>
                      Manage skill to proficiency level mappings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <Button variant="default" onClick={() => setCreateMappingOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Proficiency Mapping
                      </Button>
                      <Button variant="default" onClick={() => setImportOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Proficiencies
                      </Button>
                      <Button variant="default" onClick={exportMappings} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export Mappings
                      </Button>
                    </div>
                    
                    <div className="overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Skill</TableHead>
                            <TableHead>Proficiency</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Cluster</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedMappings.map((mapping) => (
                            <TableRow key={mapping.id}>
                              <TableCell className="font-medium">{mapping.skill}</TableCell>
                              <TableCell>{mapping.proficiencyDescription}</TableCell>
                              <TableCell>{mapping.proficiencyLevel}</TableCell>
                              <TableCell>{mapping.cluster}</TableCell>
                              <TableCell>{mapping.group}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditMapping(mapping)}>
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleInactivateMapping(mapping)}>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Inactivate
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="levels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Proficiency Levels</CardTitle>
                    <CardDescription>
                      Edit global proficiency level titles and descriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                                <Button variant="ghost" size="sm" onClick={() => handleEditLevel(level)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Create Mapping Dialog */}
            <Dialog open={createMappingOpen} onOpenChange={setCreateMappingOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Skill Proficiency Mapping</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="skill" className="text-right">
                      Skill *
                    </Label>
                    <Select value={newMapping.skill} onValueChange={(value) => setNewMapping({ ...newMapping, skill: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Proficiency Description *
                    </Label>
                    <Textarea 
                      id="description" 
                      value={newMapping.proficiencyDescription} 
                      onChange={(e) => setNewMapping({ ...newMapping, proficiencyDescription: e.target.value })} 
                      className="col-span-3" 
                      placeholder="Describe the proficiency level"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Proficiency Level *
                    </Label>
                    <Select value={newMapping.proficiencyLevel} onValueChange={(value) => setNewMapping({ ...newMapping, proficiencyLevel: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map(level => (
                          <SelectItem key={level.id} value={level.title}>{level.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cluster" className="text-right">
                      Cluster
                    </Label>
                    <Select value={newMapping.cluster} onValueChange={(value) => setNewMapping({ ...newMapping, cluster: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        {clusters.map(cluster => (
                          <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group" className="text-right">
                      Group
                    </Label>
                    <Select value={newMapping.group} onValueChange={(value) => setNewMapping({ ...newMapping, group: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateMapping} className="bg-blue-600 hover:bg-blue-700">
                  Create Proficiency Mapping
                </Button>
              </DialogContent>
            </Dialog>

            {/* Edit Mapping Dialog */}
            <Dialog open={editMappingOpen} onOpenChange={setEditMappingOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Skill Proficiency Mapping</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-skill" className="text-right">
                      Skill *
                    </Label>
                    <Select value={editMapping.skill} onValueChange={(value) => setEditMapping({ ...editMapping, skill: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {skills.map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Proficiency Description *
                    </Label>
                    <Textarea 
                      id="edit-description" 
                      value={editMapping.proficiencyDescription} 
                      onChange={(e) => setEditMapping({ ...editMapping, proficiencyDescription: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-level" className="text-right">
                      Proficiency Level *
                    </Label>
                    <Select value={editMapping.proficiencyLevel} onValueChange={(value) => setEditMapping({ ...editMapping, proficiencyLevel: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map(level => (
                          <SelectItem key={level.id} value={level.title}>{level.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-cluster" className="text-right">
                      Cluster
                    </Label>
                    <Select value={editMapping.cluster} onValueChange={(value) => setEditMapping({ ...editMapping, cluster: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        {clusters.map(cluster => (
                          <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-group" className="text-right">
                      Group
                    </Label>
                    <Select value={editMapping.group} onValueChange={(value) => setEditMapping({ ...editMapping, group: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveMapping} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>

            {/* Edit Level Dialog */}
            <Dialog open={editLevelOpen} onOpenChange={setEditLevelOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Proficiency Level</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">
                      Title
                    </Label>
                    <Input 
                      id="edit-title" 
                      value={editLevel.title} 
                      onChange={(e) => setEditLevel({ ...editLevel, title: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-desc" className="text-right">
                      Description
                    </Label>
                    <Textarea 
                      id="edit-desc" 
                      value={editLevel.description} 
                      onChange={(e) => setEditLevel({ ...editLevel, description: e.target.value })} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <Button onClick={handleSaveLevel} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Import Proficiencies</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Upload an Excel file with skill proficiency mappings
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

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Import Rules:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Add new entries</li>
                      <li>• Update existing ones</li>
                      <li>• No deletions allowed via import</li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your Excel file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      id="excel-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImport(file);
                      }}
                    />
                    <Button 
                      onClick={() => document.getElementById('excel-upload')?.click()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Choose File
                    </Button>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}

                  {importErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">Import Errors:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {importErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

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
