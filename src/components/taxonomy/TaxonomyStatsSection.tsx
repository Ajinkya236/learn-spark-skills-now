
import React from 'react';
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyStatsSectionProps {
  taxonomyData: TaxonomyNode[];
}

export const TaxonomyStatsSection: React.FC<TaxonomyStatsSectionProps> = ({ taxonomyData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <TaxonomyStats data={taxonomyData} />
    </div>
  );
};
