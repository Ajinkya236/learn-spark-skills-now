import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { cn } from '@/lib/utils';
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
  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'cluster':
        return '📁';
      case 'group':
        return '📂';
      case 'skill':
        return '🎯';
      default:
        return '📄';
    }
  };
  const getChildType = (parentType: string): 'cluster' | 'group' | 'skill' => {
    switch (parentType) {
      case 'cluster':
        return 'group';
      case 'group':
        return 'skill';
      default:
        return 'skill';
    }
  };
  return <div className={cn("space-y-1", level === 0 && "p-4")}>
      {data.map(node => <div key={node.id} className="group">
          <div className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors", `ml-${level * 4}`)}>
            {/* Expand/Collapse Button */}
            {node.children && node.children.length > 0 ? <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => toggleExpanded(node.id)}>
                {expandedNodes.has(node.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button> : <div className="w-6" />}

            {/* Node Icon & Info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">{getNodeIcon(node.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm md:text-base truncate">{node.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {node.type}
                  </Badge>
                  
                </div>
                {node.description && <p className="text-xs text-muted-foreground truncate">{node.description}</p>}
                <div className="flex items-center gap-4 mt-1">
                  {node.usageCount !== undefined && <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {node.usageCount} users
                    </div>}
                  {node.type === 'skill' && node.proficiencyLevels}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.type !== 'skill' && <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onCreateChild(getChildType(node.type))}>
                  <Plus className="h-4 w-4" />
                </Button>}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(node)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => onInactivate(node)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          {node.children && node.children.length > 0 && expandedNodes.has(node.id) && <TaxonomyTree data={node.children} onEdit={onEdit} onInactivate={onInactivate} onCreateChild={onCreateChild} level={level + 1} />}
        </div>)}
    </div>;
};