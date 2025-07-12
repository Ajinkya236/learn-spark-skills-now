
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [step, setStep] = useState<'select' | 'preview' | 'processing'>('select');
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

  const getCompatibleTargets = (sourceNode: TaxonomyNode): TaxonomyNode[] => {
    return allNodes.filter(n => 
      n.type === sourceNode.type && 
      n.id !== sourceNode.id
    );
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
        description: `Successfully merged "${sourceNode?.name}" into "${targetNode?.name}"`
      });
      onMergeComplete();
      resetDialog();
    }, 2000);
  };

  const resetDialog = () => {
    setSourceId('');
    setTargetId('');
    setStep('select');
    onOpenChange(false);
  };

  const mergePreview = getMergePreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            Merge Taxonomy Items
          </DialogTitle>
          <DialogDescription>
            Consolidate overlapping or redundant clusters/groups by merging them
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Item (will be merged from)</Label>
                <Select value={sourceId} onValueChange={setSourceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source item" />
                  </SelectTrigger>
                  <SelectContent>
                    {allNodes
                      .filter(n => n.type !== 'skill')
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

              <div className="space-y-2">
                <Label>Target Item (will be merged into)</Label>
                <Select 
                  value={targetId} 
                  onValueChange={setTargetId}
                  disabled={!sourceNode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target item" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceNode && getCompatibleTargets(sourceNode).map((node) => (
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
                  All children from "{sourceNode.name}" will be moved to "{targetNode.name}". 
                  The source item will be inactivated after merge.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'preview' && mergePreview && (
          <div className="space-y-6">
            <div className="text-center">
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
                    <CardTitle className="text-sm">Target</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="font-medium">{targetNode?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mergePreview.targetChildren.length} children
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
                onClick={() => setStep('preview')}
              >
                Preview Merge
              </Button>
            </>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>Back</Button>
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
