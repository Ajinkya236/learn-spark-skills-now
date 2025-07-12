
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SkillRelationships = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Skill Relationships</h1>
        <p className="text-muted-foreground">Visualize and manage skill connections</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Skills Graph</CardTitle>
          <CardDescription>
            Explore hierarchical and lateral relationships between skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Interactive skills graph coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillRelationships;
