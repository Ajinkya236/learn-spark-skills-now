import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { BackButton } from "@/components/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSkillProfile } from "@/components/employee-skills/GeneralSkillProfile";
import { CurrentJobSkillProfile } from "@/components/employee-skills/CurrentJobSkillProfile";
import { NextLevelJobProfile } from "@/components/employee-skills/NextLevelJobProfile";
import { CrossOrgSkillSearch } from "@/components/employee-skills/CrossOrgSkillSearch";
import { SkillTrail } from "@/components/employee-skills/SkillTrail";
import { JobPositionTrail } from "@/components/employee-skills/JobPositionTrail";

const EmployeeSkillProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Employee Skill Profile</h1>
                <p className="text-muted-foreground">Comprehensive skill development and career progression</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                <TabsTrigger value="general">General Profile</TabsTrigger>
                <TabsTrigger value="current">Current Job</TabsTrigger>
                <TabsTrigger value="next-level">Next Level</TabsTrigger>
                <TabsTrigger value="cross-org">Cross-Org Search</TabsTrigger>
                <TabsTrigger value="skill-trail">Skill Trail</TabsTrigger>
                <TabsTrigger value="job-trail">Job Trail</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <GeneralSkillProfile employeeId={id} />
              </TabsContent>

              <TabsContent value="current" className="space-y-6">
                <CurrentJobSkillProfile employeeId={id} />
              </TabsContent>

              <TabsContent value="next-level" className="space-y-6">
                <NextLevelJobProfile employeeId={id} />
              </TabsContent>

              <TabsContent value="cross-org" className="space-y-6">
                <CrossOrgSkillSearch employeeId={id} />
              </TabsContent>

              <TabsContent value="skill-trail" className="space-y-6">
                <SkillTrail employeeId={id} />
              </TabsContent>

              <TabsContent value="job-trail" className="space-y-6">
                <JobPositionTrail employeeId={id} />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeSkillProfile;