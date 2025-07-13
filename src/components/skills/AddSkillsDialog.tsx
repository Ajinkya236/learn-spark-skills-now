
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, X } from "lucide-react";
import type { SkillRelation, SkillOption } from "@/hooks/useSkillRelationships";

interface AddSkillsDialogProps {
  skill: SkillRelation;
  availableSkills: SkillOption[];
  getAISuggestedSkills: (skill: string) => string[];
  onAddSkills: (skillId: string, skills: string[]) => boolean;
}

export const AddSkillsDialog = ({ skill, availableSkills, getAISuggestedSkills, onAddSkills }: AddSkillsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const filteredAvailableSkills = availableSkills.filter(availableSkill =>
    availableSkill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
    !selectedSkills.includes(availableSkill.name) &&
    availableSkill.name !== skill.skill
  );

  const handleAddSkills = () => {
    if (selectedSkills.length === 0) return;

    const success = onAddSkills(skill.id, selectedSkills);
    if (success) {
      setSelectedSkills([]);
      setSkillSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setSelectedSkills([]);
    setSkillSearchTerm("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Related Skills</DialogTitle>
          <DialogDescription>
            Select skills to relate to {skill.skill}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2 text-blue-600">
              AI Suggested Related Skills
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {getAISuggestedSkills(skill.skill).map((suggestedSkill) => (
                <Badge 
                  key={suggestedSkill} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 border-blue-200"
                  onClick={() => {
                    if (!selectedSkills.includes(suggestedSkill)) {
                      setSelectedSkills(prev => [...prev, suggestedSkill]);
                    }
                  }}
                >
                  {suggestedSkill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              className="pl-8"
              value={skillSearchTerm}
              onChange={(e) => setSkillSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredAvailableSkills.map((availableSkill) => (
              <div
                key={availableSkill.id}
                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  if (selectedSkills.includes(availableSkill.name)) {
                    setSelectedSkills(prev => prev.filter(s => s !== availableSkill.name));
                  } else {
                    setSelectedSkills(prev => [...prev, availableSkill.name]);
                  }
                }}
              >
                <div>
                  <div className="font-medium">{availableSkill.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {availableSkill.cluster} • {availableSkill.group}
                  </div>
                </div>
                {selectedSkills.includes(availableSkill.name) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>

          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Skills:</div>
              <div className="flex flex-wrap gap-1">
                {selectedSkills.map((selectedSkill) => (
                  <Badge key={selectedSkill} variant="default" className="text-xs">
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
            <Button onClick={handleAddSkills} disabled={selectedSkills.length === 0}>
              Add Skills
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
