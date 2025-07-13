
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash2 } from "lucide-react";

interface JobRoleSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface SkillsTableProps {
  skills: JobRoleSkill[];
  currentPage: number;
  totalPages: number;
  onEditSkill: (skillId: string) => void;
  onDeleteSkill: (skillId: string) => void;
  onPageChange: (page: number) => void;
}

export const SkillsTable = ({
  skills,
  currentPage,
  totalPages,
  onEditSkill,
  onDeleteSkill,
  onPageChange
}: SkillsTableProps) => {
  return (
    <div className="space-y-4">
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
            {skills.map((skill) => (
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
                    <Button size="sm" variant="ghost" onClick={() => onEditSkill(skill.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDeleteSkill(skill.id)}>
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
    </div>
  );
};
