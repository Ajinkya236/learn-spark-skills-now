import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Upload, Download, Settings, Trash2, Edit, Merge, RotateCcw, Users, BookOpen } from "lucide-react";
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
      result.push({ ...node, level });
      if (node.children) {
        result = result.concat(flattenTaxonomyData(node.children, level + 1));
      }
    });
    
    return result;
  };

  const flatData = flattenTaxonomyData(taxonomyData);
  const totalPages = Math.ceil(flatData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = flatData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCreateNode = (type: 'cluster' | 'group' | 'skill') => {
    setSelectedNodeType(type);
    setCreateDialogOpen(true);
  };

  const handleEditNode = (node: TaxonomyNode) => {
    setSelectedNode(node);
    setEditDialogOpen(true);
  };

  const handleNodeCreated = (nodeData: Partial<TaxonomyNode>) => {
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" created successfully.`
    });
    setCreateDialogOpen(false);
  };

  const handleNodeUpdated = (nodeData: Partial<TaxonomyNode>) => {
    toast({
      title: "Success",
      description: `${nodeData.type} "${nodeData.name}" updated successfully.`
    });
    setEditDialogOpen(false);
  };

  const handleInactivateNode = (node: TaxonomyNode) => {
    toast({
      title: "Success",
      description: `${node.type} "${node.name}" has been inactivated. You can restore it from the Inactive Bin.`
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

  const getIndentClass = (level: number) => {
    return `pl-${Math.min(level * 4, 16)}`;
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
            <Tabs defaultValue="tree" className="w-full">
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
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-inter">Name</TableHead>
                            <TableHead className="font-inter">Type</TableHead>
                            <TableHead className="font-inter">Description</TableHead>
                            <TableHead className="font-inter">Usage</TableHead>
                            <TableHead className="font-inter">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className={`flex items-center gap-2 ${getIndentClass(item.level)}`}>
                                  <span className="text-lg">
                                    {item.type === 'cluster' ? '📁' : item.type === 'group' ? '📂' : '🎯'}
                                  </span>
                                  <span className="font-medium font-inter">{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getTypeColor(item.type) + " font-inter"}>
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-64 truncate font-inter">
                                {item.description || '-'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  {item.usageCount !== undefined && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Users className="h-3 w-3" />
                                      <span className="font-inter">{item.usageCount}</span>
                                    </div>
                                  )}
                                  {item.type === 'skill' && item.proficiencyLevels && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <BookOpen className="h-3 w-3" />
                                      <span className="font-inter">{item.proficiencyLevels.length}</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditNode(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-4 pb-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TaxonomyManagement;
