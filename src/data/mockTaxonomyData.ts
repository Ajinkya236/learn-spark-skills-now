
import { TaxonomyNode } from '@/types/taxonomy';

export const mockTaxonomyData: TaxonomyNode[] = [{
  id: '1',
  name: 'Technical Skills',
  description: 'All technical and engineering skills',
  type: 'cluster',
  category: 'Technical',
  rank: 1,
  isActive: true,
  usageCount: 450,
  employeeCount: 150,
  courseCount: 25,
  roleCount: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
  children: [{
    id: '2',
    name: 'Programming Languages',
    description: 'Software programming languages',
    type: 'group',
    parentId: '1',
    rank: 1,
    isActive: true,
    usageCount: 320,
    employeeCount: 120,
    courseCount: 18,
    roleCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [{
      id: '3',
      name: 'Python Programming',
      description: 'Python development skills',
      type: 'skill',
      parentId: '2',
      rank: 1,
      isActive: true,
      usageCount: 240,
      employeeCount: 80,
      courseCount: 12,
      roleCount: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      proficiencyLevels: [{
        id: '1',
        title: 'Beginner',
        description: 'Basic syntax',
        minScore: 0,
        maxScore: 25,
        order: 1
      }, {
        id: '2',
        title: 'Intermediate',
        description: 'Advanced concepts',
        minScore: 26,
        maxScore: 75,
        order: 2
      }, {
        id: '3',
        title: 'Expert',
        description: 'Architecture & mentoring',
        minScore: 76,
        maxScore: 100,
        order: 3
      }]
    }]
  }]
}];
