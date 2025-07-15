
import React from 'react';
import { TabularViewTab } from "@/components/taxonomy/TabularViewTab";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyViewTabsProps {
  taxonomyData: TaxonomyNode[];
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateNode: (type: 'cluster' | 'group' | 'skill') => void;
  findNodeById: (id: string) => TaxonomyNode | null;
}

const ITEMS_PER_PAGE = 10;

export const TaxonomyViewTabs: React.FC<TaxonomyViewTabsProps> = ({
  taxonomyData,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  onEdit,
  onInactivate,
  findNodeById
}) => {
  const getTableData = () => {
    const result: Array<{
      cluster: string, 
      group: string, 
      skill: string, 
      clusterId?: string, 
      groupId?: string, 
      skillId?: string,
      node?: TaxonomyNode
    }> = [];
    
    const traverse = (nodes: TaxonomyNode[], clusterName = '', groupName = '', clusterId?: string, groupId?: string) => {
      nodes.forEach(node => {
        if (!node.isActive) return;
        
        if (node.type === 'cluster') {
          traverse(node.children || [], node.name, '', node.id, '');
        } else if (node.type === 'group') {
          traverse(node.children || [], clusterName, node.name, clusterId, node.id);
        } else if (node.type === 'skill') {
          result.push({
            cluster: clusterName,
            group: groupName,
            skill: node.name,
            clusterId,
            groupId,
            skillId: node.id,
            node
          });
        }
      });
    };
    
    traverse(taxonomyData);
    return result;
  };

  const getFilteredTableData = () => {
    const tableData = getTableData();
    return tableData;
  };

  const filteredTableData = getFilteredTableData();
  const tableTotalPages = Math.ceil(filteredTableData.length / ITEMS_PER_PAGE);
  const tableStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const tablePaginatedData = filteredTableData.slice(tableStartIndex, tableStartIndex + ITEMS_PER_PAGE);

  const handleEditFromTable = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (node) {
      onEdit(node);
    }
  };

  const handleInactivateFromTable = (nodeId: string) => {
    const node = findNodeById(nodeId);
    if (node) {
      onInactivate(node);
    }
  };

  return (
    <div className="w-full">
      <TabularViewTab
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        tablePaginatedData={tablePaginatedData}
        currentPage={currentPage}
        tableTotalPages={tableTotalPages}
        onPageChange={onPageChange}
        onEditFromTable={handleEditFromTable}
        onInactivateFromTable={handleInactivateFromTable}
        taxonomyData={taxonomyData}
      />
    </div>
  );
};
