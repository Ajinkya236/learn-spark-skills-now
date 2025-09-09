import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Target, Filter } from "lucide-react";

interface CurrentJobSkillProfileProps {
  employeeId?: string;
}

interface JobSkill {
  id: string;
  skillName: string;
  requiredProficiency: string;
  currentProficiency: string;
  proficiencyScore: number;
  requiredScore: number;
  cluster: string;
  group: string;
  source: 'Job Position Specific' | 'Job Variant Specific' | 'Job Role Specific';
  criticality: 'High' | 'Medium' | 'Low';
  lastAssessment: string;
  status: 'Proficient' | 'Developing' | 'Needs Development';
}

const mockJobSkills: JobSkill[] = [
  {
    id: "1",
    skillName: "React.js Development",
    requiredProficiency: "Advanced",
    currentProficiency: "Advanced",
    proficiencyScore: 85,
    requiredScore: 80,
    cluster: "Frontend Development",
    group: "Web Technologies",
    source: "Job Position Specific",
    criticality: "High",
    lastAssessment: "2024-01-10",
    status: "Proficient"
  },
  {
    id: "2",
    skillName: "Node.js Backend",
    requiredProficiency: "Advanced",
    currentProficiency: "Intermediate",
    proficiencyScore: 70,
    requiredScore: 80,
    cluster: "Backend Development",
    group: "Web Technologies",
    source: "Job Position Specific",
    criticality: "High",
    lastAssessment: "2024-01-08",
    status: "Developing"
  },
  {
    id: "3",
    skillName: "JavaScript ES6+",
    requiredProficiency: "Advanced",
    currentProficiency: "Advanced",
    proficiencyScore: 90,
    requiredScore: 80,
    cluster: "Programming Languages",
    group: "Web Technologies",
    source: "Job Variant Specific",
    criticality: "High",
    lastAssessment: "2024-01-12",
    status: "Proficient"
  },
  {
    id: "4",
    skillName: "Database Design",
    requiredProficiency: "Intermediate",
    currentProficiency: "Intermediate",
    proficiencyScore: 75,
    requiredScore: 70,
    cluster: "Database Management",
    group: "Data",
    source: "Job Variant Specific",
    criticality: "Medium",
    lastAssessment: "2024-01-09",
    status: "Proficient"
  },
  {
    id: "5",
    skillName: "Problem Solving",
    requiredProficiency: "Advanced",
    currentProficiency: "Intermediate",
    proficiencyScore: 65,
    requiredScore: 80,
    cluster: "Analytical Skills",
    group: "Soft Skills",
    source: "Job Role Specific",
    criticality: "High",
    lastAssessment: "2024-01-05",
    status: "Needs Development"
  },
  {
    id: "6",
    skillName: "Team Collaboration",
    requiredProficiency: "Intermediate",
    currentProficiency: "Advanced",
    proficiencyScore: 85,
    requiredScore: 70,
    cluster: "Communication",
    group: "Soft Skills",
    source: "Job Role Specific",
    criticality: "Medium",
    lastAssessment: "2024-01-11",
    status: "Proficient"
  }
];

export const CurrentJobSkillProfile = ({ employeeId }: CurrentJobSkillProfileProps) => {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [criticalityFilter, setCriticalityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSkills = mockJobSkills.filter(skill => {
    const matchesSource = sourceFilter === "all" || skill.source === sourceFilter;
    const matchesCriticality = criticalityFilter === "all" || skill.criticality === criticalityFilter;
    const matchesStatus = statusFilter === "all" || skill.status === statusFilter;
    
    return matchesSource && matchesCriticality && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Proficient": return "bg-green-100 text-green-700";
      case "Developing": return "bg-yellow-100 text-yellow-700";
      case "Needs Development": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Job Skill Profile
          </CardTitle>
          <CardDescription>
            Skills required for Senior Software Engineer - Full Stack position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Job Position</div>
              <div className="font-semibold">Senior Software Engineer - Full Stack</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Job Variant</div>
              <div className="font-semibold">Senior Software Engineer</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Job Role</div>
              <div className="font-semibold">Software Engineer</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Skills</div>
              <div className="font-semibold text-2xl">{mockJobSkills.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Job Position Specific">Job Position Specific</SelectItem>
                <SelectItem value="Job Variant Specific">Job Variant Specific</SelectItem>
                <SelectItem value="Job Role Specific">Job Role Specific</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Proficient">Proficient</SelectItem>
                <SelectItem value="Developing">Developing</SelectItem>
                <SelectItem value="Needs Development">Needs Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Required vs Actual Proficiency</CardTitle>
          <CardDescription>
            Detailed comparison of skill requirements and current proficiency levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Required Level</TableHead>
                  <TableHead>Current Level</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.skillName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          skill.source === "Job Position Specific" ? "bg-primary/10 text-primary" :
                          skill.source === "Job Variant Specific" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }
                      >
                        {skill.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.requiredProficiency}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.currentProficiency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.proficiencyScore}%</span>
                          <span className="text-muted-foreground">/{skill.requiredScore}%</span>
                        </div>
                        <Progress 
                          value={(skill.proficiencyScore / skill.requiredScore) * 100} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(skill.status)}>
                        {skill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCriticalityColor(skill.criticality)}>
                        {skill.criticality}
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