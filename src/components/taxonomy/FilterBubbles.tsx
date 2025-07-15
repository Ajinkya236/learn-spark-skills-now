
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterBubblesProps {
  activeFilter: 'all' | 'cluster' | 'group' | 'skill';
  onFilterChange: (filter: 'all' | 'cluster' | 'group' | 'skill') => void;
  counts: {
    total: number;
    clusters: number;
    groups: number;
    skills: number;
  };
}

export const FilterBubbles: React.FC<FilterBubblesProps> = ({
  activeFilter,
  onFilterChange,
  counts
}) => {
  const filters = [
    { key: 'all' as const, label: 'All', count: counts.total },
    { key: 'cluster' as const, label: 'Clusters', count: counts.clusters },
    { key: 'group' as const, label: 'Groups', count: counts.groups },
    { key: 'skill' as const, label: 'Skills', count: counts.skills }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className={`rounded-full font-inter transition-all duration-200 ${
            activeFilter === filter.key 
              ? "bg-jio-blue hover:bg-jio-blue/90 text-white shadow-lg" 
              : "hover:bg-jio-blue/10 hover:border-jio-blue/30"
          }`}
        >
          {filter.label}
          <Badge 
            variant="secondary" 
            className={`ml-2 rounded-full text-xs ${
              activeFilter === filter.key 
                ? "bg-white/20 text-white" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
};
