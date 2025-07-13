
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";

interface SkillMappingFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SkillMappingForm: React.FC<SkillMappingFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [selectedSkill, setSelectedSkill] = useState('');

  const mockSkills = [
    { id: '1', name: 'JavaScript Programming' },
    { id: '2', name: 'React Development' },
    { id: '3', name: 'Node.js Backend' },
    { id: '4', name: 'Database Design' },
    { id: '5', name: 'API Development' }
  ];

  const proficiencyLevels = [
    { id: '1', title: 'Beginner', minScore: 0, maxScore: 25 },
    { id: '2', title: 'Intermediate', minScore: 26, maxScore: 50 },
    { id: '3', title: 'Advanced', minScore: 51, maxScore: 75 },
    { id: '4', title: 'Expert', minScore: 76, maxScore: 100 }
  ];

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      skillId: selectedSkill
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-inter">Add Skill Proficiency Mapping</CardTitle>
        <CardDescription className="font-inter">
          Map a skill to proficiency levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill" className="font-inter">Select Skill</Label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a skill..." />
              </SelectTrigger>
              <SelectContent>
                {mockSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiencyLevel" className="font-inter">Proficiency Level</Label>
            <Select onValueChange={(value) => setValue('proficiencyLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose proficiency level..." />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.title} ({level.minScore}-{level.maxScore})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-inter">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add a description..."
              {...register('description')}
              className="font-inter"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="font-inter">
              Cancel
            </Button>
            <Button type="submit" className="font-inter bg-blue-600 hover:bg-blue-700">
              Save Mapping
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
