
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { RotateCcw, Search, AlertTriangle, Archive, Users, BookOpen, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";

interface InactiveItem {
  id: string;
  name: string;
  description?: string;
  type: 'cluster' | 'group' | 'skill' | 'proficiency';
  parentName?: string;
  inactivatedAt: Date;
  inactivatedBy: string;
  employeeCount: number;
  courseCount: number;
  roleCount: number;
}

const ITEMS_PER_PAGE = 10;

const InactiveBin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const [inactiveItems, setInactiveItems] = useState<InactiveItem[]>([]);

  // Load inactive items from global state or localStorage
  useEffect(() => {
    // In real app, this would fetch from API
    const loadInactiveItems = () => {
      try {
        const stored = localStorage.getItem('inactiveItems');
        if (stored) {
          const items = JSON.parse(stored).map((item: any) => ({
            ...item,
            inactivatedAt: new Date(item.inactivatedAt)
          }));
          setInactiveItems(items);
        }
      } catch (error) {
        console.error('Error loading inactive items:', error);
      }
    };

    loadInactiveItems();
    
    // Refresh every few seconds to catch updates from other pages
    const interval = setInterval(loadInactiveItems, 2000);
    return () => clearInterval(interval);
  }, []);

  // Save inactive items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inactiveItems', JSON.stringify(inactiveItems));
  }, [inactiveItems]);

  const typeOptions = [
    { value: 'all', label: 'All', count: inactiveItems.length },
    { value: 'cluster', label: 'Cluster', count: inactiveItems.filter(item => item.type === 'cluster').length },
    { value: 'group', label: 'Group', count: inactiveItems.filter(item => item.type === 'group').length },
    { value: 'skill', label: 'Skill', count: inactiveItems.filter(item => item.type === 'skill').length },
    { value: 'proficiency', label: 'Proficiency', count: inactiveItems.filter(item => item.type === 'proficiency').length }
  ];

  const getFilteredData = () => {
    let filtered = inactiveItems;

    // Filter by type
    if (!selectedTypes.includes('all')) {
      filtered = filtered.filter(item => selectedTypes.includes(item.type));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTypeFilter = (type: string) => {
    if (type === 'all') {
      setSelectedTypes(['all']);
    } else {
      const newTypes = selectedTypes.includes('all') 
        ? [type]
        : selectedTypes.includes(type)
          ? selectedTypes.filter(t => t !== type)
          : [...selectedTypes.filter(t => t !== 'all'), type];
      
      setSelectedTypes(newTypes.length === 0 ? ['all'] : newTypes);
    }
    setCurrentPage(1);
  };

  const handleRestore = (item: InactiveItem) => {
    // Remove from inactive items
    setInactiveItems(prev => prev.filter(i => i.id !== item.id));
    
    // If it's a proficiency, add it back to proficiency mappings
    if (item.type === 'proficiency') {
      // In real app, this would call API to restore proficiency
      const restoredProficiency = {
        id: item.id,
        skillId: 'sample-skill-id',
        skillName: 'Sample Skill',
        proficiencyDescription: item.description || item.name,
        proficiencyLevelId: 'sample-level-id',
        proficiencyLevelTitle: 'Intermediate',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      // Store in localStorage for ProficiencyLevels page to pick up
      const storedProficiencies = localStorage.getItem('proficiencyMappings');
      let proficiencies = storedProficiencies ? JSON.parse(storedProficiencies) : [];
      proficiencies.push(restoredProficiency);
      localStorage.setItem('proficiencyMappings', JSON.stringify(proficiencies));
    } else {
      // For taxonomy items, store restoration signal
      const restorationSignal = {
        type: 'restore',
        item: {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          isActive: true,
          updatedAt: new Date()
        },
        timestamp: Date.now()
      };
      localStorage.setItem('taxonomyRestoration', JSON.stringify(restorationSignal));
    }
    
    toast({
      title: "Item Restored",
      description: `${item.type} "${item.name}" has been restored and will appear in the appropriate active section.`
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cluster': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'skill': return 'bg-purple-100 text-purple-800';
      case 'proficiency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBubbleVariant = (type: string, isSelected: boolean) => {
    if (isSelected) {
      return "default";
    }
    return "outline";
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
                <h1 className="text-2xl md:text-3xl font-black text-jio-dark font-inter">Inactive Bin</h1>
                <p className="text-muted-foreground font-inter">Manage inactivated taxonomy items</p>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-orange-800 font-inter">Items are Inactive</h3>
                  <p className="text-sm text-orange-700 font-inter">
                    These items have been inactivated and can be restored at any time. Restoring will make them active again.
                  </p>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">Filter & Search</CardTitle>
                <CardDescription className="font-inter">
                  Filter by type and search through inactive items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Bubble Filters */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 font-inter">Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={getBubbleVariant(option.value, selectedTypes.includes(option.value))}
                        size="sm"
                        onClick={() => handleTypeFilter(option.value)}
                        className="font-inter"
                      >
                        {option.label} ({option.count})
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search inactive items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-inter"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inactive Items Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-jio-dark font-inter">
                  Inactive Items ({filteredData.length})
                </CardTitle>
                <CardDescription className="font-inter">
                  Items that have been inactivated and can be restored
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-inter">Name</TableHead>
                        <TableHead className="font-inter">Type</TableHead>
                        <TableHead className="font-inter">Parent</TableHead>
                        <TableHead className="font-inter">Description</TableHead>
                        <TableHead className="font-inter">Inactivated</TableHead>
                        <TableHead className="font-inter">Status</TableHead>
                        <TableHead className="font-inter">Impact</TableHead>
                        <TableHead className="font-inter">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground font-inter">
                            <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No inactive items found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium font-inter">{item.name}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(item.type) + " font-inter"}>
                                {item.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-inter">{item.parentName || '-'}</TableCell>
                            <TableCell className="max-w-64 truncate font-inter">
                              {item.description || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-inter">
                                <div>{item.inactivatedAt.toLocaleDateString()}</div>
                                <div className="text-xs text-muted-foreground">by {item.inactivatedBy}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-orange-600 font-inter">
                                Inactive
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm font-inter">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {item.employeeCount} employees
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {item.courseCount} courses
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" />
                                  {item.roleCount} roles
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRestore(item)}
                                className="text-green-600 hover:text-green-600 hover:bg-green-50 font-inter"
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Restore
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default InactiveBin;
