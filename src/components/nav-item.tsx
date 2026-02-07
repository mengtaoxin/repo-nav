import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

interface NavItemProps {
  name: string;
  url: string;
  icon: string;
  localRepoPath?: string;
  tags?: string[];
  description?: string;
  onDetailClick?: () => void;
  isDeleteMode?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

export function NavItem({ name, url, icon, localRepoPath, tags, description, onDetailClick, isDeleteMode, onDragStart, onDragOver, onDrop, draggable }: NavItemProps) {
  // Check if icon is a local/data URL (use Next.js Image) or external URL (use img tag)
  const isLocalIcon = icon && (
    icon.startsWith('data:') || 
    icon.startsWith('/') || 
    icon.startsWith('./') ||
    icon.startsWith('../')
  );
  const isExternalIcon = icon && (icon.startsWith('http://') || icon.startsWith('https://'));
  const openDisabled = isDeleteMode || !localRepoPath;
  const openDisabledReason = isDeleteMode
    ? "Disabled in delete mode"
    : !localRepoPath
      ? "Local repo path is missing"
      : undefined;

  return (
    <Card 
      className={`relative transition-all ${isDeleteMode ? 'cursor-pointer hover:border-destructive hover:shadow-md' : ''} ${draggable ? 'cursor-move' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
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
        <div className="space-y-3">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline flex-1 truncate"
              onClick={(e) => {
                if (isDeleteMode) {
                  e.preventDefault();
                }
              }}
            >
              {url}
            </a>
            <div className="flex items-center gap-2">
              {!isDeleteMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDetailClick}
                >
                  Details
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={openDisabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!localRepoPath || isDeleteMode) {
                            return;
                          }
                          window.location.href = `vscode://file/${localRepoPath}`;
                        }}
                      >
                        Open in VSCode
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {openDisabledReason && (
                    <TooltipContent>
                      {openDisabledReason}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
