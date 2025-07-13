
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TaxonomyTree } from "@/components/taxonomy/TaxonomyTree";
import { TaxonomyNode } from "@/hooks/useTaxonomyManagement";

interface TreeViewTabProps {
  taxonomyData: TaxonomyNode[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateChild: (type: 'cluster' | 'group' | 'skill') => void;
}

export const TreeViewTab: React.FC<TreeViewTabProps> = ({
  taxonomyData,
  searchTerm,
  onSearchChange,
  onEdit,
  onInactivate,
  onCreateChild
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-bold text-jio-dark font-inter">Skills Taxonomy Tree</span>
        </CardTitle>
        <CardDescription className="font-inter">
          Organize skills into clusters, groups, and individual skills. Use drag & drop to reorder.
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search clusters, groups, and skills..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-inter"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TaxonomyTree 
          data={taxonomyData} 
          onEdit={onEdit} 
          onInactivate={onInactivate} 
          onCreateChild={onCreateChild} 
        />
      </CardContent>
    </Card>
  );
};
