import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "pine" | "info" | "warning" | "danger";
type BadgeTone = "neutral" | "accent" | "pine" | "warning" | "danger" | "info";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-6 border-b border-line pb-5 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
          <h1 className="section-title mt-2 max-w-4xl text-[1.8rem] font-semibold leading-tight text-ink sm:text-[2.2rem]">
            {title}
          </h1>
          <p className="mt-2 max-w-readable text-sm leading-6 text-muted">
            {description}
          </p>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>
      {meta ? <div className="mt-4 flex flex-wrap items-center gap-2.5">{meta}</div> : null}
    </header>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const variantClass = {
    primary: "bg-accent text-white hover:bg-accent/92",
    secondary: "border border-line/80 bg-panel text-ink hover:bg-elevated",
    ghost: "bg-transparent text-muted hover:bg-sand/80 hover:text-ink",
    danger: "bg-danger text-white hover:bg-danger/92",
  }[variant];
  const sizeClass = size === "sm" ? "min-h-[2.5rem] px-3.5 text-sm" : "min-h-[2.75rem] px-4 text-sm";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition duration-200 ease-out active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        "motion-safe:hover:-translate-y-0.5",
        variantClass,
        sizeClass,
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
}) {
  const variantClass = {
    primary: "bg-accent text-white hover:bg-accent/92",
    secondary: "border border-line/80 bg-panel text-ink hover:bg-elevated",
    ghost: "bg-transparent text-muted hover:bg-sand/80 hover:text-ink",
    danger: "bg-danger text-white hover:bg-danger/92",
  }[variant];
  const sizeClass = size === "sm" ? "min-h-[2.5rem] px-3.5 text-sm" : "min-h-[2.75rem] px-4 text-sm";

  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition duration-200 ease-out",
        "motion-safe:hover:-translate-y-0.5",
        variantClass,
        sizeClass,
        className,
      )}
      href={href}
    >
      {children}
    </a>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
  detail,
  trend,
}: {
  label: string;
  value: string;
  tone?: Tone;
  detail?: string;
  trend?: string;
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent/15 bg-accent/[0.05]"
      : tone === "pine"
        ? "border-pine/15 bg-pine/[0.05]"
        : tone === "info"
          ? "border-info/15 bg-info/[0.05]"
          : tone === "warning"
            ? "border-warning/15 bg-warning/[0.07]"
            : tone === "danger"
              ? "border-danger/15 bg-danger/[0.07]"
      : "border-line bg-panel";

  const valueClass =
    tone === "accent"
      ? "text-accent"
      : tone === "pine"
        ? "text-pine"
        : tone === "info"
          ? "text-info"
          : tone === "warning"
            ? "text-warning"
            : tone === "danger"
              ? "text-danger"
        : "text-ink";

  return (
    <article className={cn("rounded-[1.25rem] border p-4 sm:p-5", toneClass)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted">
          {label}
        </p>
        {trend ? <Badge tone={tone === "default" ? "neutral" : tone}>{trend}</Badge> : null}
      </div>
      <p className={cn("section-title mt-4 text-[1.9rem] font-semibold leading-none sm:text-[2.25rem]", valueClass)}>
        {value}
      </p>
      {detail ? <p className="mt-2 text-sm leading-6 text-muted">{detail}</p> : null}
    </article>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  actions,
  padded = true,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
  tone?: "default" | "critical" | "warning" | "info";
}) {
  const panelToneClass =
    tone === "critical"
      ? "border-danger/20 bg-danger/[0.05]"
      : tone === "warning"
        ? "border-warning/20 bg-warning/[0.05]"
        : tone === "info"
          ? "border-info/20 bg-info/[0.05]"
          : "border-line bg-panel";

  return (
    <section className={cn("rounded-[1.5rem] border", panelToneClass)}>
      <div className={cn("flex flex-col gap-4 border-b border-line px-4 py-4 sm:px-5 lg:px-6", padded ? "" : "pb-4")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="section-title text-[1.1rem] font-semibold leading-tight text-ink sm:text-[1.25rem]">
              {title}
            </h2>
            {subtitle ? <p className="mt-1 max-w-readable text-sm leading-6 text-muted">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </div>
      <div className={cn(padded ? "px-4 py-4 sm:px-5 sm:py-5 lg:px-6" : "")}>{children}</div>
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const toneClass = {
    neutral: "border-line/70 bg-sand/80 text-muted",
    accent: "border-accent/20 bg-accent/[0.10] text-accent",
    pine: "border-pine/20 bg-pine/[0.10] text-pine",
    warning: "border-warning/20 bg-warning/[0.12] text-warning",
    danger: "border-danger/20 bg-danger/[0.12] text-danger",
    info: "border-info/20 bg-info/[0.10] text-info",
  }[tone];

  return (
    <span className={cn("inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[0.72rem] font-medium leading-tight", toneClass)}>
      {children}
    </span>
  );
}

export function FilterChip({
  children,
  active = false,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[2.5rem] items-center rounded-full border px-3.5 text-sm font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-panel text-muted hover:bg-elevated hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  status,
  children,
}: {
  status: "critical" | "warning" | "ok" | "info" | "neutral";
  children?: ReactNode;
}) {
  const config = {
    critical: { tone: "danger" as const, label: "Critique" },
    warning: { tone: "warning" as const, label: "À surveiller" },
    ok: { tone: "pine" as const, label: "Stable" },
    info: { tone: "accent" as const, label: "Info" },
    neutral: { tone: "neutral" as const, label: "Neutre" },
  }[status];

  return <Badge tone={config.tone}>{children ?? config.label}</Badge>;
}

export function PriorityBadge({
  priority,
  children,
}: {
  priority: "high" | "medium" | "low";
  children?: ReactNode;
}) {
  const config = {
    high: { tone: "danger" as const, label: "Priorité haute" },
    medium: { tone: "warning" as const, label: "Priorité moyenne" },
    low: { tone: "neutral" as const, label: "Priorité faible" },
  }[priority];

  return <Badge tone={config.tone}>{children ?? config.label}</Badge>;
}

export function Tabs({
  items,
}: {
  items: Array<{ label: string; active?: boolean }>;
}) {
  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-line/70 bg-sand/70 p-1 soft-scroll">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition",
            item.active ? "bg-panel text-ink shadow-sm" : "text-muted",
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

export function ChartContainer({
  title,
  value,
  detail,
  children,
}: {
  title: string;
  value?: string;
  detail?: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">{title}</p>
          {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
        </div>
        {value ? <p className="section-title text-xl font-semibold text-ink">{value}</p> : null}
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

export function ListItem({
  title,
  description,
  meta,
  tone = "neutral",
  icon: Icon,
}: {
  title: string;
  description: string;
  meta?: ReactNode;
  tone?: BadgeTone;
  icon?: LucideIcon;
}) {
  const iconTone = {
    neutral: "bg-sand text-muted",
    accent: "bg-accent/[0.10] text-accent",
    pine: "bg-pine/[0.10] text-pine",
    warning: "bg-warning/[0.12] text-warning",
    danger: "bg-danger/[0.12] text-danger",
    info: "bg-info/[0.10] text-info",
  }[tone];

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", iconTone)}>
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-sm font-semibold text-ink sm:text-[0.95rem]">{title}</h3>
            {meta}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
    </article>
  );
}

export function Row({
  title,
  meta,
  description,
  badges,
  actions,
  tone = "neutral",
}: {
  title: string;
  meta?: ReactNode;
  description?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  tone?: "neutral" | "accent" | "pine" | "warning" | "danger" | "info";
}) {
  const accentClass = {
    neutral: "before:bg-line",
    accent: "before:bg-accent/60",
    pine: "before:bg-pine/60",
    warning: "before:bg-warning/70",
    danger: "before:bg-danger/70",
    info: "before:bg-info/70",
  }[tone];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border border-line bg-elevated p-4",
        "before:absolute before:inset-y-0 before:left-0 before:w-1",
        accentClass,
      )}
    >
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0 pl-1">
          <p className="text-sm font-semibold text-ink sm:text-base">{title}</p>
          {meta ? <div className="mt-1 text-sm text-muted">{meta}</div> : null}
          {description ? <div className="mt-2 text-sm leading-6 text-muted">{description}</div> : null}
        </div>
        {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : <div />}
        {actions ? <div className="flex flex-wrap justify-start gap-2 xl:justify-end">{actions}</div> : null}
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-line bg-elevated px-4 py-8 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fermer le détail"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto border-l border-line bg-panel shadow-panel">
        <div className="sticky top-0 z-10 border-b border-line bg-panel/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="section-title text-[1.35rem] font-semibold text-ink">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p> : null}
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">{children}</div>
      </aside>
    </div>
  );
}

export function Notice({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "error";
}) {
  const toneClass =
    tone === "success"
      ? "border-success/20 bg-success/[0.10] text-success"
      : "border-danger/20 bg-danger/[0.10] text-danger";

  return (
    <div className={cn("rounded-[1.25rem] border px-4 py-3 text-sm", toneClass)}>
      {children}
    </div>
  );
}

export function SkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("skeleton rounded-2xl", className)} aria-hidden />;
}

export function TableHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
