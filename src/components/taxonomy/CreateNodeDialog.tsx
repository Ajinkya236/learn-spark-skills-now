
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { TaxonomyNode, ProficiencyLevel } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';

interface CreateNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeType: 'cluster' | 'group' | 'skill';
  existingNodes: TaxonomyNode[];
  onNodeCreated: (node: Partial<TaxonomyNode>) => void;
}

export const CreateNodeDialog: React.FC<CreateNodeDialogProps> = ({
  open,
  onOpenChange,
  nodeType,
  existingNodes,
  onNodeCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    parentId: '',
    rank: 1
  });
  const [proficiencyLevels, setProficiencyLevels] = useState<Omit<ProficiencyLevel, 'id'>[]>([
    {
      title: 'Beginner',
      description: '',
      minScore: 0,
      maxScore: 25,
      order: 1
    },
    {
      title: 'Intermediate',
      description: '',
      minScore: 26,
      maxScore: 75,
      order: 2
    },
    {
      title: 'Expert',
      description: '',
      minScore: 76,
      maxScore: 100,
      order: 3
    }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const getAvailableParents = () => {
    const parents: TaxonomyNode[] = [];
    const traverse = (nodes: TaxonomyNode[]) => {
      nodes.forEach(node => {
        if (nodeType === 'group' && node.type === 'cluster') {
          parents.push(node);
        } else if (nodeType === 'skill' && node.type === 'group') {
          parents.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(existingNodes);
    return parents;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else {
      // Check uniqueness within parent scope
      const parentNode = existingNodes.find(n => n.id === formData.parentId);
      const siblings = parentNode?.children || existingNodes;
      const duplicate = siblings.find(s => s.name.toLowerCase() === formData.name.toLowerCase());
      if (duplicate) {
        newErrors.name = `A ${nodeType} named '${formData.name}' already exists in this scope.`;
      }
    }

    // Parent validation for groups and skills
    if ((nodeType === 'group' || nodeType === 'skill') && !formData.parentId) {
      newErrors.parentId = `Parent ${nodeType === 'group' ? 'Cluster' : 'Group'} is required`;
    }

    // Rank validation
    if (formData.parentId) {
      const parentNode = existingNodes.find(n => n.id === formData.parentId);
      const siblings = parentNode?.children || [];
      const rankExists = siblings.find(s => s.rank === formData.rank);
      if (rankExists) {
        newErrors.rank = `Rank ${formData.rank} is already assigned. Please choose a different rank.`;
      }
    }

    // Proficiency levels validation for skills
    if (nodeType === 'skill') {
      proficiencyLevels.forEach((level, index) => {
        if (!level.title.trim()) {
          newErrors[`proficiency_${index}_title`] = 'Title is required';
        }
        if (!level.description.trim()) {
          newErrors[`proficiency_${index}_description`] = 'Description is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    const nodeData: Partial<TaxonomyNode> = {
      ...formData,
      type: nodeType,
      isActive: true,
      proficiencyLevels: nodeType === 'skill' ? proficiencyLevels.map((level, index) => ({
        ...level,
        id: `${Date.now()}_${index}`
      })) : undefined
    };

    onNodeCreated(nodeData);

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      parentId: '',
      rank: 1
    });
    setProficiencyLevels([
      {
        title: 'Beginner',
        description: '',
        minScore: 0,
        maxScore: 25,
        order: 1
      },
      {
        title: 'Intermediate',
        description: '',
        minScore: 26,
        maxScore: 75,
        order: 2
      },
      {
        title: 'Expert',
        description: '',
        minScore: 76,
        maxScore: 100,
        order: 3
      }
    ]);
    setErrors({});
  };

  const addProficiencyLevel = () => {
    const newLevel: Omit<ProficiencyLevel, 'id'> = {
      title: '',
      description: '',
      minScore: 0,
      maxScore: 100,
      order: proficiencyLevels.length + 1
    };
    setProficiencyLevels([...proficiencyLevels, newLevel]);
  };

  const removeProficiencyLevel = (index: number) => {
    setProficiencyLevels(proficiencyLevels.filter((_, i) => i !== index));
  };

  const updateProficiencyLevel = (index: number, field: keyof Omit<ProficiencyLevel, 'id'>, value: string | number) => {
    const updated = [...proficiencyLevels];
    updated[index] = { ...updated[index], [field]: value };
    setProficiencyLevels(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}</DialogTitle>
          <DialogDescription>
            Add a new {nodeType} to your taxonomy hierarchy
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`Enter ${nodeType} name`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rank">Rank *</Label>
              <Input
                id="rank"
                type="number"
                min="1"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 1 })}
              />
              {errors.rank && <p className="text-sm text-destructive">{errors.rank}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Describe this ${nodeType}`}
            />
          </div>

          {/* Category for Clusters */}
          {nodeType === 'cluster' && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
          )}

          {/* Parent Selection */}
          {(nodeType === 'group' || nodeType === 'skill') && (
            <div className="space-y-2">
              <Label htmlFor="parent">
                Parent {nodeType === 'group' ? 'Cluster' : 'Group'} *
              </Label>
              <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select parent ${nodeType === 'group' ? 'cluster' : 'group'}`} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableParents().map(parent => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.parentId && <p className="text-sm text-destructive">{errors.parentId}</p>}
            </div>
          )}

          {/* Proficiency Levels for Skills */}
          {nodeType === 'skill' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Proficiency Levels</span>
                  <Button variant="outline" size="sm" onClick={addProficiencyLevel}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Level
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {proficiencyLevels.map((level, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Level {index + 1}</h4>
                      {proficiencyLevels.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProficiencyLevel(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={level.title}
                          onChange={(e) => updateProficiencyLevel(index, 'title', e.target.value)}
                          placeholder="e.g., Beginner"
                        />
                        {errors[`proficiency_${index}_title`] && (
                          <p className="text-sm text-destructive">{errors[`proficiency_${index}_title`]}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          min="1"
                          value={level.order}
                          onChange={(e) => updateProficiencyLevel(index, 'order', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={level.description}
                        onChange={(e) => updateProficiencyLevel(index, 'description', e.target.value)}
                        placeholder="Describe this proficiency level"
                      />
                      {errors[`proficiency_${index}_description`] && (
                        <p className="text-sm text-destructive">{errors[`proficiency_${index}_description`]}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Min Score</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={level.minScore}
                          onChange={(e) => updateProficiencyLevel(index, 'minScore', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Max Score</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={level.maxScore}
                          onChange={(e) => updateProficiencyLevel(index, 'maxScore', parseInt(e.target.value) || 100)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
