
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GlobalSettings {
  globalMaxSkills: number;
}

interface GlobalSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GlobalSettings;
  onUpdateSettings: (settings: GlobalSettings) => void;
  onSave: () => void;
  highestLocalMax: number;
}

export const GlobalSettingsDialog = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSave,
  highestLocalMax
}: GlobalSettingsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Global Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="globalMaxSkills">Global Maximum Skills per Job Role</Label>
            <Input
              id="globalMaxSkills"
              type="number"
              value={settings.globalMaxSkills}
              onChange={(e) => onUpdateSettings({
                ...settings,
                globalMaxSkills: parseInt(e.target.value) || 0
              })}
              min="1"
              max="100"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum number of skills that can be assigned to any job role globally. 
              Must be ≥ {highestLocalMax} (highest local maximum).
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
