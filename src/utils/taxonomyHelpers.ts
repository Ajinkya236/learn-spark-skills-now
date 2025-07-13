
import { TaxonomyNode } from '@/types/taxonomy';

export const getAllChildren = (node: TaxonomyNode): TaxonomyNode[] => {
  let children: TaxonomyNode[] = [];
  if (node.children) {
    node.children.forEach(child => {
      children.push(child);
      children = children.concat(getAllChildren(child));
    });
  }
  return children;
};

export const findNodeById = (nodes: TaxonomyNode[], id: string): TaxonomyNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const createNewNode = (nodeData: Partial<TaxonomyNode>): TaxonomyNode => {
  return {
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
};
