
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { JobRoleHeader } from "@/components/job-role/JobRoleHeader";
import { JobRoleFilters } from "@/components/job-role/JobRoleFilters";
import { JobRoleTable } from "@/components/job-role/JobRoleTable";
import { GlobalSettingsDialog } from "@/components/job-role/GlobalSettingsDialog";

interface JobRole {
  id: string;
  title: string;
  business: string;
  group: string;
  department: string;
  description: string;
  maxSkills: number;
  skills: string[];
}

interface GlobalSettings {
  globalMaxSkills: number;
}

const JobRoleSkillRelationship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({ globalMaxSkills: 50 });

  // Mock data
  const [jobRoles] = useState<JobRole[]>([
    {
      id: '1',
      title: 'Software Engineer',
      business: 'Technology',
      group: 'Engineering',
      department: 'Development',
      description: 'Develops and maintains software applications',
      maxSkills: 25,
      skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript']
    },
    {
      id: '2',
      title: 'Product Manager',
      business: 'Product',
      group: 'Management',
      department: 'Strategy',
      description: 'Manages product development lifecycle',
      maxSkills: 20,
      skills: ['Product Strategy', 'Agile', 'Data Analysis']
    }
  ]);

  const businesses = ['Technology', 'Product', 'Marketing', 'Sales'];
  const groups = ['Engineering', 'Management', 'Design', 'Operations'];
  const departments = ['Development', 'Strategy', 'Creative', 'Support'];

  const filteredJobRoles = jobRoles.filter(role => {
    return (
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!businessFilter || businessFilter === 'all' || role.business === businessFilter) &&
      (!groupFilter || groupFilter === 'all' || role.group === groupFilter) &&
      (!departmentFilter || departmentFilter === 'all' || role.department === departmentFilter)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobRoles = filteredJobRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleViewEditRole = (jobRole: JobRole) => {
    navigate(`/skills/job-role-relationship/${jobRole.id}`);
  };

  const handleSaveGlobalSettings = () => {
    // Validate that global max is not less than highest local max
    const highestLocalMax = Math.max(...jobRoles.map(role => role.maxSkills));
    
    if (globalSettings.globalMaxSkills < highestLocalMax) {
      toast.error(`Global maximum skills cannot be less than the highest local maximum (${highestLocalMax}) for existing roles`);
      return;
    }

    toast.success("Global settings updated successfully");
    setIsSettingsOpen(false);
  };

  const highestLocalMax = Math.max(...jobRoles.map(role => role.maxSkills));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <JobRoleHeader
              title="Job Role - Skill Relationship"
              description="Manage skill requirements and proficiency levels for job roles"
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            <JobRoleFilters
              searchTerm={searchTerm}
              businessFilter={businessFilter}
              groupFilter={groupFilter}
              departmentFilter={departmentFilter}
              businesses={businesses}
              groups={groups}
              departments={departments}
              onSearchChange={setSearchTerm}
              onBusinessFilterChange={setBusinessFilter}
              onGroupFilterChange={setGroupFilter}
              onDepartmentFilterChange={setDepartmentFilter}
            />

            <JobRoleTable
              jobRoles={paginatedJobRoles}
              totalCount={filteredJobRoles.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onViewEdit={handleViewEditRole}
              onPageChange={setCurrentPage}
            />

            <GlobalSettingsDialog
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              settings={globalSettings}
              onUpdateSettings={setGlobalSettings}
              onSave={handleSaveGlobalSettings}
              highestLocalMax={highestLocalMax}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobRoleSkillRelationship;
