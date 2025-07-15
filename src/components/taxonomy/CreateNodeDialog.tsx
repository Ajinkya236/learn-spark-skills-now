
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TaxonomyNode } from "@/types/taxonomy";
import { ParentSelector } from "@/components/taxonomy/ParentSelector";

interface CreateNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeType: 'cluster' | 'group' | 'skill';
  existingNodes: TaxonomyNode[];
  onNodeCreated: (node: Partial<TaxonomyNode>) => void;
}

export const CreateNodeDialog: React.FC<CreateNodeDialogProps> = ({
  open,
  onOpenChange,
  nodeType,
  existingNodes,
  onNodeCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const getAvailableParents = () => {
    const parents: TaxonomyNode[] = [];
    const traverse = (nodes: TaxonomyNode[]) => {
      nodes.forEach(node => {
        if (nodeType === 'group' && node.type === 'cluster') {
          parents.push(node);
        } else if (nodeType === 'skill' && node.type === 'group') {
          parents.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(existingNodes);
    return parents;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Parent validation for groups and skills
    if ((nodeType === 'group' || nodeType === 'skill') && !formData.parentId) {
      newErrors.parentId = `Parent ${nodeType === 'group' ? 'Cluster' : 'Group'} is required`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    const nodeData: Partial<TaxonomyNode> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: nodeType,
      isActive: true,
      rank: 1,
      parentId: formData.parentId || undefined
    };

    onNodeCreated(nodeData);

    // Reset form
    setFormData({
      name: '',
      description: '',
      parentId: ''
    });
    setErrors({});
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-inter font-black text-jio-dark text-xl">
            Create New {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </DialogTitle>
          <DialogDescription className="font-inter">
            Add a new {nodeType} to your taxonomy hierarchy
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-inter font-medium">Name *</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder={`Enter ${nodeType} name`}
              className="font-inter rounded-lg"
            />
            {errors.name && <p className="text-sm text-destructive font-inter">{errors.name}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter font-medium">Description *</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder={`Describe this ${nodeType}`}
              className="font-inter rounded-lg"
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive font-inter">{errors.description}</p>}
          </div>

          {/* Parent Selection */}
          {nodeType === 'group' && (
            <ParentSelector
              parentType="cluster"
              selectedParentId={formData.parentId}
              onParentSelect={(parentId) => setFormData({ ...formData, parentId })}
              availableParents={availableParents}
              error={errors.parentId}
            />
          )}

          {nodeType === 'skill' && (
            <ParentSelector
              parentType="group"
              selectedParentId={formData.parentId}
              onParentSelect={(parentId) => setFormData({ ...formData, parentId })}
              availableParents={availableParents}
              error={errors.parentId}
            />
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="font-inter rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter rounded-lg"
          >
            Create {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
