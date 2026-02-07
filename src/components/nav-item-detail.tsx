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
import { isValidUrl, isValidUrlOrEmpty, isValidFileSystemPath } from "@/lib/validator";

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
  mode: "view" | "edit" | "add";
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
  const isEditable = mode === "edit" || mode === "add";
  const title = mode === "add" ? "Add" : mode === "edit" ? "Edit" : "Navigation Details";
  const description = mode === "add"
    ? "Add a new navigation link to your dashboard."
    : mode === "edit"
    ? "Update the navigation link details."
    : "View navigation link details.";

  const handleChange = (field: keyof NavItemDetailFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable || !onFieldChange) return;
    onFieldChange(field, e.target.value);
  };

  // Validate URLs
  const isUrlValid = isValidUrl(formData.url);
  const isIconUrlValid = isValidUrlOrEmpty(formData.icon);
  const isLocalRepoPathValid = isValidFileSystemPath(formData.localRepoPath);
  const isFormValid = isUrlValid && isIconUrlValid && isLocalRepoPathValid && formData.name.trim() !== "";

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
              className={!isEditable ? "" : !isUrlValid && formData.url ? "border-red-500" : ""}
            />
            {isEditable && !isUrlValid && formData.url && (
              <p className="text-sm text-red-500">Please enter a valid URL</p>
            )}
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
              className={!isEditable ? "" : !isIconUrlValid && formData.icon ? "border-red-500" : ""}
            />
            {isEditable && !isIconUrlValid && formData.icon && (
              <p className="text-sm text-red-500">Please enter a valid URL</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="detail-localRepoPath">Local Repository Path (Optional)</Label>
            <Input
              id="detail-localRepoPath"
              value={formData.localRepoPath}
              onChange={handleChange("localRepoPath")}
              placeholder="/Users/username/repos/project"
              disabled={!isEditable}
              readOnly={!isEditable}
              className={!isEditable ? "" : !isLocalRepoPathValid && formData.localRepoPath ? "border-red-500" : ""}
            />
            {isEditable && !isLocalRepoPathValid && formData.localRepoPath && (
              <p className="text-sm text-red-500">Please enter a valid absolute path</p>
            )}
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
            <Button onClick={onSubmit} disabled={!isFormValid}>
              {mode === "add" ? "Add" : "Update"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}