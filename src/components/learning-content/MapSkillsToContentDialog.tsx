
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, BookOpen, PlayCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Content {
  id: string;
  name: string;
  type: 'course' | 'learning-path';
  description: string;
}

interface Skill {
  id: string;
  name: string;
  cluster: string;
  group: string;
}

interface SkillsToContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mappings: any[]) => void;
}

export const MapSkillsToContentDialog = ({ open, onOpenChange, onSave }: SkillsToContentDialogProps) => {
  const [step, setStep] = useState<'select-skills' | 'select-content'>('select-skills');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<{skill: Skill, proficiencyLevel: string}[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content[]>([]);

  // Mock data
  const availableContent: Content[] = [
    { id: "C001", name: "Advanced JavaScript Programming", type: "course", description: "Master advanced JS concepts" },
    { id: "C002", name: "React Fundamentals", type: "course", description: "Learn React basics" },
    { id: "C003", name: "Python for Data Science", type: "course", description: "Data analysis with Python" },
    { id: "LP001", name: "Full Stack Development Path", type: "learning-path", description: "Complete web development journey" },
    { id: "LP002", name: "Data Science Mastery", type: "learning-path", description: "From basics to advanced analytics" }
  ];

  const availableSkills: Skill[] = [
    { id: "1", name: "JavaScript", cluster: "Technical Skills", group: "Programming" },
    { id: "2", name: "React", cluster: "Technical Skills", group: "Frontend" },
    { id: "3", name: "Python", cluster: "Technical Skills", group: "Programming" },
    { id: "4", name: "Data Analysis", cluster: "Technical Skills", group: "Analytics" },
    { id: "5", name: "Node.js", cluster: "Technical Skills", group: "Backend" }
  ];

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContent = availableContent.filter(content =>
    content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.skill.id === skill.id);
      if (exists) {
        return prev.filter(s => s.skill.id !== skill.id);
      }
      return [...prev, { skill, proficiencyLevel: 'Beginner' }];
    });
  };

  const handleProficiencyChange = (skillId: string, proficiencyLevel: string) => {
    setSelectedSkills(prev => 
      prev.map(s => 
        s.skill.id === skillId ? { ...s, proficiencyLevel } : s
      )
    );
  };

  const handleContentSelect = (content: Content) => {
    setSelectedContent(prev => {
      const exists = prev.find(c => c.id === content.id);
      if (exists) {
        return prev.filter(c => c.id !== content.id);
      }
      return [...prev, content];
    });
  };

  const handleNext = () => {
    if (selectedSkills.length === 0) {
      toast.error("Please select at least one skill and assign proficiency levels");
      return;
    }
    
    // Validate that all skills have proficiency levels
    const missingProficiency = selectedSkills.some(s => !s.proficiencyLevel);
    if (missingProficiency) {
      toast.error("Please assign proficiency levels to all selected skills");
      return;
    }
    
    setStep('select-content');
    setSearchTerm("");
  };

  const handleBack = () => {
    setStep('select-skills');
    setSearchTerm("");
  };

  const handleSave = () => {
    if (selectedContent.length === 0) {
      toast.error("Please select at least one content item");
      return;
    }

    const mappings = [];
    selectedSkills.forEach(({ skill, proficiencyLevel }) => {
      selectedContent.forEach(content => {
        mappings.push({
          contentId: content.id,
          contentName: content.name,
          contentType: content.type,
          skillName: skill.name,
          proficiencyLevel,
          cluster: skill.cluster,
          group: skill.group
        });
      });
    });

    onSave(mappings);
    toast.success(`Successfully mapped ${selectedSkills.length} skill(s) to ${selectedContent.length} content item(s)`);
    
    // Reset state
    setStep('select-skills');
    setSelectedSkills([]);
    setSelectedContent([]);
    setSearchTerm("");
  };

  const handleCancel = () => {
    setStep('select-skills');
    setSelectedSkills([]);
    setSelectedContent([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Map Skills to Content</DialogTitle>
          <DialogDescription>
            {step === 'select-skills' 
              ? "Select skills and assign proficiency levels"
              : "Select learning content items to map"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 ${step === 'select-skills' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'select-skills' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Select Skills</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className={`flex items-center space-x-2 ${step === 'select-content' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'select-content' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Select Content</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={step === 'select-skills' ? "Search skills..." : "Search content by name or ID..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {step === 'select-skills' && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-3">
                {filteredSkills.map((skill) => {
                  const selectedSkill = selectedSkills.find(s => s.skill.id === skill.id);
                  const isSelected = !!selectedSkill;
                  
                  return (
                    <div
                      key={skill.id}
                      className={`p-4 border rounded-lg transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => handleSkillSelect(skill)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">{skill.name}</Badge>
                            <span className="text-xs text-muted-foreground">{skill.cluster} • {skill.group}</span>
                          </div>
                          {isSelected && (
                            <Select
                              value={selectedSkill.proficiencyLevel}
                              onValueChange={(value) => handleProficiencyChange(skill.id, value)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select proficiency level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'select-content' && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContent.map((content) => {
                  const isSelected = selectedContent.find(c => c.id === content.id);
                  return (
                    <div
                      key={content.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleContentSelect(content)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={!!isSelected}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {content.type === 'course' ? (
                              <BookOpen className="w-4 h-4 text-primary" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-primary" />
                            )}
                            <Badge variant="outline">{content.id}</Badge>
                            <Badge variant={content.type === 'course' ? 'default' : 'secondary'}>
                              {content.type === 'course' ? 'Course' : 'Learning Path'}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{content.name}</h4>
                          <p className="text-xs text-muted-foreground">{content.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {step === 'select-skills' && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={selectedSkills.length === 0}>
                Select Content ({selectedSkills.length} skills)
              </Button>
            </>
          )}
          
          {step === 'select-content' && (
            <>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={selectedContent.length === 0}>
                Save Mappings ({selectedContent.length} content)
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
