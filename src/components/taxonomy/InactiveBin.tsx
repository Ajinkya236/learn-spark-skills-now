import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Search, Trash2, AlertCircle } from 'lucide-react';
import { TaxonomyNode } from '@/pages/skills/TaxonomyManagement';
import { useToast } from '@/hooks/use-toast';
interface InactiveBinProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (node: TaxonomyNode) => void;
}
export const InactiveBin: React.FC<InactiveBinProps> = ({
  open,
  onOpenChange,
  onRestore
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    toast
  } = useToast();

  // Mock inactive items - in real app, this would come from API
  const inactiveItems: TaxonomyNode[] = [{
    id: 'inactive-1',
    name: 'Legacy Java Skills',
    description: 'Old Java skill cluster',
    type: 'cluster',
    rank: 1,
    isActive: false,
    usageCount: 45,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-10')
  }, {
    id: 'inactive-2',
    name: 'Flash Development',
    description: 'Adobe Flash development skills',
    type: 'skill',
    parentId: 'some-group',
    rank: 3,
    isActive: false,
    usageCount: 12,
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2023-12-01')
  }];
  const filteredItems = inactiveItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleRestore = (item: TaxonomyNode) => {
    onRestore(item);
  };
  const handlePermanentDelete = (item: TaxonomyNode) => {
    toast({
      title: "Permanently Deleted",
      description: `${item.type} "${item.name}" has been permanently deleted.`,
      variant: "destructive"
    });
  };
  const getDaysInactive = (updatedAt: Date): number => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const getRetentionWarning = (daysInactive: number): string => {
    const daysLeft = 30 - daysInactive;
    if (daysLeft <= 0) {
      return 'Can be permanently deleted';
    } else if (daysLeft <= 7) {
      return `Will be auto-deleted in ${daysLeft} days`;
    }
    return '';
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Inactive Items
          </DialogTitle>
          <DialogDescription>
            Manage inactivated taxonomy items. Items are kept for 30 days before permanent deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inactive items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Badge variant="outline">
              {filteredItems.length} items
            </Badge>
          </div>

          {filteredItems.length === 0 ? <div className="text-center py-8">
              <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No inactive items</h3>
              <p className="text-muted-foreground">
                Inactive items will appear here when you inactivate taxonomy nodes.
              </p>
            </div> : <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Inactive For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => {
                const daysInactive = getDaysInactive(item.updatedAt);
                const retentionWarning = getRetentionWarning(daysInactive);
                return <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.description && <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.usageCount || 0} users</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{daysInactive} days</span>
                        </TableCell>
                        <TableCell>
                          {retentionWarning && <div className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600">
                                {retentionWarning}
                              </span>
                            </div>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleRestore(item)}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            
                          </div>
                        </TableCell>
                      </TableRow>;
              })}
                </TableBody>
              </Table>
            </div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};