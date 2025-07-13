
export interface TaxonomyNode {
  id: string;
  name: string;
  description?: string;
  type: 'cluster' | 'group' | 'skill';
  category?: string;
  parentId?: string;
  rank: number;
  proficiencyLevels?: ProficiencyLevel[];
  isActive: boolean;
  children?: TaxonomyNode[];
  usageCount?: number;
  employeeCount?: number;
  courseCount?: number;
  roleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProficiencyLevel {
  id: string;
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
  order: number;
}

export interface InactiveItem {
  id: string;
  name: string;
  description?: string;
  type: 'cluster' | 'group' | 'skill';
  parentName?: string;
  inactivatedAt: Date;
  inactivatedBy: string;
  employeeCount: number;
  courseCount: number;
  roleCount: number;
}
