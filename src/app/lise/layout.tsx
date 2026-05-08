import type { Metadata } from "next";

// Pas de metadata indexable — protection de la surprise
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "✨",
  openGraph: null,
};

export default function EvjfLayout({ children }: { children: React.ReactNode }) {
  // Le root layout fournit déjà html/body/fonts
  // Ce layout ajoute juste le fond rose et isole visuellement
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      {children}
    </div>
  );
}
