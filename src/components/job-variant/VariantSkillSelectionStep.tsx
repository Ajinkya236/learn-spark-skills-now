import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ArrowRight } from "lucide-react";

interface SuggestedSkill {
  id: string;
  name: string;
  cluster: string;
  group: string;
  relevanceMatch: number;
  isSelected: boolean;
  type: 'Job Role mapped' | 'Auto suggested';
}

interface VariantSkillSelectionStepProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  suggestedSkills: SuggestedSkill[];
  onToggleSkill: (skillId: string) => void;
  onProceed: () => void;
}

export const VariantSkillSelectionStep = ({
  searchTerm,
  onSearchChange,
  suggestedSkills,
  onToggleSkill,
  onProceed,
}: VariantSkillSelectionStepProps) => {
  const filteredSkills = suggestedSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const jobRoleMappedSkills = filteredSkills.filter(skill => skill.type === 'Job Role mapped');
  const autoSuggestedSkills = filteredSkills.filter(skill => skill.type === 'Auto suggested');
  const selectedCount = suggestedSkills.filter(skill => skill.isSelected).length;

  const SkillSection = ({ title, skills, badge }: { title: string; skills: SuggestedSkill[]; badge?: string }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <h3 className="font-heading text-lg font-medium text-primary">{title}</h3>
        {badge && <Badge variant="outline" className="font-body">{badge}</Badge>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <Card 
            key={skill.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              skill.isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onToggleSkill(skill.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      checked={skill.isSelected}
                      onChange={() => onToggleSkill(skill.id)}
                      className="shrink-0"
                    />
                    <h4 className="font-body font-medium text-primary truncate">{skill.name}</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-body">
                      <span className="font-medium">Cluster:</span> {skill.cluster}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      <span className="font-medium">Group:</span> {skill.group}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge 
                    variant={skill.relevanceMatch >= 90 ? "default" : "secondary"}
                    className="text-xs font-body"
                  >
                    {skill.relevanceMatch}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills by name, cluster, or group..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 font-body"
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Role Mapped Skills */}
      {jobRoleMappedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Skills from Job Role</CardTitle>
            <CardDescription className="font-body">
              Skills already mapped to the parent job role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillSection 
              title="Recommended Skills" 
              skills={jobRoleMappedSkills}
              badge={`${jobRoleMappedSkills.length} skills`}
            />
          </CardContent>
        </Card>
      )}

      {/* Auto Suggested Skills */}
      {autoSuggestedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Additional Suggested Skills</CardTitle>
            <CardDescription className="font-body">
              Skills suggested based on relevance and industry best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillSection 
              title="Suggested Skills" 
              skills={autoSuggestedSkills}
              badge={`${autoSuggestedSkills.length} skills`}
            />
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground font-body">
          {selectedCount} skill{selectedCount !== 1 ? 's' : ''} selected
        </div>
        <Button 
          onClick={onProceed}
          disabled={selectedCount === 0}
          className="font-body"
        >
          Continue to Configuration
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};