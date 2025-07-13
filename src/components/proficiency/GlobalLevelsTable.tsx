
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { ProficiencyLevel } from "@/hooks/useProficiencyLevels";

interface GlobalLevelsTableProps {
  proficiencyLevels: ProficiencyLevel[];
  onEditLevel: (level: ProficiencyLevel) => void;
}

export const GlobalLevelsTable: React.FC<GlobalLevelsTableProps> = ({
  proficiencyLevels,
  onEditLevel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Proficiency Levels</CardTitle>
        <CardDescription>
          Edit global proficiency level titles and descriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proficiencyLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>{level.order}</TableCell>
                  <TableCell>{level.title}</TableCell>
                  <TableCell>{level.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEditLevel(level)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
