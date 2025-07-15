
import React, { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Check } from "lucide-react";
import { TaxonomyNode } from "@/types/taxonomy";

interface ParentSelectorProps {
  parentType: 'cluster' | 'group';
  selectedParentId: string;
  onParentSelect: (parentId: string) => void;
  availableParents: TaxonomyNode[];
  error?: string;
}

export const ParentSelector: React.FC<ParentSelectorProps> = ({
  parentType,
  selectedParentId,
  onParentSelect,
  availableParents,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredParents = useMemo(() => {
    if (!searchTerm) return availableParents;
    return availableParents.filter(parent => 
      parent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableParents, searchTerm]);

  const selectedParent = availableParents.find(p => p.id === selectedParentId);

  const handleParentSelect = (parent: TaxonomyNode) => {
    onParentSelect(parent.id);
    setSearchTerm(parent.name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      <Label className="font-inter font-medium">
        Parent {parentType.charAt(0).toUpperCase() + parentType.slice(1)} *
      </Label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`Search ${parentType}s...`}
            value={searchTerm || selectedParent?.name || ''}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="pl-10 font-inter rounded-lg"
          />
        </div>
        
        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg shadow-lg border">
            <CardContent className="p-0">
              {filteredParents.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground font-inter">
                  No {parentType}s found
                </div>
              ) : (
                filteredParents.map((parent) => (
                  <Button
                    key={parent.id}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto rounded-none font-inter hover:bg-jio-blue/10"
                    onClick={() => handleParentSelect(parent)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-full">
                          {parent.type}
                        </Badge>
                        <div className="text-left">
                          <div className="font-medium">{parent.name}</div>
                          {parent.description && (
                            <div className="text-sm text-muted-foreground">
                              {parent.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedParentId === parent.id && (
                        <Check className="h-4 w-4 text-jio-blue" />
                      )}
                    </div>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {error && <p className="text-sm text-destructive font-inter">{error}</p>}
    </div>
  );
};
