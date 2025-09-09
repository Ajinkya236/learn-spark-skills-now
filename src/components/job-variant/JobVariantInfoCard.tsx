import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Calendar } from "lucide-react";

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-heading text-primary">
              {jobVariant.jobVariant}
            </CardTitle>
            <CardDescription className="font-body text-base">
              Variant of: <span className="font-medium">{jobVariant.mappedToJobRole}</span>
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="font-body">
              <Building2 className="h-3 w-3 mr-1" />
              {jobVariant.business}
            </Badge>
            <Badge variant="outline" className="font-body">
              <Users className="h-3 w-3 mr-1" />
              {jobVariant.group}
            </Badge>
            <Badge variant="outline" className="font-body">
              <MapPin className="h-3 w-3 mr-1" />
              {jobVariant.department}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-heading text-sm font-medium text-primary mb-1">Mapped to Job Role</h4>
            <p className="font-body text-sm text-muted-foreground">{jobVariant.mappedToJobRole}</p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-medium text-primary mb-1">Business</h4>
            <p className="font-body text-sm text-muted-foreground">{jobVariant.business}</p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-medium text-primary mb-1">Group</h4>
            <p className="font-body text-sm text-muted-foreground">{jobVariant.group}</p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-medium text-primary mb-1">Department</h4>
            <p className="font-body text-sm text-muted-foreground">{jobVariant.department}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-3">Description</h3>
          <p className="font-body text-muted-foreground leading-relaxed">
            {jobVariant.description}
          </p>
        </div>

        {/* Roles and Responsibilities */}
        <div>
          <h3 className="font-heading text-lg font-medium text-primary mb-3">Roles and Responsibilities</h3>
          <ul className="space-y-2">
            {jobVariant.rolesAndResponsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary mt-1">•</span>
                <span className="font-body text-muted-foreground">{responsibility}</span>
              </li>
            ))}
          </ul>
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