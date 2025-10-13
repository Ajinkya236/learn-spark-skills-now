import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { JobPositionInfoCard } from "@/components/job-position/JobPositionInfoCard";
import { PositionSkillsManagementCard } from "@/components/job-position/PositionSkillsManagementCard";

interface JobPosition {
  id: string;
  jobPosition: string;
  mappedToJobVariant: string;
  mappedToJobRole: string;
  business: string;
  group: string;
  department: string;
  description: string;
  rolesAndResponsibilities: string[];
  mappedSkills: number;
  lastUpdated: string;
}

interface JobPositionSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  type: 'From Job Role' | 'From Job Variant' | 'Position specific';
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

const mockJobPosition: JobPosition = {
  id: '1',
  jobPosition: 'Senior Frontend Developer - Team Lead',
  mappedToJobVariant: 'Senior Frontend Developer - React Specialist',
  mappedToJobRole: 'Senior Frontend Developer',
  business: 'Technology',
  group: 'Product Engineering',
  department: 'Frontend Development',
  description: 'Lead a team of frontend developers while maintaining hands-on involvement in React development. Responsible for technical decision making, mentoring team members, and ensuring code quality across all frontend projects.',
  rolesAndResponsibilities: [
    'Lead a team of 4-6 frontend developers',
    'Design and implement complex React applications with TypeScript',
    'Conduct code reviews and establish coding standards',
    'Mentor junior developers and provide technical guidance',
    'Collaborate with product managers and designers on feature planning',
    'Optimize application performance and ensure scalability',
    'Drive technical decisions and architecture choices',
    'Manage project timelines and deliverables'
  ],
  mappedSkills: 18,
  lastUpdated: '2024-01-15T10:30:00Z'
};

const mockPositionSkills: JobPositionSkill[] = [
  {
    id: '1',
    no: 1,
    skillName: 'React',
    type: 'From Job Role',
    proficiencyLevel: 'Expert',
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Frontend Frameworks'
  },
  {
    id: '2',
    no: 2,
    skillName: 'TypeScript',
    type: 'From Job Variant',
    proficiencyLevel: 'Advanced',
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Languages'
  },
  {
    id: '3',
    no: 3,
    skillName: 'Team Leadership',
    type: 'Position specific',
    proficiencyLevel: 'Advanced',
    criticalityLevel: 'High',
    cluster: 'Soft Skills',
    group: 'Leadership'
  },
  {
    id: '4',
    no: 4,
    skillName: 'Project Management',
    type: 'Position specific',
    proficiencyLevel: 'Intermediate',
    criticalityLevel: 'Medium',
    cluster: 'Soft Skills',
    group: 'Management'
  },
  {
    id: '5',
    no: 5,
    skillName: 'Next.js',
    type: 'From Job Variant',
    proficiencyLevel: 'Advanced',
    criticalityLevel: 'High',
    cluster: 'Programming',
    group: 'Frontend Frameworks'
  },
  {
    id: '6',
    no: 6,
    skillName: 'Code Review',
    type: 'Position specific',
    proficiencyLevel: 'Advanced',
    criticalityLevel: 'Medium',
    cluster: 'Soft Skills',
    group: 'Technical Leadership'
  }
];

const JobPositionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Skill management state
  const [skills, setSkills] = useState(mockPositionSkills);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [proficiencyFilter, setProficiencyFilter] = useState('all');
  const [criticalityFilter, setCriticalityFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.skillName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'all' || skill.type === sourceFilter;
    const matchesProficiency = proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter;
    const matchesCriticality = criticalityFilter === 'all' || skill.criticalityLevel === criticalityFilter;
    const matchesCluster = clusterFilter === 'all' || skill.cluster === clusterFilter;
    const matchesGroup = groupFilter === 'all' || skill.group === groupFilter;
    const matchesType = typeFilter === 'all' || skill.type === typeFilter;

    return matchesSearch && matchesSource && matchesProficiency && matchesCriticality && matchesCluster && matchesGroup && matchesType;
  });

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleBack = () => {
    navigate('/skills/job-position-relationship');
  };

  const handleAddSkills = () => {
    navigate(`/skills/job-position-relationship/${id}/add-skills`);
  };

  const handleEditSkill = (skill: JobPositionSkill) => {
    // Only allow editing if type is "Position specific"
    if (skill.type === 'Position specific') {
      console.log('Edit skill:', skill);
      // TODO: Implement edit skill dialog
    }
  };

  const handleDeleteSkill = (skill: JobPositionSkill) => {
    // This function is not used anymore - delete functionality removed
    console.log('Delete skill functionality removed:', skill);
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
                  <h1 className="text-3xl font-heading text-primary">Job Position Details</h1>
                  <p className="text-muted-foreground font-body">
                    Manage skills and requirements for this job position
                  </p>
                </div>
              </div>
            </div>

            {/* Job Position Info */}
            <JobPositionInfoCard jobPosition={mockJobPosition} />

            {/* Skills Management */}
            <PositionSkillsManagementCard
              skills={displayedSkills}
              searchTerm={searchTerm}
              sourceFilter={sourceFilter}
              proficiencyFilter={proficiencyFilter}
              criticalityFilter={criticalityFilter}
              clusterFilter={clusterFilter}
              groupFilter={groupFilter}
              typeFilter={typeFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchChange={setSearchTerm}
              onSourceFilterChange={setSourceFilter}
              onProficiencyFilterChange={setProficiencyFilter}
              onCriticalityFilterChange={setCriticalityFilter}
              onClusterFilterChange={setClusterFilter}
              onGroupFilterChange={setGroupFilter}
              onTypeFilterChange={setTypeFilter}
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

export default JobPositionDetails;