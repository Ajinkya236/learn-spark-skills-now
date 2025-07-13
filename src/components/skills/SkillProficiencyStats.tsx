
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillProficiencyStatsProps {
  // Add props as needed
}

export const SkillProficiencyStats: React.FC<SkillProficiencyStatsProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-inter">Skill Proficiency Statistics</CardTitle>
        <CardDescription className="font-inter">Overview of skill proficiency mappings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground font-inter">
          Statistics will be displayed here
        </div>
      </CardContent>
    </Card>
  );
};
