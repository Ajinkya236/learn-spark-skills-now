
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface AddProficiencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (proficiencyData: { skill: string; proficiencyLevel: string; proficiencyDescription: string }) => void;
  skills: string[];
  proficiencyLevels: ProficiencyLevel[];
}

export const AddProficiencyDialog: React.FC<AddProficiencyDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  skills,
  proficiencyLevels
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedProficiencyLevel, setSelectedProficiencyLevel] = useState('');
  const [proficiencyDescription, setProficiencyDescription] = useState('');

  const filteredSkills = skills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedSkill || !selectedProficiencyLevel || !proficiencyDescription.trim()) {
      return;
    }

    onSave({
      skill: selectedSkill,
      proficiencyLevel: selectedProficiencyLevel,
      proficiencyDescription: proficiencyDescription.trim()
    });

    // Reset form
    setSearchTerm('');
    setSelectedSkill('');
    setSelectedProficiencyLevel('');
    setProficiencyDescription('');
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedSkill('');
    setSelectedProficiencyLevel('');
    setProficiencyDescription('');
    onOpenChange(false);
  };

  const isFormValid = selectedSkill && selectedProficiencyLevel && proficiencyDescription.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-black font-inter">Add Proficiency Mapping</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Skill Search */}
          <div className="space-y-2">
            <Label htmlFor="skill-search" className="font-inter font-medium">
              Search Skill <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="skill-search"
                placeholder="Search for a skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-lg font-arial"
              />
            </div>
            
            {/* Skill Selection */}
            {searchTerm && (
              <div className="max-h-32 overflow-y-auto border rounded-lg">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors font-arial ${
                        selectedSkill === skill ? 'bg-muted font-medium' : ''
                      }`}
                      onClick={() => {
                        setSelectedSkill(skill);
                        setSearchTerm(skill);
                      }}
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground font-arial">
                    No skills found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Skill Display */}
          {selectedSkill && (
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium font-inter">Selected Skill: </span>
              <span className="text-sm font-arial">{selectedSkill}</span>
            </div>
          )}

          {/* Proficiency Level Selection */}
          <div className="space-y-2">
            <Label htmlFor="proficiency-level" className="font-inter font-medium">
              Proficiency Level <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedProficiencyLevel} 
              onValueChange={setSelectedProficiencyLevel}
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
            Add Proficiency
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
