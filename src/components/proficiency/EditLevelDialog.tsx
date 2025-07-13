
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface EditLevelDialogProps {
  level: ProficiencyLevel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<ProficiencyLevel>) => void;
}

export const EditLevelDialog = ({ level, open, onOpenChange, onSave }: EditLevelDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (level) {
      setTitle(level.title);
      setDescription(level.description);
    }
  }, [level]);

  const handleSave = () => {
    onSave({ title, description });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Proficiency Level</DialogTitle>
          <DialogDescription>
            Update the proficiency level details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
