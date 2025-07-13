import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, BookOpen, Target, Archive } from "lucide-react";
import { TaxonomyNode } from "@/hooks/useTaxonomyManagement";

interface TaxonomyStatsProps {
  data: TaxonomyNode[];
}

export const TaxonomyStats: React.FC<TaxonomyStatsProps> = ({ data }) => {
  const totalClusters = data.filter(node => node.type === 'cluster').length;
  const totalGroups = data.reduce((count, node) => count + (node.type === 'group' ? 1 : 0), 0);
  const totalSkills = data.reduce((count, node) => count + (node.type === 'skill' ? 1 : 0), 0);
  const totalUsers = data.reduce((sum, node) => sum + (node.usageCount || 0), 0);
  const totalInactive = data.reduce((count, node) => count + (!node.isActive ? 1 : 0), 0);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Clusters</span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalClusters}</div>
          <Badge variant="secondary" className="font-inter">
            {totalClusters} Clusters
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Groups</span>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalGroups}</div>
          <Badge variant="secondary" className="font-inter">
            {totalGroups} Groups
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Skills</span>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalSkills}</div>
          <Badge variant="secondary" className="font-inter">
            {totalSkills} Skills
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Total Users</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalUsers}</div>
          <Badge variant="secondary" className="font-inter">
            {totalUsers} Users
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-bold text-jio-dark font-inter">Inactive Items</span>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-jio-dark font-inter">{totalInactive}</div>
          <Badge variant="secondary" className="font-inter">
            {totalInactive} Inactive
          </Badge>
        </CardContent>
      </Card>
    </>
  );
};
