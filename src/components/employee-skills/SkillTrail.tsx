import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { History, Award, BookOpen, CheckCircle, TrendingUp, Clock } from "lucide-react";

interface SkillTrailProps {
  employeeId?: string;
}

interface SkillHistory {
  id: string;
  skillName: string;
  cluster: string;
  group: string;
  acquisitionDate: string;
  proficiencyHistory: ProficiencyEvent[];
  certifications: Certification[];
  trainings: Training[];
  assessments: Assessment[];
  currentProficiency: string;
  currentScore: number;
}

interface ProficiencyEvent {
  date: string;
  fromLevel: string;
  toLevel: string;
  fromScore: number;
  toScore: number;
  reason: string;
  evidence: string;
}

interface Certification {
  id: string;
  name: string;
  provider: string;
  dateEarned: string;
  expiryDate?: string;
  credentialId: string;
}

interface Training {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  duration: string;
  type: 'Internal' | 'External' | 'Self-paced';
}

interface Assessment {
  id: string;
  type: 'Formal Assessment' | 'Project Review' | 'Peer Review' | 'Self Assessment';
  date: string;
  score: number;
  assessor: string;
  notes: string;
}

const mockSkillHistory: SkillHistory[] = [
  {
    id: "1",
    skillName: "React.js Development",
    cluster: "Frontend Development",
    group: "Web Technologies",
    acquisitionDate: "2022-03-15",
    currentProficiency: "Advanced",
    currentScore: 85,
    proficiencyHistory: [
      {
        date: "2022-03-15",
        fromLevel: "Not Acquired",
        toLevel: "Beginner",
        fromScore: 0,
        toScore: 40,
        reason: "Started React.js training course",
        evidence: "Completed React Fundamentals Course"
      },
      {
        date: "2022-06-20",
        fromLevel: "Beginner",
        toLevel: "Intermediate",
        fromScore: 40,
        toScore: 65,
        reason: "Successfully completed first React project",
        evidence: "Project: Customer Dashboard v1.0"
      },
      {
        date: "2023-02-10",
        fromLevel: "Intermediate",
        toLevel: "Advanced",
        fromScore: 65,
        toScore: 80,
        reason: "Led React architecture for major project",
        evidence: "Project: E-commerce Platform Redesign"
      },
      {
        date: "2024-01-10",
        fromLevel: "Advanced",
        toLevel: "Advanced",
        fromScore: 80,
        toScore: 85,
        reason: "Performance optimization and advanced patterns",
        evidence: "React Performance Workshop + Project Optimization"
      }
    ],
    certifications: [
      {
        id: "cert1",
        name: "React Developer Certification",
        provider: "Meta",
        dateEarned: "2022-08-15",
        credentialId: "META-REACT-2022-001"
      }
    ],
    trainings: [
      {
        id: "train1",
        name: "React Fundamentals",
        provider: "Internal Training",
        completionDate: "2022-04-10",
        duration: "40 hours",
        type: "Internal"
      },
      {
        id: "train2",
        name: "Advanced React Patterns",
        provider: "Pluralsight",
        completionDate: "2023-01-15",
        duration: "20 hours",
        type: "External"
      }
    ],
    assessments: [
      {
        id: "assess1",
        type: "Formal Assessment",
        date: "2024-01-10",
        score: 85,
        assessor: "Senior Developer - Priya Sharma",
        notes: "Strong understanding of React patterns, good performance optimization skills"
      }
    ]
  },
  {
    id: "2",
    skillName: "Node.js Backend Development",
    cluster: "Backend Development",
    group: "Web Technologies",
    acquisitionDate: "2022-08-01",
    currentProficiency: "Intermediate",
    currentScore: 70,
    proficiencyHistory: [
      {
        date: "2022-08-01",
        fromLevel: "Not Acquired",
        toLevel: "Beginner",
        fromScore: 0,
        toScore: 35,
        reason: "Started Node.js basics course",
        evidence: "Node.js Fundamentals Course"
      },
      {
        date: "2022-12-15",
        fromLevel: "Beginner",
        toLevel: "Intermediate",
        fromScore: 35,
        toScore: 65,
        reason: "Built first REST API",
        evidence: "API Project: User Management System"
      },
      {
        date: "2023-08-20",
        fromLevel: "Intermediate",
        toLevel: "Intermediate",
        fromScore: 65,
        toScore: 70,
        reason: "Improved error handling and security",
        evidence: "Security Best Practices Implementation"
      }
    ],
    certifications: [],
    trainings: [
      {
        id: "train3",
        name: "Node.js Complete Guide",
        provider: "Udemy",
        completionDate: "2022-09-30",
        duration: "60 hours",
        type: "External"
      }
    ],
    assessments: [
      {
        id: "assess2",
        type: "Project Review",
        date: "2023-08-20",
        score: 70,
        assessor: "Tech Lead - Amit Kumar",
        notes: "Good API design, needs improvement in advanced Node.js concepts"
      }
    ]
  }
];

export const SkillTrail = ({ employeeId }: SkillTrailProps) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillHistory>(mockSkillHistory[0]);
  const [viewMode, setViewMode] = useState<"timeline" | "detailed">("timeline");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Skill Acquisition & Proficiency History
          </CardTitle>
          <CardDescription>
            Timeline view of skill development, certifications, training, and assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select 
              value={selectedSkill.id} 
              onValueChange={(value) => {
                const skill = mockSkillHistory.find(s => s.id === value);
                if (skill) setSelectedSkill(skill);
              }}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {mockSkillHistory.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={viewMode} onValueChange={(value: "timeline" | "detailed") => setViewMode(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline View</SelectItem>
                <SelectItem value="detailed">Detailed View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skill Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedSkill.skillName}</CardTitle>
          <CardDescription>
            {selectedSkill.cluster} • {selectedSkill.group}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Acquired</div>
              <div className="font-semibold">{formatDate(selectedSkill.acquisitionDate)}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Current Level</div>
              <div className="font-semibold">{selectedSkill.currentProficiency}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Current Score</div>
              <div className={`font-semibold text-2xl ${getScoreColor(selectedSkill.currentScore)}`}>
                {selectedSkill.currentScore}%
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Certifications</div>
              <div className="font-semibold text-2xl">{selectedSkill.certifications.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "timeline" ? (
        /* Timeline View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Proficiency Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedSkill.proficiencyHistory.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < selectedSkill.proficiencyHistory.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{event.fromLevel}</Badge>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="default">{event.toLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.reason}</p>
                        <p className="text-sm font-medium">{event.evidence}</p>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            Score: <span className={getScoreColor(event.fromScore)}>{event.fromScore}%</span>
                            {" → "}
                            <span className={getScoreColor(event.toScore)}>{event.toScore}%</span>
                          </div>
                          <Progress 
                            value={(event.toScore / 100) * 100} 
                            className="w-24 h-2"
                          />
                        </div>
                      </div>
                      <Badge variant="secondary">{formatDate(event.date)}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Detailed View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSkill.certifications.length > 0 ? (
                <div className="space-y-4">
                  {selectedSkill.certifications.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-sm text-muted-foreground">{cert.provider}</div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">{formatDate(cert.dateEarned)}</Badge>
                        <Badge variant="secondary">{cert.credentialId}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No certifications earned yet</p>
              )}
            </CardContent>
          </Card>

          {/* Training */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedSkill.trainings.map((training) => (
                  <div key={training.id} className="border rounded-lg p-4">
                    <div className="font-semibold">{training.name}</div>
                    <div className="text-sm text-muted-foreground">{training.provider}</div>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{formatDate(training.completionDate)}</Badge>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{training.duration}</Badge>
                        <Badge variant={training.type === 'Internal' ? 'default' : 'outline'}>
                          {training.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Assessment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedSkill.assessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="font-semibold">{assessment.type}</div>
                        <div className="text-sm text-muted-foreground">By: {assessment.assessor}</div>
                        <div className="text-sm">{assessment.notes}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(assessment.score)}`}>
                          {assessment.score}%
                        </div>
                        <Badge variant="outline">{formatDate(assessment.date)}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};