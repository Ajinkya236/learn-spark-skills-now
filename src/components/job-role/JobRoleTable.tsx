
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye } from "lucide-react";

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

interface JobRoleTableProps {
  jobRoles: JobRole[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onViewEdit: (jobRole: JobRole) => void;
  onPageChange: (page: number) => void;
}

export const JobRoleTable = ({
  jobRoles,
  totalCount,
  currentPage,
  totalPages,
  onViewEdit,
  onPageChange
}: JobRoleTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Roles ({totalCount})</CardTitle>
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
              {jobRoles.map((role) => (
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
                    <Button size="sm" variant="outline" onClick={() => onViewEdit(role)}>
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
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => onPageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
