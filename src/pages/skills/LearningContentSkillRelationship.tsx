
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, BookOpen, Users, FileText } from "lucide-react";
import { useState } from "react";
import { MapContentToSkillsDialog } from "@/components/learning-content/MapContentToSkillsDialog";
import { MapSkillsToContentDialog } from "@/components/learning-content/MapSkillsToContentDialog";

interface ContentSkillMapping {
  id: string;
  no: number;
  contentId: string;
  contentName: string;
  contentType: 'course' | 'learning-path';
  skillName: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  createdDate: string;
}

const LearningContentSkillRelationship = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMapContentToSkillsOpen, setIsMapContentToSkillsOpen] = useState(false);
  const [isMapSkillsToContentOpen, setIsMapSkillsToContentOpen] = useState(false);

  // Mock data for content-skill mappings
  const [mappings, setMappings] = useState<ContentSkillMapping[]>([
    {
      id: "1",
      no: 1,
      contentId: "C001",
      contentName: "Advanced JavaScript Programming",
      contentType: "course",
      skillName: "JavaScript",
      proficiencyLevel: "Advanced",
      cluster: "Technical Skills",
      group: "Programming",
      createdDate: "2024-01-15"
    },
    {
      id: "2", 
      no: 2,
      contentId: "C001",
      contentName: "Advanced JavaScript Programming",
      contentType: "course",
      skillName: "React",
      proficiencyLevel: "Intermediate",
      cluster: "Technical Skills",
      group: "Frontend",
      createdDate: "2024-01-15"
    },
    {
      id: "3",
      no: 3,
      contentId: "LP001",
      contentName: "Full Stack Development Path",
      contentType: "learning-path",
      skillName: "Node.js",
      proficiencyLevel: "Advanced",
      cluster: "Technical Skills",
      group: "Backend",
      createdDate: "2024-01-20"
    }
  ]);

  const filteredMappings = mappings.filter(mapping =>
    mapping.contentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.contentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMappings: mappings.length,
    totalContent: new Set(mappings.map(m => m.contentId)).size,
    totalSkills: new Set(mappings.map(m => m.skillName)).size
  };

  const handleAddContentToSkillsMapping = (newMappings: any[]) => {
    const nextNo = Math.max(...mappings.map(m => m.no), 0) + 1;
    const newMappingRecords = newMappings.map((mapping, index) => ({
      ...mapping,
      id: `${Date.now()}-${index}`,
      no: nextNo + index,
      createdDate: new Date().toISOString().split('T')[0]
    }));
    
    setMappings(prev => [...prev, ...newMappingRecords]);
    setIsMapContentToSkillsOpen(false);
  };

  const handleAddSkillsToContentMapping = (newMappings: any[]) => {
    const nextNo = Math.max(...mappings.map(m => m.no), 0) + 1;
    const newMappingRecords = newMappings.map((mapping, index) => ({
      ...mapping,
      id: `${Date.now()}-${index}`,
      no: nextNo + index,
      createdDate: new Date().toISOString().split('T')[0]
    }));
    
    setMappings(prev => [...prev, ...newMappingRecords]);
    setIsMapSkillsToContentOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Content - Skill Relationship</h1>
              <p className="text-muted-foreground">Manage relationships between learning content and skills</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalMappings}</div>
                      <div className="text-sm text-muted-foreground">Total Mappings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalContent}</div>
                      <div className="text-sm text-muted-foreground">Mapped Content</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{stats.totalSkills}</div>
                      <div className="text-sm text-muted-foreground">Mapped Skills</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Content-Skill Mappings</CardTitle>
                    <CardDescription>
                      View and manage relationships between learning content and skills
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => setIsMapContentToSkillsOpen(true)}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Map Content to Skills
                    </Button>
                    <Button 
                      onClick={() => setIsMapSkillsToContentOpen(true)}
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Map Skills to Content
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by content name, skill, or content ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">No.</TableHead>
                          <TableHead>Content ID</TableHead>
                          <TableHead>Content Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Skill</TableHead>
                          <TableHead>Proficiency Level</TableHead>
                          <TableHead>Cluster</TableHead>
                          <TableHead>Group</TableHead>
                          <TableHead>Created Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMappings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              <div className="flex flex-col items-center space-y-2">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                                <span className="text-muted-foreground">No mappings found</span>
                                <span className="text-sm text-muted-foreground">
                                  Create your first mapping by clicking "Map Content to Skills"
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMappings.map((mapping) => (
                            <TableRow key={mapping.id}>
                              <TableCell className="font-medium">{mapping.no}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{mapping.contentId}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{mapping.contentName}</TableCell>
                              <TableCell>
                                <Badge variant={mapping.contentType === 'course' ? 'default' : 'secondary'}>
                                  {mapping.contentType === 'course' ? 'Course' : 'Learning Path'}
                                </Badge>
                              </TableCell>
                              <TableCell>{mapping.skillName}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    mapping.proficiencyLevel === 'Beginner' ? 'secondary' :
                                    mapping.proficiencyLevel === 'Intermediate' ? 'default' : 'destructive'
                                  }
                                >
                                  {mapping.proficiencyLevel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{mapping.cluster}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{mapping.group}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{mapping.createdDate}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dialogs */}
            <MapContentToSkillsDialog
              open={isMapContentToSkillsOpen}
              onOpenChange={setIsMapContentToSkillsOpen}
              onSave={handleAddContentToSkillsMapping}
            />

            <MapSkillsToContentDialog
              open={isMapSkillsToContentOpen}
              onOpenChange={setIsMapSkillsToContentOpen}
              onSave={handleAddSkillsToContentMapping}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningContentSkillRelationship;
