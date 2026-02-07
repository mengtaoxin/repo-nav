import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface NavItemProps {
  name: string;
  url: string;
  icon: string;
  onClick?: () => void;
  isDeleteMode?: boolean;
}

export function NavItem({ name, url, icon, onClick, isDeleteMode }: NavItemProps) {
  // Check if icon is a valid data URL or relative path
  const isValidIcon = icon && (
    icon.startsWith('data:') || 
    icon.startsWith('/') || 
    icon.startsWith('./') ||
    icon.startsWith('../')
  );

  return (
    <Card 
      className={`relative transition-all ${isDeleteMode ? 'cursor-pointer hover:border-destructive hover:shadow-md' : ''}`}
      onClick={isDeleteMode ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isValidIcon && (
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
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          onClick={(e) => isDeleteMode && e.preventDefault()}
        >
          {url}
        </a>
      </CardContent>
    </Card>
  );
}
