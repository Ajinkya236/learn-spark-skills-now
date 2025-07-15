
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
  onEdit: (mapping: SkillProficiencyMapping) => void;
  onInactivate: (id: string) => void;
}

export const SkillMappingsTable = ({ mappings, onEdit, onInactivate }: SkillMappingsTableProps) => {
  return (
    <div className="overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-black font-inter">Skill</TableHead>
            <TableHead className="font-black font-inter">Proficiency Level</TableHead>
            <TableHead className="font-black font-inter">Proficiency Description</TableHead>
            <TableHead className="font-black font-inter">Cluster</TableHead>
            <TableHead className="font-black font-inter">Group</TableHead>
            <TableHead className="font-black font-inter">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell className="font-medium font-arial">{mapping.skill}</TableCell>
              <TableCell>
                <Badge variant="outline" className="rounded-lg font-arial">{mapping.proficiencyLevel}</Badge>
              </TableCell>
              <TableCell className="font-arial">{mapping.proficiencyDescription}</TableCell>
              <TableCell className="font-arial">{mapping.cluster}</TableCell>
              <TableCell className="font-arial">{mapping.group}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(mapping)} className="rounded-lg">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onInactivate(mapping.id)} className="rounded-lg">
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
