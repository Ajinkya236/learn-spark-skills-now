
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { JobRoleDetailsHeader } from "@/components/job-role/JobRoleDetailsHeader";
import { JobRoleInfoCard } from "@/components/job-role/JobRoleInfoCard";
import { SkillsManagementCard } from "@/components/job-role/SkillsManagementCard";
import { EditSkillDialog } from "@/components/job-role/EditSkillDialog";
import { DeleteSkillDialog } from "@/components/job-role/DeleteSkillDialog";

interface JobRoleSkill {
  id: string;
  no: number;
  skillName: string;
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
  cluster: string;
  group: string;
}

const JobRoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSkill, setEditingSkill] = useState<JobRoleSkill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<JobRoleSkill | null>(null);

  // Mock data for the job role
  const jobRole = {
    id: id || '1',
    title: 'Software Engineer',
    business: 'Technology',
    group: 'Engineering',
    department: 'Development',
    maxSkills: 25
  };

  const [skills, setSkills] = useState<JobRoleSkill[]>([
    {
      id: '1',
      no: 1,
      skillName: 'React',
      proficiencyLevel: 'Advanced',
      criticalityLevel: 'High',
      cluster: 'Programming',
      group: 'Frontend Development'
    },
    {
      id: '2',
      no: 2,
      skillName: 'Node.js',
      proficiencyLevel: 'Intermediate',
      criticalityLevel: 'Medium',
      cluster: 'Programming',
      group: 'Backend Development'
    },
    {
      id: '3',
      no: 3,
      skillName: 'Python',
      proficiencyLevel: 'Expert',
      criticalityLevel: 'High',
      cluster: 'Programming',
      group: 'Backend Development'
    }
  ]);

  const filteredSkills = skills.filter(skill => {
    return (
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!proficiencyFilter || proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter) &&
      (!criticalityFilter || criticalityFilter === 'all' || skill.criticalityLevel === criticalityFilter) &&
      (!clusterFilter || clusterFilter === 'all' || skill.cluster === clusterFilter) &&
      (!groupFilter || groupFilter === 'all' || skill.group === groupFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handleBack = () => {
    navigate('/skills/job-role-relationship');
  };

  const handleAddSkills = () => {
    navigate(`/skills/job-role-relationship/${id}/add-skills`);
  };

  const handleEditSkill = (skill: JobRoleSkill) => {
    setEditingSkill(skill);
  };

  const handleDeleteSkill = (skill: JobRoleSkill) => {
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
      toast.success(`${deletingSkill.skillName} removed from job role`);
      setDeletingSkill(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <JobRoleDetailsHeader
              jobRole={jobRole}
              onBack={handleBack}
            />

            <JobRoleInfoCard
              jobRole={jobRole}
              currentSkillsCount={skills.length}
            />

            <SkillsManagementCard
              skills={paginatedSkills}
              searchTerm={searchTerm}
              proficiencyFilter={proficiencyFilter}
              criticalityFilter={criticalityFilter}
              clusterFilter={clusterFilter}
              groupFilter={groupFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              onSearchChange={setSearchTerm}
              onProficiencyFilterChange={setProficiencyFilter}
              onCriticalityFilterChange={setCriticalityFilter}
              onClusterFilterChange={setClusterFilter}
              onGroupFilterChange={setGroupFilter}
              onPageChange={setCurrentPage}
              onAddSkills={handleAddSkills}
              onEditSkill={handleEditSkill}
              onDeleteSkill={handleDeleteSkill}
            />

            <EditSkillDialog
              skill={editingSkill}
              open={!!editingSkill}
              onOpenChange={(open) => !open && setEditingSkill(null)}
              onSave={handleSaveSkillEdit}
            />

            <DeleteSkillDialog
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

export default JobRoleDetails;
