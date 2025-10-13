import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MappingType = 'job-role' | 'job-variant' | 'job-position';

export const BulkCSVUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mappingType, setMappingType] = useState<MappingType>('job-role');
  const [importProgress, setImportProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    let csvContent = '';
    
    switch (mappingType) {
      case 'job-role':
        csvContent = "job_role_name,skill_name,proficiency_level,criticality_level\nSoftware Engineer,React,Advanced,High\nSoftware Engineer,Node.js,Intermediate,Medium";
        break;
      case 'job-variant':
        csvContent = "job_variant_name,job_role_name,skill_name,proficiency_level,criticality_level\nSenior Frontend Developer - React Specialist,Senior Frontend Developer,React,Expert,High\nSenior Frontend Developer - React Specialist,Senior Frontend Developer,TypeScript,Advanced,High";
        break;
      case 'job-position':
        csvContent = "job_position_name,job_variant_name,skill_name,proficiency_level,criticality_level,type\nSenior Frontend Developer - Team Lead,Senior Frontend Developer - React Specialist,Team Leadership,Advanced,High,Position specific";
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mappingType}-skills-template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `Sample CSV template for ${mappingType} mapping downloaded successfully.`
    });
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
    setImportProgress(0);

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(i);
    }

    toast({
      title: "Import Successful",
      description: `Successfully imported skills for ${mappingType} mapping.`
    });

    setIsUploading(false);
    setImportProgress(0);
    setIsOpen(false);
    setMappingType('job-role');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Bulk CSV Upload</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk CSV Upload</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import skill mappings for Job Roles, Job Variants, or Job Positions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapping-type">Mapping Type</Label>
            <Select 
              value={mappingType} 
              onValueChange={(value) => setMappingType(value as MappingType)}
              disabled={isUploading}
            >
              <SelectTrigger id="mapping-type">
                <SelectValue placeholder="Select mapping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-role">Job Role Skills</SelectItem>
                <SelectItem value="job-variant">Job Variant Skills</SelectItem>
                <SelectItem value="job-position">Job Position Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={downloadTemplate} 
            variant="outline" 
            className="w-full"
            disabled={isUploading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sample CSV
          </Button>

          <div className="space-y-2">
            <Label htmlFor="csv-upload">Upload CSV File</Label>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
