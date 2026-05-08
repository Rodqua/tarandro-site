"use client";

import { useEffect, useState } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [diff, setDiff] = useState<null | { days: number; hours: number; minutes: number }>(null);

  useEffect(() => {
    function update() {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const delta = target - now;
      if (delta <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(delta / (1000 * 60 * 60 * 24));
      const hours = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
      setDiff({ days, hours, minutes });
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!diff) return null;

  return (
    <div className="flex gap-3 justify-center">
      {[
        { value: diff.days, label: "jours" },
        { value: diff.hours, label: "heures" },
        { value: diff.minutes, label: "min" },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="text-3xl font-bold leading-none">{value}</div>
          <div className="text-pink-100 text-xs mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
