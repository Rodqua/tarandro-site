import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mail — Tarandro",
  robots: { index: false, follow: false },
};

export default async function MailLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");
  return <>{children}</>;
}
