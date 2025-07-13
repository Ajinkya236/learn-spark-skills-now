
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Upload } from "lucide-react";

interface SkillMapping {
  id: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface SkillMappingTableProps {
  mappings: SkillMapping[];
  onEdit: (mapping: SkillMapping) => void;
  onDelete: (mappingId: string) => void;
  onCreate: () => void;
  onBulkImportClick: () => void;
}

export const SkillMappingTable: React.FC<SkillMappingTableProps> = ({
  mappings,
  onEdit,
  onDelete,
  onCreate,
  onBulkImportClick
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-bold text-jio-dark font-inter">Skill Proficiency Mappings</CardTitle>
            <CardDescription className="font-inter">
              Manage skill-to-proficiency level mappings with score ranges
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBulkImportClick} variant="outline" className="font-inter">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button onClick={onCreate} className="font-inter bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Mapping
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter">Skill</TableHead>
                <TableHead className="font-inter">Proficiency Level</TableHead>
                <TableHead className="font-inter">Score Range</TableHead>
                <TableHead className="font-inter">Description</TableHead>
                <TableHead className="font-inter">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-inter">
                    No skill mappings found. Click "Add Mapping" to create your first mapping.
                  </TableCell>
                </TableRow>
              ) : (
                mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium font-inter">{mapping.skillName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-inter">
                        {mapping.proficiencyLevelId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-inter">
                      {mapping.minScore} - {mapping.maxScore}
                    </TableCell>
                    <TableCell className="font-inter">{mapping.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(mapping)}
                          className="font-inter"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(mapping.id)}
                          className="text-red-600 hover:text-red-600 font-inter"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
