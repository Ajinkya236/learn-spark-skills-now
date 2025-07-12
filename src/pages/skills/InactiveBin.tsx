
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RotateCcw, Search, Trash2, AlertCircle, X } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";

const ITEMS_PER_PAGE = 10;

const InactiveBinPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
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
    },
    {
      id: 'inactive-4',
      name: 'Silverlight Programming',
      description: 'Microsoft Silverlight development',
      type: 'skill',
      parentId: 'some-group',
      rank: 1,
      isActive: false,
      usageCount: 8,
      createdAt: new Date('2022-03-20'),
      updatedAt: new Date('2023-10-15')
    }
  ];

  const filteredItems = inactiveItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleRestore = (item: TaxonomyNode) => {
    toast({
      title: "Restored",
      description: `${item.type} "${item.name}" has been restored successfully.`,
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
      return 'Inactive';
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

  const clearTypeFilter = () => setTypeFilter('all');
  const clearSearchFilter = () => setSearchTerm('');

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
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Inactive Bin</h1>
                <p className="text-muted-foreground font-inter">Manage inactivated taxonomy items</p>
              </div>
              <Badge variant="outline" className="text-sm font-inter">
                {filteredItems.length} items found
              </Badge>
            </div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-jio-dark font-inter">Search & Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 font-inter"
                    />
                  </div>

                  {/* Filter Bubbles */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {['cluster', 'group', 'skill'].map((type) => (
                        <Badge
                          key={type}
                          variant={typeFilter === type ? "default" : "outline"}
                          className={`cursor-pointer capitalize font-inter ${
                            typeFilter === type ? 'bg-jio-blue hover:bg-jio-blue/90' : ''
                          }`}
                          onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                        >
                          {type}
                          {typeFilter === type && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearTypeFilter();
                              }}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {/* Applied Filters */}
                    {searchTerm && (
                      <Badge variant="secondary" className="flex items-center gap-1 font-inter">
                        Search: "{searchTerm}"
                        <button onClick={clearSearchFilter} className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">Inactive Items</CardTitle>
                <CardDescription className="font-inter">
                  Items are kept for 30 days before permanent deletion.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {paginatedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 font-inter">No items found</h3>
                    <p className="text-muted-foreground font-inter">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter font-semibold">Name</TableHead>
                          <TableHead className="font-inter font-semibold">Type</TableHead>
                          <TableHead className="font-inter font-semibold">Usage</TableHead>
                          <TableHead className="font-inter font-semibold">Inactive For</TableHead>
                          <TableHead className="font-inter font-semibold">Status</TableHead>
                          <TableHead className="font-inter font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedItems.map(item => {
                          const daysInactive = getDaysInactive(item.updatedAt);
                          const retentionWarning = getRetentionWarning(daysInactive);
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium font-inter text-jio-dark">{item.name}</p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground font-inter">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getTypeColor(item.type) + " font-inter"}>
                                  {item.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-inter">{item.usageCount || 0} users</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-inter">{daysInactive} days</span>
                              </TableCell>
                              <TableCell>
                                {retentionWarning && (
                                  <div className="flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm text-orange-600 font-inter">
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
                                    className="font-inter"
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Restore
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

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
