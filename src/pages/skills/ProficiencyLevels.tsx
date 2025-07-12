
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Download, Upload, AlertCircle, GripVertical, Info } from 'lucide-react';
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
  title: string;
  description: string;
  proficiencyLevelId: string;
  proficiencyLevelName: string;
  order: number;
}

const ProficiencyLevels = () => {
  const [proficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: '1', name: 'Conversant', description: 'Basic understanding and awareness', order: 1, isGlobal: true },
    { id: '2', name: 'Beginner', description: 'Foundational knowledge with supervision', order: 2, isGlobal: true },
    { id: '3', name: 'Intermediate', description: 'Independent working knowledge', order: 3, isGlobal: true },
    { id: '4', name: 'Advanced', description: 'Expert level with mentoring capability', order: 4, isGlobal: true }
  ]);

  const [proficiencies] = useState<Proficiency[]>([
    { id: '1', skillId: '1', skillName: 'Python Programming', title: 'Basic Syntax', description: 'Understand Python syntax and basic constructs', proficiencyLevelId: '1', proficiencyLevelName: 'Conversant', order: 1 },
    { id: '2', skillId: '1', skillName: 'Python Programming', title: 'Functions & Classes', description: 'Create functions and classes effectively', proficiencyLevelId: '2', proficiencyLevelName: 'Beginner', order: 2 },
    { id: '3', skillId: '1', skillName: 'Python Programming', title: 'Advanced Libraries', description: 'Use NumPy, Pandas, and other libraries', proficiencyLevelId: '3', proficiencyLevelName: 'Intermediate', order: 3 },
    { id: '4', skillId: '1', skillName: 'Python Programming', title: 'Architecture & Mentoring', description: 'Design systems and mentor others', proficiencyLevelId: '4', proficiencyLevelName: 'Advanced', order: 4 }
  ]);

  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [isProficiencyDialogOpen, setIsProficiencyDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState<Proficiency | null>(null);
  const { toast } = useToast();

  const exportProficiencyMappings = () => {
    // Export functionality for cluster -> group -> skill -> proficiency -> proficiency level mappings
    const mappings = proficiencies.map(prof => ({
      Cluster: 'Technical Skills',
      Group: 'Programming Languages',
      Skill: prof.skillName,
      Proficiency: prof.title,
      'Proficiency Level': prof.proficiencyLevelName,
      Description: prof.description,
      Order: prof.order
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
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={exportProficiencyMappings} className="font-inter">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export Mappings</span>
                </Button>
                <Button 
                  onClick={() => setIsLevelDialogOpen(true)}
                  className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter font-semibold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Level</span>
                </Button>
              </div>
            </div>

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

            {/* Skill Proficiency Mappings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-jio-dark font-inter">Skill Proficiency Mappings</CardTitle>
                <CardDescription className="font-inter">
                  Define proficiencies per skill and map them to proficiency levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground font-inter">
                        Each proficiency must map to exactly one proficiency level
                      </span>
                    </div>
                    <Button 
                      onClick={() => setIsProficiencyDialogOpen(true)}
                      className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Proficiency
                    </Button>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter">Skill</TableHead>
                          <TableHead className="font-inter">Proficiency</TableHead>
                          <TableHead className="font-inter">Level</TableHead>
                          <TableHead className="font-inter">Description</TableHead>
                          <TableHead className="font-inter">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {proficiencies.map((prof) => (
                          <TableRow key={prof.id}>
                            <TableCell className="font-medium font-inter">{prof.skillName}</TableCell>
                            <TableCell className="font-inter">{prof.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-inter">{prof.proficiencyLevelName}</Badge>
                            </TableCell>
                            <TableCell className="max-w-48 truncate font-inter">{prof.description}</TableCell>
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
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Warnings */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-inter">
                <strong>System Validations:</strong> Each proficiency maps to exactly one level. 
                Duplicate proficiency descriptions under the same skill are not allowed.
              </AlertDescription>
            </Alert>

            {/* Add/Edit Level Dialog */}
            <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-inter">
                    {selectedLevel ? 'Edit Proficiency Level' : 'Add Proficiency Level'}
                  </DialogTitle>
                  <DialogDescription className="font-inter">
                    Define a global proficiency level for your organization
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
                        description: `Proficiency level ${selectedLevel ? 'updated' : 'created'} successfully.`
                      });
                      setIsLevelDialogOpen(false);
                      setSelectedLevel(null);
                    }}
                    className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
                  >
                    {selectedLevel ? 'Update' : 'Create'}
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
                    <Label htmlFor="skill-select" className="font-inter">Skill</Label>
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
                    <Label htmlFor="proficiency-title" className="font-inter">Proficiency Title</Label>
                    <Input 
                      id="proficiency-title" 
                      placeholder="e.g., Functions & Classes" 
                      defaultValue={selectedProficiency?.title || ''}
                      className="font-inter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proficiency-description" className="font-inter">Description</Label>
                    <Textarea 
                      id="proficiency-description" 
                      placeholder="Describe what this proficiency entails..."
                      defaultValue={selectedProficiency?.description || ''}
                      className="font-inter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level-select" className="font-inter">Proficiency Level</Label>
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
