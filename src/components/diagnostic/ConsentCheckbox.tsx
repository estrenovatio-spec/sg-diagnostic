"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  rulesAccepted: boolean;
  pdConsent: boolean;
  onRulesChange: (v: boolean) => void;
  onPdChange: (v: boolean) => void;
  rulesError?: string;
  pdError?: string;
};

export function ConsentCheckbox({
  rulesAccepted,
  pdConsent,
  onRulesChange,
  onPdChange,
  rulesError,
  pdError,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="rules"
          checked={rulesAccepted}
          onCheckedChange={(c) => onRulesChange(c === true)}
        />
        <Label htmlFor="rules" className="font-normal leading-relaxed">
          Принимаю правила работы SG Capital и понимаю, что диагностика не является
          индивидуальной инвестиционной рекомендацией
        </Label>
      </div>
      {rulesError && <p className="text-sm text-destructive">{rulesError}</p>}

      <div className="flex items-start gap-3">
        <Checkbox id="pd" checked={pdConsent} onCheckedChange={(c) => onPdChange(c === true)} />
        <Label htmlFor="pd" className="font-normal leading-relaxed">
          Даю согласие на обработку персональных данных (152-ФЗ).{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Политика конфиденциальности
          </Link>
        </Label>
      </div>
      {pdError && <p className="text-sm text-destructive">{pdError}</p>}
    </div>
  );
}
