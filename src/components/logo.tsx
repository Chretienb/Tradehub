import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, iconSize = 44 }: { className?: string; iconSize?: number }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 font-heading font-semibold tracking-tight", className)}
    >
      <Image
        src="/brand/logo-icon.png"
        alt="TEKA"
        width={iconSize}
        height={iconSize}
        priority
        className="flex-shrink-0 object-contain"
      />
      <span className="text-xl text-foreground">TEKA</span>
    </Link>
  );
}
