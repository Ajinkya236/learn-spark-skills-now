
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaxonomyNode } from "@/types/taxonomy";

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: TaxonomyNode[];
  onMergeComplete: () => void;
}

interface SearchableNode extends TaxonomyNode {
  searchTerm: string;
}

export const MergeDialog: React.FC<MergeDialogProps> = ({
  open,
  onOpenChange,
  nodes,
  onMergeComplete
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'selection' | 'naming'>('selection');
  const [selectedType, setSelectedType] = useState<'cluster' | 'group' | 'skill'>('cluster');
  const [sourceNode, setSourceNode] = useState<TaxonomyNode | null>(null);
  const [targetNode, setTargetNode] = useState<TaxonomyNode | null>(null);
  const [searchTermSource, setSearchTermSource] = useState('');
  const [searchTermTarget, setSearchTermTarget] = useState('');
  const [mergedName, setMergedName] = useState('');

  const searchableNodes: SearchableNode[] = nodes.reduce((acc: SearchableNode[], node: TaxonomyNode) => {
    const flatten = (node: TaxonomyNode) => {
      if (node.isActive && node.type === selectedType) {
        acc.push({ ...node, searchTerm: `${node.name} ${node.description} ${node.type}`.toLowerCase() });
      }
      if (node.children) {
        node.children.forEach(flatten);
      }
    };
    flatten(node);
    return acc;
  }, []);

  const filteredSourceNodes = searchableNodes.filter(node => 
    node.searchTerm.includes(searchTermSource.toLowerCase()) && 
    (!targetNode || node.id !== targetNode.id)
  );
  
  const filteredTargetNodes = searchableNodes.filter(node => 
    node.searchTerm.includes(searchTermTarget.toLowerCase()) && 
    (!sourceNode || node.id !== sourceNode.id)
  );

  const handleNext = () => {
    if (!sourceNode || !targetNode) {
      toast({
        title: "Error",
        description: "Please select both a source and a target node.",
        variant: "destructive"
      });
      return;
    }

    if (sourceNode.type !== targetNode.type) {
      toast({
        title: "Error", 
        description: `Cannot merge different types. Both items must be ${selectedType}s.`,
        variant: "destructive"
      });
      return;
    }

    setStep('naming');
  };

  const handleMerge = () => {
    if (!mergedName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the merged item.",
        variant: "destructive"
      });
      return;
    }

    // Simulate merge logic
    console.log(`Merging ${sourceNode?.name} and ${targetNode?.name} into ${mergedName}`);

    toast({
      title: "Success",
      description: `Successfully merged ${sourceNode?.name} and ${targetNode?.name} into ${mergedName}.`,
    });

    // Reset state
    setStep('selection');
    setSourceNode(null);
    setTargetNode(null);
    setSearchTermSource('');
    setSearchTermTarget('');
    setMergedName('');
    
    onMergeComplete();
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('selection');
    setMergedName('');
  };

  const resetDialog = () => {
    setStep('selection');
    setSourceNode(null);
    setTargetNode(null);
    setSearchTermSource('');
    setSearchTermTarget('');
    setMergedName('');
    setSelectedType('cluster');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  const getNodeInfo = (node: TaxonomyNode | null) => {
    if (!node) return null;

    let details = [];
    if (node.type === 'skill' && node.proficiencyLevels) {
      details.push(`${node.proficiencyLevels.length} levels`);
    }
    if (node.usageCount) {
      details.push(`${node.usageCount} users`);
    }

    return details.length > 0 ? details.join(' • ') : null;
  };

  if (step === 'naming') {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-jio-dark font-inter">
              Name the Merged {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </DialogTitle>
            <DialogDescription className="font-inter">
              Enter a name for the new merged {selectedType} that will contain all child items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-inter">Source: {sourceNode?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-inter">{sourceNode?.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-inter">Target: {targetNode?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-inter">{targetNode?.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mergedName" className="font-inter">
                New {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Name
              </Label>
              <Input
                id="mergedName"
                value={mergedName}
                onChange={(e) => setMergedName(e.target.value)}
                placeholder={`Enter name for merged ${selectedType}`}
                className="font-inter"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleBack} className="font-inter">
              Back
            </Button>
            <Button onClick={handleMerge} className="font-inter">
              Complete Merge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-jio-dark font-inter">Merge Taxonomy Items</DialogTitle>
          <DialogDescription className="font-inter">
            Select two items of the same type to merge them together.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label className="font-inter">Item Type</Label>
            <Select value={selectedType} onValueChange={(value: 'cluster' | 'group' | 'skill') => {
              setSelectedType(value);
              setSourceNode(null);
              setTargetNode(null);
              setSearchTermSource('');
              setSearchTermTarget('');
            }}>
              <SelectTrigger className="w-48 font-inter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">Cluster</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Item Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">Source {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`Search ${selectedType}s...`}
                    value={searchTermSource}
                    onChange={(e) => setSearchTermSource(e.target.value)}
                    className="pl-10 font-inter"
                  />
                </div>
                <Separator className="my-4" />
                <ScrollArea className="h-[200px] pr-2">
                  {filteredSourceNodes.length > 0 ? (
                    filteredSourceNodes.map(node => (
                      <Button
                        key={node.id}
                        variant={sourceNode?.id === node.id ? "default" : "ghost"}
                        className="w-full justify-start rounded-md font-normal font-inter hover:bg-accent hover:text-accent-foreground mb-2"
                        onClick={() => setSourceNode(node)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{node.type === 'cluster' ? '📁' : node.type === 'group' ? '📂' : '🎯'}</span>
                          <div className="text-left">
                            <p className="font-medium">{node.name}</p>
                            <p className="text-sm text-muted-foreground">{node.description}</p>
                            {getNodeInfo(node) && (
                              <p className="text-xs text-muted-foreground mt-1">{getNodeInfo(node)}</p>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground font-inter">No {selectedType}s found.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Target Item Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">Target {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`Search ${selectedType}s...`}
                    value={searchTermTarget}
                    onChange={(e) => setSearchTermTarget(e.target.value)}
                    className="pl-10 font-inter"
                  />
                </div>
                <Separator className="my-4" />
                <ScrollArea className="h-[200px] pr-2">
                  {filteredTargetNodes.length > 0 ? (
                    filteredTargetNodes.map(node => (
                      <Button
                        key={node.id}
                        variant={targetNode?.id === node.id ? "default" : "ghost"}
                        className="w-full justify-start rounded-md font-normal font-inter hover:bg-accent hover:text-accent-foreground mb-2"
                        onClick={() => setTargetNode(node)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{node.type === 'cluster' ? '📁' : node.type === 'group' ? '📂' : '🎯'}</span>
                          <div className="text-left">
                            <p className="font-medium">{node.name}</p>
                            <p className="text-sm text-muted-foreground">{node.description}</p>
                            {getNodeInfo(node) && (
                              <p className="text-xs text-muted-foreground mt-1">{getNodeInfo(node)}</p>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground font-inter">No {selectedType}s found.</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {(sourceNode || targetNode) && (
            <Alert>
              <AlertDescription className="font-inter">
                {sourceNode && targetNode ? (
                  <>Selected: <strong>{sourceNode.name}</strong> → <strong>{targetNode.name}</strong></>
                ) : sourceNode ? (
                  <>Source selected: <strong>{sourceNode.name}</strong>. Please select a target.</>
                ) : (
                  <>Target selected: <strong>{targetNode.name}</strong>. Please select a source.</>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button type="button" onClick={handleNext} className="font-inter">
            Next: Name Merged Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
