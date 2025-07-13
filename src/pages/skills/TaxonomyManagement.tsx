
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TaxonomyHeader } from "@/components/taxonomy/TaxonomyHeader";
import { TaxonomyLayout } from "@/components/taxonomy/TaxonomyLayout";
import { TaxonomyContent } from "@/components/taxonomy/TaxonomyContent";
import { TaxonomyDialogs } from "@/components/taxonomy/TaxonomyDialogs";
import { useTaxonomyManagement } from "@/hooks/useTaxonomyManagement";
import { TaxonomyNode } from "@/types/taxonomy";

const TaxonomyManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<'cluster' | 'group' | 'skill'>('cluster');
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

  const handleCreateNode = (type: 'cluster' | 'group' | 'skill') => {
    setSelectedNodeType(type);
    setCreateDialogOpen(true);
  };

  const handleEditNode = (node: TaxonomyNode) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
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
    <TaxonomyLayout>
      {/* Header with Back Button */}
      <TaxonomyHeader
        onInactiveBinClick={() => navigate('/skills/inactive-bin')}
        onBulkImportClick={() => setBulkImportOpen(true)}
      />

      {/* Main Content */}
      <TaxonomyContent
        taxonomyData={taxonomyData}
        onEdit={handleEditNode}
        onInactivate={handleInactivateNode}
        onCreateNode={handleCreateNode}
        onMergeClick={() => setMergeDialogOpen(true)}
        findNodeById={findNodeById}
      />

      {/* Dialogs */}
      <TaxonomyDialogs
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        bulkImportOpen={bulkImportOpen}
        setBulkImportOpen={setBulkImportOpen}
        mergeDialogOpen={mergeDialogOpen}
        setMergeDialogOpen={setMergeDialogOpen}
        selectedNode={selectedNode}
        selectedNodeType={selectedNodeType}
        taxonomyData={taxonomyData}
        onNodeCreated={onNodeCreated}
        onNodeUpdated={onNodeUpdated}
        onBulkImportComplete={handleBulkImportComplete}
        onMergeComplete={handleMergeComplete}
      />
    </TaxonomyLayout>
  );
};

export default TaxonomyManagement;
