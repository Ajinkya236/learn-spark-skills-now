
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Check, X } from "lucide-react";
import type { SkillRelation } from "@/hooks/useSkillRelationships";

interface RemoveSkillsDialogProps {
  skill: SkillRelation;
  onRemoveSkills: (skillId: string, skills: string[]) => void;
}

export const RemoveSkillsDialog = ({ skill, onRemoveSkills }: RemoveSkillsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleRemoveSkills = () => {
    if (selectedSkills.length === 0) return;

    onRemoveSkills(skill.id, selectedSkills);
    setSelectedSkills([]);
    setIsOpen(false);
  };

  const handleSkillToggle = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName));
    } else {
      setSelectedSkills(prev => [...prev, skillName]);
    }
  };

  const handleClose = () => {
    setSelectedSkills([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={skill.relatedSkills.length === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Remove Related Skills</DialogTitle>
          <DialogDescription>
            Select skills to remove from {skill.skill}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {skill.relatedSkills.map((relatedSkill) => (
              <div
                key={relatedSkill}
                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                onClick={() => handleSkillToggle(relatedSkill)}
              >
                <div className="font-medium">{relatedSkill}</div>
                {selectedSkills.includes(relatedSkill) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>

          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected for Removal:</div>
              <div className="flex flex-wrap gap-1">
                {selectedSkills.map((selectedSkill) => (
                  <Badge key={selectedSkill} variant="destructive" className="text-xs">
                    {selectedSkill}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkills(prev => prev.filter(s => s !== selectedSkill));
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleRemoveSkills} 
              disabled={selectedSkills.length === 0}
              variant="destructive"
            >
              Remove Skills
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
