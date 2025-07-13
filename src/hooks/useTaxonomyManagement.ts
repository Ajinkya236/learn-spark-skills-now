
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TaxonomyNode } from '@/types/taxonomy';
import { mockTaxonomyData } from '@/data/mockTaxonomyData';
import { findNodeById, getAllChildren } from '@/utils/taxonomyHelpers';
import { 
  updateTaxonomyWithNewNode, 
  updateTaxonomyNode, 
  inactivateNodeAndChildren,
  createInactiveItems,
  addToInactiveItems
} from '@/services/taxonomyOperations';

export const useTaxonomyManagement = () => {
  const { toast } = useToast();
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyNode[]>(mockTaxonomyData);

  const handleNodeCreated = (nodeData: Partial<TaxonomyNode>) => {
    const updatedTaxonomy = updateTaxonomyWithNewNode(taxonomyData, nodeData);
    setTaxonomyData(updatedTaxonomy);
    
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" created successfully and is now visible in both Tree and Tabular views.`
    });
  };

  const handleNodeUpdated = (nodeData: Partial<TaxonomyNode>) => {
    const updatedTaxonomy = updateTaxonomyNode(taxonomyData, nodeData);
    setTaxonomyData(updatedTaxonomy);
    
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" updated successfully and changes are reflected in both Tree and Tabular views.`
    });
  };

  const handleInactivateNode = (node: TaxonomyNode) => {
    // Get all children that will be inactivated
    const allChildren = getAllChildren(node);
    const allNodesToInactivate = [node, ...allChildren];

    // Create inactive items
    const inactiveItems = createInactiveItems(allNodesToInactivate, taxonomyData);
    addToInactiveItems(inactiveItems);

    // Update taxonomy data
    const updatedTaxonomy = inactivateNodeAndChildren(taxonomyData, node, allNodesToInactivate);
    setTaxonomyData(updatedTaxonomy);
    
    const childrenCount = allChildren.length;
    const message = childrenCount > 0 
      ? `${node.type} "${node.name}" and ${childrenCount} child item${childrenCount > 1 ? 's' : ''} have been inactivated and moved to the Inactive Bin.`
      : `${node.type} "${node.name}" has been inactivated and moved to the Inactive Bin.`;
    
    toast({
      title: "Success",
      description: message
    });
  };

  const handleBulkImportComplete = () => {
    toast({
      title: "Import Complete",
      description: "Taxonomy data has been imported successfully and is now visible in both Tree and Tabular views."
    });
  };

  const handleMergeComplete = () => {
    toast({
      title: "Merge Complete",
      description: "Items have been merged successfully and changes are reflected in both Tree and Tabular views."
    });
  };

  return {
    taxonomyData,
    setTaxonomyData,
    findNodeById: (id: string) => findNodeById(taxonomyData, id),
    handleNodeCreated,
    handleNodeUpdated,
    handleInactivateNode,
    handleBulkImportComplete,
    handleMergeComplete
  };
};

// Re-export types for backward compatibility
export type { TaxonomyNode, ProficiencyLevel } from '@/types/taxonomy';
