
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";

const TaxonomyManagement = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Taxonomy Management</h1>
          <p className="text-muted-foreground">Create and manage your skills hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Cluster
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills Taxonomy Tree</CardTitle>
          <CardDescription>
            Organize skills into clusters, groups, and individual skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Skills taxonomy tree interface coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxonomyManagement;
