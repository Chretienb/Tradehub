import { VendorNav } from "@/components/vendor-nav";
import { readSessionServer } from "@/lib/auth-server";

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await readSessionServer();

  return (
    <div className="flex min-h-full flex-col sm:flex-row">
      <VendorNav session={session} />
      <main className="flex-1 bg-secondary/10 p-4 pb-24 sm:p-8">{children}</main>
    </div>
  );
}
