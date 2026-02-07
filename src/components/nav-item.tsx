import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavItemProps {
  name: string;
  url: string;
  icon: string;
  localRepoPath?: string;
  tags?: string[];
  description?: string;
  onClick?: () => void;
  isDeleteMode?: boolean;
}

export function NavItem({ name, url, icon, localRepoPath, tags, description, onClick, isDeleteMode }: NavItemProps) {
  // Check if icon is a local/data URL (use Next.js Image) or external URL (use img tag)
  const isLocalIcon = icon && (
    icon.startsWith('data:') || 
    icon.startsWith('/') || 
    icon.startsWith('./') ||
    icon.startsWith('../')
  );
  const isExternalIcon = icon && (icon.startsWith('http://') || icon.startsWith('https://'));

  return (
    <Card 
      className={`relative transition-all ${isDeleteMode ? 'cursor-pointer hover:border-destructive hover:shadow-md' : ''}`}
      onClick={isDeleteMode ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
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
              onClick={(e) => isDeleteMode && e.preventDefault()}
            >
              {url}
            </a>
            {localRepoPath && !isDeleteMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `vscode://file/${localRepoPath}`;
                }}
              >
                Open in VSCode
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
