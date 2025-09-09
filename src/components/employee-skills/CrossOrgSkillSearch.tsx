import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Users, TrendingUp, Eye } from "lucide-react";

interface CrossOrgSkillSearchProps {
  employeeId?: string;
}

interface CrossOrgRole {
  id: string;
  jobTitle: string;
  jobVariant: string;
  jobRole: string;
  business: string;
  group: string;
  department: string;
  location: string;
  totalSkills: number;
  employeeCount: number;
  avgSalary: string;
  careerPathways: string[];
  keySkills: string[];
}

const mockCrossOrgRoles: CrossOrgRole[] = [
  {
    id: "1",
    jobTitle: "Product Manager - Digital Banking",
    jobVariant: "Product Manager",
    jobRole: "Product Manager",
    business: "Digital Banking",
    group: "Product",
    department: "Digital Innovation",
    location: "Mumbai",
    totalSkills: 25,
    employeeCount: 12,
    avgSalary: "₹18-25L",
    careerPathways: ["Engineering → Product", "Business Analysis → Product"],
    keySkills: ["Product Strategy", "Market Research", "Agile Methodology", "Data Analysis"]
  },
  {
    id: "2",
    jobTitle: "Data Scientist - Retail Analytics",
    jobVariant: "Data Scientist",
    jobRole: "Data Scientist",
    business: "Retail",
    group: "Analytics",
    department: "Consumer Insights",
    location: "Bengaluru",
    totalSkills: 32,
    employeeCount: 8,
    avgSalary: "₹15-22L",
    careerPathways: ["Software Engineering → Data Science", "Research → Data Science"],
    keySkills: ["Machine Learning", "Python", "SQL", "Statistical Analysis", "Business Intelligence"]
  },
  {
    id: "3",
    jobTitle: "UX Designer - Mobile Apps",
    jobVariant: "UX Designer",
    jobRole: "Designer",
    business: "Digital Services",
    group: "Design",
    department: "User Experience",
    location: "Hyderabad",
    totalSkills: 18,
    employeeCount: 15,
    avgSalary: "₹12-18L",
    careerPathways: ["Frontend Development → UX Design", "Graphic Design → UX Design"],
    keySkills: ["User Research", "Prototyping", "Design Systems", "Usability Testing"]
  },
  {
    id: "4",
    jobTitle: "DevOps Engineer - Cloud Infrastructure",
    jobVariant: "DevOps Engineer",
    jobRole: "Infrastructure Engineer",
    business: "Technology",
    group: "Infrastructure",
    department: "Cloud Operations",
    location: "Pune",
    totalSkills: 28,
    employeeCount: 20,
    avgSalary: "₹16-24L",
    careerPathways: ["System Admin → DevOps", "Software Engineering → DevOps"],
    keySkills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Infrastructure as Code"]
  },
  {
    id: "5",
    jobTitle: "Business Analyst - Financial Services",
    jobVariant: "Business Analyst",
    jobRole: "Business Analyst",
    business: "Financial Services",
    group: "Business",
    department: "Strategy & Analysis",
    location: "Delhi",
    totalSkills: 22,
    employeeCount: 18,
    avgSalary: "₹14-20L",
    careerPathways: ["Finance → Business Analysis", "Operations → Business Analysis"],
    keySkills: ["Business Process Mapping", "Requirements Analysis", "Stakeholder Management", "Financial Modeling"]
  }
];

export const CrossOrgSkillSearch = ({ employeeId }: CrossOrgSkillSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<CrossOrgRole | null>(null);

  const filteredRoles = mockCrossOrgRoles.filter(role => {
    const matchesSearch = 
      role.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.jobVariant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.keySkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBusiness = businessFilter === "all" || role.business === businessFilter;
    const matchesGroup = groupFilter === "all" || role.group === groupFilter;
    const matchesLocation = locationFilter === "all" || role.location === locationFilter;
    
    return matchesSearch && matchesBusiness && matchesGroup && matchesLocation;
  });

  // Get unique values for filters
  const businesses = [...new Set(mockCrossOrgRoles.map(role => role.business))];
  const groups = [...new Set(mockCrossOrgRoles.map(role => role.group))];
  const locations = [...new Set(mockCrossOrgRoles.map(role => role.location))];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cross-Organization Skill Profile Search
          </CardTitle>
          <CardDescription>
            Explore skill requirements across different departments, groups, and business verticals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, variant, or key skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={businessFilter} onValueChange={setBusinessFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Business Vertical" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  {businesses.map(business => (
                    <SelectItem key={business} value={business}>{business}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Available Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Roles matching your search criteria across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <div 
                key={role.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedRole(role)}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{role.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">{role.business} • {role.group}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {role.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {role.keySkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {role.keySkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.keySkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {role.employeeCount} employees
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {role.avgSalary}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    View Skill Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Role Details */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedRole.jobTitle} - Skill Profile</CardTitle>
            <CardDescription>
              Detailed skill requirements and career pathways for this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Role Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Business</div>
                  <div className="font-semibold">{selectedRole.business}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-semibold">{selectedRole.department}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Total Skills</div>
                  <div className="font-semibold text-2xl">{selectedRole.totalSkills}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Salary Range</div>
                  <div className="font-semibold">{selectedRole.avgSalary}</div>
                </div>
              </div>

              {/* Key Skills */}
              <div>
                <h4 className="font-semibold mb-3">Core Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.keySkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Career Pathways */}
              <div>
                <h4 className="font-semibold mb-3">Common Career Pathways</h4>
                <div className="space-y-2">
                  {selectedRole.careerPathways.map((pathway, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {pathway}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button>View Complete Skill Profile</Button>
                <Button variant="outline">Compare with My Skills</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};