import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaxonomyNode } from "@/hooks/useTaxonomyManagement";

interface InactiveItem {
  id: string;
  name: string;
  description?: string;
  type: string;
  parentName?: string;
  inactivatedAt: Date;
  inactivatedBy: string;
  employeeCount: number;
  courseCount: number;
  roleCount: number;
}

const mockInactiveItems: InactiveItem[] = [
  {
    id: '101',
    name: 'Legacy Skill 1',
    description: 'Old skill no longer in use',
    type: 'skill',
    parentName: 'Outdated Tech',
    inactivatedAt: new Date(),
    inactivatedBy: 'System',
    employeeCount: 5,
    courseCount: 1,
    roleCount: 0
  },
  {
    id: '102',
    name: 'Deprecated Group A',
    description: 'Group that is no longer relevant',
    type: 'group',
    parentName: 'Archive Cluster',
    inactivatedAt: new Date(),
    inactivatedBy: 'Admin',
    employeeCount: 10,
    courseCount: 2,
    roleCount: 1
  }
];

const InactiveBin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InactiveItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredItems = mockInactiveItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.parentName && item.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleItemClick = (item: InactiveItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inactive Bin</CardTitle>
          <CardDescription>
            View and manage inactivated taxonomy items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search inactive items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Inactivated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} onClick={() => handleItemClick(item)}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.type}</Badge>
                    </TableCell>
                    <TableCell>{item.parentName || 'N/A'}</TableCell>
                    <TableCell>{item.inactivatedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Details for the inactivated item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right font-medium">
                  Name
                </label>
                <Input type="text" id="name" value={selectedItem.name} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right font-medium">
                  Type
                </label>
                <Input type="text" id="type" value={selectedItem.type} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="parent" className="text-right font-medium">
                  Parent
                </label>
                <Input type="text" id="parent" value={selectedItem.parentName || 'N/A'} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="inactivatedAt" className="text-right font-medium">
                  Inactivated At
                </label>
                <Input
                  type="text"
                  id="inactivatedAt"
                  value={selectedItem.inactivatedAt.toLocaleDateString()}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="inactivatedBy" className="text-right font-medium">
                  Inactivated By
                </label>
                <Input type="text" id="inactivatedBy" value={selectedItem.inactivatedBy} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="employeeCount" className="text-right font-medium">
                  Employee Count
                </label>
                <Input type="text" id="employeeCount" value={selectedItem.employeeCount.toString()} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="courseCount" className="text-right font-medium">
                  Course Count
                </label>
                <Input type="text" id="courseCount" value={selectedItem.courseCount.toString()} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="roleCount" className="text-right font-medium">
                  Role Count
                </label>
                <Input type="text" id="roleCount" value={selectedItem.roleCount.toString()} readOnly className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InactiveBin;
