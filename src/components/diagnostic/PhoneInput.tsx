"use client";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

export function formatRussianPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  else if (digits.length > 0 && !digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.startsWith("7") ? digits.slice(1) : digits;
  if (rest.length === 0) return "";

  let out = "+7";
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += `) ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

export function PhoneInput({ value, onChange, onBlur, error }: Props) {
  return (
    <div className="space-y-1">
      <Input
        type="tel"
        inputMode="tel"
        placeholder="+7 (999) 123-45-67"
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(formatRussianPhone(e.target.value))}
        className={error ? "border-destructive" : undefined}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
