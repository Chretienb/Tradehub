import Link from "next/link";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { ChangePhoneDialog } from "@/components/change-phone-dialog";
import { readSessionServer } from "@/lib/auth-server";
import { ArrowLeft, User } from "lucide-react";

export default async function AccountSettingsPage() {
  const session = await readSessionServer();

  return (
    <div className="min-h-full bg-secondary/10">
      <div className="bg-background">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/account"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Retour
          </Link>
          <AccountSignOutButton />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Paramètres du compte</h1>

        <div className="mt-6 rounded-2xl border bg-background p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
              <User className="size-5 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{session?.name ?? "Votre compte"}</p>
              <p className="text-sm text-muted-foreground">Client TEKA</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-sm font-medium">Numéro de téléphone</p>
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-secondary/40 px-3 py-2.5">
              <span className="text-sm">{session?.phone || "Aucun numéro enregistré"}</span>
              <ChangePhoneDialog currentPhone={session?.phone ?? ""} />
            </div>
            <p className="text-xs text-muted-foreground">
              C&apos;est le numéro utilisé pour vous connecter — le changer nécessite une
              vérification par SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
