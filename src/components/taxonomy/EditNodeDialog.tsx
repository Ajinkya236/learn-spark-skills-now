
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TaxonomyNode } from "@/types/taxonomy";
import { ParentSelector } from "@/components/taxonomy/ParentSelector";

interface EditNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: TaxonomyNode | null;
  existingNodes: TaxonomyNode[];
  onNodeUpdated: (nodeData: Partial<TaxonomyNode>) => void;
}

export const EditNodeDialog: React.FC<EditNodeDialogProps> = ({
  open,
  onOpenChange,
  node,
  existingNodes,
  onNodeUpdated
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (node) {
      setName(node.name);
      setDescription(node.description || '');
      setParentId(node.parentId || '');
    }
  }, [node]);

  const getAvailableParents = () => {
    if (!node) return [];
    
    const parents: TaxonomyNode[] = [];
    const traverse = (nodes: TaxonomyNode[]) => {
      nodes.forEach(n => {
        if (n.id !== node.id) { // Don't include self
          if (node.type === 'group' && n.type === 'cluster') {
            parents.push(n);
          } else if (node.type === 'skill' && n.type === 'group') {
            parents.push(n);
          }
        }
        if (n.children) {
          traverse(n.children);
        }
      });
    };
    traverse(existingNodes);
    return parents;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (node?.type === 'group' && !parentId) {
      newErrors.parentId = 'Parent cluster is required';
    }

    if (node?.type === 'skill' && !parentId) {
      newErrors.parentId = 'Parent group is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !node) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    onNodeUpdated({
      id: node.id,
      name: name.trim(),
      description: description.trim(),
      parentId: parentId || undefined
    });
    onOpenChange(false);
  };

  const availableParents = getAvailableParents();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-black text-jio-dark font-inter text-xl">
            Edit {node?.type?.charAt(0).toUpperCase() + node?.type?.slice(1)}
          </DialogTitle>
          <DialogDescription className="font-inter">
            Make changes to your {node?.type} here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-inter font-medium">
              Name *
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="font-inter rounded-lg" 
              placeholder={`Enter ${node?.type} name`}
            />
            {errors.name && <p className="text-sm text-destructive font-inter">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter font-medium">
              Description *
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="font-inter rounded-lg" 
              placeholder={`Describe this ${node?.type}`}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive font-inter">{errors.description}</p>}
          </div>

          {/* Parent Selection for Groups and Skills */}
          {node?.type === 'group' && (
            <ParentSelector
              parentType="cluster"
              selectedParentId={parentId}
              onParentSelect={setParentId}
              availableParents={availableParents}
              error={errors.parentId}
            />
          )}

          {node?.type === 'skill' && (
            <ParentSelector
              parentType="group"
              selectedParentId={parentId}
              onParentSelect={setParentId}
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
            className="bg-jio-blue hover:bg-jio-blue/90 text-white font-inter rounded-lg"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
