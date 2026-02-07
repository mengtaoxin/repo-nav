"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
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
import { NavItem } from "@/components/nav-item";
import { NavItemDetail, type NavItemDetailFormData } from "@/components/nav-item-detail";
import { navDataManager, type NavData } from "@/lib/nav-data";

const emptyFormData: NavItemDetailFormData = {
  name: "",
  url: "",
  icon: "",
  localRepoPath: "",
  tags: "",
  description: "",
  category: "uncategorized",
};

const navToForm = (nav: NavData["navs"][number]): NavItemDetailFormData => ({
  name: nav.name,
  url: nav.url,
  icon: nav.icon,
  localRepoPath: nav.localRepoPath || "",
  tags: nav.tags?.join(", ") || "",
  description: nav.description || "",
  category: nav.category || "uncategorized",
});

export default function Home() {
  const [data, setData] = useState<NavData | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NavItemDetailFormData>(emptyFormData);
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [moveMode, setMoveMode] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Load data only on client side to avoid hydration mismatch
  useEffect(() => {
    const loadData = () => {
      const loadedData = navDataManager.load();
      if (loadedData) {
        setData(loadedData);
      }
    };
    loadData();
  }, []);

  const handleAdd = () => {
    if (!data || !formData.name || !formData.url) return;

    const newData = navDataManager.add(data, {
      name: formData.name,
      url: formData.url,
      icon: formData.icon,
      localRepoPath: formData.localRepoPath,
      tags: formData.tags,
      description: formData.description,
      category: formData.category,
    });
    setData(newData);
    setFormData(emptyFormData);
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
      return;
    }

    if (editMode) {
      setEditIndex(index);
      setFormData(navToForm(data!.navs[index]));
      setEditOpen(true);
      return;
    }

    setDetailIndex(index);
    setDetailOpen(true);
  };

  const handleEdit = () => {
    if (!data || editIndex === null || !formData.name || !formData.url) return;

    const newData = navDataManager.update(data, editIndex, {
      name: formData.name,
      url: formData.url,
      icon: formData.icon,
      localRepoPath: formData.localRepoPath,
      tags: formData.tags,
      description: formData.description,
      category: formData.category,
    });
    setData(newData);
    setFormData(emptyFormData);
    setEditOpen(false);
    setEditIndex(null);
    setEditMode(false);
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = () => (e: React.DragEvent) => {
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
      <div className="px-6 py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const detailFormData = detailIndex !== null ? navToForm(data.navs[detailIndex]) : emptyFormData;

  // Group navigation items by category
  const groupedNavs = data.navs.reduce((acc, nav, index) => {
    const category = nav.category || "uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ nav, index });
    return acc;
  }, {} as Record<string, Array<{ nav: typeof data.navs[0]; index: number }>>);

  // Sort categories: uncategorized first, then others alphabetically
  const sortedCategories = Object.keys(groupedNavs).sort((a, b) => {
    if (a === "uncategorized") return -1;
    if (b === "uncategorized") return 1;
    return a.localeCompare(b);
  });

  const isContextMenuEnabled = !deleteMode && !editMode && !moveMode;

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Repository Navigation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shortcuts for Repositories
          </p>
        </div>
        <div className="flex gap-1">
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
          <Button onClick={() => setOpen(true)}>Add</Button>
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
            <div className="mb-2 rounded-lg border border-destructive bg-destructive/10 p-2">
              <p className="text-xs text-destructive font-medium">
                Delete mode is active. Click on any navigation item to delete it.
              </p>
            </div>
          )}
          {editMode && (
            <div className="mb-2 rounded-lg border border-primary bg-primary/10 p-2">
              <p className="text-xs text-primary font-medium">
                Edit mode is active. Click on any navigation item to edit it.
              </p>
            </div>
          )}
          {moveMode && (
            <div className="mb-2 rounded-lg border border-blue-500 bg-blue-500/10 p-2">
              <p className="text-xs text-blue-500 font-medium">
                Move mode is active. Drag and drop navigation items to reorder them.
              </p>
            </div>
          )}
          {sortedCategories.map((category) => (
            <div key={category} className="mb-4">
              <h2 className="mb-2 text-base font-semibold capitalize text-foreground">
                {category === "uncategorized" ? "Uncategorized" : category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {groupedNavs[category].map(({ nav, index }) => (
                  isContextMenuEnabled ? (
                    <ContextMenu key={index}>
                      <ContextMenuTrigger asChild>
                        <div>
                          <NavItem
                            name={nav.name}
                            url={nav.url}
                            icon={nav.icon}
                            localRepoPath={nav.localRepoPath}
                            tags={nav.tags}
                            description={nav.description}
                            onDetailClick={() => handleNavItemClick(index)}
                            isDeleteMode={deleteMode}
                            isEditMode={editMode}
                            isMoveMode={moveMode}
                            draggable={moveMode}
                            onDragStart={handleDragStart(index)}
                            onDragOver={handleDragOver()}
                            onDrop={handleDrop(index)}
                            tagConfig={data.tags}
                          />
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onSelect={() => {
                            setEditIndex(index);
                            setFormData(navToForm(data.navs[index]));
                            setEditOpen(true);
                            setEditMode(false);
                            setDeleteMode(false);
                          }}
                        >
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => {
                            setDeleteIndex(index);
                            setEditMode(false);
                            setDeleteMode(false);
                          }}
                        >
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ) : (
                    <div key={index}>
                      <NavItem
                        name={nav.name}
                        url={nav.url}
                        icon={nav.icon}
                        localRepoPath={nav.localRepoPath}
                        tags={nav.tags}
                        description={nav.description}
                        onDetailClick={() => handleNavItemClick(index)}
                        isDeleteMode={deleteMode}
                        isEditMode={editMode}
                        isMoveMode={moveMode}
                        draggable={moveMode}
                        onDragStart={handleDragStart(index)}
                        onDragOver={handleDragOver()}
                        onDrop={handleDrop(index)}
                        tagConfig={data.tags}
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <NavItemDetail
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setDetailIndex(null);
          }
        }}
        mode="view"
        formData={detailFormData}
      />

      <NavItemDetail
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setEditIndex(null);
            setFormData(emptyFormData);
          }
        }}
        mode="edit"
        formData={formData}
        onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
        onSubmit={handleEdit}
      />

      <NavItemDetail
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setFormData(emptyFormData);
          }
        }}
        mode="add"
        formData={formData}
        onFieldChange={(field, value) => setFormData({ ...formData, [field]: value })}
        onSubmit={handleAdd}
      />

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
