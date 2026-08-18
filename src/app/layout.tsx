import type { Metadata } from "next";
import { Poppins, Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEKA — La marketplace B2B des importateurs et grossistes de la RDC",
  description:
    "TEKA connecte acheteurs et fournisseurs vérifiés pour le commerce de gros en République démocratique du Congo — paiement séquestré, MOQ affiché, confiance garantie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${poppins.variable} ${inter.variable} ${geistMono.variable} h-full overflow-x-clip overscroll-none antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip overscroll-none">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
