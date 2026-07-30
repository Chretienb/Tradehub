"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoReveal({ onComplete, holdMs = 1100 }: { onComplete: () => void; holdMs?: number }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), holdMs);
    const doneTimer = setTimeout(onComplete, holdMs + 350);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [holdMs, onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 bg-background transition-opacity duration-350 ease-out",
        exiting ? "opacity-0" : "opacity-100"
      )}
    >
      <div
        className="flex flex-col items-center gap-3"
        style={{ animation: "reveal-logo-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <Image src="/brand/logo-icon.png" alt="TEKA" width={40} height={40} priority className="object-contain" />
        <span className="font-heading text-lg font-medium tracking-tight text-foreground">TEKA</span>
      </div>
      <div className="h-0.5 w-24 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 rounded-full bg-primary" style={{ animation: "reveal-loading-bar 1s ease-in-out infinite" }} />
      </div>
    </div>
  );
}
