
import React from 'react';
import { TaxonomyStats } from "@/components/taxonomy/TaxonomyStats";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyStatsSectionProps {
  taxonomyData: TaxonomyNode[];
}

export const TaxonomyStatsSection: React.FC<TaxonomyStatsSectionProps> = ({
  taxonomyData
}) => {
  return (
    <div className="mb-6">
      <TaxonomyStats data={taxonomyData} />
    </div>
  );
};
