import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Calendar, TrendingUp, Users, ArrowRight, MapPin } from "lucide-react";

interface JobPositionTrailProps {
  employeeId?: string;
}

interface JobPositionHistory {
  id: string;
  jobTitle: string;
  jobVariant: string;
  jobRole: string;
  business: string;
  group: string;
  department: string;
  startDate: string;
  endDate?: string;
  duration: string;
  location: string;
  reportingManager: string;
  skillsAtJoining: SkillSnapshot[];
  skillsAtExit?: SkillSnapshot[];
  skillsGained: string[];
  skillsRetained: string[];
  skillsDropped: string[];
  keyAchievements: string[];
  transitionReason?: string;
}

interface SkillSnapshot {
  skillName: string;
  proficiencyLevel: string;
  proficiencyScore: number;
  cluster: string;
  group: string;
}

const mockJobHistory: JobPositionHistory[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer - Full Stack",
    jobVariant: "Senior Software Engineer",
    jobRole: "Software Engineer",
    business: "Technology",
    group: "Engineering",
    department: "Product Development",
    startDate: "2023-06-01",
    duration: "8 months (Current)",
    location: "Bengaluru",
    reportingManager: "Priya Sharma - Engineering Manager",
    skillsAtJoining: [
      { skillName: "React.js", proficiencyLevel: "Intermediate", proficiencyScore: 65, cluster: "Frontend", group: "Web Technologies" },
      { skillName: "Node.js", proficiencyLevel: "Beginner", proficiencyScore: 35, cluster: "Backend", group: "Web Technologies" },
      { skillName: "JavaScript", proficiencyLevel: "Advanced", proficiencyScore: 85, cluster: "Programming", group: "Web Technologies" }
    ],
    skillsGained: ["GraphQL", "Docker", "AWS Lambda", "TypeScript Advanced Patterns"],
    skillsRetained: ["React.js", "JavaScript", "Node.js", "Git", "Agile Methodology"],
    skillsDropped: [],
    keyAchievements: [
      "Led migration of legacy system to React/Node.js stack",
      "Improved application performance by 40%",
      "Mentored 2 junior developers"
    ],
  },
  {
    id: "2",
    jobTitle: "Software Engineer - Frontend",
    jobVariant: "Software Engineer",
    jobRole: "Software Engineer", 
    business: "Technology",
    group: "Engineering",
    department: "Web Development",
    startDate: "2022-03-15",
    endDate: "2023-05-31",
    duration: "1 year 3 months",
    location: "Bengaluru",
    reportingManager: "Amit Kumar - Senior Developer",
    skillsAtJoining: [
      { skillName: "HTML/CSS", proficiencyLevel: "Advanced", proficiencyScore: 80, cluster: "Frontend", group: "Web Technologies" },
      { skillName: "JavaScript", proficiencyLevel: "Intermediate", proficiencyScore: 60, cluster: "Programming", group: "Web Technologies" },
      { skillName: "jQuery", proficiencyLevel: "Intermediate", proficiencyScore: 65, cluster: "Frontend", group: "Web Technologies" }
    ],
    skillsAtExit: [
      { skillName: "React.js", proficiencyLevel: "Intermediate", proficiencyScore: 65, cluster: "Frontend", group: "Web Technologies" },
      { skillName: "JavaScript", proficiencyLevel: "Advanced", proficiencyScore: 85, cluster: "Programming", group: "Web Technologies" },
      { skillName: "Node.js", proficiencyLevel: "Beginner", proficiencyScore: 35, cluster: "Backend", group: "Web Technologies" }
    ],
    skillsGained: ["React.js", "Redux", "REST APIs", "Node.js Basics", "MongoDB"],
    skillsRetained: ["HTML/CSS", "JavaScript", "Git", "Responsive Design"],
    skillsDropped: ["jQuery", "Bootstrap 3"],
    keyAchievements: [
      "Successfully transitioned from jQuery to React.js",
      "Built 3 major frontend modules",
      "Reduced page load time by 30%"
    ],
    transitionReason: "Promotion to Senior role with full-stack responsibilities"
  },
  {
    id: "3",
    jobTitle: "Junior Frontend Developer",
    jobVariant: "Junior Developer",
    jobRole: "Developer",
    business: "Technology",
    group: "Engineering",
    department: "Web Development",
    startDate: "2021-07-01",
    endDate: "2022-03-14",
    duration: "8 months",
    location: "Pune",
    reportingManager: "Sneha Reddy - Team Lead",
    skillsAtJoining: [
      { skillName: "HTML/CSS", proficiencyLevel: "Intermediate", proficiencyScore: 55, cluster: "Frontend", group: "Web Technologies" },
      { skillName: "JavaScript", proficiencyLevel: "Beginner", proficiencyScore: 30, cluster: "Programming", group: "Web Technologies" }
    ],
    skillsAtExit: [
      { skillName: "HTML/CSS", proficiencyLevel: "Advanced", proficiencyScore: 80, cluster: "Frontend", group: "Web Technologies" },
      { skillName: "JavaScript", proficiencyLevel: "Intermediate", proficiencyScore: 60, cluster: "Programming", group: "Web Technologies" },
      { skillName: "jQuery", proficiencyLevel: "Intermediate", proficiencyScore: 65, cluster: "Frontend", group: "Web Technologies" }
    ],
    skillsGained: ["jQuery", "Bootstrap", "SASS", "Git", "Responsive Design", "Browser DevTools"],
    skillsRetained: ["HTML/CSS", "JavaScript"],
    skillsDropped: [],
    keyAchievements: [
      "Completed frontend developer training program",
      "Built first production website",
      "Learned version control and deployment processes"
    ],
    transitionReason: "Internal transfer to focus on modern frontend frameworks"
  }
];

export const JobPositionTrail = ({ employeeId }: JobPositionTrailProps) => {
  const [selectedPosition, setSelectedPosition] = useState<JobPositionHistory | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "comparison">("timeline");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getSkillChangeColor = (type: 'gained' | 'retained' | 'dropped') => {
    switch (type) {
      case 'gained': return 'bg-green-100 text-green-700';
      case 'retained': return 'bg-blue-100 text-blue-700';
      case 'dropped': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Position & Skill Evolution Trail
          </CardTitle>
          <CardDescription>
            Timeline of job positions with corresponding skill profile changes and career progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              onClick={() => setViewMode("timeline")}
            >
              Timeline View
            </Button>
            <Button
              variant={viewMode === "comparison" ? "default" : "outline"}
              onClick={() => setViewMode("comparison")}
            >
              Skill Comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === "timeline" ? (
        /* Timeline View */
        <div className="space-y-6">
          {mockJobHistory.map((position, index) => (
            <Card key={position.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${position.endDate ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
                      {position.jobTitle}
                    </CardTitle>
                    <CardDescription>
                      {position.business} • {position.department} • {position.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={position.endDate ? "secondary" : "default"}>
                      {position.duration}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDate(position.startDate)} - {position.endDate ? formatDate(position.endDate) : 'Present'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Reporting Manager</div>
                      <div className="font-medium">{position.reportingManager}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Job Variant</div>
                      <div className="font-medium">{position.jobVariant}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Job Role</div>
                      <div className="font-medium">{position.jobRole}</div>
                    </div>
                  </div>

                  {/* Skills Evolution */}
                  <div>
                    <h4 className="font-semibold mb-3">Skills Evolution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-600 mb-2">Skills Gained ({position.skillsGained.length})</div>
                        <div className="space-y-1">
                          {position.skillsGained.slice(0, 3).map((skill) => (
                            <Badge key={skill} className="mr-1 mb-1 bg-green-100 text-green-700">
                              {skill}
                            </Badge>
                          ))}
                          {position.skillsGained.length > 3 && (
                            <Badge variant="outline" className="mr-1 mb-1">
                              +{position.skillsGained.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-blue-600 mb-2">Skills Retained ({position.skillsRetained.length})</div>
                        <div className="space-y-1">
                          {position.skillsRetained.slice(0, 3).map((skill) => (
                            <Badge key={skill} className="mr-1 mb-1 bg-blue-100 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                          {position.skillsRetained.length > 3 && (
                            <Badge variant="outline" className="mr-1 mb-1">
                              +{position.skillsRetained.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {position.skillsDropped.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-red-600 mb-2">Skills Dropped ({position.skillsDropped.length})</div>
                          <div className="space-y-1">
                            {position.skillsDropped.map((skill) => (
                              <Badge key={skill} className="mr-1 mb-1 bg-red-100 text-red-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Achievements */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {position.keyAchievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {position.transitionReason && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm font-medium mb-1">Transition Reason</div>
                      <div className="text-sm text-muted-foreground">{position.transitionReason}</div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPosition(position)}
                  >
                    View Detailed Skill Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Skill Comparison View */
        <Card>
          <CardHeader>
            <CardTitle>Skill Proficiency Comparison Across Positions</CardTitle>
            <CardDescription>
              Compare skill development across different job positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Cluster</TableHead>
                    {mockJobHistory.map((position) => (
                      <TableHead key={position.id} className="text-center min-w-32">
                        {position.jobTitle.split(' - ')[0]}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(position.startDate)}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Get all unique skills across positions */}
                  {Array.from(new Set([
                    ...mockJobHistory.flatMap(pos => [...pos.skillsAtJoining.map(s => s.skillName)]),
                  ])).map((skillName) => (
                    <TableRow key={skillName}>
                      <TableCell className="font-medium">{skillName}</TableCell>
                      <TableCell>
                        {mockJobHistory
                          .find(pos => pos.skillsAtJoining.some(s => s.skillName === skillName))
                          ?.skillsAtJoining.find(s => s.skillName === skillName)?.cluster || '-'}
                      </TableCell>
                      {mockJobHistory.map((position) => {
                        const skill = position.skillsAtJoining.find(s => s.skillName === skillName) ||
                                    (position.skillsAtExit && position.skillsAtExit.find(s => s.skillName === skillName));
                        
                        return (
                          <TableCell key={position.id} className="text-center">
                            {skill ? (
                              <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">
                                  {skill.proficiencyLevel}
                                </Badge>
                                <Progress value={skill.proficiencyScore} className="h-1" />
                                <div className="text-xs text-muted-foreground">
                                  {skill.proficiencyScore}%
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Position Modal */}
      {selectedPosition && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Skill Profile: {selectedPosition.jobTitle}</CardTitle>
            <CardDescription>
              Complete skill snapshot at joining and exit (if applicable)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills at Joining */}
              <div>
                <h4 className="font-semibold mb-3">Skills at Joining</h4>
                <div className="space-y-3">
                  {selectedPosition.skillsAtJoining.map((skill, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{skill.skillName}</div>
                        <Badge variant="outline">{skill.proficiencyLevel}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={skill.proficiencyScore} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground">{skill.proficiencyScore}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {skill.cluster} • {skill.group}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills at Exit */}
              {selectedPosition.skillsAtExit && (
                <div>
                  <h4 className="font-semibold mb-3">Skills at Exit</h4>
                  <div className="space-y-3">
                    {selectedPosition.skillsAtExit.map((skill, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{skill.skillName}</div>
                          <Badge variant="outline">{skill.proficiencyLevel}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={skill.proficiencyScore} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground">{skill.proficiencyScore}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {skill.cluster} • {skill.group}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setSelectedPosition(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};