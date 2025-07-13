
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobPositionSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  type: 'Job Role specific' | 'Position specific';
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

interface EditPositionSkillDialogProps {
  skill: JobPositionSkill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skillId: string, updates: { proficiencyLevel: string; criticalityLevel: 'High' | 'Medium' | 'Low' }) => void;
}

export const EditPositionSkillDialog = ({ skill, open, onOpenChange, onSave }: EditPositionSkillDialogProps) => {
  const [proficiencyLevel, setProficiencyLevel] = useState('');
  const [criticalityLevel, setCriticalityLevel] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    if (skill) {
      setProficiencyLevel(skill.proficiencyLevel);
      setCriticalityLevel(skill.criticalityLevel);
    }
  }, [skill]);

  const handleSave = () => {
    if (skill) {
      onSave(skill.id, { proficiencyLevel, criticalityLevel });
      onOpenChange(false);
    }
  };

  if (!skill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill Requirements</DialogTitle>
          <DialogDescription>
            Update the proficiency level and criticality for {skill.skillName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
              <SelectTrigger>
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
            <Label htmlFor="criticality">Criticality Level</Label>
            <Select value={criticalityLevel} onValueChange={(value: 'High' | 'Medium' | 'Low') => setCriticalityLevel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select criticality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
