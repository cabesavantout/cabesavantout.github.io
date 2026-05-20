"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useNavigation } from "@/lib/use-navigation";
import { cn } from "@/lib/utils";

function getPrimaryGroups<T extends { key: string }>(groups: T[]) {
  const primaryKeys = ["home", "promises", "compare", "map"];
  const primaryGroups = primaryKeys
    .map((key) => groups.find((group) => group.key === key))
    .filter((group): group is T => Boolean(group));

  return primaryGroups.length > 0 ? primaryGroups : groups.slice(0, 4);
}

export function MobileNavigation({
  permissions = [],
}: {
  permissions?: string[];
}) {
  const { groups, activeGroup, activeItem } = useNavigation(permissions);
  const primaryGroups = getPrimaryGroups(groups);
  const hiddenGroups = groups.filter(
    (group) => !primaryGroups.some((primaryGroup) => primaryGroup.key === group.key),
  );

  return (
    <div className="lg:hidden">
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
        <div className="mx-auto grid max-w-app grid-cols-4 gap-2 rounded-[1.5rem] border border-line bg-panel p-2 shadow-panel-sm">
          {primaryGroups.map((group) => {
            const isActive = activeGroup?.key === group.key;

            return (
              <Link
                key={group.key}
                href={group.href}
                className={cn(
                  "flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-center transition",
                  isActive
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-elevated hover:text-ink",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="truncate text-[0.68rem] font-medium">{group.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {hiddenGroups.length > 0 ? (
        <details className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-40 lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-line bg-panel text-muted shadow-panel-sm transition hover:bg-elevated hover:text-ink">
            <Menu className="h-4 w-4" aria-hidden />
          </summary>

          <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-[1.5rem] border border-line bg-panel p-4 shadow-panel-sm">
            <p className="text-sm font-semibold text-ink">
              {activeGroup?.label ?? "Administration"}
            </p>
            <p className="mt-1 text-sm text-muted">Accès secondaires de la section active et administration.</p>
            <div className="mt-3 space-y-1.5">
              {[...(activeGroup ? activeGroup.children : []), ...hiddenGroups.flatMap((group) => group.children)].filter(
                (item, index, items) => items.findIndex((candidate) => candidate.key === item.key) === index,
              ).map((item) => {
                  const isActive = Boolean(item.href && activeItem?.href === item.href);

                  if (!item.href || item.status === "soon") {
                    return (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-muted"
                        aria-disabled="true"
                      >
                        <span>{item.label}</span>
                        <span className="rounded-full bg-sand px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
                          Bientot
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={cn(
                        "block rounded-2xl px-3 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-elevated text-ink"
                          : "text-muted hover:bg-elevated hover:text-ink",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        </details>
      ) : null}
    </div>
  );
}
