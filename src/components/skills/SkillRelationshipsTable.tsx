
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddSkillsDialog } from "./AddSkillsDialog";
import { RemoveSkillsDialog } from "./RemoveSkillsDialog";
import type { SkillRelation, SkillOption } from "@/hooks/useSkillRelationships";

interface SkillRelationshipsTableProps {
  relations: SkillRelation[];
  availableSkills: SkillOption[];
  getAISuggestedSkills: (skill: string) => string[];
  onAddSkills: (skillId: string, skills: string[]) => boolean;
  onRemoveSkills: (skillId: string, skills: string[]) => void;
}

export const SkillRelationshipsTable = ({ 
  relations, 
  availableSkills, 
  getAISuggestedSkills,
  onAddSkills,
  onRemoveSkills 
}: SkillRelationshipsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Skill</TableHead>
            <TableHead>Related Skills</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relations.map((relation) => (
            <TableRow key={relation.id}>
              <TableCell>{relation.no}</TableCell>
              <TableCell>{relation.cluster}</TableCell>
              <TableCell>{relation.group}</TableCell>
              <TableCell className="font-medium">{relation.skill}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {relation.relatedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <AddSkillsDialog
                    skill={relation}
                    availableSkills={availableSkills}
                    getAISuggestedSkills={getAISuggestedSkills}
                    onAddSkills={onAddSkills}
                  />
                  <RemoveSkillsDialog
                    skill={relation}
                    onRemoveSkills={onRemoveSkills}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
