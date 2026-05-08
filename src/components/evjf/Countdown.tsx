"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [diff, setDiff] = useState<TimeLeft | null>(null);

  useEffect(() => {
    function update() {
      const delta = new Date(targetDate).getTime() - Date.now();
      if (delta <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff({
        days:    Math.floor(delta / 86_400_000),
        hours:   Math.floor((delta % 86_400_000) / 3_600_000),
        minutes: Math.floor((delta % 3_600_000) / 60_000),
        seconds: Math.floor((delta % 60_000) / 1_000),
      });
    }
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!diff) return null;

  const units = [
    { value: diff.days,    label: "jours",      big: true },
    { value: diff.hours,   label: "heures",     big: true },
    { value: diff.minutes, label: "min",        big: true },
    { value: diff.seconds, label: "sec",        big: false },
  ];

  return (
    <div className="flex items-end gap-2 justify-center">
      {units.map(({ value, label, big }, i) => (
        <div key={label} className="flex items-end gap-2">
          <div className="text-center">
            <div
              className={`font-bold tabular-nums leading-none transition-all ${big ? "text-3xl" : "text-2xl opacity-80"}`}
              style={{ minWidth: big ? "2ch" : "2ch" }}
            >
              {big ? value : pad(value)}
            </div>
            <div className="text-pink-100 text-xs mt-0.5">{label}</div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold text-pink-200 mb-4 leading-none select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
