import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Upload, Download, Edit, Archive, Search, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface ProficiencyMapping {
  id: string;
  skillId: string;
  skillName: string;
  proficiencyDescription: string;
  proficiencyLevelId: string;
  proficiencyLevelTitle: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
interface GlobalProficiencyLevel {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  order: number;
}
interface Skill {
  id: string;
  name: string;
}
const ITEMS_PER_PAGE = 10;
const ProficiencyLevels = () => {
  const [activeTab, setActiveTab] = useState('mappings');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createMappingOpen, setCreateMappingOpen] = useState(false);
  const [editMappingOpen, setEditMappingOpen] = useState(false);
  const [editLevelOpen, setEditLevelOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<ProficiencyMapping | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GlobalProficiencyLevel | null>(null);
  const {
    toast
  } = useToast();

  // Mock data for proficiency mappings
  const [proficiencyMappings, setProficiencyMappings] = useState<ProficiencyMapping[]>([{
    id: '1',
    skillId: '1',
    skillName: 'Python Programming',
    proficiencyDescription: 'Basic Python syntax and fundamental concepts',
    proficiencyLevelId: '1',
    proficiencyLevelTitle: 'Beginner',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  }, {
    id: '2',
    skillId: '1',
    skillName: 'Python Programming',
    proficiencyDescription: 'Advanced Python with frameworks and libraries',
    proficiencyLevelId: '2',
    proficiencyLevelTitle: 'Intermediate',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    isActive: true
  }]);

  // Load proficiency mappings from localStorage on mount
  useEffect(() => {
    const loadProficiencies = () => {
      try {
        const stored = localStorage.getItem('proficiencyMappings');
        if (stored) {
          const mappings = JSON.parse(stored).map((mapping: any) => ({
            ...mapping,
            createdAt: new Date(mapping.createdAt),
            updatedAt: new Date(mapping.updatedAt)
          }));
          setProficiencyMappings(mappings);
        }
      } catch (error) {
        console.error('Error loading proficiency mappings:', error);
      }
    };
    loadProficiencies();

    // Refresh periodically to catch restorations
    const interval = setInterval(loadProficiencies, 2000);
    return () => clearInterval(interval);
  }, []);

  // Save proficiency mappings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('proficiencyMappings', JSON.stringify(proficiencyMappings));
  }, [proficiencyMappings]);

  // Mock data for global proficiency levels
  const [globalLevels, setGlobalLevels] = useState<GlobalProficiencyLevel[]>([{
    id: '1',
    title: 'Beginner',
    description: 'Basic understanding and limited practical experience',
    minScore: 0,
    maxScore: 25,
    order: 1
  }, {
    id: '2',
    title: 'Intermediate',
    description: 'Good understanding with moderate practical experience',
    minScore: 26,
    maxScore: 75,
    order: 2
  }, {
    id: '3',
    title: 'Expert',
    description: 'Deep expertise with extensive practical experience',
    minScore: 76,
    maxScore: 100,
    order: 3
  }]);

  // Mock skills data
  const mockSkills: Skill[] = [{
    id: '1',
    name: 'Python Programming'
  }, {
    id: '2',
    name: 'JavaScript Development'
  }, {
    id: '3',
    name: 'Data Analysis'
  }];
  const getFilteredMappings = () => {
    let filtered = proficiencyMappings.filter(mapping => mapping.isActive);
    if (searchTerm) {
      filtered = filtered.filter(mapping => mapping.skillName.toLowerCase().includes(searchTerm.toLowerCase()) || mapping.proficiencyDescription.toLowerCase().includes(searchTerm.toLowerCase()) || mapping.proficiencyLevelTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  };
  const filteredMappings = getFilteredMappings();
  const totalPages = Math.ceil(filteredMappings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMappings = filteredMappings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const handleInactivateProficiency = (mapping: ProficiencyMapping) => {
    // Update proficiency to inactive
    setProficiencyMappings(prev => prev.map(m => m.id === mapping.id ? {
      ...m,
      isActive: false,
      updatedAt: new Date()
    } : m));

    // Add to inactive items
    const inactiveItem = {
      id: mapping.id,
      name: mapping.proficiencyDescription,
      description: `${mapping.skillName} - ${mapping.proficiencyLevelTitle}`,
      type: 'proficiency',
      parentName: mapping.skillName,
      inactivatedAt: new Date(),
      inactivatedBy: 'Current User',
      employeeCount: Math.floor(Math.random() * 50) + 10,
      courseCount: Math.floor(Math.random() * 10) + 1,
      roleCount: Math.floor(Math.random() * 5) + 1
    };

    // Add to inactive items in localStorage
    const storedInactive = localStorage.getItem('inactiveItems');
    let inactiveItems = storedInactive ? JSON.parse(storedInactive) : [];
    inactiveItems.push(inactiveItem);
    localStorage.setItem('inactiveItems', JSON.stringify(inactiveItems));
    toast({
      title: "Proficiency Inactivated",
      description: `Proficiency "${mapping.proficiencyDescription}" has been moved to the Inactive Bin and removed from the Skill Proficiency Mappings.`
    });
  };
  const handleEditMapping = (mapping: ProficiencyMapping) => {
    setSelectedMapping(mapping);
    setEditMappingOpen(true);
  };
  const handleEditLevel = (level: GlobalProficiencyLevel) => {
    setSelectedLevel(level);
    setEditLevelOpen(true);
  };
  const handleMappingUpdated = (updatedMapping: ProficiencyMapping) => {
    setProficiencyMappings(prev => prev.map(m => m.id === updatedMapping.id ? {
      ...updatedMapping,
      updatedAt: new Date()
    } : m));
    toast({
      title: "Success",
      description: "Proficiency mapping updated successfully and reflected in the master data."
    });
    setEditMappingOpen(false);
  };
  const handleLevelUpdated = (updatedLevel: GlobalProficiencyLevel) => {
    setGlobalLevels(prev => prev.map(level => level.id === updatedLevel.id ? updatedLevel : level));

    // Update mappings that reference this level
    setProficiencyMappings(prev => prev.map(mapping => mapping.proficiencyLevelId === updatedLevel.id ? {
      ...mapping,
      proficiencyLevelTitle: updatedLevel.title,
      updatedAt: new Date()
    } : mapping));
    toast({
      title: "Success",
      description: "Global proficiency level updated successfully and reflected in all related mappings."
    });
    setEditLevelOpen(false);
  };
  const handleMappingCreated = (newMapping: Partial<ProficiencyMapping>) => {
    const mapping: ProficiencyMapping = {
      id: Date.now().toString(),
      skillId: newMapping.skillId!,
      skillName: mockSkills.find(s => s.id === newMapping.skillId)?.name || '',
      proficiencyDescription: newMapping.proficiencyDescription!,
      proficiencyLevelId: newMapping.proficiencyLevelId!,
      proficiencyLevelTitle: globalLevels.find(l => l.id === newMapping.proficiencyLevelId)?.title || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    setProficiencyMappings(prev => [...prev, mapping]);
    toast({
      title: "Success",
      description: "Proficiency mapping created successfully and is now reflected in the Skill Proficiency Mappings master."
    });
    setCreateMappingOpen(false);
  };
  const downloadTemplate = () => {
    const headers = ['Skill Name', 'Proficiency Description', 'Proficiency Level'];
    const sampleData = [['Python Programming', 'Basic syntax and fundamentals', 'Beginner'], ['JavaScript Development', 'Advanced frameworks and libraries', 'Intermediate']];
    const csvContent = [headers, ...sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_mappings_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const exportMappings = () => {
    const headers = ['Skill Name', 'Proficiency Description', 'Proficiency Level'];
    const data = filteredMappings.map(mapping => [mapping.skillName, mapping.proficiencyDescription, mapping.proficiencyLevelTitle]);
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proficiency_mappings_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Skill Proficiency</h1>
                <p className="text-muted-foreground font-inter">Manage skill proficiency mappings and global levels</p>
              </div>
            </div>

            {/* Sub-menu Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mappings" className="font-inter">Skill Proficiency Mappings</TabsTrigger>
                <TabsTrigger value="levels" className="font-inter">Global Proficiency Levels</TabsTrigger>
              </TabsList>

              {/* Skill Proficiency Mappings Tab */}
              <TabsContent value="mappings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">Actions</CardTitle>
                    <CardDescription className="font-inter">
                      Manage proficiency mappings with import/export capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setCreateMappingOpen(true)} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
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
                      <Button variant="outline" onClick={downloadTemplate} className="font-inter">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Search */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">Search & Filter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Search mappings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 font-inter" />
                    </div>
                  </CardContent>
                </Card>

                {/* Proficiency Mappings Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">
                      Skill Proficiency Mappings ({filteredMappings.length})
                    </CardTitle>
                    <CardDescription className="font-inter">
                      View and manage all skill proficiency mappings
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
                            <TableHead className="font-inter">Created</TableHead>
                            <TableHead className="font-inter">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedMappings.length === 0 ? <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-inter">
                                No proficiency mappings found
                              </TableCell>
                            </TableRow> : paginatedMappings.map(mapping => <TableRow key={mapping.id}>
                                <TableCell className="font-medium font-inter">{mapping.skillName}</TableCell>
                                <TableCell className="font-inter">{mapping.proficiencyDescription}</TableCell>
                                
                                <TableCell className="font-inter">
                                  {mapping.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditMapping(mapping)} className="font-inter">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleInactivateProficiency(mapping)} className="text-orange-600 hover:text-orange-600 font-inter">
                                      <Archive className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>)}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && <div className="flex justify-center mt-4 pb-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                            </PaginationItem>
                            {Array.from({
                          length: totalPages
                        }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="cursor-pointer">
                                  {page}
                                </PaginationLink>
                              </PaginationItem>)}
                            <PaginationItem>
                              <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Global Proficiency Levels Tab */}
              <TabsContent value="levels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">Global Proficiency Levels</CardTitle>
                    <CardDescription className="font-inter">
                      Manage global proficiency level definitions used across all skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter">Order</TableHead>
                          <TableHead className="font-inter">Title</TableHead>
                          <TableHead className="font-inter">Description</TableHead>
                          <TableHead className="font-inter">Score Range</TableHead>
                          <TableHead className="font-inter">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {globalLevels.map(level => <TableRow key={level.id}>
                            <TableCell className="font-inter">{level.order}</TableCell>
                            <TableCell className="font-medium font-inter">{level.title}</TableCell>
                            <TableCell className="font-inter">{level.description}</TableCell>
                            
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleEditLevel(level)} className="font-inter">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CreateProficiencyDialog open={createMappingOpen} onOpenChange={setCreateMappingOpen} skills={mockSkills} proficiencyLevels={globalLevels} onProficiencyCreated={handleMappingCreated} />

            <EditProficiencyDialog open={editMappingOpen} onOpenChange={setEditMappingOpen} mapping={selectedMapping} skills={mockSkills} proficiencyLevels={globalLevels} onProficiencyUpdated={handleMappingUpdated} />

            <EditLevelDialog open={editLevelOpen} onOpenChange={setEditLevelOpen} level={selectedLevel} onLevelUpdated={handleLevelUpdated} />

            <ImportProficienciesDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} skills={mockSkills} proficiencyLevels={globalLevels} existingMappings={proficiencyMappings} onImportComplete={imported => {
            setProficiencyMappings(prev => [...prev, ...imported]);
            toast({
              title: "Import Complete",
              description: `${imported.length} proficiency mappings imported successfully and reflected in the master data.`
            });
          }} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};

// Create Proficiency Dialog Component
const CreateProficiencyDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: Skill[];
  proficiencyLevels: GlobalProficiencyLevel[];
  onProficiencyCreated: (mapping: Partial<ProficiencyMapping>) => void;
}> = ({
  open,
  onOpenChange,
  skills,
  proficiencyLevels,
  onProficiencyCreated
}) => {
  const [skillId, setSkillId] = useState('');
  const [proficiencyDescription, setProficiencyDescription] = useState('');
  const [proficiencyLevelId, setProficiencyLevelId] = useState('');
  const {
    toast
  } = useToast();
  const handleSubmit = () => {
    if (!skillId || !proficiencyDescription || !proficiencyLevelId) {
      toast({
        title: "Validation Error",
        description: "All fields are mandatory. Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    onProficiencyCreated({
      skillId,
      proficiencyDescription,
      proficiencyLevelId
    });

    // Reset form
    setSkillId('');
    setProficiencyDescription('');
    setProficiencyLevelId('');
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-inter font-bold text-jio-dark">Create Proficiency Mapping</DialogTitle>
          <DialogDescription className="font-inter">
            Create a new proficiency mapping for a skill
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill" className="font-inter font-medium">Skill *</Label>
            <Select value={skillId} onValueChange={setSkillId}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map(skill => <SelectItem key={skill.id} value={skill.id} className="font-inter">
                    {skill.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter font-medium">Proficiency Description *</Label>
            <Textarea id="description" value={proficiencyDescription} onChange={e => setProficiencyDescription(e.target.value)} placeholder="Describe this proficiency level for the skill" className="font-inter" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="font-inter font-medium">Proficiency Level *</Label>
            <Select value={proficiencyLevelId} onValueChange={setProficiencyLevelId}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map(level => <SelectItem key={level.id} value={level.id} className="font-inter">
                    {level.title}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
            Create Proficiency
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

// Edit Proficiency Dialog Component
const EditProficiencyDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mapping: ProficiencyMapping | null;
  skills: Skill[];
  proficiencyLevels: GlobalProficiencyLevel[];
  onProficiencyUpdated: (mapping: ProficiencyMapping) => void;
}> = ({
  open,
  onOpenChange,
  mapping,
  skills,
  proficiencyLevels,
  onProficiencyUpdated
}) => {
  const [skillId, setSkillId] = useState(mapping?.skillId || '');
  const [proficiencyDescription, setProficiencyDescription] = useState(mapping?.proficiencyDescription || '');
  const [proficiencyLevelId, setProficiencyLevelId] = useState(mapping?.proficiencyLevelId || '');
  const {
    toast
  } = useToast();
  React.useEffect(() => {
    if (mapping) {
      setSkillId(mapping.skillId);
      setProficiencyDescription(mapping.proficiencyDescription);
      setProficiencyLevelId(mapping.proficiencyLevelId);
    }
  }, [mapping]);
  const handleSubmit = () => {
    if (!skillId || !proficiencyDescription || !proficiencyLevelId || !mapping) {
      toast({
        title: "Validation Error",
        description: "All fields are mandatory. Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    const updatedMapping: ProficiencyMapping = {
      ...mapping,
      skillId,
      skillName: skills.find(s => s.id === skillId)?.name || '',
      proficiencyDescription,
      proficiencyLevelId,
      proficiencyLevelTitle: proficiencyLevels.find(l => l.id === proficiencyLevelId)?.title || ''
    };
    onProficiencyUpdated(updatedMapping);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-inter font-bold text-jio-dark">Edit Proficiency Mapping</DialogTitle>
          <DialogDescription className="font-inter">
            Update the proficiency mapping details
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill" className="font-inter font-medium">Skill *</Label>
            <Select value={skillId} onValueChange={setSkillId}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map(skill => <SelectItem key={skill.id} value={skill.id} className="font-inter">
                    {skill.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter font-medium">Proficiency Description *</Label>
            <Textarea id="description" value={proficiencyDescription} onChange={e => setProficiencyDescription(e.target.value)} placeholder="Describe this proficiency level for the skill" className="font-inter" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="font-inter font-medium">Proficiency Level *</Label>
            <Select value={proficiencyLevelId} onValueChange={setProficiencyLevelId}>
              <SelectTrigger className="font-inter">
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map(level => <SelectItem key={level.id} value={level.id} className="font-inter">
                    {level.title}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
            Update Proficiency
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

// Edit Level Dialog Component
const EditLevelDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: GlobalProficiencyLevel | null;
  onLevelUpdated: (level: GlobalProficiencyLevel) => void;
}> = ({
  open,
  onOpenChange,
  level,
  onLevelUpdated
}) => {
  const [title, setTitle] = useState(level?.title || '');
  const [description, setDescription] = useState(level?.description || '');
  const {
    toast
  } = useToast();
  React.useEffect(() => {
    if (level) {
      setTitle(level.title);
      setDescription(level.description);
    }
  }, [level]);
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !level) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        variant: "destructive"
      });
      return;
    }
    const updatedLevel: GlobalProficiencyLevel = {
      ...level,
      title: title.trim(),
      description: description.trim()
    };
    onLevelUpdated(updatedLevel);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-inter font-bold text-jio-dark">Edit Global Proficiency Level</DialogTitle>
          <DialogDescription className="font-inter">
            Update the title and description of this proficiency level
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-inter font-medium">Title *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter level title" className="font-inter" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter font-medium">Description *</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this proficiency level" className="font-inter" />
          </div>

          {level && <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground font-inter">
                Score Range: {level.minScore} - {level.maxScore} (cannot be edited)
              </p>
            </div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
            Update Level
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};

// Import Proficiencies Dialog Component
const ImportProficienciesDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: Skill[];
  proficiencyLevels: GlobalProficiencyLevel[];
  existingMappings: ProficiencyMapping[];
  onImportComplete: (imported: ProficiencyMapping[]) => void;
}> = ({
  open,
  onOpenChange,
  skills,
  proficiencyLevels,
  existingMappings,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const {
    toast
  } = useToast();
  const validateAndImport = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        if (headers.length !== 3 || !headers.includes('Skill Name') || !headers.includes('Proficiency Description') || !headers.includes('Proficiency Level')) {
          setErrors(['Invalid CSV format. Expected columns: Skill Name, Proficiency Description, Proficiency Level']);
          return;
        }
        const importErrors: string[] = [];
        const validMappings: ProficiencyMapping[] = [];
        for (let i = 1; i < lines.length; i++) {
          const [skillName, proficiencyDescription, proficiencyLevel] = lines[i].split(',').map(cell => cell.trim());
          if (!skillName || !proficiencyDescription || !proficiencyLevel) {
            importErrors.push(`Row ${i + 1}: All fields are required`);
            continue;
          }
          const skill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
          if (!skill) {
            importErrors.push(`Row ${i + 1}: Skill "${skillName}" not found`);
            continue;
          }
          const level = proficiencyLevels.find(l => l.title.toLowerCase() === proficiencyLevel.toLowerCase());
          if (!level) {
            importErrors.push(`Row ${i + 1}: Proficiency level "${proficiencyLevel}" not found`);
            continue;
          }

          // Check for duplicate proficiency description under same skill 
          const duplicateInExisting = existingMappings.find(m => m.skillId === skill.id && m.proficiencyDescription.toLowerCase() === proficiencyDescription.toLowerCase() && m.isActive);
          const duplicateInImport = validMappings.find(m => m.skillId === skill.id && m.proficiencyDescription.toLowerCase() === proficiencyDescription.toLowerCase());
          if (duplicateInExisting || duplicateInImport) {
            importErrors.push(`Row ${i + 1}: Duplicate proficiency description "${proficiencyDescription}" for skill "${skillName}"`);
            continue;
          }
          validMappings.push({
            id: `import_${Date.now()}_${i}`,
            skillId: skill.id,
            skillName: skill.name,
            proficiencyDescription,
            proficiencyLevelId: level.id,
            proficiencyLevelTitle: level.title,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
          });
        }
        setErrors(importErrors);
        if (importErrors.length > 0) {
          toast({
            title: "Import Errors",
            description: `Found ${importErrors.length} errors. Please fix them and try again.`,
            variant: "destructive"
          });
        } else {
          onImportComplete(validMappings);
          onOpenChange(false);
          setFile(null);
          setErrors([]);
        }
      } catch (error) {
        setErrors(['Failed to parse CSV file. Please check the file format.']);
        toast({
          title: "Import Failed",
          description: "Failed to parse CSV file. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-inter font-bold text-jio-dark">Import Proficiencies</DialogTitle>
          <DialogDescription className="font-inter">
            Import proficiency mappings from a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-inter">
              <strong>Import Rules:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cannot create duplicate proficiency descriptions under the same skill</li>
                <li>Each proficiency must map to exactly one proficiency level</li>
                <li>Each proficiency must map to exactly one skill</li>
                <li>Only new entries and updates to existing ones are allowed</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="file" className="font-inter font-medium">Select CSV File</Label>
            <Input id="file" type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} className="font-inter" />
          </div>

          {errors.length > 0 && <div className="border border-destructive rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-destructive font-inter">Import Errors:</h4>
              <ul className="text-sm space-y-1">
                {errors.map((error, index) => <li key={index} className="text-destructive font-inter">• {error}</li>)}
              </ul>
            </div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button onClick={validateAndImport} className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter">
            Import Proficiencies
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default ProficiencyLevels;