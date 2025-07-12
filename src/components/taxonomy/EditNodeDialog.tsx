
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';

interface EditNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: TaxonomyNode | null;
  existingNodes: TaxonomyNode[];
  onNodeUpdated: (node: Partial<TaxonomyNode>) => void;
}

export const EditNodeDialog: React.FC<EditNodeDialogProps> = ({
  open,
  onOpenChange,
  node,
  existingNodes,
  onNodeUpdated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rank: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImpactWarning, setShowImpactWarning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (node) {
      setFormData({
        name: node.name,
        description: node.description || '',
        category: node.category || '',
        rank: node.rank
      });
      
      // Check if this node is in use
      setShowImpactWarning((node.usageCount || 0) > 0);
    }
  }, [node]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (node && formData.name !== node.name) {
      // Check uniqueness only if name changed
      const parent = findParentNode(node.id);
      const siblings = parent?.children || existingNodes;
      const duplicate = siblings.find(s => s.id !== node.id && s.name.toLowerCase() === formData.name.toLowerCase());
      
      if (duplicate) {
        newErrors.name = `A ${node.type} named '${formData.name}' already exists in this scope.`;
      }
    }

    // Rank validation
    if (node) {
      const parent = findParentNode(node.id);
      const siblings = parent?.children || existingNodes;
      const rankExists = siblings.find(s => s.id !== node.id && s.rank === formData.rank);
      
      if (rankExists) {
        newErrors.rank = `Rank ${formData.rank} is already assigned to '${rankExists.name}'. Please choose a different rank.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const findParentNode = (nodeId: string): TaxonomyNode | null => {
    const search = (nodes: TaxonomyNode[]): TaxonomyNode | null => {
      for (const n of nodes) {
        if (n.children?.some(child => child.id === nodeId)) {
          return n;
        }
        if (n.children) {
          const found = search(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(existingNodes);
  };

  const handleSubmit = () => {
    if (!node || !validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    const updatedNode: Partial<TaxonomyNode> = {
      ...node,
      ...formData,
      updatedAt: new Date()
    };

    onNodeUpdated(updatedNode);
    setErrors({});
  };

  const getImpactMessage = () => {
    if (!node?.usageCount) return '';
    
    const updates = [];
    if (node.usageCount > 0) updates.push(`${node.usageCount} employee profiles`);
    
    const contentMappings = Math.floor((node.usageCount || 0) * 0.15); // Estimate
    if (contentMappings > 0) updates.push(`${contentMappings} content mappings`);
    
    return `Renaming '${node.name}' to '${formData.name}' will update ${updates.join(' and ')}.`;
  };

  if (!node) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {node.type.charAt(0).toUpperCase() + node.type.slice(1)}</DialogTitle>
          <DialogDescription>
            Modify the details of this {node.type}
          </DialogDescription>
        </DialogHeader>

        {showImpactWarning && formData.name !== node.name && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {getImpactMessage()} Proceed with caution.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`Enter ${node.type} name`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-rank">Rank *</Label>
              <Input
                id="edit-rank"
                type="number"
                min="1"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 1 })}
              />
              {errors.rank && <p className="text-sm text-destructive">{errors.rank}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Describe this ${node.type}`}
            />
          </div>

          {node.type === 'cluster' && (
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
          )}

          {/* Usage Information */}
          <div className="rounded-lg bg-muted/30 p-3">
            <h4 className="text-sm font-medium mb-2">Usage Information</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Used by: {node.usageCount || 0} employees</p>
              <p>Created: {node.createdAt.toLocaleDateString()}</p>
              <p>Last Updated: {node.updatedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
