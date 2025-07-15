
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyStatsProps {
  data: TaxonomyNode[];
}

export const TaxonomyStats: React.FC<TaxonomyStatsProps> = ({ data }) => {
  const calculateStats = () => {
    let totalClusters = 0;
    let totalGroups = 0;
    let totalSkills = 0;

    const traverse = (nodes: TaxonomyNode[]) => {
      nodes.forEach(node => {
        if (node.isActive) {
          if (node.type === 'cluster') totalClusters++;
          else if (node.type === 'group') totalGroups++;
          else if (node.type === 'skill') totalSkills++;
          
          if (node.children) {
            traverse(node.children);
          }
        }
      });
    };

    traverse(data);
    
    return {
      totalClusters,
      totalGroups,
      totalSkills,
      totalItems: totalClusters + totalGroups + totalSkills
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-inter">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-inter">{stats.totalItems}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-inter">Clusters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-inter">{stats.totalClusters}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-inter">Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-inter">{stats.totalGroups}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-inter">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-inter">{stats.totalSkills}</div>
        </CardContent>
      </Card>
    </div>
  );
};
