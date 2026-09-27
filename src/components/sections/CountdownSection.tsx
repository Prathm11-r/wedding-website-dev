"use client";

import * as React from "react";
import type { CountdownSectionProps } from "@/types/builder";

export function CountdownSection({
  heading = "Counting Down The Moments",
  subheading = "Until we exchange our forever vows",
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
      // Default to 120 days in future if target_date is not set or invalid
      const targetTime = target_date
        ? new Date(target_date).getTime()
        : Date.now() + 120 * 24 * 60 * 60 * 1000;

      const difference = targetTime - Date.now();
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
    <section className="bg-white py-20 sm:py-24 px-6 border-b border-border/70 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-neutral-dark">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-primary-deep font-medium">
            {subheading}
          </p>
        )}

        {/* 3D Tactile Countdown Dials */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-12 max-w-xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="group relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-neutral-surface border border-[#DFB76C]/40 shadow-3d-card flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              {/* Subtle top specular sheen */}
              <div className="absolute inset-x-2 top-1 h-px bg-white/80" />

              <span className="font-display text-3xl sm:text-5xl font-bold text-gold-gradient tracking-tight">
                {String(unit.value).padStart(2, "0")}
              </span>

              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-mid mt-2 font-semibold">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
