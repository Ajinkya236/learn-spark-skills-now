
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { JobPositionDetailsHeader } from "@/components/job-position/JobPositionDetailsHeader";
import { JobPositionInfoCard } from "@/components/job-position/JobPositionInfoCard";
import { PositionSkillsManagementCard } from "@/components/job-position/PositionSkillsManagementCard";
import { EditPositionSkillDialog } from "@/components/job-position/EditPositionSkillDialog";
import { DeletePositionSkillDialog } from "@/components/job-position/DeletePositionSkillDialog";

interface JobPositionSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  type: 'Job Role specific' | 'Position specific';
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

const JobPositionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSkill, setEditingSkill] = useState<JobPositionSkill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<JobPositionSkill | null>(null);

  // Mock data for the job position
  const jobPosition = {
    id: id || '1',
    title: 'Senior Software Engineer',
    jobRole: 'Software Engineer',
    reportingTo: 'John Doe - Engineering Manager',
    description: 'Lead development of complex software solutions and mentor junior developers',
    rolesAndResponsibilities: 'Design and develop scalable applications, code reviews, technical leadership'
  };

  const [skills, setSkills] = useState<JobPositionSkill[]>([
    {
      id: '1',
      no: 1,
      skillName: 'React',
      proficiencyLevel: 'Advanced',
      type: 'Job Role specific',
      criticalityLevel: 'High',
      cluster: 'Programming',
      group: 'Frontend Development'
    },
    {
      id: '2',
      no: 2,
      skillName: 'Node.js',
      proficiencyLevel: 'Intermediate',
      type: 'Job Role specific',
      criticalityLevel: 'Medium',
      cluster: 'Programming',
      group: 'Backend Development'
    },
    {
      id: '3',
      no: 3,
      skillName: 'Team Leadership',
      proficiencyLevel: 'Advanced',
      type: 'Position specific',
      criticalityLevel: 'High',
      cluster: 'Soft Skills',
      group: 'Leadership'
    }
  ]);

  const filteredSkills = skills.filter(skill => {
    return (
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!proficiencyFilter || proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter) &&
      (!criticalityFilter || criticalityFilter === 'all' || skill.criticalityLevel === criticalityFilter) &&
      (!clusterFilter || clusterFilter === 'all' || skill.cluster === clusterFilter) &&
      (!groupFilter || groupFilter === 'all' || skill.group === groupFilter) &&
      (!typeFilter || typeFilter === 'all' || skill.type === typeFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleBack = () => {
    navigate('/skills/job-position-relationship');
  };

  const handleAddSkills = () => {
    navigate(`/skills/job-position-relationship/${id}/add-skills`);
  };

  const handleEditSkill = (skill: JobPositionSkill) => {
    setEditingSkill(skill);
  };

  const handleDeleteSkill = (skill: JobPositionSkill) => {
    setDeletingSkill(skill);
  };

  const handleSaveSkillEdit = (skillId: string, updates: { proficiencyLevel: string; criticalityLevel: 'High' | 'Medium' | 'Low' }) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...skill, ...updates }
        : skill
    ));
    toast.success("Skill requirements updated successfully");
  };

  const handleConfirmDelete = () => {
    if (deletingSkill) {
      setSkills(prev => prev.filter(skill => skill.id !== deletingSkill.id));
      toast.success(`${deletingSkill.skillName} removed from job position`);
      setDeletingSkill(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <JobPositionDetailsHeader
              jobPosition={jobPosition}
              onBack={handleBack}
            />

            <JobPositionInfoCard
              jobPosition={jobPosition}
              currentSkillsCount={skills.length}
            />

            <PositionSkillsManagementCard
              skills={paginatedSkills}
              searchTerm={searchTerm}
              proficiencyFilter={proficiencyFilter}
              criticalityFilter={criticalityFilter}
              clusterFilter={clusterFilter}
              groupFilter={groupFilter}
              typeFilter={typeFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchChange={setSearchTerm}
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

            <EditPositionSkillDialog
              skill={editingSkill}
              open={!!editingSkill}
              onOpenChange={(open) => !open && setEditingSkill(null)}
              onSave={handleSaveSkillEdit}
            />

            <DeletePositionSkillDialog
              skillName={deletingSkill?.skillName || null}
              open={!!deletingSkill}
              onOpenChange={(open) => !open && setDeletingSkill(null)}
              onConfirm={handleConfirmDelete}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobPositionDetails;
