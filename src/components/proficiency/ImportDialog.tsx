
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onOpenChange }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleImport = async (file: File) => {
    setImportErrors([]);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onOpenChange(false);
          
          // Mock validation results
          const mockErrors = Math.random() > 0.7 ? [
            "Row 3: Duplicate proficiency description under same skill",
            "Row 5: Invalid proficiency level"
          ] : [];
          
          if (mockErrors.length > 0) {
            setImportErrors(mockErrors);
            toast.error("Import failed. Please check the errors and try again.");
          } else {
            toast.success("Proficiencies imported successfully.");
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    const csvContent = "Skill,Proficiency Description,Proficiency Level,Cluster,Group\nJavaScript,Basic syntax and concepts,Beginner,Frontend,Programming\nReact,Component development,Intermediate,Frontend,Framework";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill_proficiencies_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Proficiencies</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with skill proficiency mappings
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Import Rules:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Add new entries</li>
              <li>• Update existing ones</li>
              <li>• No deletions allowed via import</li>
            </ul>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your Excel file here, or click to browse
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              id="excel-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
            />
            <Button 
              onClick={() => document.getElementById('excel-upload')?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Choose File
            </Button>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {importErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Import Errors:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {importErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
