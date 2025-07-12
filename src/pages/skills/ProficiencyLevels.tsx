
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProficiencyLevels = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Proficiency Levels</h1>
        <p className="text-muted-foreground">Configure custom proficiency stages and scoring</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proficiency Configuration</CardTitle>
          <CardDescription>
            Define custom proficiency levels and assessment criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Proficiency level configuration coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProficiencyLevels;
