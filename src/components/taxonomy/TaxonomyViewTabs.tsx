
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreeViewTab } from "@/components/taxonomy/TreeViewTab";
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
  activeTab,
  onActiveTabChange,
  searchTerm,
  onSearchChange,
  currentPage,
  onPageChange,
  onEdit,
  onInactivate,
  onCreateNode,
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
    if (!searchTerm) return tableData;
    
    return tableData.filter(row => 
      row.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tree" className="font-inter">Tree View</TabsTrigger>
        <TabsTrigger value="table" className="font-inter">Tabular View</TabsTrigger>
      </TabsList>

      <TabsContent value="tree">
        <TreeViewTab
          taxonomyData={taxonomyData}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onEdit={onEdit}
          onInactivate={onInactivate}
          onCreateChild={onCreateNode}
        />
      </TabsContent>

      <TabsContent value="table">
        <TabularViewTab
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          tablePaginatedData={tablePaginatedData}
          currentPage={currentPage}
          tableTotalPages={tableTotalPages}
          onPageChange={onPageChange}
          onEditFromTable={handleEditFromTable}
          onInactivateFromTable={handleInactivateFromTable}
        />
      </TabsContent>
    </Tabs>
  );
};
