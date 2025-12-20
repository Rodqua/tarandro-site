"use client";

import { Suspense } from "react";
import { usePageTracking, useScrollTracking } from "@/lib/analytics";

function AnalyticsTracking() {
  usePageTracking();
  useScrollTracking();
  return null;
}

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracking />
      </Suspense>
      {children}
    </>
  );
}
