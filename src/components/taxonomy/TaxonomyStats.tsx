
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxonomyNode } from "@/types/taxonomy";
import { Package, Layers, FolderTree, Target } from "lucide-react";

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

  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Clusters",
      value: stats.totalClusters,
      icon: Layers,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Groups",
      value: stats.totalGroups,
      icon: FolderTree,
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Skills",
      value: stats.totalSkills,
      icon: Target,
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden aspect-square rounded-xl border-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`} />
            <CardHeader className="relative flex flex-col items-center justify-center space-y-2 p-4 text-white h-full">
              <Icon className="h-8 w-8 text-white/80" />
              <div className="text-center">
                <div className="text-2xl font-black font-inter text-white">{stat.value}</div>
                <CardTitle className="text-sm font-black font-inter">{stat.title}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
