
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
  type: 'Job Role mapped' | 'Auto suggested';
}

interface SelectedSkill extends SuggestedSkill {
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
}

const AddSkillsToJobPosition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkill[]>([
    // Job Role mapped skills
    {
      id: '1',
      name: 'React',
      cluster: 'Programming',
      group: 'Frontend Development',
      relevanceMatch: 100,
      isSelected: false,
      type: 'Job Role mapped'
    },
    {
      id: '2',
      name: 'Node.js',
      cluster: 'Programming',
      group: 'Backend Development',
      relevanceMatch: 100,
      isSelected: false,
      type: 'Job Role mapped'
    },
    // Auto suggested skills
    {
      id: '3',
      name: 'TypeScript',
      cluster: 'Programming',
      group: 'Frontend Development',
      relevanceMatch: 95,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '4',
      name: 'Team Leadership',
      cluster: 'Soft Skills',
      group: 'Leadership',
      relevanceMatch: 88,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '5',
      name: 'GraphQL',
      cluster: 'Programming',
      group: 'API Development',
      relevanceMatch: 82,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '6',
      name: 'Docker',
      cluster: 'DevOps',
      group: 'Containerization',
      relevanceMatch: 76,
      isSelected: false,
      type: 'Auto suggested'
    }
  ]);

  const filteredSkills = suggestedSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group skills by type
  const jobRoleSkills = filteredSkills.filter(skill => skill.type === 'Job Role mapped');
  const autoSuggestedSkills = filteredSkills.filter(skill => skill.type === 'Auto suggested');

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
    toast.success(`Added ${selectedSkills.length} skills to the job position`);
    navigate(`/skills/job-position-relationship/${id}`);
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select');
    } else {
      navigate(`/skills/job-position-relationship/${id}`);
    }
  };

  const selectedCount = suggestedSkills.filter(s => s.isSelected).length;

  const SkillSection = ({ title, skills, badge }: { title: string; skills: SuggestedSkill[]; badge?: string }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge && <Badge variant="outline">{badge}</Badge>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              skill.isSelected 
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleSkillSelection(skill.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm md:text-base truncate pr-2">{skill.name}</h4>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {skill.relevanceMatch}%
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 truncate">{skill.cluster}</p>
            <p className="text-xs text-muted-foreground truncate">{skill.group}</p>
            {skill.isSelected && (
              <div className="mt-2">
                <Badge variant="default" className="text-xs">Selected</Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  {step === 'select' ? 'Select Skills' : 'Configure Skills'}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {step === 'select' ? 'Choose skills to add to the job position' : 'Set proficiency levels and criticality'}
                </p>
              </div>
            </div>

            {step === 'select' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Available Skills</CardTitle>
                  <CardDescription>
                    Skills are categorized by Job Role mapped skills and auto-suggested skills based on relevance
                  </CardDescription>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills, clusters, or groups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {jobRoleSkills.length > 0 && (
                    <SkillSection 
                      title="Job Role Mapped Skills" 
                      skills={jobRoleSkills}
                      badge="From Job Role"
                    />
                  )}

                  {autoSuggestedSkills.length > 0 && (
                    <SkillSection 
                      title="Auto Suggested Skills" 
                      skills={autoSuggestedSkills}
                      badge="AI Recommended"
                    />
                  )}

                  {filteredSkills.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No skills found matching your search.</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {selectedCount} skill{selectedCount !== 1 ? 's' : ''} selected
                    </p>
                    <Button onClick={proceedToConfiguration} disabled={selectedCount === 0}>
                      Continue to Configuration
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'configure' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Configure Selected Skills</CardTitle>
                  <CardDescription>
                    Set proficiency levels and criticality for each selected skill
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSkills.map((skill) => (
                      <div key={skill.id} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start lg:items-center">
                          <div className="lg:col-span-1">
                            <h3 className="font-medium text-sm md:text-base">{skill.name}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {skill.cluster} • {skill.group}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {skill.relevanceMatch}% match
                              </Badge>
                              <Badge 
                                variant={skill.type === 'Job Role mapped' ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {skill.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm font-medium">Proficiency Level</label>
                            <Select 
                              value={skill.proficiencyLevel} 
                              onValueChange={(value) => updateSkillConfig(skill.id, 'proficiencyLevel', value)}
                            >
                              <SelectTrigger className="w-full">
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
                          
                          <div className="space-y-2">
                            <label className="text-xs md:text-sm font-medium">Criticality</label>
                            <Select 
                              value={skill.criticalityLevel} 
                              onValueChange={(value) => updateSkillConfig(skill.id, 'criticalityLevel', value as 'High' | 'Medium' | 'Low')}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-center lg:justify-start">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSuggestedSkills(prev => prev.map(s => 
                                  s.id === skill.id ? { ...s, isSelected: false } : s
                                ));
                                setSelectedSkills(prev => prev.filter(s => s.id !== skill.id));
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} configured
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep('select')}>
                        Back to Selection
                      </Button>
                      <Button onClick={handleSubmit}>
                        Add Skills to Job Position
                      </Button>
                    </div>
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

export default AddSkillsToJobPosition;
