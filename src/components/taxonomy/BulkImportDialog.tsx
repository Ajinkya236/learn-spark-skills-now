
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ImportRow {
  id: number;
  type: string;
  name: string;
  description: string;
  parent: string;
  rank: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Parse file and preview
      parseFile(selectedFile);
    }
  };

  const parseFile = (file: File) => {
    // Mock file parsing - in real app, use proper CSV/Excel parser
    const mockData: ImportRow[] = [
      {
        id: 1,
        type: 'cluster',
        name: 'Data Science',
        description: 'Data science and analytics skills',
        parent: '',
        rank: 1,
        status: 'pending'
      },
      {
        id: 2,
        type: 'group',
        name: 'Machine Learning',
        description: 'Machine learning algorithms and techniques',
        parent: 'Data Science',
        rank: 1,
        status: 'pending'
      },
      {
        id: 3,
        type: 'skill',
        name: 'TensorFlow',
        description: 'TensorFlow framework expertise',
        parent: 'Machine Learning',
        rank: 1,
        status: 'pending'
      },
      {
        id: 4,
        type: 'skill',
        name: 'Python Programming',
        description: 'Duplicate skill for testing',
        parent: 'Machine Learning',
        rank: 1,
        status: 'pending',
        error: 'Duplicate name in parent scope'
      }
    ];

    setImportData(mockData);
    setStep('preview');
  };

  const validateData = () => {
    const validated = importData.map(row => {
      const errors = [];
      
      if (!row.name.trim()) {
        errors.push('Name is required');
      }
      
      if (row.type === 'skill' && row.name === 'Python Programming') {
        errors.push('Skill already exists in this group');
      }
      
      if (row.rank <= 0) {
        errors.push('Rank must be positive');
      }
      
      return {
        ...row,
        status: errors.length > 0 ? 'error' as const : 'pending' as const,
        error: errors.join(', ')
      };
    });
    
    setImportData(validated);
  };

  const processImport = () => {
    setStep('processing');
    setProgress(0);
    
    // Simulate import process
    let processed = 0;
    let successes = 0;
    let errors = 0;
    
    const processRow = () => {
      if (processed < importData.length) {
        const row = importData[processed];
        
        setTimeout(() => {
          if (row.status === 'error') {
            errors++;
          } else {
            successes++;
          }
          
          processed++;
          setProgress((processed / importData.length) * 100);
          
          if (processed < importData.length) {
            processRow();
          } else {
            setSuccessCount(successes);
            setErrorCount(errors);
            setStep('complete');
          }
        }, 200);
      }
    };
    
    processRow();
  };

  const downloadTemplate = () => {
    // Create and download CSV template
    const csvContent = `Type,Name,Description,Parent,Rank,Category
cluster,Technical Skills,All technical skills,,1,Technical
group,Programming Languages,Software development languages,Technical Skills,1,
skill,Python,Python programming language,Programming Languages,1,`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taxonomy_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setStep('upload');
    setFile(null);
    setImportData([]);
    setProgress(0);
    setSuccessCount(0);
    setErrorCount(0);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Taxonomy</DialogTitle>
          <DialogDescription>
            Upload CSV or Excel file to import taxonomy data in bulk
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>

            {file && (
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  File "{file.name}" uploaded successfully. Click Next to preview the data.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Import Preview</h3>
              <Button variant="outline" onClick={validateData}>
                Validate Data
              </Button>
            </div>

            <div className="border rounded-lg max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getStatusIcon(row.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.parent}</TableCell>
                      <TableCell>{row.rank}</TableCell>
                      <TableCell className="text-sm text-red-600">
                        {row.error}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Found {importData.filter(r => r.status === 'error').length} errors. 
                Only valid rows will be imported.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-medium mb-2">Processing Import</h3>
              <p className="text-muted-foreground">Please wait while we import your data...</p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <div>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Import Complete</h3>
              <p className="text-muted-foreground">
                Successfully imported {successCount} items. {errorCount} items failed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button disabled={!file} onClick={() => setStep('preview')}>
                Next
              </Button>
            </>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
              <Button onClick={processImport}>
                Import Data
              </Button>
            </>
          )}
          
          {step === 'complete' && (
            <Button onClick={() => {
              onImportComplete();
              handleClose();
            }}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
