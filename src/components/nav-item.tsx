import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NavItemProps {
  name: string;
  url: string;
  icon: string;
  onDelete: () => void;
}

export function NavItem({ name, url, icon, onDelete }: NavItemProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <img
                src={icon}
                alt={name}
                className="h-8 w-8 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          {url}
        </a>
      </CardContent>
    </Card>
  );
}
