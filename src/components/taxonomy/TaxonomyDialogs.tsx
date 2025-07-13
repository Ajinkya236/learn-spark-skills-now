
import React from 'react';
import { CreateNodeDialog } from "@/components/taxonomy/CreateNodeDialog";
import { EditNodeDialog } from "@/components/taxonomy/EditNodeDialog";
import { BulkImportDialog } from "@/components/taxonomy/BulkImportDialog";
import { MergeDialog } from "@/components/taxonomy/MergeDialog";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyDialogsProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  bulkImportOpen: boolean;
  setBulkImportOpen: (open: boolean) => void;
  mergeDialogOpen: boolean;
  setMergeDialogOpen: (open: boolean) => void;
  selectedNode: TaxonomyNode | null;
  selectedNodeType: 'cluster' | 'group' | 'skill';
  taxonomyData: TaxonomyNode[];
  onNodeCreated: (nodeData: Partial<TaxonomyNode>) => void;
  onNodeUpdated: (nodeData: Partial<TaxonomyNode>) => void;
  onBulkImportComplete: () => void;
  onMergeComplete: () => void;
}

export const TaxonomyDialogs: React.FC<TaxonomyDialogsProps> = ({
  createDialogOpen,
  setCreateDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  bulkImportOpen,
  setBulkImportOpen,
  mergeDialogOpen,
  setMergeDialogOpen,
  selectedNode,
  selectedNodeType,
  taxonomyData,
  onNodeCreated,
  onNodeUpdated,
  onBulkImportComplete,
  onMergeComplete
}) => {
  return (
    <>
      <CreateNodeDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        nodeType={selectedNodeType} 
        existingNodes={taxonomyData} 
        onNodeCreated={onNodeCreated} 
      />

      <EditNodeDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        node={selectedNode} 
        existingNodes={taxonomyData} 
        onNodeUpdated={onNodeUpdated} 
      />

      <BulkImportDialog 
        open={bulkImportOpen} 
        onOpenChange={setBulkImportOpen} 
        onImportComplete={onBulkImportComplete} 
      />

      <MergeDialog 
        open={mergeDialogOpen} 
        onOpenChange={setMergeDialogOpen} 
        nodes={taxonomyData} 
        onMergeComplete={onMergeComplete} 
      />
    </>
  );
};
