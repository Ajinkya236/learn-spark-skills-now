
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Layers, Target } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';

interface TaxonomyStatsProps {
  data: TaxonomyNode[];
}

export const TaxonomyStats: React.FC<TaxonomyStatsProps> = ({ data }) => {
  const calculateStats = (nodes: TaxonomyNode[]): {
    clusters: number;
    groups: number;
    skills: number;
    totalUsers: number;
  } => {
    let clusters = 0;
    let groups = 0;
    let skills = 0;
    let totalUsers = 0;

    const traverse = (nodeArray: TaxonomyNode[]) => {
      nodeArray.forEach(node => {
        if (!node.isActive) return;
        
        switch (node.type) {
          case 'cluster':
            clusters++;
            break;
          case 'group':
            groups++;
            break;
          case 'skill':
            skills++;
            break;
        }
        
        totalUsers += node.usageCount || 0;
        
        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);
    return { clusters, groups, skills, totalUsers };
  };

  const stats = calculateStats(data);

  const statCards = [
    {
      title: 'Total Clusters',
      value: stats.clusters,
      icon: Layers,
      description: 'Active skill clusters'
    },
    {
      title: 'Total Groups',
      value: stats.groups,
      icon: TrendingUp,
      description: 'Active skill groups'
    },
    {
      title: 'Total Skills',
      value: stats.skills,
      icon: Target,
      description: 'Individual skills'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Employees using skills'
    }
  ];

  return (
    <>
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
