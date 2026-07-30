"use client";

import { useLanguage } from "@/lib/i18n/context";
import { Sparkles } from "lucide-react";

export function WelcomeBanner({ name }: { name: string }) {
  const { t } = useLanguage();

  return (
    <div className="bg-background px-4 py-5 sm:px-6">
      <p className="mx-auto flex max-w-6xl items-center gap-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl">
        <Sparkles className="size-7 flex-shrink-0 text-[#c89b2d] sm:size-8" />
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(90deg, #0b6b3a, #c89b2d)" }}
        >
          {t("header.welcome")}, {name.split(" ")[0]}
        </span>
      </p>
    </div>
  );
}
