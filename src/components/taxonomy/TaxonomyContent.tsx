
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
import { QuickActions } from "@/components/taxonomy/QuickActions";
import { TreeViewTab } from "@/components/taxonomy/TreeViewTab";
import { TabularViewTab } from "@/components/taxonomy/TabularViewTab";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyContentProps {
  taxonomyData: TaxonomyNode[];
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateNode: (type: 'cluster' | 'group' | 'skill') => void;
  onMergeClick: () => void;
  findNodeById: (id: string) => TaxonomyNode | null;
}

const ITEMS_PER_PAGE = 10;

export const TaxonomyContent: React.FC<TaxonomyContentProps> = ({
  taxonomyData,
  onEdit,
  onInactivate,
  onCreateNode,
  onMergeClick,
  findNodeById
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tree');

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
    <>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <TaxonomyStats data={taxonomyData} />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onCreateNode={onCreateNode}
        onMergeClick={onMergeClick}
      />

      {/* Taxonomy Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tree" className="font-inter">Tree View</TabsTrigger>
          <TabsTrigger value="table" className="font-inter">Tabular View</TabsTrigger>
        </TabsList>

        <TabsContent value="tree">
          <TreeViewTab
            taxonomyData={taxonomyData}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={onEdit}
            onInactivate={onInactivate}
            onCreateChild={onCreateNode}
          />
        </TabsContent>

        <TabsContent value="table">
          <TabularViewTab
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tablePaginatedData={tablePaginatedData}
            currentPage={currentPage}
            tableTotalPages={tableTotalPages}
            onPageChange={setCurrentPage}
            onEditFromTable={handleEditFromTable}
            onInactivateFromTable={handleInactivateFromTable}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
