
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface TaxonomyNode {
  id: string;
  name: string;
  description?: string;
  type: 'cluster' | 'group' | 'skill';
  category?: string;
  parentId?: string;
  rank: number;
  proficiencyLevels?: ProficiencyLevel[];
  isActive: boolean;
  children?: TaxonomyNode[];
  usageCount?: number;
  employeeCount?: number;
  courseCount?: number;
  roleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProficiencyLevel {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  order: number;
}

// Global state for inactive items (in real app, this would be in state management)
let globalInactiveItems: any[] = [];

export const useTaxonomyManagement = () => {
  const { toast } = useToast();
  
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyNode[]>([{
    id: '1',
    name: 'Technical Skills',
    description: 'All technical and engineering skills',
    type: 'cluster',
    category: 'Technical',
    rank: 1,
    isActive: true,
    usageCount: 450,
    employeeCount: 150,
    courseCount: 25,
    roleCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [{
      id: '2',
      name: 'Programming Languages',
      description: 'Software programming languages',
      type: 'group',
      parentId: '1',
      rank: 1,
      isActive: true,
      usageCount: 320,
      employeeCount: 120,
      courseCount: 18,
      roleCount: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [{
        id: '3',
        name: 'Python Programming',
        description: 'Python development skills',
        type: 'skill',
        parentId: '2',
        rank: 1,
        isActive: true,
        usageCount: 240,
        employeeCount: 80,
        courseCount: 12,
        roleCount: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        proficiencyLevels: [{
          id: '1',
          title: 'Beginner',
          description: 'Basic syntax',
          minScore: 0,
          maxScore: 25,
          order: 1
        }, {
          id: '2',
          title: 'Intermediate',
          description: 'Advanced concepts',
          minScore: 26,
          maxScore: 75,
          order: 2
        }, {
          id: '3',
          title: 'Expert',
          description: 'Architecture & mentoring',
          minScore: 76,
          maxScore: 100,
          order: 3
        }]
      }]
    }]
  }]);

  // Helper function to get all children recursively
  const getAllChildren = (node: TaxonomyNode): TaxonomyNode[] => {
    let children: TaxonomyNode[] = [];
    if (node.children) {
      node.children.forEach(child => {
        children.push(child);
        children = children.concat(getAllChildren(child));
      });
    }
    return children;
  };

  // Find node by ID helper
  const findNodeById = (nodes: TaxonomyNode[], id: string): TaxonomyNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleNodeCreated = (nodeData: Partial<TaxonomyNode>) => {
    const newNode: TaxonomyNode = {
      id: Date.now().toString(),
      name: nodeData.name || '',
      description: nodeData.description || '',
      type: nodeData.type || 'cluster',
      category: nodeData.category,
      parentId: nodeData.parentId,
      rank: nodeData.rank || 1,
      isActive: true,
      children: [],
      usageCount: 0,
      employeeCount: 0,
      courseCount: 0,
      roleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updateTaxonomy = (nodes: TaxonomyNode[]): TaxonomyNode[] => {
      if (!nodeData.parentId) {
        return [...nodes, newNode];
      }
      
      return nodes.map(node => ({
        ...node,
        children: node.id === nodeData.parentId 
          ? [...(node.children || []), newNode]
          : node.children ? updateTaxonomy(node.children) : node.children
      }));
    };

    setTaxonomyData(updateTaxonomy(taxonomyData));
    
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" created successfully and is now visible in both Tree and Tabular views.`
    });
  };

  const handleNodeUpdated = (nodeData: Partial<TaxonomyNode>) => {
    const updateTaxonomy = (nodes: TaxonomyNode[]): TaxonomyNode[] => {
      return nodes.map(node => {
        if (node.id === nodeData.id) {
          return { ...node, ...nodeData, updatedAt: new Date() };
        }
        return {
          ...node,
          children: node.children ? updateTaxonomy(node.children) : node.children
        };
      });
    };

    setTaxonomyData(updateTaxonomy(taxonomyData));
    
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" updated successfully and changes are reflected in both Tree and Tabular views.`
    });
  };

  const handleInactivateNode = (node: TaxonomyNode) => {
    // Get all children that will be inactivated
    const allChildren = getAllChildren(node);
    const allNodesToInactivate = [node, ...allChildren];

    // Add all items to global inactive items
    allNodesToInactivate.forEach(nodeToInactivate => {
      const inactiveItem = {
        id: nodeToInactivate.id,
        name: nodeToInactivate.name,
        description: nodeToInactivate.description,
        type: nodeToInactivate.type,
        parentName: nodeToInactivate.parentId ? findNodeById(taxonomyData, nodeToInactivate.parentId)?.name : undefined,
        inactivatedAt: new Date(),
        inactivatedBy: 'Current User',
        employeeCount: nodeToInactivate.employeeCount || 0,
        courseCount: nodeToInactivate.courseCount || 0,
        roleCount: nodeToInactivate.roleCount || 0
      };
      
      globalInactiveItems.push(inactiveItem);
    });

    // Recursively inactivate node and all its children
    const inactivateNodeAndChildren = (nodes: TaxonomyNode[]): TaxonomyNode[] => {
      return nodes.map(n => {
        if (n.id === node.id) {
          return { ...n, isActive: false, updatedAt: new Date() };
        }
        
        // Check if this node is a child of the inactivated node
        const isChildOfInactivated = allNodesToInactivate.some(inactiveNode => inactiveNode.id === n.id);
        if (isChildOfInactivated) {
          return { ...n, isActive: false, updatedAt: new Date() };
        }
        
        return {
          ...n,
          children: n.children ? inactivateNodeAndChildren(n.children) : n.children
        };
      });
    };

    setTaxonomyData(inactivateNodeAndChildren(taxonomyData));
    
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
    findNodeById,
    handleNodeCreated,
    handleNodeUpdated,
    handleInactivateNode,
    handleBulkImportComplete,
    handleMergeComplete
  };
};
