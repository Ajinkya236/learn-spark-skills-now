import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JobVariantSkill {
  id: string;
  no: number;
  skillName: string;
  source: 'From Job Role' | 'Variant specific';
  proficiencyLevel: string;
  proficiencyDescription: string[];
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface VariantSkillsTableProps {
  skills: JobVariantSkill[];
  currentPage: number;
  totalPages: number;
  onEditSkill: (skill: JobVariantSkill) => void;
  onDeleteSkill: (skill: JobVariantSkill) => void;
  onPageChange: (page: number) => void;
}

export const VariantSkillsTable = ({
  skills,
  currentPage,
  totalPages,
  onEditSkill,
  onDeleteSkill,
  onPageChange,
}: VariantSkillsTableProps) => {
  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSourceColor = (source: string) => {
    return source === 'From Job Role' ? 'outline' : 'secondary';
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 font-body">No.</TableHead>
                <TableHead className="font-body">Skill</TableHead>
                <TableHead className="font-body">Source</TableHead>
                <TableHead className="font-body">Proficiency Level</TableHead>
                <TableHead className="font-body">Description</TableHead>
                <TableHead className="font-body">Criticality</TableHead>
                <TableHead className="font-body">Cluster</TableHead>
                <TableHead className="font-body">Group</TableHead>
                <TableHead className="font-body text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id} className="hover:bg-muted/50">
                  <TableCell className="font-body font-medium">{skill.no}</TableCell>
                  <TableCell className="font-body font-medium">{skill.skillName}</TableCell>
                  <TableCell>
                    <Badge variant={getSourceColor(skill.source)} className="font-body">
                      {skill.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body">{skill.proficiencyLevel}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="max-w-xs">
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {skill.proficiencyDescription.slice(0, 2).map((desc, index) => (
                            <li key={index} className="font-body truncate" title={desc}>
                              {desc}
                            </li>
                          ))}
                          {skill.proficiencyDescription.length > 2 && (
                            <li className="font-body text-xs text-primary">
                              +{skill.proficiencyDescription.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                      {skill.proficiencyDescription.length > 2 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <ul className="list-disc list-inside space-y-1">
                              {skill.proficiencyDescription.map((desc, index) => (
                                <li key={index} className="font-body text-sm">
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCriticalityColor(skill.criticalityLevel)} className="font-body">
                      {skill.criticalityLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-body">{skill.cluster}</TableCell>
                  <TableCell className="font-body">{skill.group}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      {skill.source === 'Variant specific' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditSkill(skill)}
                            className="font-body"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* Delete button hidden for phase 1 implementation as per requirements */}
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteSkill(skill)}
                            className="font-body text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                        </>
                      )}
                      {skill.source === 'From Job Role' && (
                        <span className="text-xs text-muted-foreground font-body">
                          Inherited
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};