"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookUser,
  CalendarRange,
  ClipboardList,
  Database,
  Flag,
  Landmark,
  LayoutDashboard,
  MapPinned,
  Search,
  Settings2,
  ShieldUser,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/navigation";

const iconByHref: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/polling-stations": MapPinned,
  "/elections": BarChart3,
  "/elections/history": BarChart3,
  "/electoral-analysis": BarChart3,
  "/electoral-history": BarChart3,
  "/insee": Database,
  "/budget": Landmark,
  "/documents": BookUser,
  "/mandate": Flag,
  "/tasks": ClipboardList,
  "/field-reports": Users,
  "/citizens": UserRound,
  "/contacts": BookUser,
  "/users": Settings2,
  "/search": Search,
  "/team": ShieldUser,
  "/meetings": CalendarRange,
  "/field-analysis": BarChart3,
};

export function AppShellNav({
  items,
  mobile = false,
}: {
  items: NavItem[];
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        mobile
          ? "grid grid-cols-4 gap-2"
          : "space-y-1.5",
      )}
      aria-label={mobile ? "Navigation mobile" : "Navigation principale"}
    >
      {items.map(({ href, label }) => {
        const Icon = iconByHref[href];
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              mobile
                ? isActive
                  ? "flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl bg-ink px-2 py-2 text-center text-white"
                  : "flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-center text-muted hover:bg-elevated hover:text-ink"
                : isActive
                  ? "group flex min-h-[3.25rem] items-center gap-3 rounded-2xl bg-ink px-3 py-3 text-white"
                  : "group flex min-h-[3.25rem] items-center gap-3 rounded-2xl px-3 py-3 text-muted hover:bg-elevated hover:text-ink",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition",
                isActive
                  ? "bg-white/12 text-white"
                  : "bg-sand/80 text-muted group-hover:bg-panel group-hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className={cn("truncate font-medium", mobile ? "text-[0.68rem]" : "text-sm")}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
