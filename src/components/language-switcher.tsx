"use client";

import { useLanguage } from "@/lib/i18n/context";
import { locales, localeLabels } from "@/lib/i18n/translations";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <Select value={locale} onValueChange={(value) => value && setLocale(value as typeof locale)}>
      <SelectTrigger
        size="sm"
        className={cn(
          "rounded-full border-transparent bg-secondary/70 pl-3 font-medium hover:bg-secondary",
          className
        )}
        aria-label={t("language.label")}
      >
        <Languages className="size-3.5 text-muted-foreground" />
        <SelectValue>
          <span className="hidden sm:inline">{localeLabels[locale]}</span>
          <span className="sm:hidden">{locale.toUpperCase()}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-52 p-1.5">
        <SelectGroup>
          <SelectLabel>{t("language.label")}</SelectLabel>
          {locales.map((l) => (
            <SelectItem key={l} value={l} className="py-2 pl-2.5">
              <span className="flex-1">{localeLabels[l]}</span>
              <span className="text-xs tracking-wide text-muted-foreground uppercase">{l}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
