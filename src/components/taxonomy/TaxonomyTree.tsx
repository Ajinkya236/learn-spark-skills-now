
import React, { useState } from 'react';
import { TaxonomyNode } from '@/hooks/useTaxonomyManagement';
import { cn } from '@/lib/utils';
import { TreeNode } from './TreeNode';
import { InactivateDialog } from './InactivateDialog';

interface TaxonomyTreeProps {
  data: TaxonomyNode[];
  onEdit: (node: TaxonomyNode) => void;
  onInactivate: (node: TaxonomyNode) => void;
  onCreateChild: (type: 'cluster' | 'group' | 'skill') => void;
  level?: number;
}

export const TaxonomyTree: React.FC<TaxonomyTreeProps> = ({
  data,
  onEdit,
  onInactivate,
  onCreateChild,
  level = 0
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2']));
  const [inactivateDialog, setInactivateDialog] = useState<{open: boolean, node: TaxonomyNode | null}>({
    open: false,
    node: null
  });

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleInactivateClick = (node: TaxonomyNode) => {
    setInactivateDialog({ open: true, node });
  };

  const handleConfirmInactivate = () => {
    if (inactivateDialog.node) {
      onInactivate(inactivateDialog.node);
      setInactivateDialog({ open: false, node: null });
    }
  };

  const handleCancelInactivate = () => {
    setInactivateDialog({ open: false, node: null });
  };

  return (
    <>
      <div className={cn("space-y-1", level === 0 && "p-4")}>
        {data.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            level={level}
            isExpanded={expandedNodes.has(node.id)}
            onToggleExpanded={toggleExpanded}
            onEdit={onEdit}
            onInactivate={handleInactivateClick}
            onCreateChild={onCreateChild}
          >
            {/* Children */}
            {node.children && node.children.length > 0 && expandedNodes.has(node.id) && (
              <TaxonomyTree 
                data={node.children}
                onEdit={onEdit}
                onInactivate={onInactivate}
                onCreateChild={onCreateChild}
                level={level + 1}
              />
            )}
          </TreeNode>
        ))}
      </div>

      {/* Inactivate Confirmation Dialog */}
      <InactivateDialog
        open={inactivateDialog.open}
        node={inactivateDialog.node}
        onClose={handleCancelInactivate}
        onConfirm={handleConfirmInactivate}
      />
    </>
  );
};
