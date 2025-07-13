
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Eye, Edit } from "lucide-react";

interface JobPosition {
  id: string;
  no: number;
  jobPosition: string;
  jobRole: string;
  mappedSkills: number;
  business: string;
  group: string;
  department: string;
}

const JobPositionSkillRelationship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for job positions
  const [jobPositions] = useState<JobPosition[]>([
    {
      id: '1',
      no: 1,
      jobPosition: 'Senior Software Engineer',
      jobRole: 'Software Engineer',
      mappedSkills: 12,
      business: 'Technology',
      group: 'Engineering',
      department: 'Development'
    },
    {
      id: '2',
      no: 2,
      jobPosition: 'Lead Product Manager',
      jobRole: 'Product Manager',
      mappedSkills: 8,
      business: 'Product',
      group: 'Management',
      department: 'Strategy'
    },
    {
      id: '3',
      no: 3,
      jobPosition: 'Frontend Developer',
      jobRole: 'Software Engineer',
      mappedSkills: 10,
      business: 'Technology',
      group: 'Engineering',
      department: 'Development'
    }
  ]);

  const roles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst'];
  const businesses = ['Technology', 'Product', 'Marketing', 'Sales'];
  const groups = ['Engineering', 'Management', 'Design', 'Operations'];
  const departments = ['Development', 'Strategy', 'Creative', 'Support'];

  const filteredPositions = jobPositions.filter(position => {
    return (
      position.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!roleFilter || roleFilter === 'all' || position.jobRole === roleFilter) &&
      (!businessFilter || businessFilter === 'all' || position.business === businessFilter) &&
      (!groupFilter || groupFilter === 'all' || position.group === groupFilter) &&
      (!departmentFilter || departmentFilter === 'all' || position.department === departmentFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPositions = filteredPositions.slice(startIndex, startIndex + itemsPerPage);

  const handleViewEdit = (position: JobPosition) => {
    navigate(`/skills/job-position-relationship/${position.id}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Job Position - Skill Relationship</h1>
              <p className="text-muted-foreground">
                Manage skill requirements and proficiency levels for job positions
              </p>
            </div>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <CardTitle>Job Positions</CardTitle>
                <CardDescription>
                  View and manage job positions mapped to job roles with their skill requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search job positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={businessFilter} onValueChange={setBusinessFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Businesses" />
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
                      <SelectValue placeholder="All Groups" />
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
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department} value={department}>{department}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Positions Table */}
                <div className="space-y-4">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Job Position</TableHead>
                          <TableHead>Job Role</TableHead>
                          <TableHead>Mapped Skills</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPositions.map((position) => (
                          <TableRow key={position.id}>
                            <TableCell>{position.no}</TableCell>
                            <TableCell className="font-medium">{position.jobPosition}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{position.jobRole}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{position.mappedSkills} skills</Badge>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => handleViewEdit(position)}>
                                <Eye className="h-4 w-4 mr-2" />
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
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobPositionSkillRelationship;
