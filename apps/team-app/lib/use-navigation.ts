"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { getNavigationContext } from "@/lib/navigation";

export function useNavigation(permissions: string[] = []) {
  const pathname = usePathname();

  return useMemo(
    () => getNavigationContext(pathname, permissions),
    [pathname, permissions],
  );
}
