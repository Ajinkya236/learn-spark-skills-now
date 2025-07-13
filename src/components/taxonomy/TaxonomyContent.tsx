
import React, { useState } from 'react';
import { TaxonomyStatsSection } from "@/components/taxonomy/TaxonomyStatsSection";
import { QuickActions } from "@/components/taxonomy/QuickActions";
import { TaxonomyViewTabs } from "@/components/taxonomy/TaxonomyViewTabs";
import { TaxonomyNode } from "@/types/taxonomy";

interface TaxonomyContentProps {
  taxonomyData: TaxonomyNode[];
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateNode: (type: 'cluster' | 'group' | 'skill') => void;
  onMergeClick: () => void;
  findNodeById: (id: string) => TaxonomyNode | null;
}

export const TaxonomyContent: React.FC<TaxonomyContentProps> = ({
  taxonomyData,
  onEdit,
  onInactivate,
  onCreateNode,
  onMergeClick,
  findNodeById
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tree');

  return (
    <>
      {/* Statistics */}
      <TaxonomyStatsSection taxonomyData={taxonomyData} />

      {/* Quick Actions */}
      <QuickActions
        onCreateNode={onCreateNode}
        onMergeClick={onMergeClick}
      />

      {/* Taxonomy Views */}
      <TaxonomyViewTabs
        taxonomyData={taxonomyData}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEdit={onEdit}
        onInactivate={onInactivate}
        onCreateNode={onCreateNode}
        findNodeById={findNodeById}
      />
    </>
  );
};
