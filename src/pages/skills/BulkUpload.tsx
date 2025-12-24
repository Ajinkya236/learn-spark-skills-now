import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BackButton } from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UploadType = 
  | 'clusters' 
  | 'skill-groups' 
  | 'skills' 
  | 'proficiencies' 
  | 'job-role-mapping' 
  | 'job-variant-mapping' 
  | 'related-skills';

interface UploadResult {
  row: number;
  data: Record<string, string>;
  status: 'success' | 'error' | 'updated';
  message: string;
}

const uploadTypeConfig: Record<UploadType, { 
  label: string; 
  description: string;
  columns: string[];
  sampleData: string[][];
}> = {
  'clusters': {
    label: 'Skill Clusters',
    description: 'Upload skill clusters (categories) for taxonomy',
    columns: ['cluster_name', 'description', 'status'],
    sampleData: [
      ['Technical Skills', 'Technology and engineering skills', 'Active'],
      ['Soft Skills', 'Interpersonal and communication skills', 'Active'],
    ]
  },
  'skill-groups': {
    label: 'Skill Groups',
    description: 'Upload skill groups within clusters',
    columns: ['group_name', 'cluster_name', 'description', 'status'],
    sampleData: [
      ['Frontend Development', 'Technical Skills', 'Web UI development skills', 'Active'],
      ['Backend Development', 'Technical Skills', 'Server-side development skills', 'Active'],
    ]
  },
  'skills': {
    label: 'Skills',
    description: 'Upload individual skills within groups',
    columns: ['skill_name', 'group_name', 'cluster_name', 'description', 'status'],
    sampleData: [
      ['React', 'Frontend Development', 'Technical Skills', 'React.js library for building UIs', 'Active'],
      ['Node.js', 'Backend Development', 'Technical Skills', 'JavaScript runtime for server-side', 'Active'],
    ]
  },
  'proficiencies': {
    label: 'Proficiency Definitions',
    description: 'Upload proficiency level definitions for skills',
    columns: ['skill_name', 'proficiency_level', 'definition'],
    sampleData: [
      ['React', 'Beginner', 'Can build simple components with guidance'],
      ['React', 'Intermediate', 'Can independently build complex components and manage state'],
      ['React', 'Advanced', 'Can architect large applications and mentor others'],
    ]
  },
  'job-role-mapping': {
    label: 'Job Role → Skill Mapping',
    description: 'Map skills and proficiency levels to job roles',
    columns: ['job_role_name', 'skill_name', 'proficiency_level', 'criticality'],
    sampleData: [
      ['Senior Frontend Developer', 'React', 'Advanced', 'High'],
      ['Senior Frontend Developer', 'TypeScript', 'Intermediate', 'Medium'],
    ]
  },
  'job-variant-mapping': {
    label: 'Job Variant → Skill Mapping',
    description: 'Map skills and proficiency levels to job variants',
    columns: ['job_variant_name', 'job_role_name', 'skill_name', 'proficiency_level', 'criticality'],
    sampleData: [
      ['React Specialist', 'Senior Frontend Developer', 'React', 'Expert', 'High'],
      ['React Specialist', 'Senior Frontend Developer', 'Redux', 'Advanced', 'High'],
    ]
  },
  'related-skills': {
    label: 'Related Skills Mapping',
    description: 'Define relationships between skills for recommendations',
    columns: ['skill_name', 'related_skill_1', 'related_skill_2', 'related_skill_3', 'related_skill_4', 'related_skill_5'],
    sampleData: [
      ['React', 'TypeScript', 'Redux', 'Next.js', 'Jest', 'CSS'],
      ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
    ]
  }
};

const BulkUpload = () => {
  const [activeTab, setActiveTab] = useState<UploadType>('clusters');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = (type: UploadType) => {
    const config = uploadTypeConfig[type];
    const header = config.columns.join(',');
    const rows = config.sampleData.map(row => row.join(',')).join('\n');
    const csvContent = `${header}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `Sample CSV template for ${config.label} downloaded successfully.`
    });
  };

  const parseCSV = (content: string): string[][] => {
    const lines = content.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const validateRow = (row: string[], columns: string[], rowIndex: number): { valid: boolean; error?: string } => {
    // Check required fields
    if (row.length < columns.length) {
      return { valid: false, error: `Missing columns. Expected ${columns.length}, got ${row.length}` };
    }

    // Check for empty required fields (first column is always required)
    if (!row[0] || row[0].trim() === '') {
      return { valid: false, error: `${columns[0]} is required` };
    }

    // Type-specific validations
    if (activeTab === 'proficiencies') {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const level = row[1]?.trim();
      if (level && !validLevels.includes(level)) {
        return { valid: false, error: `Invalid proficiency level: "${level}". Must be one of: ${validLevels.join(', ')}` };
      }
    }

    if (activeTab === 'job-role-mapping' || activeTab === 'job-variant-mapping') {
      const validCriticality = ['High', 'Medium', 'Low'];
      const criticality = row[row.length - 1]?.trim();
      if (criticality && !validCriticality.includes(criticality)) {
        return { valid: false, error: `Invalid criticality: "${criticality}". Must be one of: ${validCriticality.join(', ')}` };
      }
    }

    return { valid: true };
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    setShowResults(false);

    const content = await file.text();
    const rows = parseCSV(content);
    const config = uploadTypeConfig[activeTab];
    
    // Skip header row
    const dataRows = rows.slice(1);
    const results: UploadResult[] = [];

    // Simulate processing with progress
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const progress = Math.round(((i + 1) / dataRows.length) * 100);
      setUploadProgress(progress);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Build data object from row
      const data: Record<string, string> = {};
      config.columns.forEach((col, idx) => {
        data[col] = row[idx] || '';
      });

      // Validate row
      const validation = validateRow(row, config.columns, i + 2);

      if (!validation.valid) {
        results.push({
          row: i + 2,
          data,
          status: 'error',
          message: validation.error || 'Validation failed'
        });
      } else {
        // Simulate checking for existing records (30% chance of update vs new)
        const isUpdate = Math.random() < 0.3;
        results.push({
          row: i + 2,
          data,
          status: isUpdate ? 'updated' : 'success',
          message: isUpdate ? 'Record updated' : 'New record created'
        });
      }
    }

    setUploadResults(results);
    setShowResults(true);
    setIsUploading(false);

    const successCount = results.filter(r => r.status === 'success').length;
    const updateCount = results.filter(r => r.status === 'updated').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    toast({
      title: "Import Complete",
      description: `${successCount} created, ${updateCount} updated, ${errorCount} failed.`,
      variant: errorCount > 0 ? "destructive" : "default"
    });
  };

  const resetUpload = () => {
    setUploadResults([]);
    setShowResults(false);
    setUploadProgress(0);
  };

  const getStatusIcon = (status: UploadResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: UploadResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Created</Badge>;
      case 'updated':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Updated</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const config = uploadTypeConfig[activeTab];
  const successCount = uploadResults.filter(r => r.status === 'success').length;
  const updateCount = uploadResults.filter(r => r.status === 'updated').length;
  const errorCount = uploadResults.filter(r => r.status === 'error').length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-6">
            <div className="mb-6">
              <BackButton />
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Bulk Upload</h1>
              <p className="text-muted-foreground mt-1">
                Import and update skills system data at scale using CSV files
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  CSV Import
                </CardTitle>
                <CardDescription>
                  Select the type of data you want to import and upload a CSV file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as UploadType); resetUpload(); }}>
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
                    <TabsTrigger value="clusters" className="text-xs">Clusters</TabsTrigger>
                    <TabsTrigger value="skill-groups" className="text-xs">Groups</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                    <TabsTrigger value="proficiencies" className="text-xs">Proficiencies</TabsTrigger>
                    <TabsTrigger value="job-role-mapping" className="text-xs">Job Roles</TabsTrigger>
                    <TabsTrigger value="job-variant-mapping" className="text-xs">Job Variants</TabsTrigger>
                    <TabsTrigger value="related-skills" className="text-xs">Related Skills</TabsTrigger>
                  </TabsList>

                  {Object.keys(uploadTypeConfig).map((type) => (
                    <TabsContent key={type} value={type} className="space-y-6">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">{uploadTypeConfig[type as UploadType].label}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {uploadTypeConfig[type as UploadType].description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-sm text-muted-foreground">Required columns:</span>
                          {uploadTypeConfig[type as UploadType].columns.map((col) => (
                            <Badge key={col} variant="secondary" className="font-mono text-xs">
                              {col}
                            </Badge>
                          ))}
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadTemplate(type as UploadType)}
                          disabled={isUploading}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Sample CSV
                        </Button>
                      </div>
                    </TabsContent>
                  ))}

                  {!showResults ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Upload CSV File</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop or click to select a CSV file
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        className="max-w-xs mx-auto"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        disabled={isUploading}
                      />

                      {isUploading && (
                        <div className="mt-6 max-w-md mx-auto">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Processing...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Results Summary */}
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="font-medium">{successCount} Created</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">{updateCount} Updated</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-destructive" />
                            <span className="font-medium">{errorCount} Failed</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetUpload}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Upload Another
                        </Button>
                      </div>

                      {/* Results Table */}
                      <ScrollArea className="h-[400px] border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Row</TableHead>
                              <TableHead className="w-24">Status</TableHead>
                              {config.columns.slice(0, 3).map((col) => (
                                <TableHead key={col}>{col.replace(/_/g, ' ')}</TableHead>
                              ))}
                              <TableHead>Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {uploadResults.map((result, idx) => (
                              <TableRow key={idx} className={result.status === 'error' ? 'bg-destructive/5' : ''}>
                                <TableCell className="font-mono">{result.row}</TableCell>
                                <TableCell>{getStatusBadge(result.status)}</TableCell>
                                {config.columns.slice(0, 3).map((col) => (
                                  <TableCell key={col} className="max-w-[150px] truncate">
                                    {result.data[col] || '-'}
                                  </TableCell>
                                ))}
                                <TableCell className={result.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}>
                                  {result.message}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BulkUpload;
