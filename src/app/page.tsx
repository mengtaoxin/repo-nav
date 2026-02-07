"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NavItem } from "@/components/nav-item";
import { navDataManager, type NavData } from "@/lib/nav-data";

export default function Home() {
  const [data, setData] = useState<NavData | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "", icon: "", localRepoPath: "", tags: "", description: "" });
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Load data only on client side to avoid hydration mismatch
  useEffect(() => {
    setData(navDataManager.load());
  }, []);

  const handleAdd = () => {
    if (!data || !formData.name || !formData.url) return;

    const newData = navDataManager.add(data, formData);
    setData(newData);
    setFormData({ name: "", url: "", icon: "", localRepoPath: "", tags: "", description: "" });
    setOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!data || deleteIndex === null) return;

    const newData = navDataManager.delete(data, deleteIndex);
    setData(newData);
    setDeleteIndex(null);
    setDeleteMode(false);
  };

  const handleNavItemClick = (index: number) => {
    if (deleteMode) {
      setDeleteIndex(index);
    } else if (editMode) {
      setEditIndex(index);
      setFormData({
        name: data!.navs[index].name,
        url: data!.navs[index].url,
        icon: data!.navs[index].icon,
        localRepoPath: data!.navs[index].localRepoPath || "",
        tags: data!.navs[index].tags?.join(", ") || "",
        description: data!.navs[index].description || "",
      });
      setEditOpen(true);
    }
  };

  const handleEdit = () => {
    if (!data || editIndex === null || !formData.name || !formData.url) return;

    const newData = navDataManager.update(data, editIndex, formData);
    setData(newData);
    setFormData({ name: "", url: "", icon: "", localRepoPath: "", tags: "", description: "" });
    setEditOpen(false);
    setEditIndex(null);
    setEditMode(false);
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!data || dragIndex === null || dragIndex === toIndex) return;

    const newData = navDataManager.reorder(data, dragIndex, toIndex);
    setData(newData);
    setDragIndex(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your navigation links
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={editMode ? "default" : "outline"}
            onClick={() => {
              setEditMode(!editMode);
              setDeleteMode(false);
              setMoveMode(false);
            }}
          >
            {editMode ? "Cancel Edit" : "Edit"}
          </Button>
          <Button 
            variant={deleteMode ? "destructive" : "outline"}
            onClick={() => {
              setDeleteMode(!deleteMode);
              setEditMode(false);
              setMoveMode(false);
            }}
          >
            {deleteMode ? "Cancel Delete" : "Delete"}
          </Button>
          <Button 
            variant={moveMode ? "default" : "outline"}
            onClick={() => {
              setMoveMode(!moveMode);
              setDeleteMode(false);
              setEditMode(false);
            }}
          >
            {moveMode ? "Cancel Move" : "Move"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Navigation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Navigation Item</DialogTitle>
                <DialogDescription>
                  Add a new navigation link to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Example"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon URL</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="https://www.example.com/favicon.ico"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="localRepoPath">Local Repo Path (Optional)</Label>
                  <Input
                    id="localRepoPath"
                    value={formData.localRepoPath}
                    onChange={(e) => setFormData({ ...formData, localRepoPath: e.target.value })}
                    placeholder="/Users/username/repos/project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="ai, alibaba"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief overview of the item"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {data.navs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Navigation Items</CardTitle>
            <CardDescription>
              Get started by adding your first navigation link.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {deleteMode && (
            <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-destructive font-medium">
                Delete mode is active. Click on any navigation item to delete it.
              </p>
            </div>
          )}
          {editMode && (
            <div className="mb-4 rounded-lg border border-primary bg-primary/10 p-4">
              <p className="text-sm text-primary font-medium">
                Edit mode is active. Click on any navigation item to edit it.
              </p>
            </div>
          )}
          {moveMode && (
            <div className="mb-4 rounded-lg border border-blue-500 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-500 font-medium">
                Move mode is active. Drag and drop navigation items to reorder them.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.navs.map((nav, index) => (
              <NavItem
                key={index}
                name={nav.name}
                url={nav.url}
                icon={nav.icon}
                localRepoPath={nav.localRepoPath}
                tags={nav.tags}
                description={nav.description}
                onClick={() => handleNavItemClick(index)}
                isDeleteMode={deleteMode || editMode}
                draggable={moveMode}
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver(index)}
                onDrop={handleDrop(index)}
              />
            ))}
          </div>
        </>
      )}

      <Dialog open={editOpen} onOpenChange={(open) => {
        setEditOpen(open);
        if (!open) {
          setEditIndex(null);
          setFormData({ name: "", url: "", icon: "", localRepoPath: "", tags: "", description: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Navigation Item</DialogTitle>
            <DialogDescription>
              Update the navigation link details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Example"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Icon URL</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="https://www.example.com/favicon.ico"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-localRepoPath">Local Repo Path (Optional)</Label>
              <Input
                id="edit-localRepoPath"
                value={formData.localRepoPath}
                onChange={(e) => setFormData({ ...formData, localRepoPath: e.target.value })}
                placeholder="/Users/username/repos/project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (comma-separated, optional)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ai, alibaba"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief overview of the item"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Navigation Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteIndex !== null && data.navs[deleteIndex]?.name}&rdquo;? This action cannot be undone.
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
