
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Settings, Plus, Eye, Pencil, Sparkles, Users, Building, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface JobRole {
  id: string;
  title: string;
  business: string;
  group: string;
  department: string;
  description: string;
  maxSkills: number;
  clusters: Cluster[];
  groups: Group[];
  skills: JobRoleSkill[];
}

interface Cluster {
  id: string;
  name: string;
  isAISuggested: boolean;
  isRequired: boolean;
}

interface Group {
  id: string;
  name: string;
  clusterId: string;
  isAISuggested: boolean;
  isRequired: boolean;
}

interface JobRoleSkill {
  id: string;
  skillName: string;
  cluster: string;
  group: string;
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
  isAISuggested: boolean;
  isRequired: boolean;
}

interface GlobalSettings {
  globalMaxSkills: number;
}

const JobRoleSkillRelationship = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobRole, setSelectedJobRole] = useState<JobRole | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDefineSkillsOpen, setIsDefineSkillsOpen] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ globalMaxSkills: 50 });

  // Mock data
  const [jobRoles] = useState<JobRole[]>([
    {
      id: '1',
      title: 'Software Engineer',
      business: 'Technology',
      group: 'Engineering',
      department: 'Development',
      description: 'Develops and maintains software applications',
      maxSkills: 25,
      clusters: [
        { id: '1', name: 'Programming', isAISuggested: true, isRequired: true },
        { id: '2', name: 'Problem Solving', isAISuggested: false, isRequired: true }
      ],
      groups: [
        { id: '1', name: 'Frontend Development', clusterId: '1', isAISuggested: true, isRequired: true },
        { id: '2', name: 'Backend Development', clusterId: '1', isAISuggested: false, isRequired: true }
      ],
      skills: [
        {
          id: '1',
          skillName: 'React',
          cluster: 'Programming',
          group: 'Frontend Development',
          proficiencyLevel: 'Advanced',
          criticalityLevel: 'High',
          isAISuggested: true,
          isRequired: true
        },
        {
          id: '2',
          skillName: 'Node.js',
          cluster: 'Programming',
          group: 'Backend Development',
          proficiencyLevel: 'Intermediate',
          criticalityLevel: 'Medium',
          isAISuggested: false,
          isRequired: true
        }
      ]
    },
    {
      id: '2',
      title: 'Product Manager',
      business: 'Product',
      group: 'Management',
      department: 'Strategy',
      description: 'Manages product development lifecycle',
      maxSkills: 20,
      clusters: [
        { id: '3', name: 'Leadership', isAISuggested: true, isRequired: true }
      ],
      groups: [
        { id: '3', name: 'Strategic Planning', clusterId: '3', isAISuggested: true, isRequired: true }
      ],
      skills: [
        {
          id: '3',
          skillName: 'Product Strategy',
          cluster: 'Leadership',
          group: 'Strategic Planning',
          proficiencyLevel: 'Expert',
          criticalityLevel: 'High',
          isAISuggested: true,
          isRequired: true
        }
      ]
    }
  ]);

  const businesses = ['Technology', 'Product', 'Marketing', 'Sales'];
  const groups = ['Engineering', 'Management', 'Design', 'Operations'];
  const departments = ['Development', 'Strategy', 'Creative', 'Support'];

  const filteredJobRoles = jobRoles.filter(role => {
    return (
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!businessFilter || role.business === businessFilter) &&
      (!groupFilter || role.group === groupFilter) &&
      (!departmentFilter || role.department === departmentFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobRoles = filteredJobRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleDefineSkills = (jobRole: JobRole) => {
    setSelectedJobRole(jobRole);
    setIsDefineSkillsOpen(true);
  };

  const handleSaveGlobalSettings = () => {
    toast.success("Global settings updated successfully");
    setIsSettingsOpen(false);
  };

  const handleSaveSkillDefinitions = () => {
    toast.success("Skill definitions saved successfully");
    setIsDefineSkillsOpen(false);
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Job Role - Skill Relationship</h1>
                <p className="text-muted-foreground">Manage skill requirements and proficiency levels for job roles</p>
              </div>
              <Button onClick={() => setIsSettingsOpen(true)} variant="outline" className="w-full md:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Global Settings
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Job Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search job roles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={businessFilter} onValueChange={setBusinessFilter}>
                    <SelectTrigger>
                      <Building className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Businesses</SelectItem>
                      {businesses.map(business => (
                        <SelectItem key={business} value={business}>{business}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger>
                      <Users className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Groups</SelectItem>
                      {groups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <Briefcase className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department} value={department}>{department}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Roles Table */}
            <Card>
              <CardHeader>
                <CardTitle>Job Roles ({filteredJobRoles.length})</CardTitle>
                <CardDescription>
                  View and manage skill relationships for job roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Max Skills</TableHead>
                        <TableHead>Mapped Skills</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedJobRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.title}</TableCell>
                          <TableCell>{role.business}</TableCell>
                          <TableCell>{role.group}</TableCell>
                          <TableCell>{role.department}</TableCell>
                          <TableCell>
                            <Badge variant={role.skills.length >= role.maxSkills ? "destructive" : "secondary"}>
                              {role.skills.length}/{role.maxSkills}
                            </Badge>
                          </TableCell>
                          <TableCell>{role.skills.length}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleDefineSkills(role)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View/Edit
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
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              onClick={() => setCurrentPage(i + 1)}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Global Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Global Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="globalMaxSkills">Global Maximum Skills per Job Role</Label>
                    <Input
                      id="globalMaxSkills"
                      type="number"
                      value={globalSettings.globalMaxSkills}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings,
                        globalMaxSkills: parseInt(e.target.value) || 0
                      })}
                      min="1"
                      max="100"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Maximum number of skills that can be assigned to any job role globally
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGlobalSettings}>
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Define Skills Dialog */}
            <Dialog open={isDefineSkillsOpen} onOpenChange={setIsDefineSkillsOpen}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Define Skills for {selectedJobRole?.title}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedJobRole && (
                  <div className="space-y-6">
                    {/* Job Role Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Job Role Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Local Maximum Skills</Label>
                            <Input
                              type="number"
                              defaultValue={selectedJobRole.maxSkills}
                              min="1"
                              max={globalSettings.globalMaxSkills}
                              className="mt-1"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Must be ≤ {globalSettings.globalMaxSkills} (global limit)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Clusters Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Required Clusters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedJobRole.clusters.map((cluster) => (
                            <div key={cluster.id} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{cluster.name}</span>
                                {cluster.isAISuggested && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Suggested
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={cluster.isRequired ? "default" : "outline"}>
                                  {cluster.isRequired ? "Required" : "Optional"}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Cluster
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Groups Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Required Groups
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedJobRole.groups.map((group) => (
                            <div key={group.id} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{group.name}</span>
                                {group.isAISuggested && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Suggested
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={group.isRequired ? "default" : "outline"}>
                                  {group.isRequired ? "Required" : "Optional"}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Group
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Required Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Skill</TableHead>
                                <TableHead>Cluster</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Proficiency</TableHead>
                                <TableHead>Criticality</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedJobRole.skills.map((skill) => (
                                <TableRow key={skill.id}>
                                  <TableCell className="font-medium">{skill.skillName}</TableCell>
                                  <TableCell>{skill.cluster}</TableCell>
                                  <TableCell>{skill.group}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{skill.proficiencyLevel}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={
                                        skill.criticalityLevel === 'High' ? 'destructive' :
                                        skill.criticalityLevel === 'Medium' ? 'default' : 'secondary'
                                      }
                                    >
                                      {skill.criticalityLevel}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {skill.isAISuggested ? (
                                      <Badge variant="secondary" className="text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        AI
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-xs">Manual</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button size="sm" variant="ghost">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDefineSkillsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSkillDefinitions}>
                    Save Changes
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

export default JobRoleSkillRelationship;
