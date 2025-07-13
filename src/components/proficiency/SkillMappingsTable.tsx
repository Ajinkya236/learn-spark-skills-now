
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Plus, Download, Pencil, EyeOff } from "lucide-react";
import { SkillProficiencyMapping } from "@/hooks/useProficiencyLevels";

interface SkillMappingsTableProps {
  skillMappings: SkillProficiencyMapping[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreateMapping: () => void;
  onImportOpen: () => void;
  onExportMappings: () => void;
  onEditMapping: (mapping: SkillProficiencyMapping) => void;
  onInactivateMapping: (mapping: SkillProficiencyMapping) => void;
}

export const SkillMappingsTable: React.FC<SkillMappingsTableProps> = ({
  skillMappings,
  currentPage,
  totalPages,
  onPageChange,
  onCreateMapping,
  onImportOpen,
  onExportMappings,
  onEditMapping,
  onInactivateMapping
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Proficiency Mappings</CardTitle>
        <CardDescription>
          Manage skill to proficiency level mappings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button variant="default" onClick={onCreateMapping} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Proficiency Mapping
          </Button>
          <Button variant="default" onClick={onImportOpen} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Import Proficiencies
          </Button>
          <Button variant="default" onClick={onExportMappings} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Mappings
          </Button>
        </div>
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillMappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-medium">{mapping.skill}</TableCell>
                  <TableCell>{mapping.proficiencyDescription}</TableCell>
                  <TableCell>{mapping.proficiencyLevel}</TableCell>
                  <TableCell>{mapping.cluster}</TableCell>
                  <TableCell>{mapping.group}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditMapping(mapping)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onInactivateMapping(mapping)}>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Inactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
