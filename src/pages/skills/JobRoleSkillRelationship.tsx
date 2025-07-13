
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const JobRoleSkillRelationship = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Job Role - Skill Relationship</h1>
              <p className="text-muted-foreground">Manage relationships between job roles and skills</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Job Role Skill Mappings</CardTitle>
                <CardDescription>
                  Define which skills are required for specific job roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Job Role - Skill relationship management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobRoleSkillRelationship;
