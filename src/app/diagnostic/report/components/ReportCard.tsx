import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  icon: LucideIcon;
  items: string[];
  variant?: "default" | "risk";
};

export function ReportCard({ title, icon: Icon, items, variant = "default" }: Props) {
  return (
    <Card className={variant === "risk" ? "border-destructive/30 bg-destructive/5" : ""}>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
