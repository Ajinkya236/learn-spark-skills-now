
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
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredJobRoles = jobRoles.filter(role => {
    return role.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobRoles = filteredJobRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleViewEditRole = (jobRole: JobRole) => {
    navigate(`/skills/job-role-relationship/${jobRole.id}`);
  };


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-heading text-primary">Job Role - Skill Relationship</h1>
                <p className="text-muted-foreground font-body">
                  Manage skill requirements and proficiency levels for job roles
                </p>
              </div>
            </div>

            <JobRoleFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <JobRoleTable
              jobRoles={paginatedJobRoles}
              totalCount={filteredJobRoles.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onViewEdit={handleViewEditRole}
              onPageChange={setCurrentPage}
            />

          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobRoleSkillRelationship;
