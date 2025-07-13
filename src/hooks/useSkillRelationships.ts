
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export interface SkillRelation {
  id: string;
  no: number;
  cluster: string;
  group: string;
  skill: string;
  relatedSkills: string[];
}

export interface SkillOption {
  id: string;
  name: string;
  cluster: string;
  group: string;
}

export const useSkillRelationships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillRelations, setSkillRelations] = useState<SkillRelation[]>([
    {
      id: "1",
      no: 1,
      cluster: "Technical Skills",
      group: "Programming",
      skill: "JavaScript",
      relatedSkills: ["TypeScript", "React", "Node.js"]
    },
    {
      id: "2", 
      no: 2,
      cluster: "Technical Skills",
      group: "Programming", 
      skill: "Python",
      relatedSkills: ["Django", "Flask", "Data Science"]
    },
    {
      id: "3",
      no: 3,
      cluster: "Design Skills",
      group: "UI/UX",
      skill: "Figma",
      relatedSkills: ["Adobe XD", "Sketch", "Prototyping"]
    }
  ]);

  const availableSkills: SkillOption[] = [
    { id: "1", name: "JavaScript", cluster: "Technical Skills", group: "Programming" },
    { id: "2", name: "TypeScript", cluster: "Technical Skills", group: "Programming" },
    { id: "3", name: "React", cluster: "Technical Skills", group: "Programming" },
    { id: "4", name: "Node.js", cluster: "Technical Skills", group: "Programming" },
    { id: "5", name: "Python", cluster: "Technical Skills", group: "Programming" },
    { id: "6", name: "Django", cluster: "Technical Skills", group: "Programming" },
    { id: "7", name: "Flask", cluster: "Technical Skills", group: "Programming" },
    { id: "8", name: "Data Science", cluster: "Technical Skills", group: "Analytics" },
    { id: "9", name: "Figma", cluster: "Design Skills", group: "UI/UX" },
    { id: "10", name: "Adobe XD", cluster: "Design Skills", group: "UI/UX" },
    { id: "11", name: "Sketch", cluster: "Design Skills", group: "UI/UX" },
    { id: "12", name: "Prototyping", cluster: "Design Skills", group: "UI/UX" }
  ];

  const getAISuggestedSkills = (currentSkill: string): string[] => {
    const suggestions: Record<string, string[]> = {
      "JavaScript": ["TypeScript", "React", "Vue.js", "Angular"],
      "Python": ["Django", "Flask", "FastAPI", "Pandas"],
      "Figma": ["Adobe XD", "Sketch", "InVision", "Framer"],
    };
    return suggestions[currentSkill] || [];
  };

  const filteredRelations = skillRelations.filter(relation =>
    relation.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relation.relatedSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addSkillRelations = (skillId: string, newSkills: string[]) => {
    const targetSkill = skillRelations.find(relation => relation.id === skillId);
    if (!targetSkill) return;

    const duplicateSkills = newSkills.filter(skill => 
      targetSkill.relatedSkills.includes(skill)
    );

    if (duplicateSkills.length > 0) {
      toast.error(`Relation already exists for: ${duplicateSkills.join(', ')}`);
      return false;
    }

    if (newSkills.includes(targetSkill.skill)) {
      toast.error(`Cannot relate ${targetSkill.skill} to itself.`);
      return false;
    }

    setSkillRelations(prev => prev.map(relation => 
      relation.id === skillId 
        ? { ...relation, relatedSkills: [...relation.relatedSkills, ...newSkills] }
        : relation
    ));

    toast.success(`Added ${newSkills.length} skill relation(s) successfully`);
    return true;
  };

  const removeSkillRelations = (skillId: string, skillsToRemove: string[]) => {
    setSkillRelations(prev => prev.map(relation => 
      relation.id === skillId 
        ? { ...relation, relatedSkills: relation.relatedSkills.filter(skill => !skillsToRemove.includes(skill)) }
        : relation
    ));

    toast.success(`Removed ${skillsToRemove.length} skill relation(s) successfully`);
  };

  const handleBulkImport = async (file: File) => {
    // Simulate file processing
    toast.success("Bulk import completed successfully");
  };

  return {
    searchTerm,
    setSearchTerm,
    skillRelations,
    availableSkills,
    filteredRelations,
    getAISuggestedSkills,
    addSkillRelations,
    removeSkillRelations,
    handleBulkImport
  };
};
