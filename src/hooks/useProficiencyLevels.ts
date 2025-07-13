
import { useState } from 'react';
import { toast } from "sonner";

export interface ProficiencyLevel {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface SkillProficiencyMapping {
  id: string;
  skill: string;
  proficiencyDescription: string;
  proficiencyLevel: string;
  cluster: string;
  group: string;
  isActive: boolean;
}

export const useProficiencyLevels = () => {
  // Global Proficiency Levels state
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: "1", order: 1, title: "Beginner", description: "Basic understanding" },
    { id: "2", order: 2, title: "Intermediate", description: "Some experience" },
    { id: "3", order: 3, title: "Advanced", description: "Solid understanding" },
    { id: "4", order: 4, title: "Expert", description: "Deep expertise" },
  ]);

  // Skill Proficiency Mappings state
  const [skillMappings, setSkillMappings] = useState<SkillProficiencyMapping[]>([
    { id: "1", skill: "JavaScript", proficiencyDescription: "Basic syntax and concepts", proficiencyLevel: "Beginner", cluster: "Frontend", group: "Programming", isActive: true },
    { id: "2", skill: "React", proficiencyDescription: "Component development", proficiencyLevel: "Intermediate", cluster: "Frontend", group: "Framework", isActive: true },
  ]);

  // Mock data for dropdowns
  const skills = ["JavaScript", "React", "Python", "Node.js", "TypeScript"];
  const clusters = ["Frontend", "Backend", "Full Stack", "Data Science"];
  const groups = ["Programming", "Framework", "Database", "Cloud"];

  // Helper functions
  const validateMapping = (mapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>, excludeId?: string) => {
    const errors: string[] = [];
    
    if (!mapping.skill) errors.push("Skill is required");
    if (!mapping.proficiencyDescription) errors.push("Proficiency Description is required");
    if (!mapping.proficiencyLevel) errors.push("Proficiency Level is required");
    
    // Check for duplicate proficiency description under same skill
    const duplicate = skillMappings.find(m => 
      m.skill === mapping.skill && 
      m.proficiencyDescription === mapping.proficiencyDescription &&
      m.id !== excludeId
    );
    if (duplicate) {
      errors.push("Duplicate proficiency description under same skill is not allowed");
    }
    
    return errors;
  };

  // Global Level handlers
  const updateProficiencyLevel = (id: string, updates: Partial<ProficiencyLevel>) => {
    const updatedLevels = proficiencyLevels.map(level =>
      level.id === id ? { ...level, ...updates } : level
    );
    setProficiencyLevels(updatedLevels);
    toast.success("Proficiency level updated successfully.");
  };

  // Skill Mapping handlers
  const createSkillMapping = (newMapping: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => {
    const errors = validateMapping(newMapping);
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return false;
    }

    const newMappingRecord: SkillProficiencyMapping = {
      ...newMapping,
      id: String(Date.now()),
      isActive: true
    };
    
    setSkillMappings([...skillMappings, newMappingRecord]);
    toast.success("Skill proficiency mapping created successfully.");
    return true;
  };

  const updateSkillMapping = (id: string, updates: Omit<SkillProficiencyMapping, 'id' | 'isActive'>) => {
    const errors = validateMapping(updates, id);
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return false;
    }

    const updatedMappings = skillMappings.map(mapping =>
      mapping.id === id ? { ...mapping, ...updates } : mapping
    );
    setSkillMappings(updatedMappings);
    toast.success("Skill proficiency mapping updated successfully.");
    return true;
  };

  const inactivateSkillMapping = (id: string) => {
    const updatedMappings = skillMappings.map(mapping =>
      mapping.id === id ? { ...mapping, isActive: false } : mapping
    );
    setSkillMappings(updatedMappings);
    toast.success("Skill proficiency mapping inactivated successfully.");
  };

  return {
    proficiencyLevels,
    skillMappings,
    skills,
    clusters,
    groups,
    updateProficiencyLevel,
    createSkillMapping,
    updateSkillMapping,
    inactivateSkillMapping,
    validateMapping
  };
};
