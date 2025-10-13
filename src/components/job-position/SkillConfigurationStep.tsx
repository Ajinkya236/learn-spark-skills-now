
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

interface SkillConfigurationStepProps {
  selectedSkills: SelectedSkill[];
  onUpdateSkillConfig: (skillId: string, field: 'proficiencyLevel' | 'criticalityLevel', value: string) => void;
  onRemoveSkill: (skillId: string) => void;
  onBackToSelection: () => void;
  onSubmit: () => void;
  availableProficiencyLevels?: string[];
}

export const SkillConfigurationStep: React.FC<SkillConfigurationStepProps> = ({
  selectedSkills,
  onUpdateSkillConfig,
  onRemoveSkill,
  onBackToSelection,
  onSubmit,
  availableProficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Configure Selected Skills</CardTitle>
        <CardDescription>
          Set proficiency levels and criticality for each selected skill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedSkills.map((skill) => (
            <div key={skill.id} className="p-4 border rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start lg:items-center">
                <div className="lg:col-span-1">
                  <h3 className="font-medium text-sm md:text-base">{skill.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {skill.cluster} • {skill.group}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {skill.relevanceMatch}% match
                    </Badge>
                    <Badge 
                      variant={skill.type === 'Job Role mapped' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {skill.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">Proficiency Level</label>
                  <Select 
                    value={skill.proficiencyLevel} 
                    onValueChange={(value) => onUpdateSkillConfig(skill.id, 'proficiencyLevel', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProficiencyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">Criticality</label>
                  <Select 
                    value={skill.criticalityLevel} 
                    onValueChange={(value) => onUpdateSkillConfig(skill.id, 'criticalityLevel', value as 'High' | 'Medium' | 'Low')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center lg:justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSkill(skill.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} configured
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBackToSelection}>
              Back to Selection
            </Button>
            <Button onClick={onSubmit}>
              Add Skills to Job Position
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
