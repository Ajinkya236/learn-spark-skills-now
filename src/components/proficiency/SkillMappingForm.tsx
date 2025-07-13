
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProficiencyLevel, SkillProficiencyMapping } from "@/hooks/useProficiencyLevels";

interface SkillMappingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>;
  onMappingChange: (mapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => void;
  onSubmit: () => void;
  skills: string[];
  clusters: string[];
  groups: string[];
  proficiencyLevels: ProficiencyLevel[];
}

export const SkillMappingForm: React.FC<SkillMappingFormProps> = ({
  open,
  onOpenChange,
  title,
  mapping,
  onMappingChange,
  onSubmit,
  skills,
  clusters,
  groups,
  proficiencyLevels
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skill" className="text-right">
              Skill *
            </Label>
            <Select value={mapping.skill} onValueChange={(value) => onMappingChange({ ...mapping, skill: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Proficiency Description *
            </Label>
            <Textarea 
              id="description" 
              value={mapping.proficiencyDescription} 
              onChange={(e) => onMappingChange({ ...mapping, proficiencyDescription: e.target.value })} 
              className="col-span-3" 
              placeholder="Describe the proficiency level"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Proficiency Level *
            </Label>
            <Select value={mapping.proficiencyLevel} onValueChange={(value) => onMappingChange({ ...mapping, proficiencyLevel: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map(level => (
                  <SelectItem key={level.id} value={level.title}>{level.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cluster" className="text-right">
              Cluster
            </Label>
            <Select value={mapping.cluster} onValueChange={(value) => onMappingChange({ ...mapping, cluster: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select cluster" />
              </SelectTrigger>
              <SelectContent>
                {clusters.map(cluster => (
                  <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">
              Group
            </Label>
            <Select value={mapping.group} onValueChange={(value) => onMappingChange({ ...mapping, group: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
          {title.includes('Add') ? 'Create Proficiency Mapping' : 'Save Changes'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
