
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any) => void;
}

export const ImportDialog = ({ open, onOpenChange, onImport }: ImportDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    // Mock import functionality
    onImport({ file: file.name });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Upload a file to import proficiency data
          </DialogDescription>
        </DialogHeader>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileUpload(files[0]);
              }
            }}
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose File
            </label>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
