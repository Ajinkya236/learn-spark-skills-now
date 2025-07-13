
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface GlobalLevelsTableProps {
  levels: ProficiencyLevel[];
  onEdit: (level: ProficiencyLevel) => void;
}

export const GlobalLevelsTable = ({ levels, onEdit }: GlobalLevelsTableProps) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.id}>
              <TableCell>{level.order}</TableCell>
              <TableCell className="font-medium">{level.title}</TableCell>
              <TableCell>{level.description}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => onEdit(level)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
