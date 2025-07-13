
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";

interface SuggestedSkill {
  id: string;
  name: string;
  cluster: string;
  group: string;
  relevanceMatch: number;
  isSelected: boolean;
  type: 'Job Role mapped' | 'Auto suggested';
}

interface SkillSelectionStepProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  suggestedSkills: SuggestedSkill[];
  onToggleSkill: (skillId: string) => void;
  onProceed: () => void;
}

export const SkillSelectionStep: React.FC<SkillSelectionStepProps> = ({
  searchTerm,
  onSearchChange,
  suggestedSkills,
  onToggleSkill,
  onProceed
}) => {
  const filteredSkills = suggestedSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const jobRoleSkills = filteredSkills.filter(skill => skill.type === 'Job Role mapped');
  const autoSuggestedSkills = filteredSkills.filter(skill => skill.type === 'Auto suggested');
  const selectedCount = suggestedSkills.filter(s => s.isSelected).length;

  const SkillSection = ({ title, skills, badge }: { title: string; skills: SuggestedSkill[]; badge?: string }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge && <Badge variant="outline">{badge}</Badge>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              skill.isSelected 
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onToggleSkill(skill.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm md:text-base truncate pr-2">{skill.name}</h4>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {skill.relevanceMatch}%
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">{skill.cluster}</p>
            <p className="text-xs text-muted-foreground truncate">{skill.group}</p>
            {skill.isSelected && (
              <div className="mt-2">
                <Badge variant="default" className="text-xs">Selected</Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Available Skills</CardTitle>
        <CardDescription>
          Skills are categorized by Job Role mapped skills and auto-suggested skills based on relevance
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills, clusters, or groups..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {jobRoleSkills.length > 0 && (
          <SkillSection 
            title="Job Role Mapped Skills" 
            skills={jobRoleSkills}
            badge="From Job Role"
          />
        )}

        {autoSuggestedSkills.length > 0 && (
          <SkillSection 
            title="Auto Suggested Skills" 
            skills={autoSuggestedSkills}
            badge="AI Recommended"
          />
        )}

        {filteredSkills.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No skills found matching your search.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedCount} skill{selectedCount !== 1 ? 's' : ''} selected
          </p>
          <Button onClick={onProceed} disabled={selectedCount === 0}>
            Continue to Configuration
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
