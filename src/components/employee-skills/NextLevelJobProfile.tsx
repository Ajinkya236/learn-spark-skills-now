import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, ArrowRight, BookOpen } from "lucide-react";

interface NextLevelJobProfileProps {
  employeeId?: string;
}

interface NextLevelRole {
  id: string;
  jobTitle: string;
  jobVariant: string;
  jobRole: string;
  business: string;
  group: string;
  department: string;
  careerPath: string;
}

interface NextLevelSkill {
  id: string;
  skillName: string;
  requiredProficiency: string;
  currentProficiency: string;
  proficiencyScore: number;
  requiredScore: number;
  cluster: string;
  group: string;
  criticality: 'High' | 'Medium' | 'Low';
  skillStatus: 'Not Acquired' | 'Needs Upgrade' | 'Already Proficient';
  estimatedTime: string;
  learningPath?: string;
}

const mockNextLevelRoles: NextLevelRole[] = [
  {
    id: "1",
    jobTitle: "Lead Software Engineer - Full Stack",
    jobVariant: "Lead Software Engineer",
    jobRole: "Software Engineering Lead",
    business: "Technology",
    group: "Engineering",
    department: "Product Development",
    careerPath: "Technical Leadership"
  },
  {
    id: "2",
    jobTitle: "Engineering Manager - Frontend",
    jobVariant: "Engineering Manager",
    jobRole: "Engineering Manager",
    business: "Technology",
    group: "Engineering",
    department: "Product Development",
    careerPath: "People Management"
  },
  {
    id: "3",
    jobTitle: "Senior Principal Engineer",
    jobVariant: "Principal Engineer",
    jobRole: "Principal Engineer",
    business: "Technology",
    group: "Engineering",
    department: "Architecture",
    careerPath: "Technical Expert"
  }
];

const mockNextLevelSkills: NextLevelSkill[] = [
  {
    id: "1",
    skillName: "Team Leadership",
    requiredProficiency: "Advanced",
    currentProficiency: "Beginner",
    proficiencyScore: 40,
    requiredScore: 80,
    cluster: "Leadership",
    group: "Soft Skills",
    criticality: "High",
    skillStatus: "Needs Upgrade",
    estimatedTime: "6-8 months",
    learningPath: "Leadership Development Program"
  },
  {
    id: "2",
    skillName: "System Architecture Design",
    requiredProficiency: "Advanced",
    currentProficiency: "Intermediate",
    proficiencyScore: 60,
    requiredScore: 85,
    cluster: "Architecture",
    group: "Technical Skills",
    criticality: "High",
    skillStatus: "Needs Upgrade",
    estimatedTime: "4-6 months",
    learningPath: "Architecture Mastery Track"
  },
  {
    id: "3",
    skillName: "Project Management",
    requiredProficiency: "Intermediate",
    currentProficiency: "Beginner",
    proficiencyScore: 30,
    requiredScore: 70,
    cluster: "Project Management",
    group: "Management Skills",
    criticality: "Medium",
    skillStatus: "Not Acquired",
    estimatedTime: "3-4 months",
    learningPath: "Agile Project Management"
  },
  {
    id: "4",
    skillName: "Microservices Architecture",
    requiredProficiency: "Advanced",
    currentProficiency: "Intermediate",
    proficiencyScore: 70,
    requiredScore: 85,
    cluster: "Architecture",
    group: "Technical Skills",
    criticality: "High",
    skillStatus: "Needs Upgrade",
    estimatedTime: "2-3 months"
  },
  {
    id: "5",
    skillName: "Mentoring & Coaching",
    requiredProficiency: "Intermediate",
    currentProficiency: "Beginner",
    proficiencyScore: 35,
    requiredScore: 70,
    cluster: "People Development",
    group: "Soft Skills",
    criticality: "Medium",
    skillStatus: "Not Acquired",
    estimatedTime: "4-5 months",
    learningPath: "Mentoring Excellence Program"
  }
];

export const NextLevelJobProfile = ({ employeeId }: NextLevelJobProfileProps) => {
  const [selectedRole, setSelectedRole] = useState(mockNextLevelRoles[0]);
  const [criticalityFilter, setCriticalityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSkills = mockNextLevelSkills.filter(skill => {
    const matchesCriticality = criticalityFilter === "all" || skill.criticality === criticalityFilter;
    const matchesStatus = statusFilter === "all" || skill.skillStatus === statusFilter;
    
    return matchesCriticality && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Already Proficient": return "bg-green-100 text-green-700";
      case "Needs Upgrade": return "bg-yellow-100 text-yellow-700";
      case "Not Acquired": return "bg-red-100 text-red-700";
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
      {/* Career Progression Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Career Progression Roadmap
          </CardTitle>
          <CardDescription>
            Explore next-level roles and their skill requirements based on organizational hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                Current Position
              </div>
              <div className="font-semibold">Senior Software Engineer - Full Stack</div>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockNextLevelRoles.map((role) => (
                <div 
                  key={role.id}
                  className={`rounded-lg p-4 border cursor-pointer transition-colors ${
                    selectedRole.id === role.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{role.jobTitle}</div>
                    <div className="text-sm text-muted-foreground">{role.careerPath}</div>
                    <Badge variant="outline" className="text-xs">{role.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Role Details */}
      <Card>
        <CardHeader>
          <CardTitle>Target Role: {selectedRole.jobTitle}</CardTitle>
          <CardDescription>
            Skill requirements and development pathway for career progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Job Variant</div>
              <div className="font-semibold">{selectedRole.jobVariant}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Job Role</div>
              <div className="font-semibold">{selectedRole.jobRole}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Career Path</div>
              <div className="font-semibold">{selectedRole.careerPath}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Skills to Develop</div>
              <div className="font-semibold text-2xl">{mockNextLevelSkills.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
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
                <SelectItem value="Not Acquired">Not Acquired</SelectItem>
                <SelectItem value="Needs Upgrade">Needs Upgrade</SelectItem>
                <SelectItem value="Already Proficient">Already Proficient</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Next Level Skills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Development Requirements</CardTitle>
          <CardDescription>
            Skills needed for progression with current proficiency gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Required Level</TableHead>
                  <TableHead>Current Level</TableHead>
                  <TableHead>Progress Gap</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criticality</TableHead>
                  <TableHead>Est. Time</TableHead>
                  <TableHead>Learning Path</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.skillName}</TableCell>
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
                      <Badge className={getStatusColor(skill.skillStatus)}>
                        {skill.skillStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCriticalityColor(skill.criticality)}>
                        {skill.criticality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.estimatedTime}</Badge>
                    </TableCell>
                    <TableCell>
                      {skill.learningPath ? (
                        <Badge variant="secondary">{skill.learningPath}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {skill.learningPath && (
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Start Learning
                        </Button>
                      )}
                    </TableCell>
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