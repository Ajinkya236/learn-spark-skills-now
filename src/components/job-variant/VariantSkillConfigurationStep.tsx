import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ArrowLeft, Plus } from "lucide-react";

interface SelectedSkill {
  id: string;
  name: string;
  cluster: string;
  group: string;
  relevanceMatch: number;
  isSelected: boolean;
  type: 'Job Role mapped' | 'Auto suggested';
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
}

interface VariantSkillConfigurationStepProps {
  selectedSkills: SelectedSkill[];
  onUpdateSkillConfig: (skillId: string, field: 'proficiencyLevel' | 'criticalityLevel', value: string) => void;
  onRemoveSkill: (skillId: string) => void;
  onBackToSelection: () => void;
  onSubmit: () => void;
}

export const VariantSkillConfigurationStep = ({
  selectedSkills,
  onUpdateSkillConfig,
  onRemoveSkill,
  onBackToSelection,
  onSubmit,
}: VariantSkillConfigurationStepProps) => {
  const getCriticalityColor = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Configure Selected Skills</CardTitle>
          <CardDescription className="font-body">
            Set proficiency levels and criticality for each selected skill ({selectedSkills.length} skills)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedSkills.map((skill) => (
            <Card key={skill.id} className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-body font-medium text-primary">{skill.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs font-body">
                            {skill.cluster}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-body">
                            {skill.group}
                          </Badge>
                          <Badge 
                            variant={skill.type === 'Job Role mapped' ? 'default' : 'secondary'}
                            className="text-xs font-body"
                          >
                            {skill.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveSkill(skill.id)}
                        className="font-body text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2 font-body">
                          Proficiency Level
                        </label>
                        <Select
                          value={skill.proficiencyLevel}
                          onValueChange={(value) => onUpdateSkillConfig(skill.id, 'proficiencyLevel', value)}
                        >
                          <SelectTrigger className="font-body">
                            <SelectValue placeholder="Select proficiency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2 font-body">
                          Criticality Level
                        </label>
                        <Select
                          value={skill.criticalityLevel}
                          onValueChange={(value) => onUpdateSkillConfig(skill.id, 'criticalityLevel', value as 'High' | 'Medium' | 'Low')}
                        >
                          <SelectTrigger className="font-body">
                            <SelectValue placeholder="Select criticality level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                                <span>High</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Low">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                                <span>Low</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground font-body">Current:</span>
                      <Badge variant="outline" className="font-body">{skill.proficiencyLevel}</Badge>
                      <Badge variant={getCriticalityColor(skill.criticalityLevel)} className="font-body">
                        {skill.criticalityLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBackToSelection}
          className="font-body"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>
        <Button
          onClick={onSubmit}
          className="font-body"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skills to Job Variant
        </Button>
      </div>
    </div>
  );
};