import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, Edit, ArrowUpDown } from "lucide-react";

interface JobPosition {
  id: string;
  jobPosition: string;
  mappedToJobVariant: string;
  mappedToJobRole: string;
  business: string;
  group: string;
  department: string;
  mappedSkills: number;
  lastUpdated: string;
}

const mockJobPositions: JobPosition[] = [
  {
    id: '1',
    jobPosition: 'Senior Frontend Developer - Team Lead',
    mappedToJobVariant: 'Senior Frontend Developer - React Specialist',
    mappedToJobRole: 'Senior Frontend Developer',
    business: 'Technology',
    group: 'Product Engineering',
    department: 'Frontend Development',
    mappedSkills: 18,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    jobPosition: 'Backend Developer - API Specialist',
    mappedToJobVariant: 'Backend Developer - Node.js Specialist',
    mappedToJobRole: 'Backend Developer',
    business: 'Technology',
    group: 'Platform Engineering',
    department: 'Backend Development',
    mappedSkills: 15,
    lastUpdated: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    jobPosition: 'DevOps Engineer - Cloud Infrastructure',
    mappedToJobVariant: 'DevOps Engineer - AWS Specialist',
    mappedToJobRole: 'DevOps Engineer',
    business: 'Technology',
    group: 'Infrastructure',
    department: 'Cloud Operations',
    mappedSkills: 22,
    lastUpdated: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    jobPosition: 'Product Manager - Mobile Apps',
    mappedToJobVariant: 'Product Manager - Consumer Apps',
    mappedToJobRole: 'Product Manager',
    business: 'Product',
    group: 'Product Management',
    department: 'Mobile Products',
    mappedSkills: 12,
    lastUpdated: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    jobPosition: 'UX Designer - Design Systems',
    mappedToJobVariant: 'UX Designer - Enterprise Products',
    mappedToJobRole: 'UX Designer',
    business: 'Design',
    group: 'Product Design',
    department: 'User Experience',
    mappedSkills: 14,
    lastUpdated: '2024-01-11T11:30:00Z'
  }
];

const JobPositionSkillRelationship = () => {
  const navigate = useNavigate();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // Filter and sort data
  const filteredAndSortedPositions = React.useMemo(() => {
    let filtered = mockJobPositions.filter((position) => {
      const matchesSearch = 
        position.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.mappedToJobRole.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBusiness = businessFilter === 'all' || position.business === businessFilter;
      const matchesGroup = groupFilter === 'all' || position.group === groupFilter;
      const matchesDepartment = departmentFilter === 'all' || position.department === departmentFilter;

      return matchesSearch && matchesBusiness && matchesGroup && matchesDepartment;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof JobPosition];
      let bValue: any = b[sortBy as keyof JobPosition];
      
      if (sortBy === 'lastUpdated') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, businessFilter, groupFilter, departmentFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPositions = filteredAndSortedPositions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewEdit = (positionId: string) => {
    navigate(`/skills/job-position-relationship/${positionId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading text-primary">Job Position - Skill Relationship</h1>
                <p className="text-muted-foreground font-body">
                  Manage skill mappings for job positions
                </p>
              </div>
            </div>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Search and Filter</CardTitle>
                <CardDescription className="font-body">
                  Find job positions using search and filters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by job position or job role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={businessFilter} onValueChange={setBusinessFilter}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Filter by Business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Businesses</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Filter by Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      <SelectItem value="Product Engineering">Product Engineering</SelectItem>
                      <SelectItem value="Platform Engineering">Platform Engineering</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Product Management">Product Management</SelectItem>
                      <SelectItem value="Product Design">Product Design</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                      <SelectItem value="Backend Development">Backend Development</SelectItem>
                      <SelectItem value="Cloud Operations">Cloud Operations</SelectItem>
                      <SelectItem value="Mobile Products">Mobile Products</SelectItem>
                      <SelectItem value="User Experience">User Experience</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastUpdated-desc">Last Updated (Newest)</SelectItem>
                      <SelectItem value="lastUpdated-asc">Last Updated (Oldest)</SelectItem>
                      <SelectItem value="jobPosition-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="jobPosition-desc">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Positions Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-heading">Job Positions</CardTitle>
                    <CardDescription className="font-body">
                      {filteredAndSortedPositions.length} position{filteredAndSortedPositions.length !== 1 ? 's' : ''} found
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-heading">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('jobPosition')}
                            className="font-heading p-0 h-auto font-medium"
                          >
                            Job Position
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-heading">Mapped to Job Variant</TableHead>
                        <TableHead className="font-heading">Mapped to Job Role</TableHead>
                        <TableHead className="font-heading">Business</TableHead>
                        <TableHead className="font-heading">Group</TableHead>
                        <TableHead className="font-heading">Department</TableHead>
                        <TableHead className="font-heading">Mapped Skills</TableHead>
                        <TableHead className="font-heading">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('lastUpdated')}
                            className="font-heading p-0 h-auto font-medium"
                          >
                            Last Updated
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-heading">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-body font-medium">
                            {position.jobPosition}
                          </TableCell>
                          <TableCell className="font-body">
                            {position.mappedToJobVariant}
                          </TableCell>
                          <TableCell className="font-body">
                            {position.mappedToJobRole}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-body">
                              {position.business}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-body">
                              {position.group}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-body">
                              {position.department}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-body">
                              {position.mappedSkills}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-body text-sm text-muted-foreground">
                            {formatDate(position.lastUpdated)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewEdit(position.id)}
                                className="font-body"
                              >
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
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {totalPages > 5 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobPositionSkillRelationship;