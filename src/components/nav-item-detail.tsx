"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NavItemDetailFormData {
  name: string;
  url: string;
  icon: string;
  localRepoPath: string;
  tags: string;
  description: string;
}

interface NavItemDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  formData: NavItemDetailFormData;
  onFieldChange?: (field: keyof NavItemDetailFormData, value: string) => void;
  onSubmit?: () => void;
}

export function NavItemDetail({
  open,
  onOpenChange,
  mode,
  formData,
  onFieldChange,
  onSubmit,
}: NavItemDetailProps) {
  const isEditable = mode === "edit";
  const title = isEditable ? "Edit Navigation Item" : "Navigation Details";
  const description = isEditable
    ? "Update the navigation link details."
    : "View navigation link details.";

  const handleChange = (field: keyof NavItemDetailFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable || !onFieldChange) return;
    onFieldChange(field, e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="detail-name">Name</Label>
            <Input
              id="detail-name"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Example"
              disabled={!isEditable}
              readOnly={!isEditable}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-url">URL</Label>
            <Input
              id="detail-url"
              value={formData.url}
              onChange={handleChange("url")}
              placeholder="https://www.example.com"
              disabled={!isEditable}
              readOnly={!isEditable}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-icon">Icon URL (Optional)</Label>
            <Input
              id="detail-icon"
              value={formData.icon}
              onChange={handleChange("icon")}
              placeholder="https://www.example.com/favicon.ico"
              disabled={!isEditable}
              readOnly={!isEditable}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-localRepoPath">Local Repo Path (Optional)</Label>
            <Input
              id="detail-localRepoPath"
              value={formData.localRepoPath}
              onChange={handleChange("localRepoPath")}
              placeholder="/Users/username/repos/project"
              disabled={!isEditable}
              readOnly={!isEditable}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-tags">Tags (comma-separated, optional)</Label>
            <Input
              id="detail-tags"
              value={formData.tags}
              onChange={handleChange("tags")}
              placeholder="ai, alibaba"
              disabled={!isEditable}
              readOnly={!isEditable}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-description">Description (optional)</Label>
            <textarea
              id="detail-description"
              value={formData.description}
              onChange={(e) => {
                if (!isEditable || !onFieldChange) return;
                onFieldChange("description", e.target.value);
              }}
              placeholder="Brief overview of the item"
              disabled={!isEditable}
              readOnly={!isEditable}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <DialogFooter showCloseButton={!isEditable}>
          {isEditable && (
            <Button onClick={onSubmit}>Update</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}