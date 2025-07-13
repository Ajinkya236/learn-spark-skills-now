
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

export interface SkillProficiencyMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

interface SkillMappingsTableProps {
  mappings: SkillProficiencyMapping[];
  onEdit: (id: string, updatedMapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => void;
  onInactivate: (id: string) => void;
}

export const SkillMappingsTable = ({ mappings, onEdit, onInactivate }: SkillMappingsTableProps) => {
  const handleEdit = (mapping: SkillProficiencyMapping) => {
    const { id, isActive, ...editableFields } = mapping;
    onEdit(id, editableFields);
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Proficiency Level</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell className="font-medium">{mapping.skill}</TableCell>
              <TableCell>
                <Badge variant="outline">{mapping.proficiencyLevel}</Badge>
              </TableCell>
              <TableCell>{mapping.proficiencyDescription}</TableCell>
              <TableCell>{mapping.cluster}</TableCell>
              <TableCell>{mapping.group}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(mapping)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onInactivate(mapping.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
