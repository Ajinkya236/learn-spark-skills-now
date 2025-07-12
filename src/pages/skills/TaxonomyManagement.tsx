
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Settings, Trash2, Edit, Merge, RotateCcw } from "lucide-react";
import { TaxonomyTree } from "@/components/taxonomy/TaxonomyTree";
import { CreateNodeDialog } from "@/components/taxonomy/CreateNodeDialog";
import { EditNodeDialog } from "@/components/taxonomy/EditNodeDialog";
import { BulkImportDialog } from "@/components/taxonomy/BulkImportDialog";
import { MergeDialog } from "@/components/taxonomy/MergeDialog";
import { InactiveBin } from "@/components/taxonomy/InactiveBin";
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
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

const TaxonomyManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [inactiveBinOpen, setInactiveBinOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<'cluster' | 'group' | 'skill'>('cluster');
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const [taxonomyData, setTaxonomyData] = useState<TaxonomyNode[]>([
    {
      id: '1',
      name: 'Technical Skills',
      description: 'All technical and engineering skills',
      type: 'cluster',
      category: 'Technical',
      rank: 1,
      isActive: true,
      usageCount: 450,
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        {
          id: '2',
          name: 'Programming Languages',
          description: 'Software programming languages',
          type: 'group',
          parentId: '1',
          rank: 1,
          isActive: true,
          usageCount: 320,
          createdAt: new Date(),
          updatedAt: new Date(),
          children: [
            {
              id: '3',
              name: 'Python Programming',
              description: 'Python development skills',
              type: 'skill',
              parentId: '2',
              rank: 1,
              isActive: true,
              usageCount: 240,
              createdAt: new Date(),
              updatedAt: new Date(),
              proficiencyLevels: [
                { id: '1', title: 'Beginner', description: 'Basic syntax', minScore: 0, maxScore: 25, order: 1 },
                { id: '2', title: 'Intermediate', description: 'Advanced concepts', minScore: 26, maxScore: 75, order: 2 },
                { id: '3', title: 'Expert', description: 'Architecture & mentoring', minScore: 76, maxScore: 100, order: 3 }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const handleCreateNode = (type: 'cluster' | 'group' | 'skill') => {
    setSelectedNodeType(type);
    setCreateDialogOpen(true);
  };

  const handleEditNode = (node: TaxonomyNode) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleNodeCreated = (nodeData: Partial<TaxonomyNode>) => {
    // Implementation for creating new node
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" created successfully.`
    });
    setCreateDialogOpen(false);
  };

  const handleNodeUpdated = (nodeData: Partial<TaxonomyNode>) => {
    // Implementation for updating node
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" updated successfully.`
    });
    setEditDialogOpen(false);
  };

  const handleInactivateNode = (node: TaxonomyNode) => {
    // Implementation for inactivating node
    toast({
      title: "Success",
      description: `${node.type} "${node.name}" has been inactivated. You can restore it from the Inactive Bin.`
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Taxonomy Management</h1>
          <p className="text-muted-foreground">Create and manage your skills hierarchy</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setInactiveBinOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Inactive Bin</span>
          </Button>
          <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Bulk Import</span>
          </Button>
          <Button onClick={() => handleCreateNode('cluster')}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Cluster</span>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TaxonomyStats data={taxonomyData} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common taxonomy management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => handleCreateNode('cluster')} className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Cluster
            </Button>
            <Button variant="outline" onClick={() => handleCreateNode('group')} className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
            <Button variant="outline" onClick={() => handleCreateNode('skill')} className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
            <Button variant="outline" onClick={() => setMergeDialogOpen(true)} className="justify-start">
              <Merge className="mr-2 h-4 w-4" />
              Merge Items
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Taxonomy Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Skills Taxonomy Tree</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Organize skills into clusters, groups, and individual skills. Use drag & drop to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <TaxonomyTree 
            data={taxonomyData}
            onEdit={handleEditNode}
            onInactivate={handleInactivateNode}
            onCreateChild={handleCreateNode}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateNodeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        nodeType={selectedNodeType}
        existingNodes={taxonomyData}
        onNodeCreated={handleNodeCreated}
      />

      <EditNodeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        node={selectedNode}
        existingNodes={taxonomyData}
        onNodeUpdated={handleNodeUpdated}
      />

      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        onImportComplete={() => {
          toast({
            title: "Import Complete",
            description: "Taxonomy data has been imported successfully."
          });
        }}
      />

      <MergeDialog
        open={mergeDialogOpen}
        onOpenChange={setMergeDialogOpen}
        nodes={taxonomyData}
        onMergeComplete={() => {
          toast({
            title: "Merge Complete",
            description: "Items have been merged successfully."
          });
        }}
      />

      <InactiveBin
        open={inactiveBinOpen}
        onOpenChange={setInactiveBinOpen}
        onRestore={(node) => {
          toast({
            title: "Restored",
            description: `${node.type} "${node.name}" has been restored.`
          });
        }}
      />
    </div>
  );
};

export default TaxonomyManagement;
