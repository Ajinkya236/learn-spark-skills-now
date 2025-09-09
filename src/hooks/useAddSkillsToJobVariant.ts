import { useState } from 'react';
import { toast } from "sonner";

interface SuggestedSkill {
  id: string;
  name: string;
  cluster: string;
  group: string;
  relevanceMatch: number;
  isSelected: boolean;
  type: 'Job Role mapped' | 'Auto suggested';
}

interface SelectedSkill extends SuggestedSkill {
  proficiencyLevel: string;
  criticalityLevel: 'High' | 'Medium' | 'Low';
}

export const useAddSkillsToJobVariant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkill[]>([
    {
      id: '1',
      name: 'React',
      cluster: 'Programming',
      group: 'Frontend Frameworks',
      relevanceMatch: 100,
      isSelected: false,
      type: 'Job Role mapped'
    },
    {
      id: '2',
      name: 'Node.js',
      cluster: 'Programming',
      group: 'Backend Development',
      relevanceMatch: 100,
      isSelected: false,
      type: 'Job Role mapped'
    },
    {
      id: '3',
      name: 'TypeScript',
      cluster: 'Programming',
      group: 'Languages',
      relevanceMatch: 95,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '4',
      name: 'Next.js',
      cluster: 'Programming',
      group: 'Frontend Frameworks',
      relevanceMatch: 92,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '5',
      name: 'State Management (Redux/Zustand)',
      cluster: 'Programming',
      group: 'State Management',
      relevanceMatch: 88,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '6',
      name: 'Testing (Jest, React Testing Library)',
      cluster: 'Testing',
      group: 'Frontend Testing',
      relevanceMatch: 85,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '7',
      name: 'Performance Optimization',
      cluster: 'Programming',
      group: 'Web Performance',
      relevanceMatch: 82,
      isSelected: false,
      type: 'Auto suggested'
    },
    {
      id: '8',
      name: 'GraphQL',
      cluster: 'Programming',
      group: 'API Development',
      relevanceMatch: 78,
      isSelected: false,
      type: 'Auto suggested'
    }
  ]);

  const toggleSkillSelection = (skillId: string) => {
    setSuggestedSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, isSelected: !skill.isSelected } : skill
    ));
  };

  const proceedToConfiguration = () => {
    const selected = suggestedSkills.filter(skill => skill.isSelected);
    if (selected.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    const configuredSkills: SelectedSkill[] = selected.map(skill => ({
      ...skill,
      proficiencyLevel: 'Intermediate',
      criticalityLevel: 'Medium'
    }));

    setSelectedSkills(configuredSkills);
    setStep('configure');
  };

  const updateSkillConfig = (skillId: string, field: 'proficiencyLevel' | 'criticalityLevel', value: string) => {
    setSelectedSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (skillId: string) => {
    setSuggestedSkills(prev => prev.map(s => 
      s.id === skillId ? { ...s, isSelected: false } : s
    ));
    setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
  };

  const handleSubmit = () => {
    toast.success(`Added ${selectedSkills.length} skills to the job variant`);
    return true;
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select');
    }
    return false;
  };

  return {
    searchTerm,
    setSearchTerm,
    step,
    setStep,
    selectedSkills,
    suggestedSkills,
    toggleSkillSelection,
    proceedToConfiguration,
    updateSkillConfig,
    removeSkill,
    handleSubmit,
    handleBack
  };
};