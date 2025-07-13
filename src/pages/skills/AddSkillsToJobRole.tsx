
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus } from "lucide-react";
import { toast } from "sonner";

interface SuggestedSkill {
  id: string;
  name: string;
  cluster: string;
  group: string;
  relevanceMatch: number;
  isSelected: boolean;
}

interface SelectedSkill extends SuggestedSkill {
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
}

const AddSkillsToJobRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkill[]>([
    {
      id: '1',
      name: 'TypeScript',
      cluster: 'Programming',
      group: 'Frontend Development',
      relevanceMatch: 95,
      isSelected: false
    },
    {
      id: '2',
      name: 'GraphQL',
      cluster: 'Programming',
      group: 'API Development',
      relevanceMatch: 88,
      isSelected: false
    },
    {
      id: '3',
      name: 'Docker',
      cluster: 'DevOps',
      group: 'Containerization',
      relevanceMatch: 82,
      isSelected: false
    },
    {
      id: '4',
      name: 'AWS',
      cluster: 'Cloud',
      group: 'Cloud Platforms',
      relevanceMatch: 76,
      isSelected: false
    },
    {
      id: '5',
      name: 'Jest',
      cluster: 'Testing',
      group: 'Unit Testing',
      relevanceMatch: 71,
      isSelected: false
    }
  ]);

  const filteredSkills = suggestedSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSkillSelection = (skillId: string) => {
    setSuggestedSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, isSelected: !skill.isSelected } : skill
    ));
  };

  const proceedToConfiguration = () => {
    const selected = suggestedSkills.filter(skill => skill.isSelected);
    if (selected.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    const configuredSkills: SelectedSkill[] = selected.map(skill => ({
      ...skill,
      proficiencyLevel: 'Intermediate',
      criticalityLevel: 'Medium'
    }));

    setSelectedSkills(configuredSkills);
    setStep('configure');
  };

  const updateSkillConfig = (skillId: string, field: 'proficiencyLevel' | 'criticalityLevel', value: string) => {
    setSelectedSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, [field]: value } : skill
    ));
  };

  const handleSubmit = () => {
    toast.success(`Added ${selectedSkills.length} skills to the job role`);
    navigate(`/skills/job-role-relationship/${id}`);
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select');
    } else {
      navigate(`/skills/job-role-relationship/${id}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {step === 'select' ? 'Select Skills' : 'Configure Skills'}
                </h1>
                <p className="text-muted-foreground">
                  {step === 'select' ? 'Choose skills to add to the job role' : 'Set proficiency levels and criticality'}
                </p>
              </div>
            </div>

            {step === 'select' && (
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Skills</CardTitle>
                  <CardDescription>
                    Skills are sorted by relevance match percentage
                  </CardDescription>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          skill.isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleSkillSelection(skill.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{skill.name}</h3>
                          <Badge variant="secondary">{skill.relevanceMatch}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{skill.cluster}</p>
                        <p className="text-xs text-muted-foreground">{skill.group}</p>
                        {skill.isSelected && (
                          <div className="mt-2">
                            <Badge variant="default">Selected</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-muted-foreground">
                      {suggestedSkills.filter(s => s.isSelected).length} skills selected
                    </p>
                    <Button onClick={proceedToConfiguration}>
                      Continue
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'configure' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configure Selected Skills</CardTitle>
                  <CardDescription>
                    Set proficiency levels and criticality for each selected skill
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSkills.map((skill) => (
                      <div key={skill.id} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <h3 className="font-medium">{skill.name}</h3>
                            <p className="text-sm text-muted-foreground">{skill.cluster} • {skill.group}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Proficiency Level</label>
                            <Select 
                              value={skill.proficiencyLevel} 
                              onValueChange={(value) => updateSkillConfig(skill.id, 'proficiencyLevel', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
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
                            <label className="text-sm font-medium">Criticality</label>
                            <Select 
                              value={skill.criticalityLevel} 
                              onValueChange={(value) => updateSkillConfig(skill.id, 'criticalityLevel', value as 'High' | 'Medium' | 'Low')}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Badge variant="secondary">{skill.relevanceMatch}% match</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSubmit}>
                      Add Skills to Job Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AddSkillsToJobRole;
