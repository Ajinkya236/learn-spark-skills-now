
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillProficiencyMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface EditSkillMappingDialogProps {
  mapping: SkillProficiencyMapping | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: { proficiencyLevel: string; proficiencyDescription: string }) => void;
  proficiencyLevels: ProficiencyLevel[];
}

export const EditSkillMappingDialog = ({ 
  mapping, 
  open, 
  onOpenChange, 
  onSave, 
  proficiencyLevels 
}: EditSkillMappingDialogProps) => {
  const [proficiencyLevel, setProficiencyLevel] = useState('');
  const [proficiencyDescription, setProficiencyDescription] = useState('');

  useEffect(() => {
    if (mapping) {
      setProficiencyLevel(mapping.proficiencyLevel);
      setProficiencyDescription(mapping.proficiencyDescription);
    }
  }, [mapping]);

  const handleSave = () => {
    if (!proficiencyLevel || !proficiencyDescription.trim()) {
      return;
    }

    if (mapping) {
      onSave(mapping.id, {
        proficiencyLevel,
        proficiencyDescription: proficiencyDescription.trim()
      });
    }
  };

  const handleClose = () => {
    setProficiencyLevel('');
    setProficiencyDescription('');
    onOpenChange(false);
  };

  const isFormValid = proficiencyLevel && proficiencyDescription.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-black font-inter">Edit Skill Proficiency</DialogTitle>
          <DialogDescription className="font-arial">
            Update the proficiency level and description for {mapping?.skill}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Skill Display */}
          {mapping && (
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium font-inter">Skill: </span>
              <span className="text-sm font-arial">{mapping.skill}</span>
            </div>
          )}

          {/* Proficiency Level Selection */}
          <div className="space-y-2">
            <Label htmlFor="proficiency-level" className="font-inter font-medium">
              Proficiency Level <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={proficiencyLevel} 
              onValueChange={setProficiencyLevel}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.id} value={level.title}>
                    {level.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proficiency Description */}
          <div className="space-y-2">
            <Label htmlFor="proficiency-description" className="font-inter font-medium">
              Proficiency Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="proficiency-description"
              placeholder="Enter detailed description of the proficiency requirements..."
              value={proficiencyDescription}
              onChange={(e) => setProficiencyDescription(e.target.value)}
              rows={3}
              className="rounded-lg font-arial"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto rounded-lg">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid}
            className="w-full sm:w-auto rounded-lg"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
