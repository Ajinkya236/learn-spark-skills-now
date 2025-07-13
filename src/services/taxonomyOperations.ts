
import { TaxonomyNode, InactiveItem } from '@/types/taxonomy';
import { getAllChildren, findNodeById, createNewNode } from '@/utils/taxonomyHelpers';

// Global state for inactive items (in real app, this would be in state management)
let globalInactiveItems: InactiveItem[] = [];

export const getInactiveItems = (): InactiveItem[] => {
  return [...globalInactiveItems];
};

export const addToInactiveItems = (items: InactiveItem[]): void => {
  globalInactiveItems.push(...items);
};

export const updateTaxonomyWithNewNode = (
  nodes: TaxonomyNode[], 
  nodeData: Partial<TaxonomyNode>
): TaxonomyNode[] => {
  const newNode = createNewNode(nodeData);

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

  return updateTaxonomy(nodes);
};

export const updateTaxonomyNode = (
  nodes: TaxonomyNode[], 
  nodeData: Partial<TaxonomyNode>
): TaxonomyNode[] => {
  return nodes.map(node => {
    if (node.id === nodeData.id) {
      return { ...node, ...nodeData, updatedAt: new Date() };
    }
    return {
      ...node,
      children: node.children ? updateTaxonomyNode(node.children, nodeData) : node.children
    };
  });
};

export const inactivateNodeAndChildren = (
  nodes: TaxonomyNode[], 
  nodeToInactivate: TaxonomyNode,
  allNodesToInactivate: TaxonomyNode[]
): TaxonomyNode[] => {
  return nodes.map(n => {
    if (n.id === nodeToInactivate.id) {
      return { ...n, isActive: false, updatedAt: new Date() };
    }
    
    // Check if this node is a child of the inactivated node
    const isChildOfInactivated = allNodesToInactivate.some(inactiveNode => inactiveNode.id === n.id);
    if (isChildOfInactivated) {
      return { ...n, isActive: false, updatedAt: new Date() };
    }
    
    return {
      ...n,
      children: n.children ? inactivateNodeAndChildren(n.children, nodeToInactivate, allNodesToInactivate) : n.children
    };
  });
};

export const createInactiveItems = (
  nodesToInactivate: TaxonomyNode[],
  allNodes: TaxonomyNode[]
): InactiveItem[] => {
  return nodesToInactivate.map(nodeToInactivate => ({
    id: nodeToInactivate.id,
    name: nodeToInactivate.name,
    description: nodeToInactivate.description,
    type: nodeToInactivate.type,
    parentName: nodeToInactivate.parentId ? findNodeById(allNodes, nodeToInactivate.parentId)?.name : undefined,
    inactivatedAt: new Date(),
    inactivatedBy: 'Current User',
    employeeCount: nodeToInactivate.employeeCount || 0,
    courseCount: nodeToInactivate.courseCount || 0,
    roleCount: nodeToInactivate.roleCount || 0
  }));
};
