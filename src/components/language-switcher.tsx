"use client";

import { useLanguage } from "@/lib/i18n/context";
import { locales, localeLabels } from "@/lib/i18n/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <Select value={locale} onValueChange={(value) => value && setLocale(value as typeof locale)}>
      <SelectTrigger
        size="sm"
        className={className}
        aria-label={t("language.label")}
      >
        <Languages className="size-3.5" />
        <SelectValue>{localeLabels[locale]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
