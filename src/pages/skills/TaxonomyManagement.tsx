import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Upload, Download, Settings, Trash2, Edit, Merge, RotateCcw, Users, BookOpen, Search } from "lucide-react";
import { TaxonomyTree } from "@/components/taxonomy/TaxonomyTree";
import { CreateNodeDialog } from "@/components/taxonomy/CreateNodeDialog";
import { EditNodeDialog } from "@/components/taxonomy/EditNodeDialog";
import { BulkImportDialog } from "@/components/taxonomy/BulkImportDialog";
import { MergeDialog } from "@/components/taxonomy/MergeDialog";
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const getFilteredData = () => {
    const flatData = flattenTaxonomyData(taxonomyData);
    if (!searchTerm) return flatData;
    
    return flatData.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTableData = () => {
    const result: Array<{cluster: string, group: string, skill: string, clusterId?: string, groupId?: string, skillId?: string}> = [];
    
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
            skillId: node.id
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

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    setCreateDialogOpen(false);
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
    setEditDialogOpen(false);
  };

  const handleInactivateNode = (node: TaxonomyNode) => {
    const updateTaxonomy = (nodes: TaxonomyNode[]): TaxonomyNode[] => {
      return nodes.map(n => {
        if (n.id === node.id) {
          return { ...n, isActive: false, updatedAt: new Date() };
        }
        return {
          ...n,
          children: n.children ? updateTaxonomy(n.children) : n.children
        };
      });
    };

    setTaxonomyData(updateTaxonomy(taxonomyData));
    
    toast({
      title: "Success",
      description: `${node.type} "${node.name}" has been inactivated and moved to the Inactive Bin. It has been removed from both Tree and Tabular views.`
    });
  };

  const handleBulkImportComplete = (importedData: TaxonomyNode[]) => {
    const mergeImportedData = (existing: TaxonomyNode[], imported: TaxonomyNode[]): TaxonomyNode[] => {
      const result = [...existing];
      
      imported.forEach(importedNode => {
        const existingIndex = result.findIndex(node => node.id === importedNode.id);
        if (existingIndex >= 0) {
          result[existingIndex] = { ...result[existingIndex], ...importedNode, updatedAt: new Date() };
        } else {
          result.push({ ...importedNode, createdAt: new Date(), updatedAt: new Date() });
        }
      });
      
      return result;
    };

    setTaxonomyData(mergeImportedData(taxonomyData, importedData));
    
    toast({
      title: "Import Complete",
      description: "Taxonomy data has been imported successfully and is now visible in both Tree and Tabular views."
    });
  };

  const handleMergeComplete = (mergedData: TaxonomyNode[]) => {
    setTaxonomyData(mergedData);
    
    toast({
      title: "Merge Complete",
      description: "Items have been merged successfully and changes are reflected in both Tree and Tabular views."
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cluster': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'skill': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <div className="flex-1 space-y-6 p-4 md:p-6 pt-20">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
              <BackButton />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Taxonomy Management</h1>
                <p className="text-muted-foreground font-inter">Create and manage your skills hierarchy</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/skills/taxonomy/inactive')}
                  className="font-inter"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Inactive Bin</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setBulkImportOpen(true)}
                  className="font-inter"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Bulk Import</span>
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              <TaxonomyStats data={taxonomyData} />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-jio-dark font-inter">Quick Actions</CardTitle>
                <CardDescription className="font-inter">Common taxonomy management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateNode('cluster')} 
                    className="justify-start font-inter"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Cluster
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateNode('group')} 
                    className="justify-start font-inter"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Group
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateNode('skill')} 
                    className="justify-start font-inter"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setMergeDialogOpen(true)} 
                    className="justify-start font-inter"
                  >
                    <Merge className="mr-2 h-4 w-4" />
                    Merge Items
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Taxonomy Views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tree" className="font-inter">Tree View</TabsTrigger>
                <TabsTrigger value="table" className="font-inter">Tabular View</TabsTrigger>
              </TabsList>

              <TabsContent value="tree">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-bold text-jio-dark font-inter">Skills Taxonomy Tree</span>
                    </CardTitle>
                    <CardDescription className="font-inter">
                      Organize skills into clusters, groups, and individual skills. Use drag & drop to reorder.
                    </CardDescription>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search clusters, groups, and skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-inter"
                      />
                    </div>
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
              </TabsContent>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-jio-dark font-inter">Taxonomy Table View</CardTitle>
                    <CardDescription className="font-inter">
                      View all clusters, groups, and skills in a structured table format
                    </CardDescription>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search clusters, groups, and skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-inter"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-inter">Cluster</TableHead>
                            <TableHead className="font-inter">Group</TableHead>
                            <TableHead className="font-inter">Skill</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tablePaginatedData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-inter">
                                No data found
                              </TableCell>
                            </TableRow>
                          ) : (
                            tablePaginatedData.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-inter">{item.cluster}</TableCell>
                                <TableCell className="font-inter">{item.group}</TableCell>
                                <TableCell className="font-inter">{item.skill}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {tableTotalPages > 1 && (
                      <div className="flex justify-center mt-4 pb-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {Array.from({ length: tableTotalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(Math.min(tableTotalPages, currentPage + 1))}
                                className={currentPage === tableTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
              onImportComplete={() => handleBulkImportComplete} 
            />

            <MergeDialog 
              open={mergeDialogOpen} 
              onOpenChange={setMergeDialogOpen} 
              nodes={taxonomyData} 
              onMergeComplete={() => handleMergeComplete} 
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TaxonomyManagement;
