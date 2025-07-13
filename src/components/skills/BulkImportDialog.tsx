
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Download } from "lucide-react";

interface BulkImportDialogProps {
  onImport: (file: File) => Promise<void>;
}

export const BulkImportDialog = ({ onImport }: BulkImportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const downloadTemplate = () => {
    const csvContent = "skill,related skills\nJavaScript,\"TypeScript,React,Node.js\"\nPython,\"Django,Flask,Data Science\"";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill-relationship-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setImportProgress(0);

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(i);
    }

    await onImport(file);
    setIsUploading(false);
    setImportProgress(0);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Import Skills</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import skill relationships
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
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
