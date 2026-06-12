import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
});

const protectedRoutes = ["/favorites", "/cart"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  if (isProtected) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};