
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertTriangle, Merge, Check } from 'lucide-react';
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
  const [step, setStep] = useState<'select' | 'details' | 'summary' | 'processing'>('select');
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
      if (mergeType === 'cluster') {
        toast({
          title: "Cluster Merge Complete",
          description: `Successfully merged "${sourceNode?.name}" into "${newTitle}". All skill groups now have the new parent cluster.`
        });
      } else {
        toast({
          title: "Group Merge Complete", 
          description: `Successfully merged "${sourceNode?.name}" into "${newTitle}". All skills now have the new parent group.`
        });
      }
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
          <DialogTitle className="flex items-center gap-2 font-inter font-bold text-jio-dark">
            <Merge className="h-5 w-5" />
            Merge Taxonomy Items
          </DialogTitle>
          <DialogDescription className="font-inter">
            Consolidate {mergeType}s by merging them together
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="font-inter font-medium">Type to Merge</Label>
              <Select value={mergeType} onValueChange={(value: 'cluster' | 'group') => {
                setMergeType(value);
                setSourceId('');
                setTargetId('');
              }}>
                <SelectTrigger className="font-inter">
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
                <Label className="font-inter font-medium">Source {mergeType} (will be merged from)</Label>
                <Select value={sourceId} onValueChange={setSourceId}>
                  <SelectTrigger className="font-inter">
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
                <Label className="font-inter font-medium">Target {mergeType} (will be merged into)</Label>
                <Select 
                  value={targetId} 
                  onValueChange={setTargetId}
                  disabled={!sourceId}
                >
                  <SelectTrigger className="font-inter">
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
                <AlertDescription className="font-inter">
                  {mergeType === 'cluster' 
                    ? `All skill groups from "${sourceNode.name}" will be moved to the merged cluster. The source cluster will be inactivated after merge.`
                    : `All skills from "${sourceNode.name}" will be moved to the merged group. The source group will be inactivated after merge.`
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2 font-inter text-jio-dark">New {mergeType} Details</h3>
              <p className="text-muted-foreground font-inter">
                Provide title and description for the merged {mergeType}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-inter font-medium">Title *</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`Enter merged ${mergeType} title`}
                  className="font-inter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-inter font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={`Enter merged ${mergeType} description`}
                  className="font-inter"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 font-inter">Merging:</h4>
                <div className="flex items-center gap-2 text-sm font-inter">
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

        {step === 'summary' && mergePreview && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2 font-inter text-jio-dark">Merge Summary</h3>
              <p className="text-muted-foreground font-inter">Review the details before confirming</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-inter font-bold text-jio-dark">New {mergeType} Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="font-inter font-medium">Name:</Label>
                  <p className="font-inter text-jio-dark">{newTitle}</p>
                </div>
                {newDescription && (
                  <div>
                    <Label className="font-inter font-medium">Description:</Label>
                    <p className="font-inter text-muted-foreground">{newDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="text-sm font-inter">
                  • {mergePreview.sourceChildren.length} {mergeType === 'cluster' ? 'groups' : 'skills'} will be moved from source
                </p>
                <p className="text-sm font-inter">
                  • {mergePreview.targetChildren.length} {mergeType === 'cluster' ? 'groups' : 'skills'} already exist in target
                </p>
                <p className="text-sm font-medium font-inter">
                  • Total after merge: {mergePreview.totalAfterMerge} {mergeType === 'cluster' ? 'groups' : 'skills'}
                </p>
              </div>

              {mergePreview.conflicts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-orange-600 font-inter">Conflicts Detected</h4>
                  <div className="border border-orange-200 rounded-lg p-4 space-y-2">
                    {mergePreview.conflicts.map((conflict) => (
                      <div key={conflict.id} className="flex items-center justify-between text-sm font-inter">
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jio-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground font-inter">Processing merge...</p>
          </div>
        )}

        <DialogFooter>
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={resetDialog} className="font-inter">Cancel</Button>
              <Button 
                disabled={!sourceId || !targetId}
                onClick={() => setStep('details')}
                className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
              >
                Next: Details
              </Button>
            </>
          )}
          
          {step === 'details' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')} className="font-inter">Back</Button>
              <Button 
                disabled={!newTitle.trim() || !newDescription.trim()}
                onClick={() => setStep('summary')}
                className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
              >
                Next: Summary
              </Button>
            </>
          )}
          
          {step === 'summary' && (
            <>
              <Button variant="outline" onClick={() => setStep('details')} className="font-inter">Back</Button>
              <Button 
                onClick={handleMerge}
                className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm Merge
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
