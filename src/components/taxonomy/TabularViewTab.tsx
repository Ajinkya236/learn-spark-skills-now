
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Edit, Archive } from "lucide-react";
import { TaxonomyNode } from "@/types/taxonomy";
import { FilterBubbles } from "@/components/taxonomy/FilterBubbles";

interface TabularViewTabProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tablePaginatedData: Array<{
    cluster: string, 
    group: string, 
    skill: string, 
    clusterId?: string, 
    groupId?: string, 
    skillId?: string,
    node?: TaxonomyNode
  }>;
  currentPage: number;
  tableTotalPages: number;
  onPageChange: (page: number) => void;
  onEditFromTable: (nodeId: string) => void;
  onInactivateFromTable: (nodeId: string) => void;
  taxonomyData: TaxonomyNode[];
}

export const TabularViewTab: React.FC<TabularViewTabProps> = ({
  searchTerm,
  onSearchChange,
  tablePaginatedData,
  currentPage,
  tableTotalPages,
  onPageChange,
  onEditFromTable,
  onInactivateFromTable,
  taxonomyData
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cluster' | 'group' | 'skill'>('all');

  // Calculate counts for filter bubbles
  const filterCounts = useMemo(() => {
    const counts = { total: 0, clusters: 0, groups: 0, skills: 0 };
    
    const traverse = (nodes: TaxonomyNode[]) => {
      nodes.forEach(node => {
        if (node.isActive) {
          counts.total++;
          if (node.type === 'cluster') counts.clusters++;
          else if (node.type === 'group') counts.groups++;
          else if (node.type === 'skill') counts.skills++;
          
          if (node.children) traverse(node.children);
        }
      });
    };
    
    traverse(taxonomyData);
    return counts;
  }, [taxonomyData]);

  // Get expanded table data with filtering
  const getExpandedTableData = () => {
    const expandedData: Array<{
      id: string;
      name: string;
      type: 'cluster' | 'group' | 'skill';
      cluster: string;
      group: string;
      skill: string;
      node?: TaxonomyNode;
    }> = [];

    tablePaginatedData.forEach(item => {
      if (item.node) {
        // Add cluster row
        if (item.clusterId && (activeFilter === 'all' || activeFilter === 'cluster')) {
          expandedData.push({
            id: item.clusterId,
            name: item.cluster,
            type: 'cluster',
            cluster: item.cluster,
            group: '',
            skill: '',
            node: item.node
          });
        }

        // Add group row
        if (item.groupId && (activeFilter === 'all' || activeFilter === 'group')) {
          expandedData.push({
            id: item.groupId,
            name: item.group,
            type: 'group',
            cluster: item.cluster,
            group: item.group,
            skill: '',
            node: item.node
          });
        }

        // Add skill row
        if (item.skillId && (activeFilter === 'all' || activeFilter === 'skill')) {
          expandedData.push({
            id: item.skillId,
            name: item.skill,
            type: 'skill',
            cluster: item.cluster,
            group: item.group,
            skill: item.skill,
            node: item.node
          });
        }
      }
    });

    // Remove duplicates and apply search filter
    const uniqueData = expandedData
      .filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
      .filter(item => {
        if (!searchTerm) return true;
        return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.skill.toLowerCase().includes(searchTerm.toLowerCase());
      });

    return uniqueData;
  };

  const expandedData = getExpandedTableData();

  return (
    <Card className="rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-black text-jio-dark font-inter text-xl">
          Taxonomy Table View
        </CardTitle>
        <CardDescription className="font-inter">
          View all clusters, groups, and skills in a structured table format
        </CardDescription>
        
        {/* Filter Bubbles */}
        <FilterBubbles
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`Search ${activeFilter === 'all' ? 'all items' : activeFilter + 's'}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-inter rounded-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter font-bold">Type</TableHead>
                <TableHead className="font-inter font-bold">Name</TableHead>
                <TableHead className="font-inter font-bold">Cluster</TableHead>
                <TableHead className="font-inter font-bold">Group</TableHead>
                <TableHead className="font-inter font-bold">Skill</TableHead>
                <TableHead className="font-inter font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expandedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-inter">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                expandedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge 
                        variant={
                          item.type === 'cluster' ? 'default' :
                          item.type === 'group' ? 'secondary' : 'outline'
                        }
                        className="rounded-full"
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium font-inter">{item.name}</TableCell>
                    <TableCell className="font-inter">{item.cluster}</TableCell>
                    <TableCell className="font-inter">{item.group}</TableCell>
                    <TableCell className="font-inter">{item.skill}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditFromTable(item.id)}
                          className="font-inter rounded-lg hover:bg-jio-blue/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onInactivateFromTable(item.id)}
                          className="text-orange-600 hover:text-orange-600 hover:bg-orange-50 font-inter rounded-lg"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={`rounded-lg ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-jio-blue/10"}`}
                  />
                </PaginationItem>
                {Array.from({ length: tableTotalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer rounded-lg ${currentPage === page ? "bg-jio-blue text-white" : "hover:bg-jio-blue/10"}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(Math.min(tableTotalPages, currentPage + 1))}
                    className={`rounded-lg ${currentPage === tableTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-jio-blue/10"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
