"use client";

import { Progress } from "@/components/ui/progress";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          Шаг {current} из {total}
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} />
    </div>
  );
}
