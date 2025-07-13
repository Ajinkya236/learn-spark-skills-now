
import React from 'react';
import { Archive } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TaxonomyNode } from '@/hooks/useTaxonomyManagement';

interface InactivateDialogProps {
  open: boolean;
  node: TaxonomyNode | null;
  onClose: () => void;
  onConfirm: () => void;
}

interface ImpactAnalysis {
  clusters: number;
  groups: number;
  skills: number;
  totalUsers: number;
  courses: number;
  childrenCount: number;
}

export const InactivateDialog: React.FC<InactivateDialogProps> = ({
  open,
  node,
  onClose,
  onConfirm
}) => {
  // Helper function to get all children recursively
  const getAllChildren = (node: TaxonomyNode): TaxonomyNode[] => {
    let children: TaxonomyNode[] = [];
    if (node.children) {
      node.children.forEach(child => {
        children.push(child);
        children = children.concat(getAllChildren(child));
      });
    }
    return children;
  };

  const getImpactAnalysis = (node: TaxonomyNode): ImpactAnalysis => {
    const allChildren = getAllChildren(node);
    
    const clusters = node.type === 'cluster' ? 1 : allChildren.filter(child => child.type === 'cluster').length;
    const groups = node.type === 'group' ? 1 : allChildren.filter(child => child.type === 'group').length;
    const skills = node.type === 'skill' ? 1 : allChildren.filter(child => child.type === 'skill').length;
    
    // Calculate total usage across all children
    let totalUsers = node.usageCount || 0;
    allChildren.forEach(child => {
      totalUsers += child.usageCount || 0;
    });
    
    const courses = Math.floor(totalUsers * 0.3); // Simulated course impact

    return { clusters, groups, skills, totalUsers, courses, childrenCount: allChildren.length };
  };

  const impact = node ? getImpactAnalysis(node) : null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-orange-600" />
            Confirm Inactivation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to inactivate "{node?.name}"?
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
                  {impact.childrenCount > 0 && (
                    <p className="text-sm font-medium text-orange-600 mt-2">
                      Warning: This will also inactivate {impact.childrenCount} child item{impact.childrenCount > 1 ? 's' : ''}.
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-muted-foreground">
              This item will be moved to the Inactive Bin and can be restored within 30 days.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Inactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
