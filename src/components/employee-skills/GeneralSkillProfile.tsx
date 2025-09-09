import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Target, Award } from "lucide-react";

interface GeneralSkillProfileProps {
  employeeId?: string;
}

interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: EmployeeSkill[];
  color: string;
}

interface EmployeeSkill {
  id: string;
  skillName: string;
  currentProficiency: string;
  targetProficiency: string;
  proficiencyScore: number;
  targetScore: number;
  cluster: string;
  group: string;
  source: 'Current Job Position' | 'Next-Level Job Position' | 'Other Acquired Skills';
  lastAssessment: string;
  gapStatus: 'On Track' | 'Needs Improvement' | 'Exceeded';
}

const mockEmployeeSkills: EmployeeSkill[] = [
  {
    id: "1",
    skillName: "React.js Development",
    currentProficiency: "Advanced",
    targetProficiency: "Expert",
    proficiencyScore: 85,
    targetScore: 95,
    cluster: "Frontend Development",
    group: "Web Technologies",
    source: "Current Job Position",
    lastAssessment: "2024-01-10",
    gapStatus: "On Track"
  },
  {
    id: "2",
    skillName: "Node.js Backend",
    currentProficiency: "Intermediate",
    targetProficiency: "Advanced",
    proficiencyScore: 70,
    targetScore: 85,
    cluster: "Backend Development",
    group: "Web Technologies",
    source: "Current Job Position",
    lastAssessment: "2024-01-08",
    gapStatus: "Needs Improvement"
  },
  {
    id: "3",
    skillName: "Team Leadership",
    currentProficiency: "Beginner",
    targetProficiency: "Intermediate",
    proficiencyScore: 40,
    targetScore: 70,
    cluster: "Leadership",
    group: "Soft Skills",
    source: "Next-Level Job Position",
    lastAssessment: "2024-01-05",
    gapStatus: "Needs Improvement"
  },
  {
    id: "4",
    skillName: "AWS Cloud Architecture",
    currentProficiency: "Advanced",
    targetProficiency: "Advanced",
    proficiencyScore: 88,
    targetScore: 85,
    cluster: "Cloud Computing",
    group: "Infrastructure",
    source: "Other Acquired Skills",
    lastAssessment: "2024-01-12",
    gapStatus: "Exceeded"
  },
  {
    id: "5",
    skillName: "Data Analysis",
    currentProficiency: "Intermediate",
    targetProficiency: "Advanced",
    proficiencyScore: 65,
    targetScore: 80,
    cluster: "Data Science",
    group: "Analytics",
    source: "Other Acquired Skills",
    lastAssessment: "2024-01-07",
    gapStatus: "On Track"
  }
];

export const GeneralSkillProfile = ({ employeeId }: GeneralSkillProfileProps) => {
  const skillCategories: SkillCategory[] = [
    {
      category: "Current Job Position",
      icon: <Target className="h-5 w-5" />,
      skills: mockEmployeeSkills.filter(skill => skill.source === "Current Job Position"),
      color: "bg-primary/10 text-primary"
    },
    {
      category: "Next-Level Job Position",
      icon: <TrendingUp className="h-5 w-5" />,
      skills: mockEmployeeSkills.filter(skill => skill.source === "Next-Level Job Position"),
      color: "bg-orange-100 text-orange-700"
    },
    {
      category: "Other Acquired Skills",
      icon: <Award className="h-5 w-5" />,
      skills: mockEmployeeSkills.filter(skill => skill.source === "Other Acquired Skills"),
      color: "bg-green-100 text-green-700"
    }
  ];

  const getGapColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-700";
      case "Needs Improvement": return "bg-red-100 text-red-700";
      case "Exceeded": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Overview - Rajesh Kumar
          </CardTitle>
          <CardDescription>
            Holistic view of skills mapped to current position, next-level aspirations, and additional competencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className={`rounded-lg p-4 ${category.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {category.icon}
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="text-2xl font-bold">{category.skills.length}</div>
                  <div className="text-sm opacity-80">Skills</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Skills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Skill Proficiency</CardTitle>
          <CardDescription>
            Current vs target proficiency levels with gap analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Current Level</TableHead>
                  <TableHead>Target Level</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Gap Status</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmployeeSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.skillName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          skill.source === "Current Job Position" ? "bg-primary/10 text-primary" :
                          skill.source === "Next-Level Job Position" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }
                      >
                        {skill.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.currentProficiency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.targetProficiency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.proficiencyScore}%</span>
                          <span className="text-muted-foreground">/{skill.targetScore}%</span>
                        </div>
                        <Progress value={(skill.proficiencyScore / skill.targetScore) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGapColor(skill.gapStatus)}>
                        {skill.gapStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{skill.cluster}</TableCell>
                    <TableCell>{skill.group}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};