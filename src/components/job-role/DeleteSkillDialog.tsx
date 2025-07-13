
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DeleteSkillDialogProps {
  skillName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteSkillDialog = ({
  skillName,
  open,
  onOpenChange,
  onConfirm
}: DeleteSkillDialogProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      onOpenChange(false);
      setConfirmed(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setConfirmed(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Skill</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove "{skillName}" from this job role?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <Label htmlFor="confirm">
              Yes, I want to remove this skill mapping from the job role
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleConfirm} 
              disabled={!confirmed}
              variant="destructive"
            >
              Remove Skill
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
