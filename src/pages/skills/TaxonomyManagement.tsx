
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateNodeDialog } from "@/components/taxonomy/CreateNodeDialog";
import { EditNodeDialog } from "@/components/taxonomy/EditNodeDialog";
import { BulkImportDialog } from "@/components/taxonomy/BulkImportDialog";
import { MergeDialog } from "@/components/taxonomy/MergeDialog";
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { TaxonomyHeader } from "@/components/taxonomy/TaxonomyHeader";
import { QuickActions } from "@/components/taxonomy/QuickActions";
import { TreeViewTab } from "@/components/taxonomy/TreeViewTab";
import { TabularViewTab } from "@/components/taxonomy/TabularViewTab";
import { useTaxonomyManagement } from "@/hooks/useTaxonomyManagement";
import { TaxonomyNode } from "@/types/taxonomy";

const ITEMS_PER_PAGE = 10;

const TaxonomyManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<'cluster' | 'group' | 'skill'>('cluster');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tree');
  const navigate = useNavigate();

  const {
    taxonomyData,
    findNodeById,
    handleNodeCreated,
    handleNodeUpdated,
    handleInactivateNode,
    handleBulkImportComplete,
    handleMergeComplete
  } = useTaxonomyManagement();

  const flattenTaxonomyData = (nodes: TaxonomyNode[], level = 0): Array<TaxonomyNode & { level: number }> => {
    let result: Array<TaxonomyNode & { level: number }> = [];
    
    nodes.forEach(node => {
      if (node.isActive) {
        result.push({ ...node, level });
        if (node.children) {
          result = result.concat(flattenTaxonomyData(node.children, level + 1));
        }
      }
    });
    
    return result;
  };

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

  const handleCreateNode = (type: 'cluster' | 'group' | 'skill') => {
    setSelectedNodeType(type);
    setCreateDialogOpen(true);
  };

  const handleEditNode = (node: TaxonomyNode) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleEditFromTable = (nodeId: string) => {
    const node = findNodeById(taxonomyData, nodeId);
    if (node) {
      setSelectedNode(node);
      setEditDialogOpen(true);
    }
  };

  const handleInactivateFromTable = (nodeId: string) => {
    const node = findNodeById(taxonomyData, nodeId);
    if (node) {
      handleInactivateNode(node);
    }
  };

  const onNodeCreated = (nodeData: Partial<TaxonomyNode>) => {
    handleNodeCreated(nodeData);
    setCreateDialogOpen(false);
  };

  const onNodeUpdated = (nodeData: Partial<TaxonomyNode>) => {
    handleNodeUpdated(nodeData);
    setEditDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            {/* Header with Back Button */}
            <TaxonomyHeader
              onInactiveBinClick={() => navigate('/skills/inactive-bin')}
              onBulkImportClick={() => setBulkImportOpen(true)}
            />

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              <TaxonomyStats data={taxonomyData} />
            </div>

            {/* Quick Actions */}
            <QuickActions
              onCreateNode={handleCreateNode}
              onMergeClick={() => setMergeDialogOpen(true)}
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
                  onEdit={handleEditNode}
                  onInactivate={handleInactivateNode}
                  onCreateChild={handleCreateNode}
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

            {/* Dialogs */}
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
              onImportComplete={handleBulkImportComplete} 
            />

            <MergeDialog 
              open={mergeDialogOpen} 
              onOpenChange={setMergeDialogOpen} 
              nodes={taxonomyData} 
              onMergeComplete={handleMergeComplete} 
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TaxonomyManagement;
