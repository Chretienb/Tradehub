"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function AccountSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4" /> Se déconnecter
    </button>
  );
}
