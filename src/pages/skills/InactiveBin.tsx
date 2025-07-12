
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Search, Trash2, AlertCircle, Filter } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

const InactiveBinPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('inactive');
  const { toast } = useToast();

  // Mock inactive items
  const inactiveItems: TaxonomyNode[] = [
    {
      id: 'inactive-1',
      name: 'Legacy Java Skills',
      description: 'Old Java skill cluster',
      type: 'cluster',
      rank: 1,
      isActive: false,
      usageCount: 45,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'inactive-2',
      name: 'Flash Development',
      description: 'Adobe Flash development skills',
      type: 'skill',
      parentId: 'some-group',
      rank: 3,
      isActive: false,
      usageCount: 12,
      createdAt: new Date('2022-06-10'),
      updatedAt: new Date('2023-12-01')
    },
    {
      id: 'inactive-3',
      name: 'Old Web Technologies',
      description: 'Outdated web development group',
      type: 'group',
      parentId: 'some-cluster',
      rank: 2,
      isActive: false,
      usageCount: 28,
      createdAt: new Date('2022-08-15'),
      updatedAt: new Date('2023-11-20')
    }
  ];

  const filteredItems = inactiveItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' ? item.isActive : !item.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRestore = (item: TaxonomyNode) => {
    toast({
      title: "Restored",
      description: `${item.type} "${item.name}" has been restored successfully.`,
    });
  };

  const handlePermanentDelete = (item: TaxonomyNode) => {
    toast({
      title: "Permanently Deleted",
      description: `${item.type} "${item.name}" has been permanently deleted.`,
      variant: "destructive"
    });
  };

  const getDaysInactive = (updatedAt: Date): number => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRetentionWarning = (daysInactive: number): string => {
    const daysLeft = 30 - daysInactive;
    if (daysLeft <= 0) {
      return 'Can be permanently deleted';
    } else if (daysLeft <= 7) {
      return `Will be auto-deleted in ${daysLeft} days`;
    }
    return '';
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
          <div className="flex-1 space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inactive Bin</h1>
                <p className="text-muted-foreground">Manage inactivated taxonomy items</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredItems.length} items found
              </Badge>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="cluster">Clusters</SelectItem>
                        <SelectItem value="group">Groups</SelectItem>
                        <SelectItem value="skill">Skills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Bubbles */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {typeFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Type: {typeFilter}
                      <button onClick={() => setTypeFilter('all')} className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== 'inactive' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter('inactive')} className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Inactive Items</CardTitle>
                <CardDescription>
                  Items are kept for 30 days before permanent deletion.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Usage</TableHead>
                          <TableHead>Inactive For</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map(item => {
                          const daysInactive = getDaysInactive(item.updatedAt);
                          const retentionWarning = getRetentionWarning(daysInactive);
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getTypeColor(item.type)}>
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{item.usageCount || 0} users</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{daysInactive} days</span>
                              </TableCell>
                              <TableCell>
                                {retentionWarning && (
                                  <div className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm text-orange-600">
                                      {retentionWarning}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRestore(item)}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Restore
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePermanentDelete(item)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default InactiveBinPage;
