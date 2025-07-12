
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Layers, Target, Download } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';

interface TaxonomyStatsProps {
  data: TaxonomyNode[];
}

export const TaxonomyStats: React.FC<TaxonomyStatsProps> = ({ data }) => {
  const { toast } = useToast();

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

  const exportToExcel = () => {
    const exportData: Array<{no: number, cluster: string, group: string, skill: string}> = [];
    let counter = 1;

    const traverse = (nodeArray: TaxonomyNode[], clusterName = '', groupName = '') => {
      nodeArray.forEach(node => {
        if (!node.isActive) return;
        
        if (node.type === 'cluster') {
          if (node.children) {
            traverse(node.children, node.name, '');
          }
        } else if (node.type === 'group') {
          if (node.children) {
            traverse(node.children, clusterName, node.name);
          }
        } else if (node.type === 'skill') {
          exportData.push({
            no: counter++,
            cluster: clusterName,
            group: groupName,
            skill: node.name
          });
        }
      });
    };

    traverse(data);

    // Create CSV content
    const headers = ['No', 'Cluster', 'Group', 'Skill'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        [row.no, row.cluster, row.group, row.skill].map(cell => 
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'skills-taxonomy.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Complete",
      description: "Skills taxonomy has been exported to CSV file."
    });
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
            <CardTitle className="text-sm font-medium text-muted-foreground font-inter">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-jio-dark font-inter">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 font-inter">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
      
      {/* Download Button Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground font-inter">
            Export Data
          </CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button 
            onClick={exportToExcel}
            className="w-full bg-jio-blue hover:bg-jio-blue/90 text-jio-white font-inter font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
          <p className="text-xs text-muted-foreground mt-2 font-inter">
            Export taxonomy structure
          </p>
        </CardContent>
      </Card>
    </>
  );
};
