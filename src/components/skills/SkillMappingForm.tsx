
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Skill {
  id: string;
  name: string;
}

interface ProficiencyLevel {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  order: number;
}

interface SkillMapping {
  id: string;
  skillName: string;
  proficiencyLevelId: string;
  minScore: number;
  maxScore: number;
  description: string;
}

interface SkillMappingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mapping: SkillMapping | null;
  skills: Skill[];
  onSave: (mapping: SkillMapping) => void;
  proficiencyLevels: ProficiencyLevel[];
}

export const SkillMappingForm: React.FC<SkillMappingFormProps> = ({
  open,
  onOpenChange,
  title,
  mapping,
  skills,
  onSave,
  proficiencyLevels
}) => {
  const [formData, setFormData] = useState({
    skillName: '',
    proficiencyLevelId: '',
    minScore: 0,
    maxScore: 100,
    description: ''
  });

  useEffect(() => {
    if (mapping) {
      setFormData({
        skillName: mapping.skillName,
        proficiencyLevelId: mapping.proficiencyLevelId,
        minScore: mapping.minScore,
        maxScore: mapping.maxScore,
        description: mapping.description
      });
    } else {
      setFormData({
        skillName: '',
        proficiencyLevelId: '',
        minScore: 0,
        maxScore: 100,
        description: ''
      });
    }
  }, [mapping, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMapping: SkillMapping = {
      id: mapping?.id || Date.now().toString(),
      ...formData
    };
    onSave(newMapping);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-jio-dark font-inter">{title}</DialogTitle>
          <DialogDescription className="font-inter">
            Configure skill proficiency mapping with score ranges
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill" className="font-inter">Skill</Label>
            <Select value={formData.skillName} onValueChange={(value) => setFormData({ ...formData, skillName: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiencyLevel" className="font-inter">Proficiency Level</Label>
            <Select value={formData.proficiencyLevelId} onValueChange={(value) => setFormData({ ...formData, proficiencyLevelId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minScore" className="font-inter">Min Score</Label>
              <Input
                id="minScore"
                type="number"
                value={formData.minScore}
                onChange={(e) => setFormData({ ...formData, minScore: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="font-inter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxScore" className="font-inter">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="font-inter"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this skill-proficiency mapping..."
              className="font-inter"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
              Cancel
            </Button>
            <Button type="submit" className="font-inter bg-blue-600 hover:bg-blue-700 text-white">
              Save Mapping
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
