
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ImportRow {
  name: string;
  description: string;
  type: 'cluster' | 'group' | 'skill';
  parent: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete
}) => {
  const [step, setStep] = useState<'upload' | 'validate' | 'import' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sampleData: ImportRow[] = [
    {
      name: 'Data Science',
      description: 'Data science and analytics cluster',
      type: 'cluster',
      parent: '',
      status: 'pending'
    },
    {
      name: 'Machine Learning',
      description: 'ML algorithms and techniques',
      type: 'group',
      parent: 'Data Science',
      status: 'pending'
    },
    {
      name: 'Python for ML',
      description: 'Python programming for machine learning',
      type: 'skill',
      parent: 'Machine Learning',
      status: 'pending'
    }
  ];

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'type', 'parent'];
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => [
        `"${row.name}"`,
        `"${row.description}"`,
        row.type,
        `"${row.parent}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taxonomy_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your device."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Simulate file parsing
      setTimeout(() => {
        setImportData(sampleData);
        setStep('validate');
      }, 1000);
    }
  };

  const validateData = () => {
    const errors: string[] = [];
    const nameSet = new Set<string>();
    
    importData.forEach((row, index) => {
      const rowNum = index + 1;
      
      // Rule 7a: Name should be unique
      if (!row.name.trim()) {
        errors.push(`Row ${rowNum}: Name is required`);
      } else if (nameSet.has(row.name.toLowerCase())) {
        errors.push(`Row ${rowNum}: Name "${row.name}" must be unique`);
      } else {
        nameSet.add(row.name.toLowerCase());
      }
      
      // Rule 7b: Type validation
      if (!['cluster', 'group', 'skill'].includes(row.type)) {
        errors.push(`Row ${rowNum}: Type must be one of: cluster, group, skill`);
      }
      
      // Rule 7c: Parent of skill should only be group and not empty
      if (row.type === 'skill' && !row.parent.trim()) {
        errors.push(`Row ${rowNum}: Parent group is required for skills`);
      }
      
      // Rule 7d: Parent of group should only be cluster and not empty
      if (row.type === 'group' && !row.parent.trim()) {
        errors.push(`Row ${rowNum}: Parent cluster is required for groups`);
      }
      
      // Rule 7e: Parent of cluster should be empty
      if (row.type === 'cluster' && row.parent.trim()) {
        errors.push(`Row ${rowNum}: Clusters should not have a parent`);
      }
      
      // Rule 7f: Description cannot be empty
      if (!row.description.trim()) {
        errors.push(`Row ${rowNum}: Description is required`);
      }
    });

    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setStep('import');
      simulateImport();
    }
  };

  const simulateImport = () => {
    let currentProgress = 0;
    const totalRows = importData.length;
    
    const updateProgress = () => {
      if (currentProgress < totalRows) {
        setProgress((currentProgress / totalRows) * 100);
        
        // Simulate some rows having errors
        const updatedData = [...importData];
        if (currentProgress === 1) {
          updatedData[1].status = 'error';
          updatedData[1].error = 'Parent "Data Science" not found';
        } else {
          updatedData[currentProgress].status = 'success';
        }
        setImportData(updatedData);
        
        currentProgress++;
        setTimeout(updateProgress, 500);
      } else {
        setProgress(100);
        setStep('complete');
      }
    };
    
    updateProgress();
  };

  const handleComplete = () => {
    onImportComplete();
    resetDialog();
  };

  const resetDialog = () => {
    setStep('upload');
    setFile(null);
    setImportData([]);
    setProgress(0);
    setValidationErrors([]);
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const successCount = importData.filter(row => row.status === 'success').length;
  const errorCount = importData.filter(row => row.status === 'error').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black font-inter text-xl">
            <Upload className="h-5 w-5" />
            Bulk Import Taxonomy
          </DialogTitle>
          <DialogDescription className="font-inter">
            Import multiple taxonomy items from CSV or Excel files
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="border-2 border-dashed border-muted rounded-xl p-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 font-inter">Upload Your File</h3>
                <p className="text-muted-foreground mb-4 font-inter">
                  Select a CSV or Excel file containing your taxonomy data
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg font-inter"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                
                {file && (
                  <p className="text-sm text-muted-foreground mt-2 font-inter">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-inter">Need a template?</h4>
                <Button 
                  variant="outline" 
                  onClick={downloadTemplate}
                  className="rounded-lg font-inter"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
              
              <Alert className="rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-inter space-y-2">
                    <p><strong>Required columns:</strong> name, description, type, parent</p>
                    <p><strong>Validation Rules:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Names must be unique</li>
                      <li>Type must be: cluster, group, or skill</li>
                      <li>Skills must have a parent group</li>
                      <li>Groups must have a parent cluster</li>
                      <li>Clusters must have empty parent</li>
                      <li>Description is required for all items</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {step === 'validate' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Data Validation</h3>
              <Badge variant="outline">
                {importData.length} rows found
              </Badge>
            </div>

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Validation errors found:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="border rounded-lg max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.type}</Badge>
                      </TableCell>
                      <TableCell>{row.parent || '-'}</TableCell>
                      <TableCell className="max-w-48 truncate">{row.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {step === 'import' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Importing Data</h3>
              <p className="text-muted-foreground">Please wait while we process your data...</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="border rounded-lg max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {getStatusIcon(row.status)}
                        </TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.type}</Badge>
                        </TableCell>
                        <TableCell className="text-red-600 text-sm">
                          {row.error || ''}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <div>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Import Complete</h3>
              <p className="text-muted-foreground">
                Your taxonomy data has been processed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-700">Successfully imported</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-700">Failed to import</div>
              </div>
            </div>

            {errorCount > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Some items couldn't be imported due to validation errors. 
                  Please review and fix the issues, then try importing again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button 
              variant="outline" 
              onClick={resetDialog}
              className="rounded-lg font-inter"
            >
              Cancel
            </Button>
          )}
          
          {step === 'validate' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setStep('upload')}
                className="rounded-lg font-inter"
              >
                Back
              </Button>
              <Button 
                onClick={validateData}
                disabled={validationErrors.length > 0}
                className="rounded-lg font-inter bg-jio-blue hover:bg-jio-blue/90"
              >
                {validationErrors.length > 0 ? 'Fix Errors First' : 'Start Import'}
              </Button>
            </>
          )}
          
          {step === 'complete' && (
            <Button 
              onClick={handleComplete}
              className="rounded-lg font-inter bg-jio-blue hover:bg-jio-blue/90"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
