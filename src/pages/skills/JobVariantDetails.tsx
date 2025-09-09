import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { JobVariantInfoCard } from "@/components/job-variant/JobVariantInfoCard";
import { VariantSkillsManagementCard } from "@/components/job-variant/VariantSkillsManagementCard";

interface JobVariant {
  id: string;
  jobVariant: string;
  mappedToJobRole: string;
  business: string;
  group: string;
  department: string;
  description: string;
  rolesAndResponsibilities: string[];
  mappedSkills: number;
  lastUpdated: string;
}

interface JobVariantSkill {
  id: string;
  no: number;
  skillName: string;
  source: 'From Job Role' | 'Variant specific';
  proficiencyLevel: string;
  proficiencyDescription: string[];
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

const mockJobVariant: JobVariant = {
  id: '1',
  jobVariant: 'Senior Frontend Developer - React Specialist',
  mappedToJobRole: 'Senior Frontend Developer',
  business: 'Technology',
  group: 'Product Engineering',
  department: 'Frontend Development',
  description: 'Specialized senior frontend developer role focused on React ecosystem and modern web applications. Responsible for architecting and implementing complex user interfaces with emphasis on performance and scalability.',
  rolesAndResponsibilities: [
    'Design and implement complex React applications with TypeScript',
    'Lead frontend architecture decisions and code reviews',
    'Mentor junior developers and establish coding standards',
    'Collaborate with UX/UI designers to implement pixel-perfect interfaces',
    'Optimize application performance and ensure cross-browser compatibility',
    'Integrate with backend APIs and manage state management solutions',
    'Implement automated testing strategies for frontend components'
  ],
  mappedSkills: 15,
  lastUpdated: '2024-01-15T10:30:00Z'
};

const mockVariantSkills: JobVariantSkill[] = [
  {
    id: '1',
    no: 1,
    skillName: 'React',
    source: 'From Job Role',
    proficiencyLevel: 'Expert',
    proficiencyDescription: [
      'Deep understanding of React internals and lifecycle methods',
      'Proficient in hooks, context API, and modern React patterns',
      'Can architect complex applications with optimal performance'
    ],
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Frontend Frameworks'
  },
  {
    id: '2',
    no: 2,
    skillName: 'TypeScript',
    source: 'Variant specific',
    proficiencyLevel: 'Advanced',
    proficiencyDescription: [
      'Strong typing skills with complex type definitions',
      'Experience with generics and advanced TypeScript features',
      'Can set up and maintain TypeScript configurations'
    ],
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Languages'
  },
  {
    id: '3',
    no: 3,
    skillName: 'Next.js',
    source: 'Variant specific',
    proficiencyLevel: 'Advanced',
    proficiencyDescription: [
      'Experience with SSR and SSG implementations',
      'Knowledge of Next.js API routes and middleware',
      'Understanding of performance optimization techniques'
    ],
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Frontend Frameworks'
  },
  {
    id: '4',
    no: 4,
    skillName: 'State Management (Redux/Zustand)',
    source: 'From Job Role',
    proficiencyLevel: 'Advanced',
    proficiencyDescription: [
      'Proficient in Redux Toolkit and modern Redux patterns',
      'Experience with Zustand for lightweight state management',
      'Understanding of when to use different state management solutions'
    ],
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'State Management'
  },
  {
    id: '5',
    no: 5,
    skillName: 'Testing (Jest, React Testing Library)',
    source: 'From Job Role',
    proficiencyLevel: 'Intermediate',
    proficiencyDescription: [
      'Can write unit and integration tests for React components',
      'Experience with Jest and React Testing Library',
      'Understanding of testing best practices and patterns'
    ],
    criticalityLevel: 'Medium',
    cluster: 'Testing',
    group: 'Frontend Testing'
  }
];

const JobVariantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Skill management state
  const [skills, setSkills] = useState(mockVariantSkills);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [proficiencyFilter, setProficiencyFilter] = useState('all');
  const [criticalityFilter, setCriticalityFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.skillName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || skill.source === sourceFilter;
    const matchesProficiency = proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter;
    const matchesCriticality = criticalityFilter === 'all' || skill.criticalityLevel === criticalityFilter;
    const matchesCluster = clusterFilter === 'all' || skill.cluster === clusterFilter;
    const matchesGroup = groupFilter === 'all' || skill.group === groupFilter;

    return matchesSearch && matchesSource && matchesProficiency && matchesCriticality && matchesCluster && matchesGroup;
  });

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleBack = () => {
    navigate('/skills/job-variant-relationship');
  };

  const handleAddSkills = () => {
    navigate(`/skills/job-variant-relationship/${id}/add-skills`);
  };

  const handleEditSkill = (skill: JobVariantSkill) => {
    console.log('Edit skill:', skill);
    // TODO: Implement edit skill dialog
  };

  const handleDeleteSkill = (skill: JobVariantSkill) => {
    console.log('Delete skill:', skill);
    // TODO: Implement delete skill confirmation
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="font-body"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-heading text-primary">Job Variant Details</h1>
                  <p className="text-muted-foreground font-body">
                    Manage skills and requirements for this job variant
                  </p>
                </div>
              </div>
            </div>

            {/* Job Variant Info */}
            <JobVariantInfoCard jobVariant={mockJobVariant} />

            {/* Skills Management */}
            <VariantSkillsManagementCard
              skills={displayedSkills}
              searchTerm={searchTerm}
              sourceFilter={sourceFilter}
              proficiencyFilter={proficiencyFilter}
              criticalityFilter={criticalityFilter}
              clusterFilter={clusterFilter}
              groupFilter={groupFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchChange={setSearchTerm}
              onSourceFilterChange={setSourceFilter}
              onProficiencyFilterChange={setProficiencyFilter}
              onCriticalityFilterChange={setCriticalityFilter}
              onClusterFilterChange={setClusterFilter}
              onGroupFilterChange={setGroupFilter}
              onPageChange={setCurrentPage}
              onAddSkills={handleAddSkills}
              onEditSkill={handleEditSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobVariantDetails;