"use client";

import { usePathname } from "next/navigation";

/**
 * Wrapper conditionnel : masque le Header/Footer Tarandro sur les routes /lise
 * et injecte les fonts + styles EVJF
 */
export default function EvjfShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEvjf = pathname?.startsWith("/lise");

  if (!isEvjf) return <>{children}</>;

  // Pour /lise : on retourne les children directement sans wrapper supplémentaire
  // Le root layout fournit déjà html/body, on applique juste les styles EVJF
  return (
    <div
      className="evjf-root"
      style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
    >
      {children}
    </div>
  );
}
