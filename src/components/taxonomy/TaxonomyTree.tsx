
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Archive, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { cn } from '@/lib/utils';

interface TaxonomyTreeProps {
  data: TaxonomyNode[];
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateChild: (type: 'cluster' | 'group' | 'skill') => void;
  level?: number;
}

export const TaxonomyTree: React.FC<TaxonomyTreeProps> = ({
  data,
  onEdit,
  onInactivate,
  onCreateChild,
  level = 0
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2']));
  const [inactivateDialog, setInactivateDialog] = useState<{open: boolean, node: TaxonomyNode | null}>({
    open: false,
    node: null
  });

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'cluster':
        return '📁';
      case 'group':
        return '📂';
      case 'skill':
        return '🎯';
      default:
        return '📄';
    }
  };

  const getChildType = (parentType: string): 'cluster' | 'group' | 'skill' => {
    switch (parentType) {
      case 'cluster':
        return 'group';
      case 'group':
        return 'skill';
      default:
        return 'skill';
    }
  };

  const getImpactAnalysis = (node: TaxonomyNode) => {
    const getChildCount = (n: TaxonomyNode, type?: string): number => {
      let count = 0;
      if (!type || n.type === type) {
        count = 1;
      }
      if (n.children) {
        n.children.forEach(child => {
          count += getChildCount(child, type);
        });
      }
      return count;
    };

    const clusters = node.type === 'cluster' ? 1 : getChildCount(node, 'cluster');
    const groups = node.type === 'group' ? 1 : getChildCount(node, 'group');
    const skills = node.type === 'skill' ? 1 : getChildCount(node, 'skill');
    const totalUsers = node.usageCount || 0;
    const courses = Math.floor(totalUsers * 0.3); // Simulated course impact

    return { clusters, groups, skills, totalUsers, courses };
  };

  const handleInactivateClick = (node: TaxonomyNode) => {
    setInactivateDialog({ open: true, node });
  };

  const handleConfirmInactivate = () => {
    if (inactivateDialog.node) {
      onInactivate(inactivateDialog.node);
      setInactivateDialog({ open: false, node: null });
    }
  };

  const handleCancelInactivate = () => {
    setInactivateDialog({ open: false, node: null });
  };

  const impact = inactivateDialog.node ? getImpactAnalysis(inactivateDialog.node) : null;

  return (
    <>
      <div className={cn("space-y-1", level === 0 && "p-4")}>
        {data.map(node => (
          <div key={node.id} className="group">
            <div className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors", `ml-${level * 4}`)}>
              {/* Expand/Collapse Button */}
              {node.children && node.children.length > 0 ? (
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => toggleExpanded(node.id)}>
                  {expandedNodes.has(node.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              ) : (
                <div className="w-6" />
              )}

              {/* Node Icon & Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{getNodeIcon(node.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm md:text-base truncate">{node.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {node.type}
                    </Badge>
                  </div>
                  {node.description && <p className="text-xs text-muted-foreground truncate">{node.description}</p>}
                  <div className="flex items-center gap-4 mt-1">
                    {node.usageCount !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {node.usageCount} users
                      </div>
                    )}
                    {node.type === 'skill' && node.proficiencyLevels && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        {node.proficiencyLevels.length} levels
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {node.type !== 'skill' && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onCreateChild(getChildType(node.type))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(node)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-orange-600 hover:text-orange-600" onClick={() => handleInactivateClick(node)}>
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            {node.children && node.children.length > 0 && expandedNodes.has(node.id) && (
              <TaxonomyTree 
                data={node.children}
                onEdit={onEdit}
                onInactivate={onInactivate}
                onCreateChild={onCreateChild}
                level={level + 1}
              />
            )}
          </div>
        ))}
      </div>

      {/* Inactivate Confirmation Dialog */}
      <Dialog open={inactivateDialog.open} onOpenChange={(open) => !open && handleCancelInactivate()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-orange-600" />
              Confirm Inactivation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to inactivate "{inactivateDialog.node?.name}"?
            </DialogDescription>
          </DialogHeader>

          {impact && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Impact Analysis:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {impact.clusters > 0 && (
                        <div>• {impact.clusters} Cluster{impact.clusters > 1 ? 's' : ''}</div>
                      )}
                      {impact.groups > 0 && (
                        <div>• {impact.groups} Group{impact.groups > 1 ? 's' : ''}</div>
                      )}
                      {impact.skills > 0 && (
                        <div>• {impact.skills} Skill{impact.skills > 1 ? 's' : ''}</div>
                      )}
                      <div>• {impact.totalUsers} Users affected</div>
                      <div>• {impact.courses} Courses impacted</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-muted-foreground">
                This item will be moved to the Inactive Bin and can be restored within 30 days.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelInactivate}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmInactivate}>
              Inactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
