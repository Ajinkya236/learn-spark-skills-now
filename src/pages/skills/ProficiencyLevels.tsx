
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Upload, Download, Edit, Archive, AlertTriangle, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";

export interface Skill {
  id: string;
  name: string;
}

export interface ProficiencyLevel {
  id: string;
  title: string;
}

export interface ProficiencyMapping {
  id: string;
  skillId: string;
  skillName: string;
  proficiencyDescription: string;
  proficiencyLevelId: string;
  proficiencyLevelTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

const ITEMS_PER_PAGE = 10;

const ProficiencyLevels = () => {
  const [skills] = useState<Skill[]>([
    { id: '1', name: 'Python Programming' },
    { id: '2', name: 'JavaScript' },
    { id: '3', name: 'React' }
  ]);

  const [proficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: '1', title: 'Beginner' },
    { id: '2', title: 'Intermediate' },
    { id: '3', title: 'Advanced' }
  ]);

  const [createProficiencyOpen, setCreateProficiencyOpen] = useState(false);
  const [editProficiencyOpen, setEditProficiencyOpen] = useState(false);
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyMapping | null>(null);
  
  const handleEditProficiency = (mapping: ProficiencyMapping) => {
    setSelectedProficiency(mapping);
    setEditProficiencyOpen(true);
  };

  const handleInactivateProficiency = (mapping: ProficiencyMapping) => {
    toast({
      title: "Proficiency Inactivated",
      description: `Proficiency "${mapping.proficiencyDescription}" has been moved to the Inactive Bin.`
    });
  };
  
  const { toast } = useToast();
  
  const [proficiencyMappings, setProficiencyMappings] = useState<ProficiencyMapping[]>([
    {
      id: '1',
      skillId: '1',
      skillName: 'Python Programming',
      proficiencyDescription: 'Basic syntax understanding and simple script writing',
      proficiencyLevelId: '1',
      proficiencyLevelTitle: 'Beginner',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      skillId: '1',
      skillName: 'Python Programming',
      proficiencyDescription: 'Advanced concepts, frameworks, and complex applications',
      proficiencyLevelId: '2',
      proficiencyLevelTitle: 'Intermediate',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleImportProficiencies = () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }

    // Simulate file processing with validation
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simulate parsing and validation
        const errors: string[] = [];
        
        // Mock validation rules
        const mockData = [
          { skill: 'Python Programming', proficiency: 'Basic syntax', level: 'Beginner' },
          { skill: 'Python Programming', proficiency: 'Basic syntax', level: 'Beginner' }, // Duplicate
          { skill: '', proficiency: 'Advanced concepts', level: 'Expert' }, // Missing skill
          { skill: 'JavaScript', proficiency: 'DOM Manipulation', level: 'NonExistentLevel' } // Invalid level
        ];

        mockData.forEach((row, index) => {
          const rowNum = index + 2; // Account for header row
          
          // Check for required fields
          if (!row.skill) {
            errors.push(`Row ${rowNum}: Skill name is required`);
          }
          if (!row.proficiency) {
            errors.push(`Row ${rowNum}: Proficiency description is required`);
          }
          if (!row.level) {
            errors.push(`Row ${rowNum}: Proficiency level is required`);
          }

          // Check for duplicates
          if (row.skill === 'Python Programming' && row.proficiency === 'Basic syntax') {
            const existing = proficiencyMappings.find(p => 
              p.skillName === row.skill && p.proficiencyDescription === row.proficiency
            );
            if (existing) {
              errors.push(`Row ${rowNum}: Duplicate proficiency "${row.proficiency}" for skill "${row.skill}"`);
            }
          }

          // Check for valid proficiency level
          if (row.level === 'NonExistentLevel') {
            errors.push(`Row ${rowNum}: Invalid proficiency level "${row.level}". Must be one of: Conversant, Beginner, Intermediate, Advanced`);
          }
        });

        if (errors.length > 0) {
          setImportErrors(errors);
          toast({
            title: "Import Failed",
            description: `Found ${errors.length} error(s). Please fix them and try again.`,
            variant: "destructive"
          });
        } else {
          // Simulate successful import
          toast({
            title: "Import Successful",
            description: "Proficiency mappings have been imported successfully."
          });
          setImportDialogOpen(false);
          setImportFile(null);
          setImportErrors([]);
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to process the file. Please check the format and try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(importFile);
  };

  const downloadImportTemplate = () => {
    const csvContent = "Skill,Proficiency Description,Proficiency Level\n" +
                      "Python Programming,Basic syntax understanding,Beginner\n" +
                      "JavaScript,DOM manipulation and events,Intermediate\n" +
                      "React,Component development and state management,Advanced";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    window.URL.revokeObjectURL(url);
  };

  const exportMappings = () => {
    const csvContent = "Skill,Proficiency Description,Proficiency Level\n" +
      proficiencyMappings.map(mapping => 
        `"${mapping.skillName}","${mapping.proficiencyDescription}","${mapping.proficiencyLevelTitle}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_mappings_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateProficiency = (proficiencyData: Partial<ProficiencyMapping>) => {
    const newMapping: ProficiencyMapping = {
      id: Date.now().toString(),
      skillId: proficiencyData.skillId || '',
      skillName: proficiencyData.skillName || '',
      proficiencyDescription: proficiencyData.proficiencyDescription || '',
      proficiencyLevelId: proficiencyData.proficiencyLevelId || '',
      proficiencyLevelTitle: proficiencyData.proficiencyLevelTitle || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProficiencyMappings([...proficiencyMappings, newMapping]);
    
    toast({
      title: "Success",
      description: "Proficiency mapping created successfully and reflected in master data."
    });
  };

  // Pagination for skill proficiency mappings
  const totalPages = Math.ceil(proficiencyMappings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMappings = proficiencyMappings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Skills Proficiency Management</h1>
                <p className="text-muted-foreground font-inter">Manage global proficiency levels and skill mappings</p>
              </div>
            </div>

            {/* Sub-menu Tabs */}
            <Tabs defaultValue="mappings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mappings" className="font-inter">Skill Proficiency Mappings</TabsTrigger>
                <TabsTrigger value="levels" className="font-inter">Global Proficiency Levels</TabsTrigger>
              </TabsList>

              <TabsContent value="mappings">
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-jio-dark font-inter">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => setCreateProficiencyOpen(true)} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Proficiency
                        </Button>
                        <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="font-inter">
                          <Upload className="mr-2 h-4 w-4" />
                          Import Proficiencies
                        </Button>
                        <Button variant="outline" onClick={exportMappings} className="font-inter">
                          <Download className="mr-2 h-4 w-4" />
                          Export Mappings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Proficiency Mappings Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-bold text-jio-dark font-inter">Skill Proficiency Mappings</CardTitle>
                      <CardDescription className="font-inter">
                        Manage proficiency descriptions mapped to skills and levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-inter">Skill</TableHead>
                              <TableHead className="font-inter">Proficiency Description</TableHead>
                              <TableHead className="font-inter">Proficiency Level</TableHead>
                              <TableHead className="font-inter">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedMappings.map((mapping) => (
                              <TableRow key={mapping.id}>
                                <TableCell className="font-medium font-inter">{mapping.skillName}</TableCell>
                                <TableCell className="font-inter">{mapping.proficiencyDescription}</TableCell>
                                <TableCell>
                                  <Badge className="font-inter">{mapping.proficiencyLevelTitle}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditProficiency(mapping)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-orange-600" onClick={() => handleInactivateProficiency(mapping)}>
                                      <Archive className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-4 pb-4">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="levels">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">Global Proficiency Levels</CardTitle>
                    <CardDescription className="font-inter">
                      Manage the list of global proficiency levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter">Title</TableHead>
                          <TableHead className="font-inter">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {proficiencyLevels.map((level) => (
                          <TableRow key={level.id}>
                            <TableCell className="font-medium font-inter">{level.title}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-inter font-bold text-jio-dark">Import Proficiency Mappings</DialogTitle>
                  <DialogDescription className="font-inter">
                    Upload an Excel/CSV file with proficiency mappings. Download the template for the correct format.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={downloadImportTemplate} className="font-inter">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="import-file" className="font-inter font-medium">Select File</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="font-inter"
                    />
                  </div>

                  {importErrors.length > 0 && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium font-inter">Import Errors:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm font-inter">
                            {importErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="font-inter">
                      <div className="space-y-2">
                        <p className="font-medium">Import Rules:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Each proficiency must map to exactly one skill</li>
                          <li>Each proficiency must map to exactly one proficiency level</li>
                          <li>Cannot create duplicate proficiency descriptions under the same skill</li>
                          <li>New entries will be added, existing ones will be updated</li>
                          <li>No deletions allowed via import</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)} className="font-inter">
                    Cancel
                  </Button>
                  <Button onClick={handleImportProficiencies} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
                    Import Proficiencies
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create Proficiency Dialog */}
            <Dialog open={createProficiencyOpen} onOpenChange={setCreateProficiencyOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-inter font-bold text-jio-dark">Create New Proficiency Mapping</DialogTitle>
                  <DialogDescription className="font-inter">
                    Map a skill to a proficiency description and level
                  </DialogDescription>
                </DialogHeader>

                {/* Create Proficiency Form */}
                <CreateProficiencyForm 
                  skills={skills}
                  proficiencyLevels={proficiencyLevels}
                  onCreate={handleCreateProficiency}
                  onCancel={() => setCreateProficiencyOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Edit Proficiency Dialog */}
            <Dialog open={editProficiencyOpen} onOpenChange={setEditProficiencyOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-inter font-bold text-jio-dark">Edit Proficiency Mapping</DialogTitle>
                  <DialogDescription className="font-inter">
                    Modify the proficiency description and level for a skill
                  </DialogDescription>
                </DialogHeader>

                {/* Edit Proficiency Form */}
                <EditProficiencyForm 
                  skills={skills}
                  proficiencyLevels={proficiencyLevels}
                  existingMapping={selectedProficiency}
                  onUpdate={() => {}}
                  onCancel={() => setEditProficiencyOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

interface CreateProficiencyFormProps {
  skills: Skill[];
  proficiencyLevels: ProficiencyLevel[];
  onCreate: (data: Partial<ProficiencyMapping>) => void;
  onCancel: () => void;
}

const CreateProficiencyForm: React.FC<CreateProficiencyFormProps> = ({ skills, proficiencyLevels, onCreate, onCancel }) => {
  const [skillId, setSkillId] = useState('');
  const [proficiencyDescription, setProficiencyDescription] = useState('');
  const [proficiencyLevelId, setProficiencyLevelId] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!skillId || !proficiencyDescription || !proficiencyLevelId) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedSkill = skills.find(skill => skill.id === skillId);
    const selectedLevel = proficiencyLevels.find(level => level.id === proficiencyLevelId);

    if (!selectedSkill || !selectedLevel) {
      toast({
        title: "Error",
        description: "Invalid skill or proficiency level selected.",
        variant: "destructive"
      });
      return;
    }

    onCreate({
      skillId,
      skillName: selectedSkill.name,
      proficiencyDescription,
      proficiencyLevelId,
      proficiencyLevelTitle: selectedLevel.title
    });

    onCancel();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="skill" className="font-inter font-medium">Skill</Label>
        <Select value={skillId} onValueChange={setSkillId}>
          <SelectTrigger className="font-inter">
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={skill.id} className="font-inter">
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proficiency-description" className="font-inter font-medium">Proficiency Description</Label>
        <Textarea
          id="proficiency-description"
          placeholder="Enter proficiency description"
          value={proficiencyDescription}
          onChange={(e) => setProficiencyDescription(e.target.value)}
          className="font-inter"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proficiency-level" className="font-inter font-medium">Proficiency Level</Label>
        <Select value={proficiencyLevelId} onValueChange={setProficiencyLevelId}>
          <SelectTrigger className="font-inter">
            <SelectValue placeholder="Select a proficiency level" />
          </SelectTrigger>
          <SelectContent>
            {proficiencyLevels.map((level) => (
              <SelectItem key={level.id} value={level.id} className="font-inter">
                {level.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="font-inter">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
          Create Proficiency
        </Button>
      </DialogFooter>
    </div>
  );
};

interface EditProficiencyFormProps {
  skills: Skill[];
  proficiencyLevels: ProficiencyLevel[];
  existingMapping: ProficiencyMapping | null;
  onUpdate: (data: Partial<ProficiencyMapping>) => void;
  onCancel: () => void;
}

const EditProficiencyForm: React.FC<EditProficiencyFormProps> = ({ skills, proficiencyLevels, existingMapping, onUpdate, onCancel }) => {
  const [skillId, setSkillId] = useState(existingMapping?.skillId || '');
  const [proficiencyDescription, setProficiencyDescription] = useState(existingMapping?.proficiencyDescription || '');
  const [proficiencyLevelId, setProficiencyLevelId] = useState(existingMapping?.proficiencyLevelId || '');
  const { toast } = useToast();

  React.useEffect(() => {
    if (existingMapping) {
      setSkillId(existingMapping.skillId);
      setProficiencyDescription(existingMapping.proficiencyDescription);
      setProficiencyLevelId(existingMapping.proficiencyLevelId);
    }
  }, [existingMapping]);

  const handleSubmit = () => {
    if (!skillId || !proficiencyDescription || !proficiencyLevelId) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedSkill = skills.find(skill => skill.id === skillId);
    const selectedLevel = proficiencyLevels.find(level => level.id === proficiencyLevelId);

    if (!selectedSkill || !selectedLevel) {
      toast({
        title: "Error",
        description: "Invalid skill or proficiency level selected.",
        variant: "destructive"
      });
      return;
    }

    onUpdate({
      id: existingMapping?.id,
      skillId,
      skillName: selectedSkill.name,
      proficiencyDescription,
      proficiencyLevelId,
      proficiencyLevelTitle: selectedLevel.title
    });

    onCancel();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="skill" className="font-inter font-medium">Skill</Label>
        <Select value={skillId} onValueChange={setSkillId}>
          <SelectTrigger className="font-inter">
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={skill.id} className="font-inter">
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proficiency-description" className="font-inter font-medium">Proficiency Description</Label>
        <Textarea
          id="proficiency-description"
          placeholder="Enter proficiency description"
          value={proficiencyDescription}
          onChange={(e) => setProficiencyDescription(e.target.value)}
          className="font-inter"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proficiency-level" className="font-inter font-medium">Proficiency Level</Label>
        <Select value={proficiencyLevelId} onValueChange={setProficiencyLevelId}>
          <SelectTrigger className="font-inter">
            <SelectValue placeholder="Select a proficiency level" />
          </SelectTrigger>
          <SelectContent>
            {proficiencyLevels.map((level) => (
              <SelectItem key={level.id} value={level.id} className="font-inter">
                {level.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="font-inter">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
          Update Proficiency
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ProficiencyLevels;
