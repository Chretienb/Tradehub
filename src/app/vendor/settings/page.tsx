import { SettingsForm } from "./settings-form";
import { readSessionServer } from "@/lib/auth-server";

export default async function VendorSettingsPage() {
  const session = await readSessionServer();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Espace fournisseur</p>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les informations de votre entreprise et vos préférences de notification.
        </p>
      </div>

      <SettingsForm session={session} />
    </div>
  );
}
