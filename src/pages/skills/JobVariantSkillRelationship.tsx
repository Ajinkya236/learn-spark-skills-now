import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, ArrowUpDown, Calendar } from "lucide-react";

interface JobVariant {
  id: string;
  jobVariant: string;
  mappedToJobRole: string;
  business: string;
  group: string;
  department: string;
  mappedSkills: number;
  lastUpdated: string;
}

const mockJobVariants: JobVariant[] = [
  {
    id: '1',
    jobVariant: 'Senior Frontend Developer - React Specialist',
    mappedToJobRole: 'Senior Frontend Developer',
    business: 'Technology',
    group: 'Product Engineering',
    department: 'Frontend Development',
    mappedSkills: 15,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    jobVariant: 'Backend Developer - Node.js Expert',
    mappedToJobRole: 'Backend Developer',
    business: 'Technology',
    group: 'Product Engineering',
    department: 'Backend Development',
    mappedSkills: 12,
    lastUpdated: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    jobVariant: 'DevOps Engineer - AWS Certified',
    mappedToJobRole: 'DevOps Engineer',
    business: 'Technology',
    group: 'Infrastructure',
    department: 'Cloud Operations',
    mappedSkills: 18,
    lastUpdated: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    jobVariant: 'Data Analyst - Healthcare Domain',
    mappedToJobRole: 'Data Analyst',
    business: 'Healthcare',
    group: 'Analytics',
    department: 'Data Science',
    mappedSkills: 10,
    lastUpdated: '2024-01-12T14:20:00Z'
  },
  {
    id: '5',
    jobVariant: 'Product Manager - Mobile Apps',
    mappedToJobRole: 'Product Manager',
    business: 'Product',
    group: 'Product Management',
    department: 'Mobile Products',
    mappedSkills: 8,
    lastUpdated: '2024-01-11T11:30:00Z'
  }
];

const JobVariantSkillRelationship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort job variants
  const filteredVariants = mockJobVariants.filter((variant) => {
    const matchesSearch = variant.jobVariant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.mappedToJobRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    let aValue: any = a[sortBy as keyof JobVariant];
    let bValue: any = b[sortBy as keyof JobVariant];

    if (sortBy === 'lastUpdated') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVariants = filteredVariants.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewEdit = (variant: JobVariant) => {
    navigate(`/skills/job-variant-relationship/${variant.id}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-heading text-primary">Job Variant - Skill Management</h1>
                <p className="text-muted-foreground font-body">
                  Manage skill relationships for job variants and their specific requirements
                </p>
              </div>
              <Button 
                onClick={() => navigate('/skills/job-variant-relationship/create')}
                className="font-body"
              >
                Create Job Variant
              </Button>
            </div>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Filter Job Variants</CardTitle>
                <CardDescription className="font-body">
                  Search and filter job variants by various criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search job variants or job roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>

                {/* Sort */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}>
                    <SelectTrigger className="font-body">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastUpdated-desc">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Latest Updated
                        </div>
                      </SelectItem>
                      <SelectItem value="lastUpdated-asc">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Oldest Updated
                        </div>
                      </SelectItem>
                      <SelectItem value="jobVariant-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="jobVariant-desc">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Job Variants Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Job Variants ({filteredVariants.length})</CardTitle>
                <CardDescription className="font-body">
                  Manage skill mappings for specific job variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-body">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('jobVariant')}
                            className="h-auto p-0 font-body hover:text-primary"
                          >
                            Job Variant
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-body">Mapped to Job Role</TableHead>
                        <TableHead className="font-body text-center">Mapped Skills</TableHead>
                        <TableHead className="font-body">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('lastUpdated')}
                            className="h-auto p-0 font-body hover:text-primary"
                          >
                            Last Updated
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="font-body text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedVariants.map((variant) => (
                        <TableRow key={variant.id} className="hover:bg-muted/50">
                          <TableCell className="font-body font-medium max-w-xs">
                            <div className="truncate" title={variant.jobVariant}>
                              {variant.jobVariant}
                            </div>
                          </TableCell>
                          <TableCell className="font-body">{variant.mappedToJobRole}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-body">
                              {variant.mappedSkills}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-body text-sm text-muted-foreground">
                            {formatDate(variant.lastUpdated)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              onClick={() => handleViewEdit(variant)}
                              className="font-body"
                            >
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
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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

export default JobVariantSkillRelationship;