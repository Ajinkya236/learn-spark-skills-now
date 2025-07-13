
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Settings, Eye, Users, Building, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface JobRole {
  id: string;
  title: string;
  business: string;
  group: string;
  department: string;
  description: string;
  maxSkills: number;
  skills: string[];
}

interface GlobalSettings {
  globalMaxSkills: number;
}

const JobRoleSkillRelationship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript']
    },
    {
      id: '2',
      title: 'Product Manager',
      business: 'Product',
      group: 'Management',
      department: 'Strategy',
      description: 'Manages product development lifecycle',
      maxSkills: 20,
      skills: ['Product Strategy', 'Agile', 'Data Analysis']
    }
  ]);

  const businesses = ['Technology', 'Product', 'Marketing', 'Sales'];
  const groups = ['Engineering', 'Management', 'Design', 'Operations'];
  const departments = ['Development', 'Strategy', 'Creative', 'Support'];

  const filteredJobRoles = jobRoles.filter(role => {
    return (
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!businessFilter || businessFilter === 'all' || role.business === businessFilter) &&
      (!groupFilter || groupFilter === 'all' || role.group === groupFilter) &&
      (!departmentFilter || departmentFilter === 'all' || role.department === departmentFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobRoles = filteredJobRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleViewEditRole = (jobRole: JobRole) => {
    navigate(`/skills/job-role-relationship/${jobRole.id}`);
  };

  const handleSaveGlobalSettings = () => {
    // Validate that global max is not less than highest local max
    const highestLocalMax = Math.max(...jobRoles.map(role => role.maxSkills));
    
    if (globalSettings.globalMaxSkills < highestLocalMax) {
      toast.error(`Global maximum skills cannot be less than the highest local maximum (${highestLocalMax}) for existing roles`);
      return;
    }

    toast.success("Global settings updated successfully");
    setIsSettingsOpen(false);
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
                      <SelectItem value="all">All Businesses</SelectItem>
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
                      <SelectItem value="all">All Groups</SelectItem>
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
                      <SelectItem value="all">All Departments</SelectItem>
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
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {role.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {role.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{role.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleViewEditRole(role)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View/Edit
                            </Button>
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
                      Maximum number of skills that can be assigned to any job role globally. 
                      Must be ≥ {Math.max(...jobRoles.map(role => role.maxSkills))} (highest local maximum).
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobRoleSkillRelationship;
