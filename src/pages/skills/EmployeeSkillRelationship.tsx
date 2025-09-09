
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  no: number;
  employeeName: string;
  employeeId: string;
  jobPosition: string;
  jobVariant: string;
  jobRole: string;
  business: string;
  group: string;
  department: string;
  totalSkills: number;
  lastUpdated: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    no: 1,
    employeeName: "Rajesh Kumar",
    employeeId: "EMP001",
    jobPosition: "Senior Software Engineer - Full Stack",
    jobVariant: "Senior Software Engineer",
    jobRole: "Software Engineer",
    business: "Technology",
    group: "Engineering",
    department: "Product Development",
    totalSkills: 28,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    no: 2,
    employeeName: "Priya Sharma",
    employeeId: "EMP002",
    jobPosition: "Product Manager - Digital Services",
    jobVariant: "Product Manager",
    jobRole: "Product Manager",
    business: "Digital Services",
    group: "Product",
    department: "Digital Innovation",
    totalSkills: 22,
    lastUpdated: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    no: 3,
    employeeName: "Amit Patel",
    employeeId: "EMP003",
    jobPosition: "Data Scientist - ML Specialist",
    jobVariant: "Data Scientist",
    jobRole: "Data Scientist",
    business: "Analytics",
    group: "Data Science",
    department: "AI & ML",
    totalSkills: 35,
    lastUpdated: "2024-01-13T16:45:00Z",
  },
  {
    id: "4",
    no: 4,
    employeeName: "Sneha Reddy",
    employeeId: "EMP004",
    jobPosition: "UX Designer - Mobile",
    jobVariant: "UX Designer",
    jobRole: "Designer",
    business: "Design",
    group: "User Experience",
    department: "Design Studio",
    totalSkills: 19,
    lastUpdated: "2024-01-12T11:15:00Z",
  },
  {
    id: "5",
    no: 5,
    employeeName: "Vikram Singh",
    employeeId: "EMP005",
    jobPosition: "DevOps Engineer - Cloud Infrastructure",
    jobVariant: "DevOps Engineer",
    jobRole: "Infrastructure Engineer",
    business: "Technology",
    group: "Infrastructure",
    department: "Cloud Operations",
    totalSkills: 31,
    lastUpdated: "2024-01-11T09:00:00Z",
  },
];

const EmployeeSkillRelationship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort employees
  const filteredEmployees = mockEmployees
    .filter(employee => {
      const matchesSearch = 
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobPosition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBusiness = businessFilter === "all" || employee.business === businessFilter;
      const matchesGroup = groupFilter === "all" || employee.group === groupFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      return matchesSearch && matchesBusiness && matchesGroup && matchesDepartment;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.employeeName;
          bValue = b.employeeName;
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        default:
          aValue = a[sortBy as keyof Employee];
          bValue = b[sortBy as keyof Employee];
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleViewProfile = (employeeId: string) => {
    navigate(`/skills/employee-profile/${employeeId}`);
  };

  // Get unique values for filters
  const businesses = [...new Set(mockEmployees.map(emp => emp.business))];
  const groups = [...new Set(mockEmployees.map(emp => emp.group))];
  const departments = [...new Set(mockEmployees.map(emp => emp.department))];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Employee Skill Profiles</h1>
              <p className="text-muted-foreground">View and manage employee skill profiles and development paths</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employee Skills Management</CardTitle>
                <CardDescription>
                  Access comprehensive skill profiles for all employees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees, ID, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={businessFilter} onValueChange={setBusinessFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Business" />
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
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department} value={department}>{department}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Controls */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className={sortBy === "name" ? "bg-muted" : ""}
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("lastUpdated")}
                    className={sortBy === "lastUpdated" ? "bg-muted" : ""}
                  >
                    Last Updated {sortBy === "lastUpdated" && (sortOrder === "asc" ? "↑" : "↓")}
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Job Position</TableHead>
                        <TableHead>Job Variant</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Total Skills</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.no}</TableCell>
                          <TableCell className="font-medium">{employee.employeeName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{employee.employeeId}</Badge>
                          </TableCell>
                          <TableCell>{employee.jobPosition}</TableCell>
                          <TableCell>{employee.jobVariant}</TableCell>
                          <TableCell>{employee.jobRole}</TableCell>
                          <TableCell>{employee.business}</TableCell>
                          <TableCell>{employee.group}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{employee.totalSkills}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(employee.lastUpdated)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewProfile(employee.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              onClick={() => setCurrentPage(i + 1)}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeSkillRelationship;
