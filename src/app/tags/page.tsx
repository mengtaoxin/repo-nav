"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { navDataManager, type NavData, type Tag } from "@/lib/nav-data";

export default function TagsPage() {
  const [data, setData] = useState<NavData | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<Tag>({ name: "", icon: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadData = () => {
      const loadedData = navDataManager.load();
      if (loadedData) {
        setData(loadedData);
      }
    };
    loadData();
  }, []);

  const tags = data?.tags || [];

  const handleAdd = () => {
    if (!data || !formData.name) return;

    const newData = navDataManager.addTag(data, formData);
    setData(newData);
    setFormData({ name: "", icon: "" });
    setOpen(false);
  };

  const handleEdit = () => {
    if (!data || editIndex === null || !formData.name) return;

    const newData = navDataManager.updateTag(data, editIndex, formData);
    setData(newData);
    setFormData({ name: "", icon: "" });
    setEditOpen(false);
    setEditIndex(null);
  };

  const handleDeleteConfirm = () => {
    if (!data || deleteIndex === null) return;

    const newData = navDataManager.deleteTag(data, deleteIndex);
    if (newData) {
      setData(newData);
      setDeleteIndex(null);
      setDeleteOpen(false);
    }
  };

  const openEditDialog = (index: number) => {
    setEditIndex(index);
    setFormData({ ...tags[index] });
    setEditOpen(true);
  };

  const openDeleteDialog = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const getUsageCount = (tagName: string) => {
    return navDataManager.getTagUsageCount(data!, tagName);
  };

  const canDeleteTag = (tagName: string) => {
    return getUsageCount(tagName) === 0;
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your global tags
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Tag</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
              <DialogDescription>
                Create a new global tag for your navigation items.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AI, Backend, Frontend"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag-icon">Icon URL (Optional)</Label>
                <Input
                  id="tag-icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Add Tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Tags</CardTitle>
            <CardDescription>
              Get started by creating your first tag.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag, index) => {
                const usageCount = getUsageCount(tag.name);
                const canDelete = canDeleteTag(tag.name);

                return (
                  <TableRow key={index}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>
                      {tag.icon ? (
                        <a
                          href={tag.icon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {tag.icon}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{usageCount}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(index)}
                        disabled={!canDelete}
                        title={!canDelete ? `Tag is used by ${usageCount} item(s)` : ""}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., AI, Backend, Frontend"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tag-icon">Icon URL (Optional)</Label>
              <Input
                id="edit-tag-icon"
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="https://example.com/icon.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Update Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag &ldquo;{deleteIndex !== null && tags[deleteIndex]?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
