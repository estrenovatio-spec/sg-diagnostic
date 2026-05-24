"use client";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function TelegramInput({ value, onChange, error }: Props) {
  return (
    <div className="space-y-1">
      <Input
        placeholder="@username"
        value={value}
        onChange={(e) => {
          let v = e.target.value.trim();
          if (v && !v.startsWith("@")) v = `@${v}`;
          onChange(v);
        }}
        className={error ? "border-destructive" : undefined}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">Можно пропустить — нажмите «Далее»</p>
    </div>
  );
}
