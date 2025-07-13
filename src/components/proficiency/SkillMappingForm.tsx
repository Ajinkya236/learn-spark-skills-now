
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProficiencyLevel {
  id: string;
  name: string;
  description: string;
}

interface SkillMappingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: string[];
  proficiencyLevels: ProficiencyLevel[];
  onSave: (data: any) => void;
}

export const SkillMappingForm: React.FC<SkillMappingFormProps> = ({
  open,
  onOpenChange,
  skills,
  proficiencyLevels,
  onSave
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [proficiencyMappings, setProficiencyMappings] = useState<Record<string, string>>({});

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleProficiencyChange = (skill: string, proficiencyId: string) => {
    setProficiencyMappings(prev => ({
      ...prev,
      [skill]: proficiencyId
    }));
  };

  const handleSave = () => {
    const mappings = selectedSkills.map(skill => ({
      skill,
      proficiencyId: proficiencyMappings[skill] || proficiencyLevels[0]?.id
    }));
    onSave(mappings);
    onOpenChange(false);
    setSelectedSkills([]);
    setProficiencyMappings({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Map Skills to Proficiency Levels</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Available Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Set Proficiency Levels</h3>
              <div className="space-y-2">
                {selectedSkills.map(skill => (
                  <div key={skill} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{skill}</span>
                    <Select
                      value={proficiencyMappings[skill] || ''}
                      onValueChange={(value) => handleProficiencyChange(skill, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map(level => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedSkills.length === 0}>
            Save Mappings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
