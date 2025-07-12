
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Edit, Archive, Download, Upload, AlertCircle, GripVertical, Info } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

interface ProficiencyLevel {
  id: string;
  name: string;
  description: string;
  order: number;
  isGlobal: boolean;
}

interface Proficiency {
  id: string;
  skillId: string;
  skillName: string;
  description: string;
  proficiencyLevelId: string;
  proficiencyLevelName: string;
  order: number;
  isActive: boolean;
}

const ITEMS_PER_PAGE = 10;

const ProficiencyLevels = () => {
  const [proficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: '1', name: 'Conversant', description: 'Basic understanding and awareness', order: 1, isGlobal: true },
    { id: '2', name: 'Beginner', description: 'Foundational knowledge with supervision', order: 2, isGlobal: true },
    { id: '3', name: 'Intermediate', description: 'Independent working knowledge', order: 3, isGlobal: true },
    { id: '4', name: 'Advanced', description: 'Expert level with mentoring capability', order: 4, isGlobal: true }
  ]);

  const [proficiencies, setProficiencies] = useState<Proficiency[]>([
    { id: '1', skillId: '1', skillName: 'Python Programming', description: 'Understand Python syntax and basic constructs', proficiencyLevelId: '1', proficiencyLevelName: 'Conversant', order: 1, isActive: true },
    { id: '2', skillId: '1', skillName: 'Python Programming', description: 'Create functions and classes effectively', proficiencyLevelId: '2', proficiencyLevelName: 'Beginner', order: 2, isActive: true },
    { id: '3', skillId: '1', skillName: 'Python Programming', description: 'Use NumPy, Pandas, and other libraries', proficiencyLevelId: '3', proficiencyLevelName: 'Intermediate', order: 3, isActive: true },
    { id: '4', skillId: '1', skillName: 'Python Programming', description: 'Design systems and mentor others', proficiencyLevelId: '4', proficiencyLevelName: 'Advanced', order: 4, isActive: true },
    { id: '5', skillId: '2', skillName: 'JavaScript Development', description: 'Basic JavaScript syntax and DOM manipulation', proficiencyLevelId: '1', proficiencyLevelName: 'Conversant', order: 1, isActive: true },
    { id: '6', skillId: '2', skillName: 'JavaScript Development', description: 'ES6+ features and async programming', proficiencyLevelId: '2', proficiencyLevelName: 'Beginner', order: 2, isActive: true },
    { id: '7', skillId: '3', skillName: 'Data Analysis', description: 'Statistical analysis and data visualization', proficiencyLevelId: '3', proficiencyLevelName: 'Intermediate', order: 1, isActive: true },
  ]);

  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [isProficiencyDialogOpen, setIsProficiencyDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isInactivateDialogOpen, setIsInactivateDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState<Proficiency | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const activeProficiencies = proficiencies.filter(p => p.isActive);
  const totalPages = Math.ceil(activeProficiencies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProficiencies = activeProficiencies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const exportProficiencyMappings = () => {
    const mappings = proficiencies.filter(p => p.isActive).map((prof, index) => ({
      No: index + 1,
      Cluster: 'Technical Skills',
      Group: 'Programming Languages',
      Skill: prof.skillName,
      Proficiency: prof.description,
      'Proficiency Level': prof.proficiencyLevelName
    }));

    const csvContent = [
      Object.keys(mappings[0]).join(','),
      ...mappings.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_mappings.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Proficiency mappings have been exported successfully."
    });
  };

  const downloadImportTemplate = () => {
    const template = [
      ['Skill', 'Proficiency Description', 'Proficiency Level'],
      ['Python Programming', 'Basic syntax understanding', 'Conversant'],
      ['JavaScript Development', 'DOM manipulation skills', 'Beginner']
    ];

    const csvContent = template.map(row => row.map(val => `"${val}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "Import template has been downloaded successfully."
    });
  };

  const handleInactivateProficiency = (proficiency: Proficiency) => {
    setSelectedProficiency(proficiency);
    setIsInactivateDialogOpen(true);
  };

  const confirmInactivate = () => {
    if (selectedProficiency) {
      setProficiencies(prev => 
        prev.map(p => 
          p.id === selectedProficiency.id ? { ...p, isActive: false } : p
        )
      );
      toast({
        title: "Proficiency Inactivated",
        description: `Proficiency has been moved to inactive bin.`
      });
      setIsInactivateDialogOpen(false);
      setSelectedProficiency(null);
    }
  };

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
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Proficiency Levels</h1>
                <p className="text-muted-foreground font-inter">Configure custom proficiency stages and scoring</p>
              </div>
            </div>

            <Tabs defaultValue="mappings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mappings" className="font-inter">Skill Proficiency Mappings</TabsTrigger>
                <TabsTrigger value="levels" className="font-inter">Global Proficiency Levels</TabsTrigger>
              </TabsList>

              <TabsContent value="mappings" className="space-y-6">
                {/* Actions Bar */}
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={downloadImportTemplate} className="font-inter">
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="font-inter">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Proficiencies
                    </Button>
                    <Button variant="outline" onClick={exportProficiencyMappings} className="font-inter">
                      <Download className="mr-2 h-4 w-4" />
                      Export Mappings
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setIsProficiencyDialogOpen(true)}
                    className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Proficiency
                  </Button>
                </div>

                {/* Skill Proficiency Mappings Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-jio-dark font-inter">Skill Proficiency Mappings</CardTitle>
                    <CardDescription className="font-inter">
                      Define proficiencies per skill and map them to proficiency levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-inter">Skill</TableHead>
                            <TableHead className="font-inter">Proficiency Description</TableHead>
                            <TableHead className="font-inter">Level</TableHead>
                            <TableHead className="font-inter">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedProficiencies.map((prof) => (
                            <TableRow key={prof.id}>
                              <TableCell className="font-medium font-inter">{prof.skillName}</TableCell>
                              <TableCell className="max-w-64 font-inter">{prof.description}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-inter">{prof.proficiencyLevelName}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProficiency(prof);
                                      setIsProficiencyDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-orange-600 hover:text-orange-700"
                                    onClick={() => handleInactivateProficiency(prof)}
                                  >
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
              </TabsContent>

              <TabsContent value="levels" className="space-y-6">
                {/* Global Proficiency Levels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-jio-dark font-inter">Global Proficiency Levels</CardTitle>
                    <CardDescription className="font-inter">
                      Define business-specific proficiency levels (3-5 levels as per business policy)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {proficiencyLevels.map((level, index) => (
                        <div key={level.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-4">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <h3 className="font-semibold font-inter">{level.name}</h3>
                                <p className="text-sm text-muted-foreground font-inter">{level.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedLevel(level);
                                setIsLevelDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Validation Warnings */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-inter">
                <strong>System Validations:</strong> Each proficiency maps to exactly one level. 
                Duplicate proficiency descriptions under the same skill are not allowed.
              </AlertDescription>
            </Alert>

            {/* Edit Level Dialog */}
            <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-inter">Edit Proficiency Level</DialogTitle>
                  <DialogDescription className="font-inter">
                    Update the proficiency level information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="level-name" className="font-inter">Level Name</Label>
                    <Input 
                      id="level-name" 
                      placeholder="e.g., Advanced" 
                      defaultValue={selectedLevel?.name || ''}
                      className="font-inter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level-description" className="font-inter">Description</Label>
                    <Textarea 
                      id="level-description" 
                      placeholder="Describe what this level represents..."
                      defaultValue={selectedLevel?.description || ''}
                      className="font-inter"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLevelDialogOpen(false)} className="font-inter">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Success",
                        description: "Proficiency level updated successfully."
                      });
                      setIsLevelDialogOpen(false);
                      setSelectedLevel(null);
                    }}
                    className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                  >
                    Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add/Edit Proficiency Dialog */}
            <Dialog open={isProficiencyDialogOpen} onOpenChange={setIsProficiencyDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-inter">
                    {selectedProficiency ? 'Edit Proficiency' : 'Add Proficiency'}
                  </DialogTitle>
                  <DialogDescription className="font-inter">
                    Define a proficiency for a specific skill and map it to a level
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill-select" className="font-inter">Skill *</Label>
                    <Select defaultValue={selectedProficiency?.skillId || ''}>
                      <SelectTrigger className="font-inter">
                        <SelectValue placeholder="Select a skill..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="font-inter">Python Programming</SelectItem>
                        <SelectItem value="2" className="font-inter">JavaScript Development</SelectItem>
                        <SelectItem value="3" className="font-inter">Data Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proficiency-description" className="font-inter">Proficiency Description *</Label>
                    <Textarea 
                      id="proficiency-description" 
                      placeholder="Describe what this proficiency entails..."
                      defaultValue={selectedProficiency?.description || ''}
                      className="font-inter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level-select" className="font-inter">Proficiency Level *</Label>
                    <Select defaultValue={selectedProficiency?.proficiencyLevelId || ''}>
                      <SelectTrigger className="font-inter">
                        <SelectValue placeholder="Select a level..." />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id} className="font-inter">
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProficiencyDialogOpen(false)} className="font-inter">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Success",
                        description: `Proficiency ${selectedProficiency ? 'updated' : 'created'} successfully.`
                      });
                      setIsProficiencyDialogOpen(false);
                      setSelectedProficiency(null);
                    }}
                    className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                  >
                    {selectedProficiency ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-inter">Import Proficiencies</DialogTitle>
                  <DialogDescription className="font-inter">
                    Upload an Excel file to import proficiency mappings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-file" className="font-inter">Select Excel File</Label>
                    <Input 
                      id="import-file" 
                      type="file" 
                      accept=".xlsx,.xls,.csv"
                      className="font-inter"
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="font-inter">
                      New entries will be added and existing ones will be updated. No deletions will be performed via import.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} className="font-inter">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Import Complete",
                        description: "Proficiencies have been imported successfully."
                      });
                      setIsImportDialogOpen(false);
                    }}
                    className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                  >
                    Import
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Inactivate Confirmation Dialog */}
            <Dialog open={isInactivateDialogOpen} onOpenChange={setIsInactivateDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 font-inter">
                    <Archive className="h-5 w-5 text-orange-600" />
                    Confirm Inactivation
                  </DialogTitle>
                  <DialogDescription className="font-inter">
                    Are you sure you want to inactivate this proficiency? It will be moved to the inactive bin.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInactivateDialogOpen(false)} className="font-inter">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmInactivate} className="font-inter">
                    Inactivate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
