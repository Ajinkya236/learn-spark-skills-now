
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LearningContentSkillRelationship = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Content - Skill Relationship</h1>
              <p className="text-muted-foreground">Manage relationships between learning content and skills</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Learning Content Skill Mappings</CardTitle>
                <CardDescription>
                  Define which skills are developed through specific learning content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Learning Content - Skill relationship management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default LearningContentSkillRelationship;
