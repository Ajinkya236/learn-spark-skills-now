
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye } from "lucide-react";

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
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="font-black font-inter">Job Roles</CardTitle>
        <CardDescription className="font-arial">
          {totalCount} job role{totalCount !== 1 ? 's' : ''} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black font-inter">Job Role</TableHead>
                <TableHead className="font-black font-inter">Business</TableHead>
                <TableHead className="font-black font-inter">Group</TableHead>
                <TableHead className="font-black font-inter">Department</TableHead>
                <TableHead className="font-black font-inter">Max Skills</TableHead>
                <TableHead className="font-black font-inter">Mapped Skills</TableHead>
                <TableHead className="font-black font-inter">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium font-inter">{role.title}</div>
                      <div className="text-sm text-muted-foreground font-arial">{role.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-arial">{role.business}</TableCell>
                  <TableCell className="font-arial">{role.group}</TableCell>
                  <TableCell className="font-arial">{role.department}</TableCell>
                  <TableCell className="font-arial">{role.maxSkills}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {role.skills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs rounded-full font-arial"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {role.skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs rounded-full font-arial"
                        >
                          +{role.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewEdit(role)}
                        className="rounded-lg"
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground font-arial">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
