import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, ArrowRight, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaxonomyNode } from "@/hooks/useTaxonomyManagement";

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
  const [sourceNode, setSourceNode] = useState<TaxonomyNode | null>(null);
  const [targetNode, setTargetNode] = useState<TaxonomyNode | null>(null);
  const [searchTermSource, setSearchTermSource] = useState('');
  const [searchTermTarget, setSearchTermTarget] = useState('');

  const searchableNodes: SearchableNode[] = nodes.reduce((acc: SearchableNode[], node: TaxonomyNode) => {
    const flatten = (node: TaxonomyNode) => {
      if (node.isActive) {
        acc.push({ ...node, searchTerm: `${node.name} ${node.description} ${node.type}`.toLowerCase() });
        if (node.children) {
          node.children.forEach(flatten);
        }
      }
    };
    flatten(node);
    return acc;
  }, []);

  const filteredSourceNodes = searchableNodes.filter(node => node.searchTerm.includes(searchTermSource.toLowerCase()));
  const filteredTargetNodes = searchableNodes.filter(node => node.searchTerm.includes(searchTermTarget.toLowerCase()));

  const handleMerge = () => {
    if (!sourceNode || !targetNode) {
      toast({
        title: "Error",
        description: "Please select both a source and a target node.",
        variant: "destructive"
      });
      return;
    }

    // Simulate merge logic (replace with actual merge logic)
    console.log(`Merging ${sourceNode.name} into ${targetNode.name}`);

    toast({
      title: "Success",
      description: `Successfully merged ${sourceNode.name} into ${targetNode.name}.`,
    });

    onMergeComplete();
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-jio-dark font-inter">Merge Taxonomy Items</DialogTitle>
          <DialogDescription className="font-inter">
            Combine duplicate or similar taxonomy items to maintain a clean and organized structure.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Item Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-jio-dark font-inter">Source Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search items..."
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
                      variant="ghost"
                      className="w-full justify-start rounded-md font-normal font-inter hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setSourceNode(node)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{node.type === 'cluster' ? '📁' : node.type === 'group' ? '📂' : '🎯'}</span>
                        <div>
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
                  <p className="text-sm text-muted-foreground font-inter">No items found.</p>
                )}
              </ScrollArea>
              {sourceNode && (
                <Alert className="mt-4">
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sourceNode.type === 'cluster' ? '📁' : sourceNode.type === 'group' ? '📂' : '🎯'}</span>
                      <div>
                        <p className="font-medium">{sourceNode.name}</p>
                        <p className="text-sm text-muted-foreground">{sourceNode.description}</p>
                        {getNodeInfo(sourceNode) && (
                          <p className="text-xs text-muted-foreground mt-1">{getNodeInfo(sourceNode)}</p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Target Item Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-jio-dark font-inter">Target Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search items..."
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
                      variant="ghost"
                      className="w-full justify-start rounded-md font-normal font-inter hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setTargetNode(node)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{node.type === 'cluster' ? '📁' : node.type === 'group' ? '📂' : '🎯'}</span>
                        <div>
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
                  <p className="text-sm text-muted-foreground font-inter">No items found.</p>
                )}
              </ScrollArea>
              {targetNode && (
                <Alert className="mt-4">
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{targetNode.type === 'cluster' ? '📁' : targetNode.type === 'group' ? '📂' : '🎯'}</span>
                      <div>
                        <p className="font-medium">{targetNode.name}</p>
                        <p className="text-sm text-muted-foreground">{targetNode.description}</p>
                        {getNodeInfo(targetNode) && (
                          <p className="text-xs text-muted-foreground mt-1">{getNodeInfo(targetNode)}</p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-inter">
            Cancel
          </Button>
          <Button type="button" onClick={handleMerge} className="font-inter">
            Merge Items
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
