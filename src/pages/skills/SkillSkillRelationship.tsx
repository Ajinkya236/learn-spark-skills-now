
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, Minus, Upload, Download, X, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SkillRelation {
  id: string;
  no: number;
  cluster: string;
  group: string;
  skill: string;
  relatedSkills: string[];
}

interface SkillOption {
  id: string;
  name: string;
  cluster: string;
  group: string;
}

const SkillSkillRelationship = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillRelations, setSkillRelations] = useState<SkillRelation[]>([
    {
      id: "1",
      no: 1,
      cluster: "Technical Skills",
      group: "Programming",
      skill: "JavaScript",
      relatedSkills: ["TypeScript", "React", "Node.js"]
    },
    {
      id: "2", 
      no: 2,
      cluster: "Technical Skills",
      group: "Programming", 
      skill: "Python",
      relatedSkills: ["Django", "Flask", "Data Science"]
    },
    {
      id: "3",
      no: 3,
      cluster: "Design Skills",
      group: "UI/UX",
      skill: "Figma",
      relatedSkills: ["Adobe XD", "Sketch", "Prototyping"]
    }
  ]);

  const [availableSkills] = useState<SkillOption[]>([
    { id: "1", name: "JavaScript", cluster: "Technical Skills", group: "Programming" },
    { id: "2", name: "TypeScript", cluster: "Technical Skills", group: "Programming" },
    { id: "3", name: "React", cluster: "Technical Skills", group: "Programming" },
    { id: "4", name: "Node.js", cluster: "Technical Skills", group: "Programming" },
    { id: "5", name: "Python", cluster: "Technical Skills", group: "Programming" },
    { id: "6", name: "Django", cluster: "Technical Skills", group: "Programming" },
    { id: "7", name: "Flask", cluster: "Technical Skills", group: "Programming" },
    { id: "8", name: "Data Science", cluster: "Technical Skills", group: "Analytics" },
    { id: "9", name: "Figma", cluster: "Design Skills", group: "UI/UX" },
    { id: "10", name: "Adobe XD", cluster: "Design Skills", group: "UI/UX" },
    { id: "11", name: "Sketch", cluster: "Design Skills", group: "UI/UX" },
    { id: "12", name: "Prototyping", cluster: "Design Skills", group: "UI/UX" }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedSkillForEdit, setSelectedSkillForEdit] = useState<SkillRelation | null>(null);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // AI suggested skills based on the current skill
  const getAISuggestedSkills = (currentSkill: string): string[] => {
    const suggestions: Record<string, string[]> = {
      "JavaScript": ["TypeScript", "React", "Vue.js", "Angular"],
      "Python": ["Django", "Flask", "FastAPI", "Pandas"],
      "Figma": ["Adobe XD", "Sketch", "InVision", "Framer"],
      // Add more AI suggestions as needed
    };
    return suggestions[currentSkill] || [];
  };

  const filteredRelations = skillRelations.filter(relation =>
    relation.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.relatedSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAvailableSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill.name) &&
    (selectedSkillForEdit ? skill.name !== selectedSkillForEdit.skill : true)
  );

  const handleAddSkills = () => {
    if (!selectedSkillForEdit || selectedSkills.length === 0) return;

    const duplicateSkills = selectedSkills.filter(skill => 
      selectedSkillForEdit.relatedSkills.includes(skill)
    );

    if (duplicateSkills.length > 0) {
      toast.error(`Relation already exists for: ${duplicateSkills.join(', ')}`);
      return;
    }

    if (selectedSkills.includes(selectedSkillForEdit.skill)) {
      toast.error(`Cannot relate ${selectedSkillForEdit.skill} to itself.`);
      return;
    }

    setSkillRelations(prev => prev.map(relation => 
      relation.id === selectedSkillForEdit.id 
        ? { ...relation, relatedSkills: [...relation.relatedSkills, ...selectedSkills] }
        : relation
    ));

    toast.success(`Added ${selectedSkills.length} skill relation(s) successfully`);

    setSelectedSkills([]);
    setSkillSearchTerm("");
    setIsAddDialogOpen(false);
    setSelectedSkillForEdit(null);
  };

  const handleRemoveSkills = () => {
    if (!selectedSkillForEdit || selectedSkills.length === 0) return;

    setSkillRelations(prev => prev.map(relation => 
      relation.id === selectedSkillForEdit.id 
        ? { ...relation, relatedSkills: relation.relatedSkills.filter(skill => !selectedSkills.includes(skill)) }
        : relation
    ));

    toast.success(`Removed ${selectedSkills.length} skill relation(s) successfully`);

    setSelectedSkills([]);
    setIsRemoveDialogOpen(false);
    setSelectedSkillForEdit(null);
  };

  const handleBulkImport = async (file: File) => {
    setIsUploading(true);
    setImportProgress(0);

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(i);
    }

    toast.success("Bulk import completed successfully");

    setIsUploading(false);
    setImportProgress(0);
    setIsBulkImportOpen(false);
  };

  const downloadTemplate = () => {
    const csvContent = "skill,related skills\nJavaScript,\"TypeScript,React,Node.js\"\nPython,\"Django,Flask,Data Science\"";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill-relationship-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Skill - Skill Relationship</h1>
                <p className="text-muted-foreground">Manage relationships between skills</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Bulk Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Bulk Import Skills</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file to import skill relationships
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
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Related Skills</CardTitle>
                <CardDescription>
                  Search and manage skill relationships
                </CardDescription>
                <div className="w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">No</TableHead>
                        <TableHead>Cluster</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Related Skills</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRelations.map((relation) => (
                        <TableRow key={relation.id}>
                          <TableCell>{relation.no}</TableCell>
                          <TableCell>{relation.cluster}</TableCell>
                          <TableCell>{relation.group}</TableCell>
                          <TableCell className="font-medium">{relation.skill}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {relation.relatedSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedSkillForEdit(relation)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Add Related Skills</DialogTitle>
                                    <DialogDescription>
                                      Select skills to relate to {selectedSkillForEdit?.skill}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-sm font-medium mb-2 text-blue-600">
                                        AI Suggested Related Skills
                                      </div>
                                      <div className="flex flex-wrap gap-1 mb-4">
                                        {selectedSkillForEdit && getAISuggestedSkills(selectedSkillForEdit.skill).map((skill) => (
                                          <Badge 
                                            key={skill} 
                                            variant="outline" 
                                            className="cursor-pointer hover:bg-blue-50 border-blue-200"
                                            onClick={() => {
                                              if (!selectedSkills.includes(skill)) {
                                                setSelectedSkills(prev => [...prev, skill]);
                                              }
                                            }}
                                          >
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="relative">
                                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        placeholder="Search skills..."
                                        className="pl-8"
                                        value={skillSearchTerm}
                                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                      {filteredAvailableSkills.map((skill) => (
                                        <div
                                          key={skill.id}
                                          className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                                          onClick={() => {
                                            if (selectedSkills.includes(skill.name)) {
                                              setSelectedSkills(prev => prev.filter(s => s !== skill.name));
                                            } else {
                                              setSelectedSkills(prev => [...prev, skill.name]);
                                            }
                                          }}
                                        >
                                          <div>
                                            <div className="font-medium">{skill.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {skill.cluster} • {skill.group}
                                            </div>
                                          </div>
                                          {selectedSkills.includes(skill.name) && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {selectedSkills.length > 0 && (
                                      <div className="space-y-2">
                                        <div className="text-sm font-medium">Selected Skills:</div>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedSkills.map((skill) => (
                                            <Badge key={skill} variant="default" className="text-xs">
                                              {skill}
                                              <X
                                                className="ml-1 h-3 w-3 cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSkills(prev => prev.filter(s => s !== skill));
                                                }}
                                              />
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                      <Button onClick={handleAddSkills} disabled={selectedSkills.length === 0}>
                                        Add Skills
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedSkills([]);
                                          setSkillSearchTerm("");
                                          setIsAddDialogOpen(false);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedSkillForEdit(relation)}
                                    disabled={relation.relatedSkills.length === 0}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Remove Related Skills</DialogTitle>
                                    <DialogDescription>
                                      Select skills to remove from {selectedSkillForEdit?.skill}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                      {selectedSkillForEdit?.relatedSkills.map((skill) => (
                                        <div
                                          key={skill}
                                          className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                                          onClick={() => {
                                            if (selectedSkills.includes(skill)) {
                                              setSelectedSkills(prev => prev.filter(s => s !== skill));
                                            } else {
                                              setSelectedSkills(prev => [...prev, skill]);
                                            }
                                          }}
                                        >
                                          <div className="font-medium">{skill}</div>
                                          {selectedSkills.includes(skill) && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {selectedSkills.length > 0 && (
                                      <div className="space-y-2">
                                        <div className="text-sm font-medium">Selected for Removal:</div>
                                        <div className="flex flex-wrap gap-1">
                                          {selectedSkills.map((skill) => (
                                            <Badge key={skill} variant="destructive" className="text-xs">
                                              {skill}
                                              <X
                                                className="ml-1 h-3 w-3 cursor-pointer"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSkills(prev => prev.filter(s => s !== skill));
                                                }}
                                              />
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                      <Button 
                                        onClick={handleRemoveSkills} 
                                        disabled={selectedSkills.length === 0}
                                        variant="destructive"
                                      >
                                        Remove Skills
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedSkills([]);
                                          setIsRemoveDialogOpen(false);
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SkillSkillRelationship;
