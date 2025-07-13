import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Pencil, Trash2, Download, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ProficiencyLevel {
  id: string;
  name: string;
  description: string;
  level: number;
}

const ProficiencyLevels = () => {
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([
    { id: "1", name: "Beginner", description: "Basic understanding", level: 1 },
    { id: "2", name: "Intermediate", description: "Some experience", level: 2 },
    { id: "3", name: "Advanced", description: "Solid understanding", level: 3 },
  ]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newProficiency, setNewProficiency] = useState<Omit<ProficiencyLevel, 'id'>>({ name: "", description: "", level: 1 });
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel | null>(null);
  const [editProficiency, setEditProficiency] = useState<Omit<ProficiencyLevel, 'id'>>({ name: "", description: "", level: 1 });

  const handleCreate = () => {
    if (newProficiency.name && newProficiency.description) {
      setProficiencyLevels([...proficiencyLevels, { ...newProficiency, id: String(Date.now()) }]);
      setOpen(false);
      setNewProficiency({ name: "", description: "", level: 1 });
      toast.success("Proficiency level created successfully.");
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const handleEdit = () => {
    if (selectedProficiency) {
      setEditOpen(true);
      setEditProficiency({ name: selectedProficiency.name, description: selectedProficiency.description, level: selectedProficiency.level });
    }
  };

  const handleSaveEdit = () => {
    if (selectedProficiency) {
      const updatedProficiencyLevels = proficiencyLevels.map(level =>
        level.id === selectedProficiency.id ? { ...level, ...editProficiency } : level
      );
      setProficiencyLevels(updatedProficiencyLevels);
      setEditOpen(false);
      setSelectedProficiency(null);
      toast.success("Proficiency level updated successfully.");
    }
  };

  const handleDelete = () => {
    if (selectedProficiency) {
      setDeleteOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedProficiency) {
      const updatedProficiencyLevels = proficiencyLevels.filter(level => level.id !== selectedProficiency.id);
      setProficiencyLevels(updatedProficiencyLevels);
      setDeleteOpen(false);
      setSelectedProficiency(null);
      toast.success("Proficiency level deleted successfully.");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-6 p-4 md:p-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Proficiency Levels</h1>
              <p className="text-muted-foreground">Manage skill proficiency levels</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Proficiency Levels</CardTitle>
                <CardDescription>
                  Define and manage proficiency levels for skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proficiencyLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell>{level.name}</TableCell>
                          <TableCell>{level.description}</TableCell>
                          <TableCell>{level.level}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedProficiency(level); handleEdit(); }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedProficiency(level); handleDelete(); }}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Proficiency Level
                </Button>
              </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add Proficiency Level</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Proficiency Level</DialogTitle>
                  {/* <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={newProficiency.name} onChange={(e) => setNewProficiency({ ...newProficiency, name: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" value={newProficiency.description} onChange={(e) => setNewProficiency({ ...newProficiency, description: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Level
                    </Label>
                    <Input type="number" id="level" value={newProficiency.level} onChange={(e) => setNewProficiency({ ...newProficiency, level: Number(e.target.value) })} className="col-span-3" />
                  </div>
                </div>
                {/* <fieldset>
                  <div className="space-y-2">
                    <div className="space-y-1 leading-none">
                      <p className="text-sm font-medium leading-none">
                        Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Configure notifications for your account.
                      </p>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <Switch id="push" />
                      <Label htmlFor="push">Push Notifications</Label>
                    </div>
                  </div>
                </fieldset> */}
                <Button onClick={handleCreate}>Create Proficiency Level</Button>
              </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Proficiency Level</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={editProficiency.name} onChange={(e) => setEditProficiency({ ...editProficiency, name: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" value={editProficiency.description} onChange={(e) => setEditProficiency({ ...editProficiency, description: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Level
                    </Label>
                    <Input type="number" id="level" value={editProficiency.level} onChange={(e) => setEditProficiency({ ...editProficiency, level: Number(e.target.value) })} className="col-span-3" />
                  </div>
                </div>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the proficiency level from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProficiencyLevels;
