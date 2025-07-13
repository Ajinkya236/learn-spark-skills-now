import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TaxonomyNode } from "@/hooks/useTaxonomyManagement";

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
  const [type, setType] = useState<'cluster' | 'group' | 'skill'>('cluster');
  const [category, setCategory] = useState('');
  const [rank, setRank] = useState(1);

  useEffect(() => {
    if (node) {
      setName(node.name);
      setDescription(node.description || '');
      setType(node.type);
      setCategory(node.category || '');
      setRank(node.rank);
    }
  }, [node]);

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!node) {
      return;
    }

    onNodeUpdated({
      id: node.id,
      name,
      description,
      type,
      category,
      rank
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {node?.type}</DialogTitle>
          <DialogDescription>
            Make changes to your {node?.type} here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as 'cluster' | 'group' | 'skill')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster">Cluster</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rank" className="text-right">
              Rank
            </Label>
            <Input
              type="number"
              id="rank"
              value={rank}
              onChange={(e) => setRank(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
