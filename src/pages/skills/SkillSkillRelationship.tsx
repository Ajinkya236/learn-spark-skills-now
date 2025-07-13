
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSkillRelationships } from "@/hooks/useSkillRelationships";
import { BulkImportDialog } from "@/components/skills/BulkImportDialog";
import { SkillRelationshipsTable } from "@/components/skills/SkillRelationshipsTable";

const SkillSkillRelationship = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredRelations,
    availableSkills,
    getAISuggestedSkills,
    addSkillRelations,
    removeSkillRelations,
    handleBulkImport
  } = useSkillRelationships();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Skill - Skill Relationship</h1>
                <p className="text-muted-foreground">Manage relationships between skills</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <BulkImportDialog onImport={handleBulkImport} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Related Skills</CardTitle>
                <CardDescription>
                  Search and manage skill relationships
                </CardDescription>
                <div className="w-full max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SkillRelationshipsTable
                  relations={filteredRelations}
                  availableSkills={availableSkills}
                  getAISuggestedSkills={getAISuggestedSkills}
                  onAddSkills={addSkillRelations}
                  onRemoveSkills={removeSkillRelations}
                />
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SkillSkillRelationship;
