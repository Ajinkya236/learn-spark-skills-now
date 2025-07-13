
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface LocalSkillMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

interface SkillMappingsTableProps {
  skillMappings: LocalSkillMapping[];
  onUpdate: (id: string, updatedMapping: LocalSkillMapping) => void;
  onDelete: (id: string) => void;
}

export const SkillMappingsTable = ({
  skillMappings,
  onUpdate,
  onDelete
}: SkillMappingsTableProps) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Proficiency Description</TableHead>
            <TableHead>Proficiency Level</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skillMappings.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell className="font-medium">{mapping.skill}</TableCell>
              <TableCell>{mapping.proficiencyDescription}</TableCell>
              <TableCell>
                <Badge variant="outline">{mapping.proficiencyLevel}</Badge>
              </TableCell>
              <TableCell>{mapping.cluster}</TableCell>
              <TableCell>{mapping.group}</TableCell>
              <TableCell>
                <Badge variant={mapping.isActive ? "default" : "secondary"}>
                  {mapping.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onUpdate(mapping.id, mapping)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDelete(mapping.id)}
                  >
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
