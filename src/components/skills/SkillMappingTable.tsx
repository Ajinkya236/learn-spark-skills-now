
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillMappingTableProps {
  // Add props as needed
}

export const SkillMappingTable: React.FC<SkillMappingTableProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-inter">Skill Mappings</CardTitle>
        <CardDescription className="font-inter">Manage skill proficiency mappings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground font-inter">
          Skill mappings table will be displayed here
        </div>
      </CardContent>
    </Card>
  );
};
