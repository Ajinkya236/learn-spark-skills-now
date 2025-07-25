
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxonomyNode } from "@/types/taxonomy";
import { Package, Layers, FolderTree, Target } from "lucide-react";

interface TaxonomyStatsProps {
  data: TaxonomyNode[];
}

export const TaxonomyStats: React.FC<TaxonomyStatsProps> = ({
  data
}) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-inter font-black text-gray-700">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-inter font-black text-gray-900">
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
