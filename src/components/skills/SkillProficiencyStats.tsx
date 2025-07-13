
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, BookOpen, Target, Archive } from "lucide-react";

interface SkillMapping {
  id: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface SkillProficiencyStatsProps {
  mappings: SkillMapping[];
}

export const SkillProficiencyStats: React.FC<SkillProficiencyStatsProps> = ({ mappings }) => {
  const totalMappings = mappings.length;
  const avgMinScore = mappings.length > 0 ? Math.round(mappings.reduce((sum, m) => sum + m.minScore, 0) / mappings.length) : 0;
  const avgMaxScore = mappings.length > 0 ? Math.round(mappings.reduce((sum, m) => sum + m.maxScore, 0) / mappings.length) : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Total Mappings</span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalMappings}</div>
          <Badge variant="secondary" className="font-inter">
            Skill Mappings
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Avg Min Score</span>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{avgMinScore}</div>
          <Badge variant="secondary" className="font-inter">
            Average
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Avg Max Score</span>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{avgMaxScore}</div>
          <Badge variant="secondary" className="font-inter">
            Average
          </Badge>
        </CardContent>
      </Card>
    </>
  );
};
