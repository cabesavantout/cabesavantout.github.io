"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  Gauge,
  MapPinned,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useNavigation } from "@/lib/use-navigation";
import { cn } from "@/lib/utils";

const iconByGroupKey: Record<string, LucideIcon> = {
  home: Gauge,
  promises: BriefcaseBusiness,
  compare: BarChart3,
  map: MapPinned,
  settings: Shield,
};

export function Sidebar({
  permissions = [],
}: {
  permissions?: string[];
}) {
  const { groups, activeGroup, activeItem, subNavigation } = useNavigation(permissions);
  const [openGroupKey, setOpenGroupKey] = useState<string | null>(activeGroup?.key ?? null);

  useEffect(() => {
    setOpenGroupKey(activeGroup?.key ?? null);
  }, [activeGroup?.key]);

  return (
    <nav aria-label="Navigation principale" className="space-y-1">
        {groups.map((group) => {
          const Icon = iconByGroupKey[group.key] ?? Gauge;
          const isGroupActive = activeGroup?.key === group.key;
          const isOpen = openGroupKey === group.key;
          const visibleChildren = isGroupActive ? subNavigation : group.children;

          return (
            <div key={group.key} className="rounded-2xl">
              <div className="flex items-center gap-1">
                <Link
                  href={group.href}
                  className={cn(
                    "flex min-h-[2.9rem] min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    isGroupActive
                      ? "bg-elevated text-ink"
                      : "text-muted hover:bg-elevated hover:text-ink",
                  )}
                  aria-current={isGroupActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                      isGroupActive ? "bg-accent/[0.12] text-accent" : "bg-sand/70 text-muted",
                    )}
                  >
                      <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{group.label}</p>
                  </div>
                </Link>

                {visibleChildren.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOpenGroupKey((current) => (current === group.key ? null : group.key))}
                    className={cn(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-elevated hover:text-ink",
                      isOpen ? "bg-elevated text-ink" : "",
                    )}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Replier ${group.label}` : `Ouvrir ${group.label}`}
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 transition", isOpen ? "rotate-180" : "rotate-0")}
                      aria-hidden
                    />
                  </button>
                ) : null}
              </div>

              {isOpen && visibleChildren.length > 0 ? (
                <div className="ml-7 mt-1 space-y-1 border-l border-line pl-4">
                  {visibleChildren.map((item) => {
                    const isItemActive = Boolean(item.href && activeItem?.href === item.href);

                    return (
                      <Link
                        key={item.key}
                        href={item.href ?? "#"}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition",
                          isItemActive
                            ? "bg-elevated text-ink"
                            : "text-muted hover:bg-elevated hover:text-ink",
                        )}
                        aria-current={isItemActive ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
  );
}
