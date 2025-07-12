
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertTriangle, Merge } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: TaxonomyNode[];
  onMergeComplete: () => void;
}

export const MergeDialog: React.FC<MergeDialogProps> = ({
  open,
  onOpenChange,
  nodes,
  onMergeComplete
}) => {
  const [mergeType, setMergeType] = useState<'cluster' | 'group'>('cluster');
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [step, setStep] = useState<'select' | 'details' | 'preview' | 'processing'>('select');
  const { toast } = useToast();

  const getAllNodes = (): TaxonomyNode[] => {
    const result: TaxonomyNode[] = [];
    
    const traverse = (nodeArray: TaxonomyNode[]) => {
      nodeArray.forEach(node => {
        if (node.isActive) {
          result.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    
    traverse(nodes);
    return result;
  };

  const allNodes = getAllNodes();
  const sourceNode = allNodes.find(n => n.id === sourceId);
  const targetNode = allNodes.find(n => n.id === targetId);

  const getNodesByType = (type: 'cluster' | 'group'): TaxonomyNode[] => {
    return allNodes.filter(n => n.type === type);
  };

  const getMergePreview = () => {
    if (!sourceNode || !targetNode) return null;

    const sourceChildren = sourceNode.children || [];
    const targetChildren = targetNode.children || [];
    
    const conflicts = sourceChildren.filter(sc => 
      targetChildren.some(tc => tc.name.toLowerCase() === sc.name.toLowerCase())
    );

    return {
      sourceChildren,
      targetChildren,
      conflicts,
      totalAfterMerge: targetChildren.length + sourceChildren.length - conflicts.length
    };
  };

  const handleMerge = () => {
    setStep('processing');
    
    // Simulate merge process
    setTimeout(() => {
      toast({
        title: "Merge Complete",
        description: `Successfully merged "${sourceNode?.name}" into "${newTitle || targetNode?.name}"`
      });
      onMergeComplete();
      resetDialog();
    }, 2000);
  };

  const resetDialog = () => {
    setMergeType('cluster');
    setSourceId('');
    setTargetId('');
    setNewTitle('');
    setNewDescription('');
    setStep('select');
    onOpenChange(false);
  };

  const mergePreview = getMergePreview();
  const availableNodes = getNodesByType(mergeType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            Merge Taxonomy Items
          </DialogTitle>
          <DialogDescription>
            Consolidate overlapping or redundant {mergeType}s by merging them
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Type to Merge</Label>
              <Select value={mergeType} onValueChange={(value: 'cluster' | 'group') => {
                setMergeType(value);
                setSourceId('');
                setTargetId('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cluster">Clusters</SelectItem>
                  <SelectItem value="group">Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source {mergeType} (will be merged from)</Label>
                <Select value={sourceId} onValueChange={setSourceId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select source ${mergeType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNodes.map((node) => (
                      <SelectItem key={node.id} value={node.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{node.type}</Badge>
                          {node.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target {mergeType} (will be merged into)</Label>
                <Select 
                  value={targetId} 
                  onValueChange={setTargetId}
                  disabled={!sourceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select target ${mergeType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNodes
                      .filter(node => node.id !== sourceId)
                      .map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{node.type}</Badge>
                            {node.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sourceNode && targetNode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  All children from "{sourceNode.name}" will be moved to the merged {mergeType}. 
                  The source {mergeType} will be inactivated after merge.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">New {mergeType} Details</h3>
              <p className="text-muted-foreground">
                Provide title and description for the merged {mergeType}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`Enter merged ${mergeType} title`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={`Enter merged ${mergeType} description`}
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">Merging:</h4>
                <div className="flex items-center gap-2 text-sm">
                  <span>"{sourceNode?.name}"</span>
                  <ArrowRight className="h-4 w-4" />
                  <span>"{targetNode?.name}"</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="font-medium">"{newTitle || 'New ' + mergeType}"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && mergePreview && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Merge Preview</h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Source</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="font-medium">{sourceNode?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mergePreview.sourceChildren.length} children
                    </p>
                  </CardContent>
                </Card>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Result</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="font-medium">{newTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {mergePreview.totalAfterMerge} children total
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Merge Summary</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    • {mergePreview.sourceChildren.length} items will be moved from source
                  </p>
                  <p className="text-sm">
                    • {mergePreview.targetChildren.length} items already exist in target
                  </p>
                  <p className="text-sm font-medium">
                    • Total after merge: {mergePreview.totalAfterMerge} items
                  </p>
                </div>
              </div>

              {mergePreview.conflicts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-orange-600">Conflicts Detected</h4>
                  <div className="border border-orange-200 rounded-lg p-4 space-y-2">
                    {mergePreview.conflicts.map((conflict) => (
                      <div key={conflict.id} className="flex items-center justify-between text-sm">
                        <span>"{conflict.name}" exists in both locations</span>
                        <Badge variant="outline" className="text-orange-600">
                          Will merge
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing merge...</p>
          </div>
        )}

        <DialogFooter>
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={resetDialog}>Cancel</Button>
              <Button 
                disabled={!sourceId || !targetId}
                onClick={() => setStep('details')}
              >
                Next: Details
              </Button>
            </>
          )}
          
          {step === 'details' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>Back</Button>
              <Button 
                disabled={!newTitle.trim()}
                onClick={() => setStep('preview')}
              >
                Preview Merge
              </Button>
            </>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
              <Button onClick={handleMerge}>
                Confirm Merge
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
