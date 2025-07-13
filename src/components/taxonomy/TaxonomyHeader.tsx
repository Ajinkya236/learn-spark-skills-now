
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface TaxonomyHeaderProps {
  onInactiveBinClick: () => void;
  onBulkImportClick: () => void;
}

export const TaxonomyHeader: React.FC<TaxonomyHeaderProps> = ({
  onInactiveBinClick,
  onBulkImportClick
}) => {
  return (
    <div className="flex items-center gap-4">
      <BackButton />
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Taxonomy Management</h1>
        <p className="text-muted-foreground font-inter">Create and manage your skills hierarchy</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={onInactiveBinClick}
          className="font-inter"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Inactive Bin</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={onBulkImportClick}
          className="font-inter"
        >
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Bulk Import</span>
        </Button>
      </div>
    </div>
  );
};
