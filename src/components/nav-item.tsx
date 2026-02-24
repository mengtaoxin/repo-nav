import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MyTag } from "@/components/my-tag";
import Image from "next/image";
import { Code, Info, Link } from "lucide-react";
import type { Tag } from "@/lib/nav-data";

interface NavItemProps {
  name: string;
  url: string;
  icon: string;
  localRepoPath?: string;
  tags?: string[];
  description?: string;
  onDetailClick?: () => void;
  isDeleteMode?: boolean;
  isEditMode?: boolean;
  isMoveMode?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
  tagConfig?: Tag[];
}

export function NavItem({ name, url, icon, localRepoPath, tags, description, onDetailClick, isDeleteMode, isEditMode, isMoveMode, onDragStart, onDragOver, onDrop, draggable, tagConfig }: NavItemProps) {
  // Check if icon is a local/data URL (use Next.js Image) or external URL (use img tag)
  const isLocalIcon = icon && (
    icon.startsWith('data:') || 
    icon.startsWith('/') || 
    icon.startsWith('./') ||
    icon.startsWith('../')
  );
  const isExternalIcon = icon && (icon.startsWith('http://') || icon.startsWith('https://'));
  
  // Disable interactions when in any mode (edit/delete/move)
  const isInMode = isDeleteMode || isEditMode || isMoveMode;
  const openDisabled = isInMode || !localRepoPath;
  const openDisabledReason = isInMode
    ? "Disabled in edit/delete/move mode"
    : !localRepoPath
      ? "Local repository path is missing"
      : undefined;

  const cardClickHandler = isDeleteMode || isEditMode ? onDetailClick : undefined;

  // Helper function to get tag icon from config
  const getTagIcon = (tagName: string): string | undefined => {
    return tagConfig?.find(t => t.name === tagName)?.icon;
  };

  return (
    <Card 
      className={`w-[280px] relative transition-all hover:shadow-lg ${isDeleteMode ? 'cursor-pointer hover:border-destructive' : 'hover:border-primary'} ${draggable ? 'cursor-move' : ''}`}
      onClick={cardClickHandler}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {draggable && !isDeleteMode && (
              <svg
                className="w-5 h-5 text-muted-foreground flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            )}
            {isLocalIcon && (
              <Image
                src={icon}
                alt={name}
                width={32}
                height={32}
                className="rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {isExternalIcon && (
              <img
                src={icon}
                alt={name}
                width={32}
                height={32}
                className="rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => {
                const iconUrl = getTagIcon(tag);
                return (
                  <MyTag
                    key={index}
                    name={tag}
                    icon={iconUrl ? <img src={iconUrl} alt={tag} className="w-4 h-4 rounded" /> : undefined}
                  />
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-0.5">
              {isInMode ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="h-6 px-1.5 text-xs"
                >
                  <Link className="h-3 w-3 flex-shrink-0" />
                  <span>URL</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="h-6 px-1.5 text-xs"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Link className="h-3 w-3 flex-shrink-0" />
                    <span>URL</span>
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={isInMode}
                onClick={onDetailClick}
                className="h-6 px-1.5 text-xs"
              >
                <Info className="h-3 w-3" />
                <span>Details</span>
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block w-fit">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={openDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!localRepoPath || isInMode) {
                          return;
                        }
                        window.location.href = `vscode://file/${localRepoPath}`;
                      }}
                      className="h-6 px-1.5 text-xs"
                    >
                      <Code className="h-3 w-3" />
                      <span>Open in VS Code</span>
                    </Button>
                  </span>
                </TooltipTrigger>
                {openDisabledReason && (
                  <TooltipContent side="right">
                    {openDisabledReason}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
