
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Merge } from "lucide-react";

interface QuickActionsProps {
  onCreateNode: (type: 'cluster' | 'group' | 'skill') => void;
  onMergeClick: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateNode,
  onMergeClick
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-jio-dark font-inter">Quick Actions</CardTitle>
        <CardDescription className="font-inter">Common taxonomy management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            onClick={() => onCreateNode('cluster')} 
            className="justify-start font-inter bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Cluster
          </Button>
          <Button 
            onClick={() => onCreateNode('group')} 
            className="justify-start font-inter bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
          <Button 
            onClick={() => onCreateNode('skill')} 
            className="justify-start font-inter bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
          <Button 
            onClick={onMergeClick} 
            className="justify-start font-inter bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Merge className="mr-2 h-4 w-4" />
            Merge Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
