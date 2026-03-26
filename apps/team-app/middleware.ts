import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/search/:path*",
    "/polling-stations/:path*",
    "/electoral-analysis/:path*",
    "/insee/:path*",
    "/team/:path*",
    "/users/:path*",
    "/tasks/:path*",
    "/meetings/:path*",
    "/field-reports/:path*",
    "/field-analysis/:path*",
    "/citizens/:path*",
    "/contacts/:path*",
  ],
};
