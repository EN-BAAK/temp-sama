import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { accessGuid } from "./constants/global";
import { AccessItem, MatchedRoute } from "./types/variables";

function findMatchedRoute(pathname: string, items: AccessItem[], parentPath = ""): MatchedRoute | undefined {
  for (const item of items) {
    const fullPath = `${parentPath}${item.path}`;

    const isMatched =
      pathname === fullPath ||
      pathname.startsWith(`${fullPath}/`);

    if (!isMatched) {
      continue;
    }

    if (item.children?.length) {
      const childMatch = findMatchedRoute(
        pathname,
        item.children,
        fullPath
      );

      if (childMatch) {
        return childMatch;
      }
    }

    return {
      authorized: item.authorized,
      path: fullPath,
    };
  }

  return undefined;
}

export function proxy(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME!;
  const token = req.cookies.get(cookieName)?.value;

  const { pathname } = req.nextUrl;

  const matched = findMatchedRoute(pathname, accessGuid);
  if (!matched) {
    return NextResponse.next();
  }

  if (!matched.authorized) {
    if (token) 
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    

    return NextResponse.next();
  }

  if (!token)
    return NextResponse.redirect(
      new URL("/login", req.url)
    );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/forgot-password"
  ],
};