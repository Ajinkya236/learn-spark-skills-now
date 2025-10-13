import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface JobVariant {
  id: string;
  jobVariant: string;
  mappedToJobRole: string;
  business: string;
  group: string;
  department: string;
  description: string;
  rolesAndResponsibilities: string[];
  mappedSkills: number;
  lastUpdated: string;
}

interface JobVariantInfoCardProps {
  jobVariant: JobVariant;
}

export const JobVariantInfoCard = ({ jobVariant }: JobVariantInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVariant, setEditedVariant] = useState(jobVariant);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    // Save logic here
    toast.success("Job variant updated successfully");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedVariant(jobVariant);
    setIsEditing(false);
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...editedVariant.rolesAndResponsibilities];
    newResponsibilities[index] = value;
    setEditedVariant({ ...editedVariant, rolesAndResponsibilities: newResponsibilities });
  };

  const addResponsibility = () => {
    setEditedVariant({
      ...editedVariant,
      rolesAndResponsibilities: [...editedVariant.rolesAndResponsibilities, '']
    });
  };

  const removeResponsibility = (index: number) => {
    const newResponsibilities = editedVariant.rolesAndResponsibilities.filter((_, i) => i !== index);
    setEditedVariant({ ...editedVariant, rolesAndResponsibilities: newResponsibilities });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl font-heading text-primary">
              {jobVariant.jobVariant}
            </CardTitle>
            <CardDescription className="font-body text-base">
              Variant of: <span className="font-medium">{jobVariant.mappedToJobRole}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="font-body">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="font-body">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="font-body">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-heading text-sm font-medium text-primary mb-1">Mapped to Job Role</h4>
            <p className="font-body text-sm text-muted-foreground">{jobVariant.mappedToJobRole}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-3">Description</h3>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedVariant.description}
                onChange={(e) => setEditedVariant({ ...editedVariant, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          ) : (
            <p className="font-body text-muted-foreground leading-relaxed">
              {jobVariant.description}
            </p>
          )}
        </div>

        {/* Roles and Responsibilities */}
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-3">Roles and Responsibilities</h3>
          {isEditing ? (
            <div className="space-y-4">
              {editedVariant.rolesAndResponsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeResponsibility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addResponsibility} variant="outline" size="sm">
                Add Responsibility
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {jobVariant.rolesAndResponsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="font-body text-muted-foreground">{responsibility}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="font-body">Last updated: {formatDate(jobVariant.lastUpdated)}</span>
            </div>
          </div>
          <Badge variant="secondary" className="font-body">
            {jobVariant.mappedSkills} Skills Mapped
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};