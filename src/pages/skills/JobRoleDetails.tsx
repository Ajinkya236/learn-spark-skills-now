
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface JobRoleSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

const JobRoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for the job role
  const jobRole = {
    id: id || '1',
    title: 'Software Engineer',
    business: 'Technology',
    group: 'Engineering',
    department: 'Development',
    maxSkills: 25
  };

  const [skills] = useState<JobRoleSkill[]>([
    {
      id: '1',
      no: 1,
      skillName: 'React',
      proficiencyLevel: 'Advanced',
      criticalityLevel: 'High',
      cluster: 'Programming',
      group: 'Frontend Development'
    },
    {
      id: '2',
      no: 2,
      skillName: 'Node.js',
      proficiencyLevel: 'Intermediate',
      criticalityLevel: 'Medium',
      cluster: 'Programming',
      group: 'Backend Development'
    },
    {
      id: '3',
      no: 3,
      skillName: 'Python',
      proficiencyLevel: 'Expert',
      criticalityLevel: 'High',
      cluster: 'Programming',
      group: 'Backend Development'
    }
  ]);

  const filteredSkills = skills.filter(skill => {
    return (
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!proficiencyFilter || proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter) &&
      (!criticalityFilter || criticalityFilter === 'all' || skill.criticalityLevel === criticalityFilter) &&
      (!clusterFilter || clusterFilter === 'all' || skill.cluster === clusterFilter) &&
      (!groupFilter || groupFilter === 'all' || skill.group === groupFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleAddSkills = () => {
    navigate(`/skills/job-role-relationship/${id}/add-skills`);
  };

  const handleEditSkill = (skillId: string) => {
    toast.success("Edit skill functionality would be implemented here");
  };

  const handleDeleteSkill = (skillId: string) => {
    toast.success("Delete skill functionality would be implemented here");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/skills/job-role-relationship')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{jobRole.title}</h1>
                <p className="text-muted-foreground">{jobRole.business} • {jobRole.group} • {jobRole.department}</p>
              </div>
            </div>

            {/* Job Role Info */}
            <Card>
              <CardHeader>
                <CardTitle>Job Role Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Maximum Skills</p>
                    <p className="font-medium">{jobRole.maxSkills}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Skills</p>
                    <p className="font-medium">{skills.length} / {jobRole.maxSkills}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills and Proficiencies</CardTitle>
                <div className="flex justify-between items-center">
                  <CardDescription>
                    Manage skill requirements and proficiency levels
                  </CardDescription>
                  <Button onClick={handleAddSkills}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skills
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={proficiencyFilter} onValueChange={setProficiencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Proficiency Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Proficiency Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Criticality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Criticality</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={clusterFilter} onValueChange={setClusterFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Clusters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clusters</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                      <SelectItem value="Backend Development">Backend Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Proficiency Level</TableHead>
                        <TableHead>Criticality</TableHead>
                        <TableHead>Cluster</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSkills.map((skill) => (
                        <TableRow key={skill.id}>
                          <TableCell>{skill.no}</TableCell>
                          <TableCell className="font-medium">{skill.skillName}</TableCell>
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
                          <TableCell>{skill.cluster}</TableCell>
                          <TableCell>{skill.group}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditSkill(skill.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteSkill(skill.id)}>
                                <Trash2 className="h-4 w-4" />
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobRoleDetails;
