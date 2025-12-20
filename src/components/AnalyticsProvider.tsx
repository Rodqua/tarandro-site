"use client";

import { usePageTracking, useScrollTracking } from "@/lib/analytics";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();
  useScrollTracking();
  
  return <>{children}</>;
}
