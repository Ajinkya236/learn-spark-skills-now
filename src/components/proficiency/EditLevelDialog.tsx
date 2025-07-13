
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: { title: string; description: string };
  onLevelChange: (level: { title: string; description: string }) => void;
  onSave: () => void;
}

export const EditLevelDialog: React.FC<EditLevelDialogProps> = ({
  open,
  onOpenChange,
  level,
  onLevelChange,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Proficiency Level</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <Input 
              id="edit-title" 
              value={level.title} 
              onChange={(e) => onLevelChange({ ...level, title: e.target.value })} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-desc" className="text-right">
              Description
            </Label>
            <Textarea 
              id="edit-desc" 
              value={level.description} 
              onChange={(e) => onLevelChange({ ...level, description: e.target.value })} 
              className="col-span-3" 
            />
          </div>
        </div>
        <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
