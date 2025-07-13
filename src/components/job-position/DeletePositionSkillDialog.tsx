
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeletePositionSkillDialogProps {
  skillName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeletePositionSkillDialog = ({ skillName, open, onOpenChange, onConfirm }: DeletePositionSkillDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Remove Skill from Job Position
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{skillName}</strong> from this job position? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Remove Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
