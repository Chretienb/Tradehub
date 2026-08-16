import { HeaderAuthActions } from "@/components/header-auth-actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { SiteNavLinks } from "@/components/site-nav-links";
import { WelcomeBanner } from "@/components/welcome-banner";
import { readSessionServer } from "@/lib/auth-server";
import { cn } from "@/lib/utils";

export async function SiteHeader({ bordered = true }: { bordered?: boolean }) {
  const session = await readSessionServer();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
          bordered && "border-b"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
          <Logo iconSize={32} />
          <SiteNavLinks />
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <HeaderAuthActions session={session} />
          </div>
          <MobileMenu session={session} />
        </div>
      </header>

      {session && <WelcomeBanner name={session.name} />}
    </>
  );
}
