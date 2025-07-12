
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Award, Brain, Target } from "lucide-react";

const DashboardContent = () => {
  const stats = [
    { title: "Total Employees", value: "2,847", icon: Users, change: "+12%" },
    { title: "Skills Mapped", value: "1,432", icon: Brain, change: "+8%" },
    { title: "Active Learning Paths", value: "127", icon: Target, change: "+23%" },
    { title: "Internal Placements", value: "43", icon: Award, change: "+15%" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to SkillSphere - Your Skills Intelligence Platform</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Skills Gap Analysis
            </CardTitle>
            <CardDescription>
              Overview of critical skill gaps across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Skills gap visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground">New skills assessment completed</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground">Internal job posting matched</p>
              <p className="text-xs text-muted-foreground">4 hours ago</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground">Learning path recommendation sent</p>
              <p className="text-xs text-muted-foreground">6 hours ago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { DashboardContent };
