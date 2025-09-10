import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SelectedJobRole {
  id: string;
  name: string;
}

interface SelectedSkill {
  id: string;
  name: string;
  proficiencyLevel: string;
  criticalityLevel: string;
  cluster: string;
  group: string;
}

interface SkillOption {
  id: string;
  name: string;
  cluster: string;
  group: string;
}

// Mock data
const mockJobRoles = [
  { id: '1', name: 'Senior Frontend Developer' },
  { id: '2', name: 'Backend Developer' },
  { id: '3', name: 'DevOps Engineer' },
  { id: '4', name: 'Data Analyst' },
  { id: '5', name: 'Product Manager' }
];

const mockBusinesses = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Healthcare' },
  { id: '3', name: 'Product' },
  { id: '4', name: 'Finance' }
];

const mockGroups = [
  { id: '1', name: 'Product Engineering' },
  { id: '2', name: 'Infrastructure' },
  { id: '3', name: 'Analytics' },
  { id: '4', name: 'Product Management' }
];

const mockDepartments = [
  { id: '1', name: 'Frontend Development' },
  { id: '2', name: 'Backend Development' },
  { id: '3', name: 'Cloud Operations' },
  { id: '4', name: 'Data Science' },
  { id: '5', name: 'Mobile Products' }
];

const mockSkills: SkillOption[] = [
  { id: '1', name: 'React.js', cluster: 'Frontend Frameworks', group: 'Web Development' },
  { id: '2', name: 'Node.js', cluster: 'Backend Frameworks', group: 'Server Development' },
  { id: '3', name: 'TypeScript', cluster: 'Programming Languages', group: 'Web Development' },
  { id: '4', name: 'AWS', cluster: 'Cloud Platforms', group: 'DevOps' },
  { id: '5', name: 'Docker', cluster: 'Containerization', group: 'DevOps' }
];

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const criticalityLevels = ['Low', 'Medium', 'High'];

const CreateJobVariant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [selectedJobRole, setSelectedJobRole] = useState<SelectedJobRole | null>(null);
  const [formData, setFormData] = useState({
    jobVariantName: '',
    business: '',
    group: '',
    department: '',
    description: '',
    rolesAndResponsibilities: ''
  });

  // Skills state
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [showSkillSearch, setShowSkillSearch] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  // Job Role Search
  const [jobRoleSearchTerm, setJobRoleSearchTerm] = useState('');
  const [showJobRoleSearch, setShowJobRoleSearch] = useState(false);

  // Business/Group/Department Search
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');

  const filteredJobRoles = mockJobRoles.filter(role =>
    role.name.toLowerCase().includes(jobRoleSearchTerm.toLowerCase())
  );

  const filteredBusinesses = mockBusinesses.filter(business =>
    business.name.toLowerCase().includes(businessSearchTerm.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  const filteredSkills = mockSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
    !selectedSkills.some(selected => selected.id === skill.id)
  );

  const handleJobRoleSelect = (role: { id: string; name: string }) => {
    setSelectedJobRole(role);
    setShowJobRoleSearch(false);
    setJobRoleSearchTerm('');
  };

  const handleSkillAdd = (skill: SkillOption) => {
    const newSkill: SelectedSkill = {
      ...skill,
      proficiencyLevel: '',
      criticalityLevel: ''
    };
    setSelectedSkills([...selectedSkills, newSkill]);
    setSkillSearchTerm('');
  };

  const handleSkillRemove = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.id !== skillId));
  };

  const handleSkillUpdate = (skillId: string, field: 'proficiencyLevel' | 'criticalityLevel', value: string) => {
    setSelectedSkills(selectedSkills.map(skill =>
      skill.id === skillId ? { ...skill, [field]: value } : skill
    ));
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedJobRole) {
      toast({
        title: "Error",
        description: "Please select a job role",
        variant: "destructive"
      });
      return;
    }

    const requiredFields = ['jobVariantName', 'business', 'group', 'department', 'description', 'rolesAndResponsibilities'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all mandatory fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one skill",
        variant: "destructive"
      });
      return;
    }

    const incompleteSkills = selectedSkills.filter(skill => !skill.proficiencyLevel || !skill.criticalityLevel);
    if (incompleteSkills.length > 0) {
      toast({
        title: "Error",
        description: "Please set proficiency and criticality levels for all skills",
        variant: "destructive"
      });
      return;
    }

    // Success simulation
    toast({
      title: "Success",
      description: "Job variant created successfully!"
    });

    navigate('/skills/job-variant-relationship');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/skills/job-variant-relationship')}
                className="font-body"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-heading text-primary">Create Job Variant</h1>
                <p className="text-muted-foreground font-body">
                  Create a new job variant with specific skill requirements
                </p>
              </div>
            </div>

            {/* Job Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Select Job Role *</CardTitle>
                <CardDescription className="font-body">
                  First, select the base job role for this variant
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedJobRole ? (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="font-body font-medium">{selectedJobRole.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedJobRole(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search job roles..."
                        value={jobRoleSearchTerm}
                        onChange={(e) => {
                          setJobRoleSearchTerm(e.target.value);
                          setShowJobRoleSearch(true);
                        }}
                        onFocus={() => setShowJobRoleSearch(true)}
                        className="pl-10 font-body"
                      />
                    </div>
                    {showJobRoleSearch && (
                      <div className="border rounded-md max-h-48 overflow-y-auto">
                        {filteredJobRoles.map((role) => (
                          <div
                            key={role.id}
                            className="p-3 hover:bg-muted cursor-pointer font-body"
                            onClick={() => handleJobRoleSelect(role)}
                          >
                            {role.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            {selectedJobRole && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Basic Information</CardTitle>
                  <CardDescription className="font-body">
                    Provide details for the job variant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobVariantName" className="font-body">Job Variant Name *</Label>
                      <Input
                        id="jobVariantName"
                        placeholder="e.g. Senior Frontend Developer - React Specialist"
                        value={formData.jobVariantName}
                        onChange={(e) => setFormData({ ...formData, jobVariantName: e.target.value })}
                        className="font-body"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mappedJobRole" className="font-body">Mapped to Job Role</Label>
                      <Input
                        id="mappedJobRole"
                        value={selectedJobRole.name}
                        disabled
                        className="font-body bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-body">Business *</Label>
                      <Select 
                        value={formData.business} 
                        onValueChange={(value) => setFormData({ ...formData, business: value })}
                      >
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Select business" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBusinesses.map((business) => (
                            <SelectItem key={business.id} value={business.name}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-body">Group *</Label>
                      <Select 
                        value={formData.group} 
                        onValueChange={(value) => setFormData({ ...formData, group: value })}
                      >
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGroups.map((group) => (
                            <SelectItem key={group.id} value={group.name}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-body">Department *</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger className="font-body">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDepartments.map((department) => (
                            <SelectItem key={department.id} value={department.name}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-body">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the job variant..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="font-body"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rolesAndResponsibilities" className="font-body">Roles and Responsibilities *</Label>
                    <Textarea
                      id="rolesAndResponsibilities"
                      placeholder="List roles and responsibilities..."
                      value={formData.rolesAndResponsibilities}
                      onChange={(e) => setFormData({ ...formData, rolesAndResponsibilities: e.target.value })}
                      className="font-body"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {selectedJobRole && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Required Skills and Proficiencies *</CardTitle>
                  <CardDescription className="font-body">
                    Add skills with their proficiency and criticality levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Skills */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-body">Search and Add Skills</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSkillSearch(!showSkillSearch)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skills
                      </Button>
                    </div>

                    {showSkillSearch && (
                      <div className="space-y-2 p-4 border rounded-md bg-muted/20">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search skills..."
                            value={skillSearchTerm}
                            onChange={(e) => setSkillSearchTerm(e.target.value)}
                            className="pl-10 font-body"
                          />
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {filteredSkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                              onClick={() => handleSkillAdd(skill)}
                            >
                              <div>
                                <span className="font-body font-medium">{skill.name}</span>
                                <div className="text-sm text-muted-foreground">
                                  {skill.cluster} • {skill.group}
                                </div>
                              </div>
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Skills */}
                  {selectedSkills.length > 0 && (
                    <div className="space-y-3">
                      {selectedSkills.map((skill) => (
                        <div key={skill.id} className="p-4 border rounded-md">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-body font-medium">{skill.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {skill.cluster} • {skill.group}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSkillRemove(skill.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="font-body text-sm">Proficiency Level *</Label>
                              <Select
                                value={skill.proficiencyLevel}
                                onValueChange={(value) => handleSkillUpdate(skill.id, 'proficiencyLevel', value)}
                              >
                                <SelectTrigger className="font-body">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {proficiencyLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="font-body text-sm">Criticality Level *</Label>
                              <Select
                                value={skill.criticalityLevel}
                                onValueChange={(value) => handleSkillUpdate(skill.id, 'criticalityLevel', value)}
                              >
                                <SelectTrigger className="font-body">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {criticalityLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {selectedJobRole && (
              <div className="flex justify-end">
                <Button onClick={handleSubmit} className="font-body">
                  Create Job Variant
                </Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreateJobVariant;