import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 rounded-[28px] border border-white/60 bg-white/50 px-4 py-5 shadow-panel backdrop-blur sm:mb-8 sm:rounded-[32px] sm:px-7 sm:py-8">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
        {eyebrow}
      </p>
      <h2 className="section-title mt-3 max-w-4xl text-[2rem] leading-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/70 sm:mt-4 sm:text-[0.95rem]">
        {description}
      </p>
    </header>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "pine";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-accent text-white"
      : tone === "pine"
        ? "bg-pine text-white"
        : "glass-panel text-ink";

  return (
    <div className={cn("rounded-[24px] border border-white/70 p-4 shadow-panel sm:rounded-[28px] sm:p-6", toneClass)}>
      <p className={cn("text-[0.68rem] uppercase tracking-[0.3em]", tone === "default" ? "text-ink/55" : "text-white/70")}>
        {label}
      </p>
      <p className="section-title mt-3 break-words text-[1.9rem] leading-tight sm:mt-4 sm:text-[2.2rem]">{value}</p>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-panel rounded-[24px] border border-white/70 p-4 shadow-panel sm:rounded-[30px] sm:p-6 lg:p-7">
      <div className="mb-4 border-b border-line/50 pb-4 sm:mb-5">
        <h3 className="section-title text-[1.55rem] text-ink sm:text-2xl">{title}</h3>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-ink/65">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "pine" | "warning";
}) {
  const toneClass = {
    neutral: "bg-sand text-ink/80",
    accent: "bg-accent/10 text-accent",
    pine: "bg-pine/10 text-pine",
    warning: "bg-amber-100 text-amber-800",
  }[tone];

  return (
    <span className={cn("inline-flex rounded-full border border-white/50 px-3 py-1 text-xs font-medium shadow-sm", toneClass)}>
      {children}
    </span>
  );
}
