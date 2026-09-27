"use client";

import * as React from "react";
import type { CountdownSectionProps } from "@/types/builder";

export function CountdownSection({
  heading = "Counting Down The Moments",
  subheading = "Until we say I do",
  target_date,
}: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(target_date).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [target_date]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="bg-white py-16 sm:py-20 px-6 border-b border-border/60">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 text-sm text-neutral-mid">{subheading}</p>
        )}

        <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-8 max-w-lg mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-neutral-light rounded-2xl p-3 sm:p-5 border border-border flex flex-col items-center justify-center shadow-soft-sm"
            >
              <span className="font-display text-2xl sm:text-4xl font-bold text-primary-dark">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-neutral-mid mt-1 font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
