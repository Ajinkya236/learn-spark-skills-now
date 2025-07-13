
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface JobRoleHeaderProps {
  title: string;
  description: string;
  onOpenSettings: () => void;
}

export const JobRoleHeader = ({ title, description, onOpenSettings }: JobRoleHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onOpenSettings} variant="outline" className="w-full md:w-auto">
        <Settings className="h-4 w-4 mr-2" />
        Global Settings
      </Button>
    </div>
  );
};
